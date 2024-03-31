<script setup>
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
import { useStuInfoStore } from '../stores/stuInfo';
import { removeToken } from '../utils/token-utils';
import { useRouter, useRoute } from 'vue-router';
import { isUserOverdue } from '../api';
let stuInfoStore = useStuInfoStore()
let username = ref('')
let keyWords = ref(null)//搜索栏输入的值
const { Bus } = getCurrentInstance().appContext.config.globalProperties // 获取到 全局事件总线
let router = useRouter()
let route = useRoute()

const profilePictureUrl = ref('')


onMounted(() => {
    //加载用户名称
    username.value = stuInfoStore.username
    //加载用户头像
    if (stuInfoStore.profilePictureUrl != null) {
        profilePictureUrl.value = stuInfoStore.profilePictureUrl
    }
    else {
        //如果用户未设置头像，则使用默认头像
        profilePictureUrl.value = '/src/assets/profilePicture/defaultStuProfile.png'
    }
})
function goLogin() {
    //如果当前页是NonPersonalInfo，前往登录时传递参数，表明上一次路由是NonPersonalInfo
    if (route.path == "/NonPersonalInfo") {
        router.push({ name: "login", query: { goPersonal: true } })
    }
    else {
        router.push({ name: "login" })
    }

}
//前往个人中心方法
async function goPersonal() {
    //检查用户登录是否过期
    await isUserOverdue()
    router.push({ name: "personalInfo" })
}
//前往发布商品
async function goPublishGoods() {
    //检查用户登录是否过期
    await isUserOverdue()
    if (route.path != "/publishOrModifyGoods") {
        router.push({ name: "publishOrModifyGoods" })
    }
    else {
        window.location.href = "http://localhost:5173/#/publishOrModifyGoods"
        router.go(0)
    }


}
//前往发布求购信息
async function goPublishPurchaseInfo() {
    //检查用户登录是否过期
    await isUserOverdue()
    router.push({ name: "publishPurchaseInfo" })
}
//退出登录方法，去除token并将stuInfoStore清空
function logout() {
    removeToken()
    let stuId = stuInfoStore.stuId
    stuInfoStore.$reset()
    console.log("out:" + stuId)
    username.value = null

    //如果当前页是personalInfo，退出登录时前往NonPersonalInfo
    if (route.path == "/personalInfo") {
        router.push({ name: "NonPersonalInfo", query: { stuId } })
    }
    else {//刷新页面
        router.go()
    }

}
watch(keyWords, (newVal) => {
    Bus.emit('keyWords', newVal)
})

</script>

<template>
    <el-affix>
        <div class="header">
            <div class="title">
                <el-icon size="70px" color="#2b73af">
                    <ShoppingBag />
                </el-icon>
                <h1>校园二手商品交易平台</h1>
            </div>
            <div v-if="route.path == '/' || route.path == '/showGoods'" class="routeLabel">
                <el-icon size="35px" color="black">
                    <HomeFilled />
                </el-icon>
                <h2>首页</h2>
            </div>
            <div v-if="route.path == '/goodsDetail'" class="routeLabel">
                <el-icon size="35px">
                    <ShoppingCart />
                </el-icon>
                <h2>商品详情</h2>
            </div>
            <div v-if="route.path == '/personalInfo'" class="routeLabel">
                <el-icon size="35px">
                    <User />
                </el-icon>
                <h2>个人中心</h2>
            </div>
            <div v-if="route.path == '/NonPersonalInfo'" class="routeLabel">
                <el-icon size="35px" color="black">
                    <UserFilled />
                </el-icon>
                <h2>他人中心</h2>
            </div>
            <div v-if="route.path == '/publishPurchaseInfo' && !route.query.goodsId" class="routeLabel">
                <el-icon size="35px">
                    <FirstAidKit />
                </el-icon>
                <h2>发布求购信息</h2>
            </div>
            <div v-if="route.path == '/purchaseInfo' && !route.query.goodsId" class="routeLabel">
                <el-icon size="35px">
                    <List />
                </el-icon>
                <h2>求购专区</h2>
            </div>
            <div v-if="route.path == '/publishOrModifyGoods' && !route.query.goodsId" class="routeLabel">
                <el-icon size="35px">
                    <FolderAdd />
                </el-icon>
                <h2>上架商品</h2>
            </div>
            <div v-if="route.path == '/publishOrModifyGoods' && route.query.goodsId" class="routeLabel">
                <el-icon size="35px">
                    <Edit />
                </el-icon>
                <h2>编辑商品</h2>
            </div>
            <div class="infoDiv">
                <el-dropdown trigger="hover" v-if="username">

                    <span class="InfoinnerScan">
                        <el-image class="profileImage" :src="profilePictureUrl" :zoom-rate="1.2" :max-scale="7"
                            :min-scale="0.2" :preview-src-list="[profilePictureUrl]" :initial-index="4" fit="cover" />
                        {{ username }}<el-icon size="15px" style="margin-left: 5px;"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdwon-menu>
                            <el-dropdown-item @click="goPersonal()">
                                个人中心
                            </el-dropdown-item>
                            <el-dropdown-item @click="goPublishGoods()">
                                上架商品
                            </el-dropdown-item>
                            <el-dropdown-item @click="goPublishPurchaseInfo()">
                                求购商品
                            </el-dropdown-item>
                            <el-dropdown-item @click="logout()">
                                退出登录
                            </el-dropdown-item>
                        </el-dropdwon-menu>
                    </template>
                </el-dropdown>
                <el-button v-else type="primary" @click="goLogin()">您好，请登录</el-button>
            </div>
        </div>
    </el-affix>

</template>

<style scoped>
.header {
    width: 100%;
    height: 80px;
    background-color: white;
    display: flex;
    border-bottom: 1px solid rgb(195, 192, 192);
    justify-content: space-between;
    align-items: center;
    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
}

.title {
    display: flex;

}


.routeLabel {
    display: flex;
    align-items: center;
}

.infoDiv {
    display: flex;
    height: 50px;
    width: 120px;
    /* border: 1px solid black; */
    align-items: center;
}
/* 去除黑框 */
.el-tooltip__trigger:focus-visible {
    outline: unset;
}
/* :deep(.el-input__wrapper) {

    border-radius: 0%;
   } */
.searchButton {
    height: 35px;
    border-radius: 0%;
    border-left: 0cap;
    background-color: #2b73af;
    color: white;
    border: 1px solid rgb(126, 121, 121);
}

.InfoinnerScan {
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: space-around
}

.profileImage {
    border-radius: 50%;
    width: 45px;
    height: 45px;
}

.example-showcase .el-dropdown+.el-dropdown {
    margin-left: 15px;
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

a {
    text-decoration: none;
    color: black
}
</style>
