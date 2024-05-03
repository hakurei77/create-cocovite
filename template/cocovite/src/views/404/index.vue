<template>
    <div class="notFound-container">
        <div class="notFound-image">
            <img src="@/assets/images/404.png" alt="404报错图片">
        </div>
        <div class="notFound-text">狗修金sama，您访问的页面不存在呢QAQ</div>
        <router-link to="/">
            <el-button type="primary">返回主页</el-button>
        </router-link>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped lang="scss">
.notFound-container{
    width:100%; height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    .notFound-image{
        width: 300px;
        margin-top: 300px;
        img{
            width: 100%; height: 100%;
        }
    }
    .notFound-text{
        margin-top: 20px; margin-bottom: 20px;
        font-size: 20px; font-weight: 600;
    }
}
</style>