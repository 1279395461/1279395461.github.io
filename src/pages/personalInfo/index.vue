<script setup>
import { isUserOverdue,uploadStuProfile, findPersonalInfo, updatePersonalInfo, updatePassword, findPersonalGoods, setGoodsStatusOff, getPersonalPurchaseInfoApi, deletePersonalPurchaseInfo } from '../../api';
import Header from '../../components/Header.vue';
import navigator from '../../components/navigator.vue';
import { useStuInfoStore } from '../../stores/stuInfo';
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus';
import { validateUsername, validatePassword, validatePhoneNumber, validateStudentNumber } from '../../utils/validate-utils'

const route = useRoute()
const router = useRouter()
const stuInfoStore = useStuInfoStore()
//个人信息存储对象
let personalInfo = reactive({
    stuId: null,
    username: null,
    password: null,
    checkPassword: null,
    phoneNumber: null,
    institute: null,
    studentNumber: null,
    profilePictureUrl: null
})
let findPersonalGoodsInfo = reactive({
    stuId: stuInfoStore.stuId,
    pageNum: 1,
    pageSize: 5
})
let findPersonalPurchaseInfo = reactive({
    stuId: stuInfoStore.stuId,
    pageNum: 1,
    pageSize: 5
})
//个人商品存储对象
let personalGoodsPgaeData = ref([])
let personalPurchaseInfoPageData = ref([])
//返回数据的总个数
let personalGoodsTotalSize = ref(0)
let personalPurchaseInfoTotalSize = ref(0)
const ruleInfoFormRef = ref()
const rulePwdFormRef = ref()
//验证重新输入的密码
function validateCheckPassword(rule, value, callback) {
    if (!value) {
        callback(new Error("请重新输入密码！"))
    }
    else if (personalInfo.password != value) {
        callback(new Error("两次密码输入不一致！"))
    }
    else {
        callback()
    }
}
//个人信息表单验证规则
const rules1 = {
    username: [{ required: true, validator: validateUsername, trigger: ['blur', 'change'] }],
    phoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: ['blur', 'change'] }],
    studentNumber: [{ required: true, validator: validateStudentNumber, trigger: ['blur', 'change'] }]

}
//密码修改表单验证规则
const rules2 = {
    password: [{ required: true, validator: validatePassword, trigger: ['blur', 'change'] }],
    checkPassword: [{ required: true, validator: validateCheckPassword, trigger: ['blur', 'change'] }]
}

