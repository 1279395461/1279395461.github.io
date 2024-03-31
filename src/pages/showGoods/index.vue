<script setup>
import { Search } from '@element-plus/icons-vue'
import { useStuInfoStore } from '../../stores/stuInfo';
import Header from '../../components/Header.vue';
import { onMounted, ref, reactive, onBeforeMount, getCurrentInstance, watch } from 'vue';
import { findAllTypes, findGoods } from '../../api/index'
import { useRouter } from 'vue-router'
import navigator from '../../components/navigator.vue';
const stuInfoStore = useStuInfoStore()
const router = useRouter()
let goodsTypesList = ref([])
let getGoodsInfo = reactive({
    keyWords: null,
    typeId: null,
    pageNum: 1,
    pageSize: 10
})
let totalSize = ref(0)
let pageData = ref([{
    goodsId: null,  // 商品id 
    title: null,   //     商品标题
    typeId: null,  // 商品类别编号
    pastHours: null,    // 发布时间已过小时数
    price: null,        // 商品价格
    profilePuctureUrl: 'https://hjw-upload-picture.oss-cn-guangzhou.aliyuncs.com/goods/shoppng_bag.jpeg'
}])
const currentTypeIndex = ref(0)
const currentGoodsIndex = ref(null)
const goPurChaseInfo = () => { router.push({ name: "purchaseInfo" }) }
// const { Bus }=getCurrentInstance().appContext.config.globalProperties

//获取商品分类列表
async function getGoodsTypes() {
    let { goodsTypes } = await findAllTypes()
    //将”其他“类别放在最后
    let temp = goodsTypes[10]
    goodsTypes.splice(10, 1)
    goodsTypes.push(temp)
    goodsTypesList.value = goodsTypes
}
//获取商品数据列表
async function getGoodsList() {
    const { pageInfo } = await findGoods(getGoodsInfo)
    // console.log("[[[[[[[[[[[[[]]]]]]]]]]]]]")
    // console.log(pageInfo.pageData)
    pageData.value = pageInfo.pageData
    totalSize.value = pageInfo.totalSize
    console.log(pageData.value)
}
// //当前页码变更时的处理函数
// function handleCurrentChange(currentPage) {
//     console.log("currentPage:" + currentPage)
//     console.log("getGoodsInfo.pageNum" + getGoodsInfo.pageNum)
//     console.log("---------------------")
//     getGoodsList()
//     // console.log(pageData.value)
//     // pageData
// }
// //当前页记录数变更时的处理函数
// function handleSizeChange(currentSize) {
//     console.log("currentSize:" + currentSize)
//     console.log("getGoodsInfo.pageSize" + getGoodsInfo.pageSize)
//     console.log("=================")
//     getGoodsList()
//     // console.log(pageData.value)

//     // pageData
// }
//将当前触发点击事件的optionDiv的index赋值给currentTypeIndex
function setCurrentTypeIndex(index) {
    currentTypeIndex.value = index
}

// //将当前触发鼠标加入事件的goodsDiv的index赋值给currentTypeIndex
// function setCurrentGoodsIndex(index) {
//     currentGoodsIndex.value = index
// }
// //将当前触发鼠标加入事件事件的goodsDiv的index赋值为null以取消阴影效果
// function setCurrentGoodsIndexNull() {
//     currentGoodsIndex.value = null
// }
//点击前往商品详情页
function goGoodsDeatil(goodsId) {
    //将被点击商品的商品id存储在本地,用户登录后跳转至商品详情页时也能够正常访问
    // localStorage.setItem("goodsId", goodsId)
    router.push({ name: "goodsDeatil", query: { goodsId } })
}
onMounted(() => {
    getGoodsTypes()
})
onMounted(() => {
    getGoodsList()
    console.log(pageData.value)

})
// //触发监听函数，让getGoodsInfo.keyWords等于Header组件的keyWords
// Bus.on('keyWords',(keyWords)=>{
//     getGoodsInfo.keyWords=keyWords
//     console.log(getGoodsInfo.keyWords)
// })

//监听getGoodsInfo.keyWords，当其变化时，获取对应的商品数据
watch(() => getGoodsInfo.keyWords, () => {
    getGoodsList()
}, { deep: true })

</script>

