<script setup>
import Header from '../../components/Header.vue'
import { useStuInfoStore } from '../../stores/stuInfo';
import { onMounted, reactive, ref,getCurrentInstance,watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { findGoodsDetail,submitReportInfo,isUserOverdue } from '../../api';
import { ElMessage } from 'element-plus';
import navigator from '../../components/navigator.vue';
const stuInfoStore = useStuInfoStore()
let username = ref('')
let stuId=ref('')//登录用户的id
const router = useRouter()
const route=useRoute()
const goods = ref({})
const dialogVisible = ref(false)
const ruleFormRef=ref()
const reportInfo = reactive({
    promoterId: stuInfoStore.stuId,//举报发起人id
    targetId: localStorage.getItem('goodsId'), //被举报商品的id
    content: null //举报原因
})
// const {Bus}=getCurrentInstance().appContext.config.globalProperties
// Bus.on('keyWords',(keyWords)=>{
//     router.push({name:"showGoods"})
// })
//  goodsId: null,
//     type: null,
//     price: 0,
//     description: null,
//     goodsLocation: null,
//     contactInfo: null,
//     sellerName: null,
//     detailPictureUrls: []

async function getGoodsDetail() {
    console.log("goodsId=")
    console.log(route.query.goodsId)

    //拿到本地存储的goodsId
    let result = await findGoodsDetail(route.query.goodsId)
    console.log('result=')
    goods.value = result.goods
    console.log(goods.value)

}
onMounted(() => {
    // console.log('goods1=')
    username.value = stuInfoStore.username
    stuId.value=stuInfoStore.stuId
    getGoodsDetail()
    console.log("monunted了")
    // console.log('good2s2=')
    console.log( goods.value)
    // console.log('stu=')
    // console.log(stuInfoStore.$state)
})

//举报原因验证规则
function validateContent(rule, value, callback){
    if(!value){
        callback(new Error("请输入举报原因！"))
    }
    else if(value.length<10){
        callback(new Error("请输入10字以上的内容！"))
    }
    else{
        callback()
    }
}
const rules={
    content:[{required:true,validator:validateContent,trigger:['blur','change']}]
}
//提交举报函数
async function submitReport(){
    await ruleFormRef.value?.validate()//等待表单的验证规则通过
    //检查用户登录是否过期
    await isUserOverdue()
    await submitReportInfo(reportInfo)
    //清空
    ruleFormRef.value?.resetFields()
    ElMessage.success("提交成功，请耐心等待处理")
    dialogVisible.value=false
}
//点击前往卖家个人中心
function goPersonal(){
    let stuId= stuInfoStore.stuId;
    // console.log(stuId)
    // console.log(goods.value.sellerStuId)
    // console.log(stuId!=goods.value.sellerStuId)
    //判断卖家是否是用户本人
    if(stuId!=goods.value.sellerStuId){
        stuId=goods.value.sellerStuId
        // console.log("goNonp")
        router.push({name:'NonPersonalInfo',query:{stuId}})
    }
    else{
        // console.log("gonp")
        router.push({name:'personalInfo',query:{stuId}})
    }
}
</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <div class="carouselDiv">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item v-for="(item, index) in goods.detailPictureUrls">
                        <img :src="item" alt="" class="imageDiv">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="infoDiv">

                <el-descriptions column="1" size="large" title="商品详情">
                    <el-descriptions-item label=" 商品id：">{{ goods.goodsId }}</el-descriptions-item>
                    <el-descriptions-item label=" 标题：">{{ goods.title }}</el-descriptions-item>
                    <el-descriptions-item label=" 类别：">{{ goods.type }}</el-descriptions-item>
                    <el-descriptions-item label=" 价格：">￥{{ goods.price }}</el-descriptions-item>
                    <el-descriptions-item label=" 卖家名称："><span class="nameTag" @click="goPersonal()">{{ goods.sellerName }}</span></el-descriptions-item>
                    <el-descriptions-item label=" 上架时间：">{{ goods.createTime }}</el-descriptions-item>
                    <el-descriptions-item v-if="username" label=" 交易地点：">{{ goods.goodsLocation
                        }}</el-descriptions-item>
                    <el-descriptions-item v-if="username" label=" 联系方式：">{{ goods.contactInfo
                        }}</el-descriptions-item>
                    <el-descriptions-item v-else>请登录后查看交易地点与联系方式！</el-descriptions-item>
                </el-descriptions>
                <el-button v-if="username && stuId!=goods.sellerStuId " class="reportButton" type="danger"
                    @click="dialogVisible = true">举报商品</el-button>
                    
                <el-dialog v-model="dialogVisible" title="举报" width="500" center align-center>
                    <el-form :model="reportInfo" label-width="auto" ref="ruleFormRef" :rules="rules">
                        <el-form-item label="举报原因：" prop="content">
                            <el-input type="textarea" v-model="reportInfo.content" autosize maxlength="100"
                                show-word-limit placeholder="请输入10到100字的内容"  ></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <el-button type="danger" class="reportButton" @click="submitReport()">提交</el-button>
                    </template>
                </el-dialog>
            </div>
        </div>
        <div class="footer">
            <el-divider content-position="center"><span
                    style="font-size: 20px;font-weight: bold;">商品描述</span></el-divider>
            <el-descriptions coloum="1" size="large">
                <el-descriptions-item>{{ goods.description }}</el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: white;
    /* border: 1px solid black; */
    width: 1200px;
    margin: 20px auto 0 auto;
    box-shadow: 10px 10px 15px 10px rgba(0, 0, 0, 0.3);
    /* display: flex;
    justify-content: space-evenly;
    align-items: self-start; */
}

.goback:hover {
    cursor: pointer;
    margin-left: 10px
}

.content {
    display: flex;
    justify-content: space-evenly;
    align-items: self-start;

}
.nameTag:hover{
    color:red;
    border-bottom: 1px solid red;
    cursor: pointer;
}
.footer {
    /* border: 1px solid black; */
    /* border-top: 3px solid rgb(184, 177, 177); */
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

.carouselDiv {
    /* border: 1px solid black; */
    width: 600px;
    height: 500px;
}

.imageDiv {
    width: 600px;
    height: 500px;
}

.infoDiv {
    /* border: 1px solid black; */
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 3px dashed rgb(184, 177, 177);
    border-radius: 10px;

}

:deep(.el-descriptions__label) {
    font-size: 20px;
}

:deep(.el-descriptions__content) {
    font-size: 20px;
}

:deep(.el-descriptions--large .el-descriptions__header .el-descriptions__title) {
    font-size: 25px;
}

.reportButton {
    width: 150px;
    height: 30px;
}
</style>
