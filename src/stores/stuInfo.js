import {defineStore} from 'pinia';
import { getToken,setToken,removeToken } from '../utils/token-utils'; 
import {getLogin,getStuUserInfo} from '../api/index'

export const useStuInfoStore=defineStore(
    'StuInfo',{
        state:()=>({
            token:getToken(),
            stuId:null,
            username:null,
            profilePictureUrl:null
        }),
        actions:{
            //异步登录方法
            async login(loginForm){
                //发送登录请求
                const result=await getLogin(loginForm)
                // console.log(111)
                // console.log(result)
                const token=result.token
                this.token=token
                setToken(token)
            },
            //获取用户信息方法
            async getStuUserInfo(token){
                //发送请求
                const result=await getStuUserInfo(token)
                //将获取到的用户信息存储到pinia中
                this.stuId=result.stuUserInfo.stuId
                this.username=result.stuUserInfo.username
                this.profilePictureUrl=result.stuUserInfo.profilePictureUrl            
                console.log("++++++++++++=")
            },

        }

    }
    
)