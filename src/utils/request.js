import axios from 'axios';
import { ElMessage } from 'element-plus';
import pinia from '../stores/index';
import NProgress from 'nprogress';
import { useStuInfoStore } from '../stores/stuInfo';
import 'nprogress/nprogress.css';

//配置axios实例
const service = axios.create(
    {
        baseURL: 'http://localhost:8080/',
        timeout: 50000
    }
)

/**添加请求拦截器,发请求前检查useStuInfoStore是否带有token，
 * 如果有，将token放到请求头中一并发送到后端
 **/
service.interceptors.request.use(
    (config) => {
        //开启进度条
        NProgress.start()
        const StuInfoStore = useStuInfoStore(pinia) //不在组件里使用，需要传入pinia
        // console.log(StuInfoStore)
        const token = StuInfoStore.token
        if (token) {
            config.headers["token"] = token
            console.log(config.headers["token"])
        }
        console.log(config)
        return config;
    }
);

service.interceptors.response.use(
    (response) => {
        NProgress.done()//关闭进度条

        //根据响应码作出判断
        if (response.data.code !== 200) {
            if (response.data.code == 501) return Promise.reject(ElMessage.error('账号不存在！'))
            else if (response.data.code == 502) return Promise.reject(ElMessage.error('手机号码已被注册！'))
            else if (response.data.code == 503) return Promise.reject(ElMessage.error('密码错误！'))
            else if (response.data.code == 504) return Promise.reject(ElMessage.error('登陆已过期，请重新登录！'))
            else if (response.data.code == 505) return Promise.reject(ElMessage.error('账号已被冻结，请联系管理员解除！'))
            // console.log(response.data.code)
        }
        else {
            //返回成功响应数据中的data
            console.log("response.data=")
            console.log(response.data.data)
            return response.data.data
        }
    }
    ,
    (error) => {
        NProgress.done()//关闭进度条
        return Promise.reject(error.message)
     }
)

export default service