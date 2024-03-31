//检查手机号格式是否正确
export function validatePhoneNumber(rule, value, callback) {
    if (!value) {
        callback(new Error("请输入手机号！"))
    }
    // console.log("666")
    else if (!/[0-9]{11}/.test(value)) {
        // console.log("23232")
        callback(new Error("请输入正确格式的手机号！"))
    }
    else {
        // console.log("333")
        callback()
    }
}
//验证用户名格式
export function validateUsername(rule, value, callback) {
    if (!value) {
        callback(new Error("请输入用户名！"))
    }
    else if (/[!@#$%^&*()_+<>:"-\[\]\{\}]/.test(value)) {
        callback(new Error("用户名不能含有特殊符号！"))
    }
    else if (value.length < 2) {
        callback(new Error("用户名过短！"))
    }
    else {
        callback()
    }

}
//验证密码格式
export function validatePassword(rule, value, callback) {
    if (!value) {
        callback(new Error("请输入密码！"))
    }
    else if (value.length < 8) {
        callback(new Error("密码至少是8位以上！"))
    }
    else {
        callback()
    }
}

//验证学号格式
export function validateStudentNumber(rule, value, callback) {
    if (!value) {
        callback(new Error("请输入学号！"))
    }
    // console.log("666")
    else if (!/[0-9]{12}/.test(value)) {
        // console.log("23232")
        callback(new Error("请输入正确格式的学号！"))
    }
    else {
        callback()
    }

}
//举报原因验证规则
export function validateContent(rule, value, callback){
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
