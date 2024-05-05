<template>
    <h1 class="title">cocoreimu-ui 组件展示</h1>
    <nav class="nav">
      <RouterLink to="/">Icon</RouterLink>
      <RouterLink to="/button">Button</RouterLink>
    </nav>
    <div class="displayArea">
      <RouterView></RouterView>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped lang="scss">
h1.title{
  text-align: center;
  font-weight: 200;
}
.nav{
  display: flex;
  height: 50px;
  justify-content: space-evenly;
  align-items: center;
}
.displayArea{
  margin-top: 2em;
}
.active{
  border-bottom: 3px solid hsla(160,100%,37%,1);
}
</style>