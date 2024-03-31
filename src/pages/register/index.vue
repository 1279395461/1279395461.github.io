<script setup>
import '../../assets/css/LoginAndRegister.css'
import { reactive, ref } from 'vue'
import { checkPhoneNumber, register } from '../../api/index'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import {validateUsername,validatePassword,validatePhoneNumber,validateStudentNumber} from '../../utils/validate-utils'
let router=useRouter()
let registerStuUser = reactive({
    username: null,
    password: null,
    checkPassword: null,
    phoneNumber: null,
    studentNumber: null
})
let ruleFormRef = ref()
//验证重新输入的密码
function validateCheckPassword(rule, value, callback) {
    if (!value) {
        callback(new Error("请重新输入密码！"))
    }
    else if (registerStuUser.password != value) {
        callback(new Error("两次密码输入不一致！"))
    }
    else {
        callback()
    }
}
const rules = {
    username: [
        // {required:true,message:"请输入用户名！",trigger:"blur"},
        { required: true, validator: validateUsername, trigger: ["blur", "change"] }
    ],
    password: [
        // {required:true,message:"请输入密码！",trigger:"blur"}
        { required: true, validator: validatePassword, trigger: ["blur", "change"] }
    ],
    checkPassword: [
        { required: true, validator: validateCheckPassword, trigger: ["blur", "change"] }
    ],
    phoneNumber: [
        { required: true, validator: validatePhoneNumber, trigger: ["blur", "change"] }
    ],
    studentNumber: [
        { required: true, validator: validateStudentNumber, trigger: ["blur", "change"] }
    ]
}

async function goRegister() {
    //校验表单规则
    await ruleFormRef.value?.validate()
    //检查手机号是否已被注册
    await checkPhoneNumber(registerStuUser)

    //处理参数
    let obj = {
        username: null,
        password: null,
        phoneNumber: null,
        studentNumber: null,
        profilePictureUrl:"https://hjw-upload-picture.oss-cn-guangzhou.aliyuncs.com/stu/defaultStuProfile.png",
    }
    obj.password = registerStuUser.password
    obj.username = registerStuUser.username
    obj.phoneNumber = registerStuUser.phoneNumber
    obj.studentNumber = registerStuUser.studentNumber
    console.log(obj)
    await register(obj)

    //清空
    ruleFormRef.value?.resetFields()
    ElMessage.success("注册成功！")
    router.push({name:"/login"})

}
</script>
<template>
    <div class="base">
        <div style="display: flex;"><el-icon size="70px" color="#2b73af"><ShoppingBag /></el-icon><h1>校园二手商品交易平台</h1></div>
        <div class="bg">
            <div class="registerDiv flex">
                <h1>欢迎注册</h1>

                <el-form label-width="auto" :model="registerStuUser" :rules="rules" ref="ruleFormRef">
                    <div class="nInputs">
                        <el-form-item label="用户名：" prop="username">
                            <el-input type="text" clearable placeholder="请输入2-10位的数字、字母或汉字" class="ninput"
                                v-model="registerStuUser.username" maxlength="10" />
                            <span v-if="isUsed" class="message">用户名已被占用！</span> </el-form-item>
                        <el-form-item label="密码：" prop="password">
                            <el-input type="password" clearable placeholder="请输入8-20位的数字、字母或字符" class="ninput"
                                v-model="registerStuUser.password" maxlength="20" show-password />
                        </el-form-item>
                        <el-form-item label="确认密码：" prop="checkPassword">
                            <el-input type="password" clearable placeholder="请重新输入密码" class="ninput"
                                v-model="registerStuUser.checkPassword" maxlength="20" show-password />
                        </el-form-item>
                        <el-form-item label="手机号：" prop="phoneNumber">
                            <el-input type="text" clearable placeholder="请输入11位有效手机号" class="ninput"
                                v-model="registerStuUser.phoneNumber" maxlength="11"/>
                        </el-form-item>
                        <el-form-item label="学号：" prop="studentNumber">
                            <el-input type="text" clearable placeholder="请输入12位学号" class="ninput"
                                v-model="registerStuUser.studentNumber" maxlength="12"/>
                        </el-form-item>
                    </div>
                </el-form>

                <div class="buttonDiv">
                    <el-button class="nbutton" color="rgb(6, 225, 167)" text-color="black"
                        @click="goRegister()">注册</el-button>
                </div>
                <div style="cursor: pointer;" @click="router.go(-1)">已有账号？去登陆吧</div>
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
    background: url('../../assets/loginAndRegist/secure_login.svg') no-repeat;
    background-size: 100% 100%;

}

.registerDiv {
    width: 400px;
    height: 500px;
    background-color: white;
    color: black;
    margin: 20px auto;
    opacity: 0.8;
    /*透明度*/
    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.3);
    /*阴影*/
}

.nInputs {
    width: 400px;
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}

.ninput {
    width: 250px;
}

.nbutton {
    width: 200px;

    font-size: 15px;
    font-weight: bolder;

}
</style>