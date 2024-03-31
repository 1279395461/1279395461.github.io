<script setup>
import { findPersonalInfo,findPersonalGoods } from '../../api';
import Header from '../../components/Header.vue';
import { useStuInfoStore } from '../../stores/stuInfo';
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import navigator from '../../components/navigator.vue';
const route = useRoute()
const router = useRouter()
const stuInfoStore=useStuInfoStore()
//个人信息存储对象
let personalInfo = reactive({
    stuId: null,
    phoneNumber: null,
    institute: null,
    studentNumber: null,
    profilePictureUrl:null
})
let findPersonalGoodsInfo = reactive({
    stuId: null,
    pageNum: 1,
    pageSize: 5
})
//个人商品存储对象
let personalGoodsPgaeData = ref([])
//返回数据的总个数
let totalSize = ref(0)
//发送请求，接受个人信息数据
async function getPersonalInfo() {
    console.log(route.query.stuId)
    let { stuUser } = await findPersonalInfo(route.query.stuId)
    personalInfo.stuId = stuUser.stuId
    personalInfo.username = stuUser.username
    personalInfo.phoneNumber = stuUser.phoneNumber
    personalInfo.institute = stuUser.institute
    personalInfo.studentNumber = stuUser.studentNumber
    personalInfo.profilePictureUrl=stuUser.profilePictureUrl
    findPersonalGoodsInfo.stuId=stuUser.stuId
    getPersonalGoods()
    console.log(personalInfo)
}
//查询个人商品分页信息函数
async function getPersonalGoods() {
    console.log(findPersonalGoodsInfo)
    let { pageInfo } = await findPersonalGoods(findPersonalGoodsInfo)
    personalGoodsPgaeData.value = pageInfo.pageData
    console.log(personalGoodsPgaeData.value)
    totalSize.value = pageInfo.totalSize
}
// //当前页码变更时的处理函数
// function handleSizeChange(val){
//     getPersonalGoods()
// }
// //当前页记录数变更时的处理函数
// function handleCurrentChange(val){
//     getPersonalGoods()
// }
//点击前往商品详情
function goGoodsDetail(goodsId){
    router.push({name:'goodsDeatil',query:{goodsId}})
}

onMounted(() => {
    //如果用户学号stuId与路由参数的stuId相同，说明需要前往个人信息路由personalInfo
    if(stuInfoStore.stuId==route.query.stuId){
        router.push({name:"personalInfo"})
    }
    getPersonalInfo()
   
})
</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <el-tabs  class="tabsDiv">
                <el-tab-pane label="他人信息" class="pane">
                    <img :src="personalInfo.profilePictureUrl" alt="" class="profilePicture">
                    <el-descriptions column=1>
                        <el-descriptions-item label="学生id：">{{ personalInfo.stuId }}</el-descriptions-item>
                        <el-descriptions-item label="用户名：">{{ personalInfo.username }}</el-descriptions-item>
                        <el-descriptions-item label="手机号码：">{{ personalInfo.phoneNumber }}</el-descriptions-item>
                        <el-descriptions-item label="学院：">{{ personalInfo.institute }}</el-descriptions-item>
                        <el-descriptions-item label="学号：">{{ personalInfo.studentNumber }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="他的商品" class="goodsPane">
                    <div v-for="(item, index) in personalGoodsPgaeData" class="goodsDiv goodsHover">
                        <img :src="item.profilePictureUrl" alt="" class="goodsPicture">
                        <table cellspacing="5px" width="900px" height="150px">
                            <tbody>
                                <tr><span>商品Id：{{ item.goodsId }}</span></tr>
                                <tr><span>标题：{{ item.title }}</span></tr>
                                <tr>商品描述：<span class="descSpan">{{ item.description }}</span></tr>
                            </tbody>
                            <tr class="bottomTr">
                                    <span style="font-size: 13px;">
                                        上架时间：{{ item.createTime }}
                                    </span>
                                    <el-button class="elButton" type="primary" @click="goGoodsDetail(item.goodsId)">查看详情</el-button>
                         </tr>
                        </table>
                    </div>
                    <div style="margin-bottom:10px;display: flex;justify-content: center;align-items: center;">
                        <el-pagination v-model:current-page="findPersonalGoodsInfo.pageNum"
                        v-model:page-size="findPersonalGoodsInfo.pageSize" @size-change="getPersonalGoods()"
                        @current-change="getPersonalGoods()" :page-sizes="[5, 7, 10]" background
                        layout="prev, pager, next , ->, sizes, total" :total="totalSize">
                    </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: white;
    /* border: 1px solid black; */
    width: 1100px;
    
    margin: 20px auto 0 auto;
    box-shadow: 10px 10px 15px 10px rgba(0, 0, 0, 0.3);
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
}

.content {
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.pane {
    width: 500px;
    margin: 0 auto;
    height: 400px;
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.tabsDiv {
    width: 1000px;
}

.profilePicture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.goodsDiv {
    display: flex;
    justify-content: start;
    align-items: self-start;
    margin-bottom: 10px;
    border: 1px solid rgb(125, 121, 121);
    border-radius:15px;
}
.goodsHover:hover{
    border: 1px solid #ff9900;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3)
}
.goodsPicture {
    width: 150px;
    height: 150px;
    border-radius:15px;
    /* border: 1px solid black; */
}

.descSpan {
    font-size: 15px;
    display: -webkit-box;
    /* 将容器设置为弹性盒子 */
    -webkit-box-orient: vertical;
    /* 垂直方向排列 */
    overflow: hidden;
    /* 溢出隐藏 */
    -webkit-line-clamp: 1;
    /* 设置显示的行数 */
}

.bottomTr {
    /* border: 1px solid black; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0px;
}
.elButton{
    height: 10px;
    width: 70px;
    font-size: 12px;
}
</style>
