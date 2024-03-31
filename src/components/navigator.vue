<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
let goBack = () => { router.go(-1) }
let goHome = () => { router.push({ path: "/" }) }
let goFront = () => { router.go(1) }
</script>

<template>
    <div>
        <el-tooltip content="返回" placement="top">
            <el-icon size="35px" class="Back" @click="goBack">
                <Back />
            </el-icon>
        </el-tooltip>

        <el-tooltip content="主页" placement="top">
            <el-icon size="35px" class="House" @click="goHome">
                <House />
            </el-icon>
        </el-tooltip>

        <el-tooltip content="向前" placement="top">
            <el-icon size="35px" class="Right" @click="goFront">
                <Right />
            </el-icon>
        </el-tooltip>

    </div>
</template>

<style scoped>
div {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.Back:hover {
    cursor: pointer;
}

.Right:hover {
    cursor: pointer;
}

.House:hover {
    cursor: pointer;
}
</style>
