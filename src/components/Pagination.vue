<template><nav v-if="totalPage>1" class="pagination-wrap"><button class="page-btn" :disabled="current<=1" @click="change(current-1)">‹</button><button v-for="p in pageList" :key="p" class="page-btn" :class="{active:p===current}" @click="change(p)">{{p}}</button><button class="page-btn" :disabled="current>=totalPage" @click="change(current+1)">›</button></nav></template>
<script setup>
import {computed} from 'vue'
const props=defineProps({page:{type:Number,default:1},total:{type:Number,default:1}}),emit=defineEmits(['change'])
const current=computed(()=>props.page),totalPage=computed(()=>props.total)
const pageList=computed(()=>{const start=Math.max(1,current.value-4),end=Math.min(totalPage.value,current.value+4);return Array.from({length:Math.max(0,end-start+1)},(_,i)=>start+i)})
function change(p){p=Number(p);if(p>=1&&p<=totalPage.value&&p!==current.value)emit('change',p)}
</script>
<style scoped>.pagination-wrap{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin:30px 0 8px}.page-btn{min-width:34px;height:34px;border:1px solid #ffffff17;border-radius:9px;background:#15151b;color:#92929d;cursor:pointer}.page-btn.active{border-color:#f5c400;background:#f5c400;color:#fff}.page-btn:disabled{opacity:.35}</style>
