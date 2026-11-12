<template><Header/><div class="page-shell global-blocks"><AdContainer slot="top" label="顶部广告"/><FriendlyLinks/></div><router-view/><div class="page-shell global-blocks"><AdContainer slot="bottom" label="底部广告"/></div><Footer/></template>
<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import AdContainer from './components/AdContainer.vue'
import FriendlyLinks from './components/FriendlyLinks.vue'
</script>
<style scoped>.global-blocks{padding-top:14px}</style>
