<template><main class="site-main history-page"><div class="page-shell"><div class="section-bar"><div><div class="section-kicker">WATCH HISTORY</div><h1 class="section-heading">观看历史</h1><div class="section-subtitle">继续观看最近浏览过的影片</div></div><button v-if="items.length" class="clear-btn" @click="clear">清空历史</button></div><div v-if="items.length" class="video-grid"><VideoCard v-for="item in items" :key="item.vod_id" :item="item"/></div><div v-else class="empty-state"><i class="bi bi-clock-history"></i><strong>还没有观看记录</strong><span>打开影片后会自动记录。</span><router-link to="/" class="back-btn">去发现影片</router-link></div></div></main></template>
<script setup>
import {ref,onMounted} from 'vue'
import VideoCard from '../components/VideoCard.vue'
const KEY='cavxx_watch_history',items=ref([])
function load(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');items.value=Array.isArray(a)?a:[]}catch{items.value=[]}}
function clear(){localStorage.removeItem(KEY);items.value=[]}
onMounted(()=>{load();document.title='观看历史 - CAVXX'})
</script>
<style scoped>
.section-bar{display:flex;align-items:flex-end;justify-content:space-between;margin:24px 0 18px}.section-heading{margin:0;color:#eee;font-size:20px}.section-subtitle{margin-top:5px;color:#777;font-size:11px}.clear-btn{padding:8px 12px;border:1px solid #ffffff17;border-radius:9px;background:#15151b;color:#999}.empty-state{min-height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:1px dashed #ffffff17;border-radius:16px;color:#888}.empty-state i{font-size:36px;color:#ff7894}.empty-state strong{color:#ddd}.empty-state span{font-size:12px}.back-btn{margin-top:10px;padding:9px 15px;border-radius:9px;background:#ff4d73;color:white;text-decoration:none;font-size:12px}
</style>
