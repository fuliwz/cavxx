<template>
  <div v-if="enabled && ads.length" class="ad-container" :aria-label="label">
    <div v-for="(ad,index) in ads" :key="`${ad.id || index}-${generation}`" class="ad-item">
      <a v-if="ad.type === 'image' && ad.image" :href="ad.href || undefined" :target="ad.href ? (ad.target || '_blank') : undefined" :rel="ad.href ? 'noopener noreferrer sponsored' : undefined">
        <img :src="ad.image" :alt="ad.alt || '广告'" loading="lazy">
      </a>
      <a v-else-if="ad.type === 'text' && ad.text" :href="ad.href || undefined" :target="ad.href ? (ad.target || '_blank') : undefined" :rel="ad.href ? 'noopener noreferrer sponsored' : undefined">{{ ad.text }}</a>
      <div v-else-if="ad.type === 'html'" class="ad-html" v-html="ad.html"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const props = defineProps({ slot: { type: String, default: 'top' }, label: { type: String, default: '广告' } })
const route = useRoute()
const config = ref({ enabled: false, slots: {} })
const generation = ref(0)
const enabled = computed(() => config.value.enabled === true)
const ads = computed(() => { const value = config.value.slots?.[props.slot]; return Array.isArray(value) ? value.filter(item => item && item.enabled !== false) : [] })
async function loadAds() {
  try {
    const response = await fetch('/ads.json', { cache: 'no-cache' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    config.value = data && typeof data === 'object' ? data : { enabled: false, slots: {} }
    generation.value++
  } catch (error) { console.warn('[AdContainer] ads.json load failed', error); config.value = { enabled: false, slots: {} } }
}
onMounted(loadAds)
watch(() => route.fullPath, () => { generation.value++ })
</script>
<style scoped>
.ad-container{width:100%;display:grid;gap:10px;overflow:hidden}.ad-item{min-width:0;text-align:center}.ad-item a{color:#f5c400;text-decoration:none}.ad-item img{display:block;width:100%;height:auto;max-height:180px;object-fit:cover;border-radius:8px}.ad-html{max-width:100%;overflow:hidden}
</style>
