<template>
    <svg :style="{ width , height }">
        <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
</template>

<script setup lang='ts'>
defineProps({
    name: {
        type: String,
    }, 
    width: {
        type: String,
        default: '1em'
    }, 
    height: {
        type: String,
        default: '1em'
    }, 
    color: {
        type: String,
        default: '#333'
    }, 
    prefix: {
        type: String,
        default: '#icon-'
    }
})
</script>

<style scoped lang="scss">

</style>