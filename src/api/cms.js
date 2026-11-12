const API_BASE=String(import.meta.env.VITE_APPLECMS_API_BASE||'https://api.7e5zbdgbh4rebo1.sbs/api.php').trim()
const cache=new Map(),pending=new Map()
const TTL=60_000,STALE=600_000,TIMEOUT=12_000
function apiUrl(params={}) {
 if(!API_BASE) throw new Error('请配置 VITE_APPLECMS_API_BASE 苹果 CMS API 地址')
 const url=new URL(API_BASE)
 if(!['http:','https:'].includes(url.protocol)) throw new Error('API 地址必须为 HTTP/HTTPS')
 Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=='')url.searchParams.set(k,String(v))})
 return url
}
function normalize(json) {
 const root=json?.data&&typeof json.data==='object'&&!Array.isArray(json.data)?json.data:(json||{})
 if(Array.isArray(root.list)) root.list=root.list.map(item=>{
  if(!item)return item
  const raw=item.vod_pic||item.vod_pic_thumb||item.vod_pic_slide||''
  let pic=raw
  if(raw&&!/^https?:\/\//i.test(raw)){try{pic=new URL(raw,'https://api.heiapi.cc/api.php/provide/vod/').href}catch{}}
  return {...item,vod_pic:pic||'/fallback.svg'}
 })
 if(root.pagecount==null&&root.page_count!=null)root.pagecount=root.page_count
 return {...json,data:root}
}
async function request(params={},ttl=TTL,retry=1) {
 const url=apiUrl(params),key=url.href,now=Date.now(),old=cache.get(key)
 if(old&&now-old.time<ttl)return old.value
 if(pending.has(key))return pending.get(key)
 const task=(async()=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),TIMEOUT)
  try {
   const response=await fetch(url,{method:'GET',mode:'cors',credentials:'omit',cache:'no-store',headers:{Accept:'application/json, text/plain;q=0.9, */*;q=0.8'},signal:controller.signal})
   if(!response.ok)throw new Error('AppleCMS API HTTP '+response.status)
   const value=normalize(await response.json());cache.set(key,{time:Date.now(),value});return value
  } catch(error) {
   if(retry>0&&(error.name==='TypeError'||error.name==='AbortError'||/HTTP 5\d\d/.test(error.message))){await new Promise(r=>setTimeout(r,300));return request(params,ttl,retry-1)}
   if(old&&now-old.time<STALE)return old.value
   if(error.name==='AbortError')throw new Error('AppleCMS API 请求超时')
   if(error instanceof SyntaxError)throw new Error('API 返回的不是有效 JSON')
   throw error
  } finally {clearTimeout(timer);pending.delete(key)}
 })()
 pending.set(key,task);return task
}
const EMPTY={data:{list:[],pagecount:0,total:0}}
export const getClass=()=>request({ac:'list',pg:1,pagesize:100},300_000)
let pagePool=[]
function nextPage(){if(!pagePool.length){pagePool=Array.from({length:500},(_,i)=>i+1);for(let i=pagePool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pagePool[i],pagePool[j]]=[pagePool[j],pagePool[i]]}}return pagePool.pop()}
export const getHome=(page=1,limit=20,random=false)=>request({ac:'detail',pg:random?nextPage():Math.max(1,Number(page)||1),pagesize:limit})
export const getLatestVideos=(p=1,l=12)=>getHome(p,l,false)
export const getHotVideos=(p=1,l=12)=>getHome(1,l,true)
export const getDayHotVideos=(p=1,l=12)=>getHome(1,l,true)
export const getWeekHotVideos=(p=1,l=12)=>getHome(1,l,true)
export const getTopVideos=(p=1,l=12)=>getHome(1,l,true)
export const getCategory=(id,page=1,sort='latest')=>request({ac:'detail',t:id,pg:Math.max(1,Number(page)||1),pagesize:12,...(sort&&sort!=='latest'?{sort}:{})})
export const searchVideo=(wd,page=1)=>String(wd||'').trim()?request({ac:'detail',wd:String(wd).trim(),pg:Math.max(1,Number(page)||1),pagesize:12}):Promise.resolve(EMPTY)
export const getDetail=id=>request({ac:'detail',ids:id})
export const getCategoryLatest=(id,limit=12)=>getCategory(id,1).then(r=>{r.data.list=(r.data.list||[]).slice(0,limit);return r})
async function pool(limit,items,fn){const out=[],active=new Set();for(const item of items){const p=Promise.resolve().then(()=>fn(item));out.push(p);active.add(p);p.finally(()=>active.delete(p));if(active.size>=limit)await Promise.race(active)}return Promise.all(out)}
async function hasVideo(id){try{return(await request({ac:'detail',t:id,pg:1,pagesize:1})).data.list?.length>0}catch{return false}}
let classCache=null,classTime=0
export async function getActiveClass(){if(classCache&&Date.now()-classTime<300_000)return classCache;const r=await getClass();const values=await pool(5,r.data.class||[],async item=>(await hasVideo(item.type_id))?item:null);classCache=values.filter(Boolean);classTime=Date.now();return classCache}
export function clearApiCache(){cache.clear();pending.clear();pagePool=[];classCache=null;classTime=0}
