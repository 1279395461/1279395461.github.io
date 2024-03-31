<script setup>
import '../../assets/css/LoginAndRegister.css'
// import {useMessage } from 'naive-ui';
import { reactive, ref } from 'vue';
import { useStuInfoStore } from '../../stores/stuInfo';
import { useRouter, useRoute } from 'vue-router';
import { getLogin } from '../../api';
import {validatePhoneNumber} from '../../utils/validate-utils'
let loginStuUser = reactive({
    phoneNumber: "18881881818",
    password: "123456789"
})
let stuInfoStore = useStuInfoStore()
let router = useRouter()
let route = useRoute()
const ruleFormRef = ref()
// //检查手机号格式是否正确
// function validatePhoneNumber(rule, value, callback) {
//     if (!value) {
//         callback(new Error("请输入手机号！"))
//     }
//     // console.log("666")
//     else if (!/[0-9]{11}/.test(value)) {
//         // console.log("23232")
//         callback(new Error("请输入正确格式的手机号！"))
//     }
//     else {
//         // console.log("333")
//         callback()
//     }
// }
//自定义验证规则
const rules = {
    phoneNumber: [
        { required: true, message: '请输入账号！', trigger: 'blur' },
        { validator: validatePhoneNumber, trigger: "blur" }
    ],
    password: [
        { required: true, message: '请输入密码！', trigger: 'blur' },
    ]
}
async function login() {
    await ruleFormRef.value?.validate() //等待表单的验证规则通过
    await stuInfoStore.login(loginStuUser) //完成登录请求
    //清空
    ruleFormRef.value?.resetFields()
   router.go(-1)

    // window.history.back()
}
</script>

<template>
    <div class="base">
        <div style="display: flex;"><el-icon size="70px" color="#2b73af">
                <ShoppingBag />
            </el-icon>
            <h1>校园二手商品交易平台</h1>
        </div>
        <div class="bg">

            <div class="loginDiv flex">
                <h1>欢迎，请登录</h1>
                <el-form :model="loginStuUser" :rules="rules" ref="ruleFormRef" hide-required-asterisk
                    label-width="auto">
                    <div class="nInputs">

                        <el-form-item prop="phoneNumber" label="账号：">
                            <el-input type="text" class="ninupt" v-model="loginStuUser.phoneNumber"
                                @keydown.enter.prevent placeholder="请输入手机号" clearable maxlenth="20"/>
                        </el-form-item>

                        <el-form-item prop="password" label="密码：">
                            <!-- <div style="font-size: 20px;"> -->
                            <el-input type="password" class="ninupt" v-model="loginStuUser.password"
                                @keydown.enter.prevent placeholder="请输入密码" clearable show-password />
                            <!-- </div> -->
                        </el-form-item>

                    </div>
                </el-form>

                <div class="buttonDiv">
                    <el-button class="nbutton" color="rgba(27, 207, 231, 1)" text-color="black"
                        @click="login()">登录</el-button>
                    <el-button class="nbutton" color="rgba(45, 201, 40, 1)" text-color="black"
                        @click="router.push({name:'register'})">
                        注册
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    font-size: 30px;

}

.bg {
    height: 82%;
    width: 57%;
    /* margin: 70px auto; */
    /* border: 1px solid black; */
    /* background-color: aqua; */
    background: url('../../assets/loginAndRegist/business_deal.svg') no-repeat;
    background-size: 100% 100%;

}


.loginDiv {
    height: 350px;
    width: 350px;
    background-color: aliceblue;
    margin: 100px auto;
    opacity: 0.8;
    /*透明度*/
    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
    /*阴影*/
    color: black;
}

.nInputs {
    width: 300px;
    height: 150px;
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}

.ninupt {
    width: 200px;
}



.nbutton {
    width: 80px;
    color: back;
    font-size: 15px;
    font-weight: bolder;
}
</style>
