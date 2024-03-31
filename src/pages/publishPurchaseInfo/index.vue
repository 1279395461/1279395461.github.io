<script setup>
import Header from '../../components/Header.vue';
import navigator from '../../components/navigator.vue';
import { useStuInfoStore } from '../../stores/stuInfo';
import { reactive, ref } from 'vue'
import { uploadPurchaseImagesApi, publishPurchaseInfoApi,isUserOverdue } from '../../api/index'
import { ElMessage, ElMessageBox } from 'element-plus';
const stuInfoStore = useStuInfoStore()
let purchaseInfo = reactive({
    stuId: stuInfoStore.stuId,
    info: null,
    imageList: []
})
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
    ElMessage.error('只能上传1张图片！')
}
//要上传的图片文件
let file = null;
//获取要上传的图片文件列表
function getFileList(uploadfile, uploadfileList) {
    file = uploadfile
    console.log(uploadfile)
}
//上传图片
async function upload(file) {
    //上传图片
    let formData = new FormData()
    formData.append("file", file.raw)
    //检查用户登录是否过期
    await isUserOverdue()
    let { pictureUrl } = await uploadPurchaseImagesApi(formData)
    return pictureUrl
}
//发布求购信息
async function publishPurchaseInfo() {
    //校验表单规则
    await ruleFormRef.value?.validate()
    //检查用户登录是否过期
    await isUserOverdue()
    let obj = {
        stuId: stuInfoStore.stuId,
        info: purchaseInfo.info,
        pictureUrl: null
    }
    //上传图片
    upload(file).then(
        async (pictureUrl) => {
            obj.pictureUrl = pictureUrl
            await publishPurchaseInfoApi(obj)
            file.status = "success"
        }
    ).catch((e) => {
        file.status = "fail"
    })
    //清空表达数据
    ruleFormRef.value?.resetFields()
}
const ruleFormRef = ref()
const uploadRef = ref()
const rules = {
    imageList: [{ required: true, message: "请上传图片！" }],
    info: [{ required: true, message: "请输入求购信息！", trigger: "blur" }]
}

</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <el-form :model="purchaseInfo" label-width="auto" :rules="rules" ref="ruleFormRef">
                <el-form-item label="图片：" prop="imageList">
                    <el-upload ref="uploadRef" v-model:file-list="purchaseInfo.imageList" list-type="picture-card"
                        :limit=1 :auto-upload="false" :before-upload="onBeforeUpload" :on-exceed="handleOnExceed"
                        :on-change="getFileList">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="求购信息：" prop="info" style="width: 400px;">
                    <el-input type="textarea" v-model="purchaseInfo.info" clearable maxlength="145"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" class="elButton" @click="publishPurchaseInfo()">确认发布</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 1200px;
    /* height: 1100px; */
    margin: 20px auto 20px auto;
    background-color: white;
    box-shadow: 10px 10px 15px 10px rgba(0, 0, 0, 0.3);

}

.content {
    height: 500px;
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.elButton {
    margin: 0 auto;
    width: 150px;
    font-size: 20px
}
</style>
