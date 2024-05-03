<template>
    <div class="homePage-container">
        <div class="Herta-box" :class="change">
            <img :src="HertaImg" alt="黑塔图片">
        </div>
        <div class="homePage-text">欢迎回家，狗修金sama (*>◡<*) --博丽七七</div>
        <div class="button-box">
            <el-button type="primary" @click="action">转圈圈</el-button>
            <router-link to="/404">
                <el-button type="primary">跳转404页面</el-button>
            </router-link>
            <el-button type="primary" @click="find">获取假数据</el-button>
        </div>
        <div class="getData">{{ getData }}</div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getUserInfo } from '@/api/user';
import Herta from "@/assets/images/Herta.png"
import HertaAct from "@/assets/images/HertaAct.png"
import HertaAudio from "@/assets/audio/Herta.m4a"

let audio = new Audio(HertaAudio);
let HertaImg = ref(Herta);
let change = ref("none");
let time = 0

let getData = ref("");

let action = () => {
    change.value = "none"
    HertaImg.value = Herta;
    audio.currentTime = 0; 
    audio.play();
    if(time === 0){
        setTimeout(()=>{
            change.value = "change"
            HertaImg.value = HertaAct;
        } , 150)
        time++;
    }
    else{
        change.value = "change"
        HertaImg.value = HertaAct;
    }
    setTimeout(()=>{
        change.value = "none"
        HertaImg.value = Herta;
    } , 550)
}
let find = async () => {
    try {
        const data = await getUserInfo({username:"admin",password:"123456"});
        getData.value = data.other; // 将获取到的数据赋值给 userInfo
    } catch (error) {
        console.error("获取数据失败：", error);
        // 在此处可以添加处理失败的逻辑，例如提示用户或记录日志
    }
}
</script>

<style scoped lang="scss">
.homePage-container{
    width: 100%; height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    .Herta-box{
        img{
            width: 100%; height: 100%;
        }
    }
    .change{
        margin-top: 20px;
        width: 380px;
    }
    .none{
        width: 400px;
    }
    .homePage-text{
        margin-top: 20px; margin-bottom: 20px;
        font-size: 20px; font-weight: 600;
    }
    .button-box{
        display: flex;
        button{
            margin-right: 10px;
        }
    }
    .getData{
        margin-top: 20px; margin-bottom: 20px;
        font-size: 20px; font-weight: 600;
    }
}
</style>