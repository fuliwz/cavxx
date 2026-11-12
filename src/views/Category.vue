<template><main class="site-main category-page"><div class="page-shell"><section class="category-hero"><div><div class="section-kicker">CATEGORY</div><h1>{{typeName}}</h1><p>浏览该分类最新与热门内容。</p></div></section><div class="sort-tabs"><button v-for="s in sorts" :key="s.key" :class="{active:sort===s.key}" @click="changeSort(s.key)"><i :class="s.icon"></i>{{s.label}}</button></div><div class="section-bar"><div><h2 class="section-heading">{{activeLabel}}</h2><div class="section-subtitle">第 {{page}} 页 · 共 {{total}} 页</div></div></div><div class="video-grid"><template v-if="loading"><VideoCardSkeleton v-for="i in 12" :key="i"/></template><VideoCard v-else v-for="v in list" :key="v.vod_id" :item="v"/></div><div v-if="!loading&&!list.length" class="empty-state"><i class="bi bi-inbox"></i><strong>暂时没有内容</strong></div><Pagination v-if="total>1" :page="page" :total="total" @change="changePage"/></div></main></template>
<script setup>
import {ref,computed,watch} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import {getCategory} from '../api/cms'
import VideoCard from '../components/VideoCard.vue'
import VideoCardSkeleton from '../components/VideoCardSkeleton.vue'
import Pagination from '../components/Pagination.vue'
const route=useRoute(),router=useRouter(),list=ref([]),loading=ref(false),page=ref(1),total=ref(1),typeName=ref('影片分类'),sort=ref('latest')
const sorts=[{key:'latest',label:'最新',icon:'bi bi-lightning-charge-fill'},{key:'hot',label:'最热',icon:'bi bi-fire'},{key:'day',label:'今日热门',icon:'bi bi-bar-chart-fill'},{key:'week',label:'本周热门',icon:'bi bi-graph-up-arrow'},{key:'score',label:'高分',icon:'bi bi-star-fill'}],activeLabel=computed(()=>sorts.find(x=>x.key===sort.value)?.label||'最新')
async function load(){page.value=Math.max(1,Number(route.params.page||1));sort.value=sorts.some(s=>s.key===route.query.sort)?route.query.sort:'latest';loading.value=true;try{const r=await getCategory(route.params.id,page.value,sort.value);list.value=r.data.list||[];total.value=Number(r.data.pagecount||1);typeName.value=list.value[0]?.type_name||typeName.value;document.title=typeName.value+' - CAVXX'}catch{list.value=[];total.value=1}finally{loading.value=false}}
function changeSort(key){router.push({name:'category',params:{id:route.params.id},query:{sort:key}})}
function changePage(p){router.push({name:'category',params:{id:route.params.id,page:String(p)},query:{sort:sort.value}})}
watch(()=>route.fullPath,load,{immediate:true})
</script>
<style scoped>
.category-page{padding:20px 0 50px}.category-hero{padding:28px 30px;margin-bottom:14px;border:1px solid #ffffff12;border-radius:16px;background:radial-gradient(circle at 85% 30%,#ff4d7326,transparent 30%),#121218}.category-hero h1{margin:5px 0;color:#f4f4f6;font-size:28px}.category-hero p{margin:0;color:#777;font-size:12px}.sort-tabs{display:flex;gap:7px;padding:6px;margin-bottom:22px;overflow:auto;border:1px solid #ffffff12;border-radius:12px;background:#111117}.sort-tabs button{display:flex;align-items:center;gap:7px;padding:9px 14px;border:0;border-radius:8px;background:transparent;color:#858590;font-size:12px;white-space:nowrap}.sort-tabs button.active{color:#fff;background:#ff4d7322}.section-bar{margin:18px 0 15px}.section-heading{margin:0;color:#f0f0f3;font-size:20px}.section-subtitle{margin-top:4px;color:#777;font-size:11px}.empty-state{min-height:260px;display:grid;place-content:center;color:#999}@media(max-width:640px){.category-page{padding-top:10px}.category-hero{padding:22px 18px}.category-hero h1{font-size:23px}}
</style>
