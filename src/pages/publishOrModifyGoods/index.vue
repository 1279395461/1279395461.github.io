<script setup>
import Header from '../../components/Header.vue';
import { useStuInfoStore } from '../../stores/stuInfo';
import { reactive, ref, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { uploadGoodsImagesApi, publishGoodsApi, findGoodsDetail, modifyGoodsApi, isUserOverdue,findAllTypes } from '../../api/index'
import { useRoute } from 'vue-router';
import navigator from '../../components/navigator.vue';
import axios from 'axios';
const stuInfoStore = useStuInfoStore()
const route = useRoute()
//商品信息对象
let goods = reactive({
    title: null,
    typeId: null,
    price: null,
    description: null,
    goodsLocation: null,
    contactInfo: null,
    imageList: [],
})
//商品类别列表
let goodsTypes = ref([
])
// //生成本地将要上传的图片列表
// function generateLocalUrl(e, file, fileList) {
//     let reader = new FileReader()
//     console.log(file)
//     reader.readAsDataURL(file.raw)
//     reader.onload = (e) => {
//         // fileList.push({ name: file.raw.name, url: e.target.result.goods.})
//         console.log(fileList)
//     }
// }

//上传图片之前的格式大小检查函数
function onBeforeUpload(file) {
    const isIMAGE = file.type === 'image/jpeg' || 'image/png' || 'image/jpg';
    const isLt1M = file.size / 1024 / 1024 < 2;
    if (!isIMAGE) {
        ElMessage.error('只能上传jepg、png、jpg格式的图片！')
        return false
    }
    if (!isLt1M) {
        ElMessage.error('图片不能超过2MB!')
        return false
    }
    return true;
}
//上传图片超过限制时的处理函数
function handleOnExceed(files, uploadfiles) {
    console.log(files)
    console.log(uploadfiles)
    ElMessage.error('最多只能上传5张图片！')
}

const ruleFormRef = ref()
const uploadRef = ref()
//表单验证规则
const rules = {
    title: [{ required: true, message: "请输入标题！", trigger: ["blur"] }],
    imageList: [{ required: true, message: "请至少一张上传商品展示图", trigger: ["blur"] }],
    typeId: [{ required: true, message: "请选择商品类别！", trigger: ["blur"] }],
    price: [{ required: true, message: "请输入商品价格！", trigger: ["blur"] },
    { required: true, message: "请输入商品价格！", trigger: ["blur"] }],
    contactInfo: [{ required: true, message: "请输入联系方式！", trigger: ["blur"] }]
}
//要上传的图片文件列表
let fileList = []
//获取要上传的图片文件列表
function getFileList(uploadfile, uploadfileList) {
    console.log(uploadfile)
    fileList = uploadfileList
    console.log(fileList)
}
//上传图片
async function upload(fileList) {

    //上传图片
    let formData = new FormData()
    if (route.query.goodsId) {
        fileList = goods.imageList
    }
    fileList.forEach(
        file => {
            formData.append("files", file.raw)
            console.log(file.raw)
        }
    )
    //检查用户登录是否过期
    await isUserOverdue()
    let { detailPictureUrls } = await uploadGoodsImagesApi(formData)
    // goods.detailPictureUrls=detailPictureUrls
    console.log(detailPictureUrls)
    return detailPictureUrls
    // console.log(detailPictureUrl)
}
//上架商品函数
async function publishGoods() {
    // console.log(goods.imageList)
    //校验表单规则
    await ruleFormRef.value?.validate()
    //检查用户登录是否过期
    await isUserOverdue()
    // 整理参数
    let info = {
        title: goods.title,
        typeId: goods.typeId,
        price: goods.price,
        description: goods.description,
        goodsLocation: goods.goodsLocation,
        contactInfo: goods.contactInfo,
        sellerStuId: stuInfoStore.stuId,
        createTime: null,
        detailPictureUrls: []
    }
    //上传图片
    upload(fileList).then(async (value) => {
        info.detailPictureUrls = value
        fileList.forEach(file => {
            file.status = "success"
        })
        //上传商品
        await publishGoodsApi(info)
    }).catch((e) => {
        fileList.forEach(file => {
            file.status = "fail"
        })
    })
    ElMessage.success("上架成功！")
    ruleFormRef.value?.resetFields()
    // console.log(goods.detailPictureUrls)

    // console.log("info=")
    // console.log(info)

}
//商品详情信息回显
async function getGoodsDeatilEcho() {
    let result = await findGoodsDetail(route.query.goodsId)
    goods.goodsId = route.query.goodsId
    goods.title = result.goods.title
    goods.typeId = result.goods.typeId
    goods.price = result.goods.price
    goods.description = result.goods.description
    goods.goodsLocation = result.goods.goodsLocation
    goods.contactInfo = result.goods.contactInfo
    // console.log(result.goods.detailPictureUrls[1])
    let detailPictureUrls = result.goods.detailPictureUrls
    for (let i = 0; i < detailPictureUrls.length; i++) {
        axios.get(`http://localhost:8080/goods/urlToFile?url=${result.goods.detailPictureUrls[i]}`, {responseType: 'blob' })
            .then(res => {
                console.log(res)
                let blob = new Blob([res.data])
                let url = URL.createObjectURL(blob);

                let file = new File([blob], 'image.png', { type: 'image/png' })
                goods.imageList.push({ name: "iamge" + i + ".png", raw: file, url: url, status: "ready" })
            }).catch(e=>{
                console.log("fail")
            })
    }

}
//将修改后的商品信息上传
async function modifyGoods() {
    //校验表单规则
    await ruleFormRef.value?.validate()
    //检查用户登录是否过期
    await isUserOverdue()
    // 整理参数
    let info = {
        goodsId: route.query.goodsId,
        title: goods.title,
        typeId: goods.typeId,
        price: goods.price,
        description: goods.description,
        goodsLocation: goods.goodsLocation,
        contactInfo: goods.contactInfo,
        detailPictureUrls: []
    }
    //上传图片
    upload(fileList).then(async (value) => {
        info.detailPictureUrls = value
        fileList.forEach(file => {
            file.status = "success"
        })
        //上传商品修改信息
        await modifyGoodsApi(info)
        // await publishGoodsApi(info)
    })
}

onMounted(async  () => {
   let result=await findAllTypes()
   console.log("goodsTypes.value")
   //将”其他“类别放在最后
   let temp=result.goodsTypes[10]
   result.goodsTypes.splice(10,1)
   result.goodsTypes.push(temp)
   
   goodsTypes.value=result.goodsTypes
   //如果上一路由有传入参数，说明进行某个商品的编辑
    if (route.query.goodsId) {
        getGoodsDeatilEcho()
    }
    else {
        console.log("nogoodsId")
    }

})

</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <el-form label-width="auto" :model="goods" :rules="rules" ref="ruleFormRef">
                <el-form-item label="标题：" prop="title" style="width: 700px;">
                    <el-input v-model="goods.title" type="text" clearable maxlength="30" show-word-limit />
                </el-form-item>
                <el-form-item label="商品展示图：" prop="imageList">
                    <el-upload ref="uploadRef" v-model:file-list="goods.imageList" list-type="picture-card" :limit=5
                        :auto-upload="false" :before-upload="onBeforeUpload" :on-exceed="handleOnExceed"
                        :on-change="getFileList" multiple>
                        <!-- <img src="blob:http://localhost:5173/2d6257df-e1b5-45c8-9686-302b337d2e28" alt=""> -->
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="类别：" prop="typeId">
                    <el-select v-model="goods.typeId" palceholder="请选择商品类别">
                        <el-option v-for="(item, index) in goodsTypes" :key="index" :label="item.type" :value="item.typeId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="价格（元）：" prop="price">
                    <el-input-number v-model="goods.price" type="text" :precision="2" />
                </el-form-item>
                <el-form-item label="交易地点：" prop="goodsLocation">
                    <el-input v-model="goods.goodsLocation" type="text" clearable maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="联系方式：" prop="contactInfo">
                    <el-input v-model="goods.contactInfo" type="text" clearable maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="商品描述：" prop="description">
                    <el-input v-model="goods.description" type="textarea" clearable maxlength="200" show-word-limit />
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!route.query.goodsId" class="elButton" type="primary"
                        @click="publishGoods()">上架</el-button>
                    <el-button v-if="route.query.goodsId" class="elButton" type="primary"
                        @click="modifyGoods()">确认修改</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<style scoped>
.container {
    background-color: white;
    /* border: 1px solid black; */
    width: 1100px;
    height: 600px;
    margin: 20px auto 0 auto;
    box-shadow: 10px 10px 15px 10px rgba(0, 0, 0, 0.3);


}

.content {

    margin-top: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px solid black; */
}

.elButton {
    width: 150px;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
}
</style>