//发送请求，上传用户头像
async function upload(obj) {
    //检查用户登录是否过期
    await isUserOverdue()
    const formData = new FormData()
    formData.append("file", obj.file)
    let { url } = await uploadStuProfile(formData)
    personalInfo.profilePictureUrl = url
}
//发送请求，接受个人信息数据
async function getPersonalInfo() {
    let { stuUser } = await findPersonalInfo(stuInfoStore.stuId)
    personalInfo.stuId = stuUser.stuId
    personalInfo.username = stuUser.username
    personalInfo.phoneNumber = stuUser.phoneNumber
    personalInfo.institute = stuUser.institute
    personalInfo.studentNumber = stuUser.studentNumber
    personalInfo.profilePictureUrl = stuUser.profilePictureUrl
    console.log(personalInfo)
}
//提交修改个人信息
async function submitChangeInfo() {
    //校验表单规则
    await ruleInfoFormRef.value?.validate()
    //检查用户登录是否过期
    await isUserOverdue()
    //更新数据
    await updatePersonalInfo(personalInfo)
    //重新获取更新过后的数据
    getPersonalInfo()

    ElMessage.success("修改成功！")
    setTimeout(() => {
        router.go()
    }, 500)


}
//提交修改密码
async function submitChangePassword() {
    //校验表单规则
    await rulePwdFormRef.value?.validate()
    //检查用户登录是否过期
    await isUserOverdue()
    let formData = new FormData()
    formData.append("stuId", personalInfo.stuId)
    formData.append("password", personalInfo.password)
    //修改密码请求
    await updatePassword(formData)
    rulePwdFormRef.value?.resetFields()
    ElMessage.success("修改成功！")
    setTimeout(() => {
        router.go()
    }, 500)

}
//查询个人商品分页信息函数
async function getPersonalGoods() {
    let { pageInfo } = await findPersonalGoods(findPersonalGoodsInfo)
    personalGoodsPgaeData.value = pageInfo.pageData
    personalGoodsTotalSize.value = pageInfo.totalSize
}
async function getPersonalPurchaseInfo() {
    let { pageInfo } = await getPersonalPurchaseInfoApi(findPersonalPurchaseInfo)
    personalPurchaseInfoPageData.value = pageInfo.pageData
    personalPurchaseInfoTotalSize.value = pageInfo.totalSize
}
// //当前页码变更时的处理函数
// function handleSizeChange(val) {
//     getPersonalGoods()
// }
// //当前页记录数变更时的处理函数
// function handleCurrentChange(val) {
//     getPersonalGoods()
// }
//点击前往商品详情
function goGoodsDetail(goodsId) {
    router.push({ name: 'goodsDeatil', query: { goodsId } })
}
//点击前往编辑商品
function goModifyGoods(goodsId) {
    router.push({ name: "publishOrModifyGoods", query: { goodsId } })
}
//下架商品
function offGoods(goodsId) {
    ElMessageBox.confirm(
        "确定要下架商品吗?",
        "下架商品",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
    ).then(async () => {
        //修改数据库商品表状态id，使其为下架状态
        await setGoodsStatusOff(goodsId)
        //刷新数据
        getPersonalGoods()
        //提示下架成功
        ElMessage({
            type: 'success',
            message: '下架成功！'
        })
    }).catch(() => {
        //提示取消下架
        ElMessage({
            type: 'info',
            message: '已取消下架'
        })
    })


}
//删除求购信息
function deletePersonalPurchase(id) {

    ElMessageBox.confirm(
        "确定要删除吗?",
        "删除求购信息",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
    ).then(async () => {
        //检查用户登录是否过期
        await isUserOverdue()
        //修改删除求购信息
        console.log(id)
        await deletePersonalPurchaseInfo(id)
        //刷新数据
        getPersonalPurchaseInfo()
        //提示下架成功
        ElMessage({
            type: 'success',
            message: '删除成功！'
        })
    }).catch(() => {
        //提示取消下架
        ElMessage({
            type: 'info',
            message: '已取消'
        })
    })
}
onMounted(() => {
    getPersonalInfo()
    getPersonalGoods()
    getPersonalPurchaseInfo()
})
</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <el-tabs class="tabsDiv">
                <el-tab-pane label="修改信息" class="pane">
                    <el-upload class="avatar-uploader" :show-file-list="false" :http-request="upload">
                        <el-tooltip placement="top" content="点击上传用户头像">
                            <img :src="personalInfo.profilePictureUrl" class="profilePicture" />
                        </el-tooltip>
                    </el-upload>
                    <el-form label-width="auto" :model="personalInfo" :rules="rules" ref="ruleInfoFormRef">
                        <el-form-item label="学生id：" prop="stuId">
                            {{ personalInfo.stuId }}
                        </el-form-item>
                        <el-form-item label="用户名：" prop="username">
                            <el-input v-model="personalInfo.username" type="text" />
                        </el-form-item>
                        <el-form-item label="手机号码：" prop="phoneNumber">
                            <el-input v-model="personalInfo.phoneNumber" type="text" maxlength="12" />
                        </el-form-item>

                        <el-form-item label="学院：" prop="institute">
                            <el-input v-model="personalInfo.institute" type="text" />
                        </el-form-item>
                        <el-form-item label="学号：" prop="studentNumber">
                            <el-input v-model="personalInfo.studentNumber" type="text" maxlength="12" />
                        </el-form-item>
                        <el-form-item>
                            <span style="margin-left: auto;margin-right: auto;"><el-button type="success"
                                    @click="submitChangeInfo()">确认修改</el-button></span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="密码修改" class="pane">
                    <div style="height: 400px;display: flex;justify-content: center;align-items: center;">
                        <el-form label-width="auto" :model="personalInfo" :rules="rules2" ref="rulePwdFormRef">
                            <el-form-item label="新密码：" prop="password" style="width: 400px;">
                                <el-input v-model="personalInfo.password" type="password" maxlength="20"
                                    placeholder="请输入8-20位的数字、字母或字符" clearable show-password />
                            </el-form-item>
                            <el-form-item label="确认密码：" prop="checkPassword">
                                <el-input v-model="personalInfo.checkPassword" type="password" maxlength="20"
                                    placeholder="请重新输入密码" clearable show-password />
                            </el-form-item>
                            <el-form-item>
                                <span style="margin-left: auto;margin-right: auto;"><el-button type="success"
                                        @click="submitChangePassword()">确认修改</el-button></span>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="我的商品" class="goodsPane">
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
                                <div>
                                    <el-button class="elButton" type="primary"
                                        @click="goGoodsDetail(item.goodsId)">查看详情</el-button>
                                    <el-button class="elButton" type="success"
                                        @click="goModifyGoods(item.goodsId)">编辑</el-button>
                                    <el-button class="elButton" type="danger"
                                        @click="offGoods(item.goodsId)">下架</el-button>
                                </div>
                            </tr>
                        </table>
                    </div>
                    <div style="margin-bottom:10px;display: flex;justify-content: center;align-items: center;">
                        <el-pagination v-model:current-page="findPersonalGoodsInfo.pageNum"
                            v-model:page-size="findPersonalGoodsInfo.pageSize" @size-change="getPersonalGoods()"
                            @current-change="getPersonalGoods()" :page-sizes="[5, 7, 10]" background
                            layout="prev, pager, next , ->, sizes, total" :total="personalGoodsTotalSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="我的求购信息" class="goodsPane">
                    <div v-for="(item, index) in personalPurchaseInfoPageData" class="purchaseDiv">
                        <div style="display: flex;justify-content: start;">
                            <img :src="item.pictureUrl" alt="" class="goodsPicture">
                            <div>
                                <span><span style="font-weight: bolder;">时间：</span>{{ item.createTime }}</span>
                                <div><span style="font-weight: bolder;">求购信息：</span>{{ item.info }}</div>
                            </div>
                        </div>
                        <el-icon size="20px">
                            <CircleClose @click="deletePersonalPurchase(item.id)" />
                        </el-icon>
                    </div>
                    <div style="margin-bottom:10px;display: flex;justify-content: center;align-items: center;">
                        <el-pagination v-model:current-page="personalPurchaseInfoPageData.pageNum"
                            v-model:page-size="personalPurchaseInfoPageData.pageSize"
                            @size-change="getPersonalPurchaseInfo()" @current-change="getPersonalPurchaseInfo()"
                            :page-sizes="[5, 7, 10]" background layout="prev, pager, next , ->, sizes, total"
                            :total="personalPurchaseInfoTotalSize">
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
    /* border: 1px solid black; */
    display: flex;
    height: 500px;
    flex-direction: column;
    justify-content: center;
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
    border-radius: 15px;
}

.goodsHover:hover {
    border: 1px solid #ff9900;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3)
}

.goodsPicture {
    width: 150px;
    height: 150px;
    border-radius: 15px;
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

.purchaseDiv {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    border-radius: 15px;
    border: 1px solid rgb(125, 121, 121);
}

.elButton {
    height: 10px;
    width: 50px;
    font-size: 12px;
    margin-left: 1px;
}
</style>