<template>
    <Header></Header>
    <div class="container">
        <navigator></navigator>
        <div class="content">

            <div class="menuDiv">
                <span style="font-size: 30px;font-weight: bolder;">商品分类</span>
                <div class="optionDiv optionHover"
                    @click="setCurrentTypeIndex(0); getGoodsInfo.typeId = null; getGoodsList()" :style="{
                        backgroundColor: currentTypeIndex === 0 ? '#66c18c' : 'initial',
                        marginLeft: currentTypeIndex === 0 ? '60px' : 'initial',
                        fontSize: currentTypeIndex === 0 ? '25px' : '20px',
                        boxShadow: currentTypeIndex === 0 ? '3px 3px 3px 3px rgba(0, 0, 0, 0.3)' : 'none'
                    }">全部</div>
                <div class="optionDiv optionHover" v-for="(item, index) in goodsTypesList" :key="index"
                    @click="setCurrentTypeIndex(index + 1); getGoodsInfo.typeId = index + 1; getGoodsList()" :style="{
                        backgroundColor: currentTypeIndex === index + 1 ? '#66c18c' : 'initial',
                        marginLeft: currentTypeIndex === index + 1 ? '60px' : 'initial',
                        fontSize: currentTypeIndex === index + 1 ? '25px' : '15px',
                        boxShadow: currentTypeIndex === index + 1 ? '3px 3px 3px 3px rgba(0, 0, 0, 0.3)' : 'none'
                    }">
                    {{ item.type }}
                </div>
                <hr style="width: 200px">
                <div class="purchaseInfo purchaseInfoHover" @click="goPurChaseInfo">
                    <el-icon size="30px">
                        <Link />
                    </el-icon>前往求购专区
                </div>
            </div>
            <div class="showGoodsDiv">
                <div class="searchDiv">
                    <el-input v-model=getGoodsInfo.keyWords style="height: 35px;" type="text" :prefix-icon="Search"
                        clearable placeholder="请输入关键字进行搜索....." />
                </div>

                <div class="goodsContainer">
                    <div v-for="(item, index) in pageData" :key="index" class="goodsDiv goodsHover"
                        @click="goGoodsDeatil(item.goodsId)">
                        <img :src="item.profilePuctureUrl" alt="" class="goodsImage">
                        <span style="font-size: 15px;">{{ item.title }} </span>
                        <span style="font-size: 17px;">￥{{ item.price }}</span>
                    </div>
                </div>
                <div class="pageDiv">
                    <el-pagination v-model:current-page="getGoodsInfo.pageNum" v-model:page-size="getGoodsInfo.pageSize"
                        @size-change="getGoodsList()" @current-change="getGoodsList()" :page-sizes="[5, 7, 10]"
                        background layout="prev, pager, next , ->, sizes, total" :total="totalSize">
                    </el-pagination>
                </div>
            </div>

        </div>
    </div>


</template>

<style scoped>
.container {
    width: 1200px;
    /* height: 1100px; */
    /* height: 100vh; */
    margin: 20px auto 0 auto;
    background-color: white;
    box-shadow: 10px 10px 15px 10px rgba(0, 0, 0, 0.3);
}

.content {
    display: flex;
    /* height: 1000px; */
    /* height: 1400px; */
    /* width: 1100px; */
    /* height: 100vh; */
    margin: 20px auto 0 auto;
    justify-content: space-evenly;
    align-items: self-start;
    /* grid-template-areas: "aside content content";
    justify-items: center;
    align-items: start; */

    /* background-image: linear-gradient(135deg, #9ad1ee 10%, #6ca8e1 100%) */
    /* background-color: white; */
}

.menuDiv {
    width: 250px;
    /* margin-top: 20px;
    margin-left: 100px; */
    /* grid-area: aside; */
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* border: 1px solid black; */
    /* background-color: white; */
}

.optionDiv {
    margin-bottom: 10px;
    text-align: center;
    /* width: 150px; */
    /* border: 1px solid black; */
    border-radius: 5%;
    cursor: default;
}

.optionHover:hover {
    border-bottom: 1px solid #126bae;
    font-weight: bold;
}

.purchaseInfo {
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    /* color:rgb(0, 195, 255); */
    font-size: 16px;
    border: 4px dashed #494a4b;
    margin-top: 5px;
    margin-bottom: 10px;
    background-color: #8abcd1;
}

.purchaseInfoHover:hover {
    cursor: pointer;
    font-size: 18px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
}

.showGoodsDiv {
    /* grid-area: content; */
    height: 100vh;
    /* border: 1px solid black; */
    width: 1100px;
    /* height: 1000px; */
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.searchDiv {
    width: 400px;
    height: 30px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px
}


.goodsContainer {
    /* height: 1000px; */
    /* background-color: bisque; */
    /* border: 1px solid rgb(170, 32, 32); */
    /* margin-top: 20px;
    margin-right: 100px;
    width: 1000px; */
    background-color: white;
    display: grid;
    grid-template-columns: repeat(3, 280px);
    grid-template-rows: repeat(auto-fill, 260px);
    column-gap: 20px;
    row-gap: 30px;
    align-content: start;
    justify-content: center;
}

.goodsDiv {
    width: 280px;
    margin-top: 20px;
    /* margin-bottom: 20px; */
    /* height: 3020px; */
    border-radius: 10%;
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 280px;
    background-color: white;

}

.goodsHover:hover {
    border: 1px solid #126bae;
    box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.3)
}

.goodsImage {
    width: 250px;
    height: 200px;
    margin-top: 10px;
    border-radius: 10%;
}

.pageDiv {
    /* border: 1px solid black; */
    margin-top: 50px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: white; */
    /* margin: 0 auto; */
}
</style>
