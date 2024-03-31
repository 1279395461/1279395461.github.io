<script setup>

import Header from '../../components/Header.vue';
import navigator from '../../components/navigator.vue';
import { reactive, ref, onMounted, watch } from "vue"
import { getPurchaseInfoApi } from '../../api/index'
import { Search } from '@element-plus/icons-vue'
let getPurchaseInfoVo = reactive({
    keyWords: null,
    pageNum: 1,
    pageSize: 10
})
let purchaseInfoPageData = ref([])
let totalSize = ref(0)
let offset = ref(0) //序号偏移量
async function getPurchaseInfo() {
    let { pageInfo } = await getPurchaseInfoApi(getPurchaseInfoVo)
    purchaseInfoPageData.value = pageInfo.pageData
    totalSize.value = pageInfo.totalSize
}
//当前页码变更时的处理函数
function handleCurrentChange(currentPage) {
    console.log("cc" + currentPage)
    getPurchaseInfo()
    if (currentPage != 1) {
        offset.value = getPurchaseInfoVo.pageSize
    } else {
        offset.value = 0
    }
    // totalSize.value=+pageInfo.totalSize
    // console.log(pageData.value)
    // pageData
}
//当前页记录数变更时的处理函数
function handleSizeChange(currentSize) {
    getPurchaseInfo()
    // console.log(pageData.value)
    if (getPurchaseInfoVo.pageNum != 1) {
        offset.value = getPurchaseInfoVo.pageSize
    } else {
        offset.value = 0
    }
    // pageData
}
onMounted(() => {
    getPurchaseInfo()
})
watch(() => getPurchaseInfoVo.keyWords, () => {
    getPurchaseInfo()
}, { deep: true })
</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">
            <span style="margin-left: 5px;"><el-input v-model="getPurchaseInfoVo.keyWords" style="width: 240px"
                    placeholder="输入关键字进行搜索...." :prefix-icon="Search" /></span>
            <div v-for="(item, index) in purchaseInfoPageData" class="infoDiv">
                <el-image style="width: 100px;" :src="item.pictureUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                    :preview-src-list="[item.pictureUrl]" :initial-index="4" fit="cover" />
                <div style="width: 800px;">
                    <div style="font-size: 10px;font-weight: bolder;">NO.{{ index + 1 + offset }} </div>
                    <span style="display: flex;justify-content: space-between;">
                        <span><span style="font-weight: bolder;">用户名：</span>{{ item.username }} </span>
                        <span><span style="font-weight: bolder;">时间：</span>{{ item.createTime }}</span>
                    </span>
                    <div><span style="font-weight: bolder;">求购信息：</span>{{ item.info }}</div>
                </div>

            </div>
            <div style="margin-bottom: 10px;margin-top: 10px;">
                <el-pagination background v-model:current-page="getPurchaseInfoVo.pageNum"
                    v-model:page-size="getPurchaseInfoVo.pageSize" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :page-sizes="[5, 7, 10]"
                    layout="prev, pager, next , ->, sizes, total" :total="totalSize">
                </el-pagination>
            </div>

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
    display: flex;
    /* height: 1000px; */
    /* height: 1400px; */
    width: 950px;
    margin: 10px auto 30px auto;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    /* grid-template-areas: "aside content content";
    justify-items: center;
    align-items: start; */
    border: 5px solid black;
    /* background-image: linear-gradient(135deg, #9ad1ee 10%, #6ca8e1 100%) */
    background-color: #fafc7d;
}

.infoDiv {
    width: 900px;
    height: 100px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-bottom: 3px dashed black;
    border-top: 3px dashed black;
    display: flex;
    justify-content: space-around;
    align-items: center
}


</style>
