<template>
  <section v-if="links.length" class="friendly-links" aria-label="友情链接">
    <div class="links-inner">
      <div class="links-title"><span>↗</span> 友情链接</div>
      <div class="links-list">
        <a v-for="(item,index) in links" :key="`${item.name}-${index}`" :href="item.url" target="_blank" rel="noopener noreferrer" class="tag">{{ item.name }}</a>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
const linksConfig = ref({})
const hostname = window.location.hostname.toLowerCase().replace(/\.$/, '')
function normalizeHost(value) { return String(value || '').trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0].replace(/^www\./, '') }
function validLink(item) { return item && typeof item.name === 'string' && typeof item.url === 'string' && /^https?:\/\//i.test(item.url) }
const links = computed(() => {
  const entries = linksConfig.value || {}
  const exact = Object.keys(entries).find(key => normalizeHost(key) === hostname)
  if (exact) return Array.isArray(entries[exact]) ? entries[exact].filter(validLink) : []
  const wildcard = Object.keys(entries).find(key => key.startsWith('*.') && hostname.endsWith(key.slice(1)))
  if (wildcard) return Array.isArray(entries[wildcard]) ? entries[wildcard].filter(validLink) : []
  return []
})
onMounted(async () => {
  try {
    const response = await fetch('/links.json', { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    linksConfig.value = data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch (error) { console.warn('[FriendlyLinks] links.json load failed', error) }
})
</script>
<style scoped>
.friendly-links{border:1px solid #292929;background:#101010;border-radius:9px;margin:0 0 18px}.links-inner{width:100%;margin:0 auto;padding:13px 16px;display:flex;align-items:flex-start;gap:18px;box-sizing:border-box}.links-title{flex:0 0 auto;color:#aaa;font-size:11px;font-weight:700;line-height:26px}.links-title span{margin-right:5px;color:#f5c400}.links-list{display:flex;flex-wrap:wrap;gap:6px 14px}.tag{color:#aaa;text-decoration:none;font-size:11px;line-height:26px;white-space:nowrap}.tag:hover{color:#ffdc36}@media(max-width:640px){.links-inner{display:block;padding:11px 12px}.links-title{margin-bottom:4px}.links-list{gap:3px 12px}}
</style>
