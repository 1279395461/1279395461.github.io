import { createRouter,createWebHashHistory } from "vue-router";
import {routes} from './routers';
import {useStuInfoStore} from '../stores/stuInfo'
import pinia from '../stores/index'
import {getToken,removeToken} from '../utils/token-utils'
//创建路由
const router=createRouter({
    history:createWebHashHistory(),
    routes:routes
})
const stuInfoStore=useStuInfoStore(pinia)
const username=!!stuInfoStore.username
//全局前置守卫
router.beforeEach(async (to,from,next)=>{
    const token=getToken()
    console.log("token=:"+token)
    //判断token是否存在
    if(token){
        console.log("有token")
        if(to.path=='/login'){
            next({path:'/'})
        }
        else{
            console.log("get")
            if(username){
                //如果username有值，说明不需要向后端发送请求获取用户名
                // console.log("有")
                
                next()
            }
            else{
                try{
                    // 如果uername没有值，则需要向后端发送请求获取用户名
                    await stuInfoStore.getStuUserInfo(token)
                    console.log("username没有值")
                    next()
                }catch(error){
                    removeToken()
                }
            }
        }
    }
    else{
        //token不存在，说明没有登录，说明不需要向后端发送请求获取用户名，直接放行
        console.log("没有tkoen")
        // //没有登录不能访问个人中心
        // if(to.path=="/personalInfo"){
        //     next({path:'/'})
        // }
        // else{
        //     next()
        // }
        next()

        
    }
})
//导出路由
export default router;