import request from "../utils/request"

//判断用户登录过期的接口
export const isUserOverdue = () => {
  return request.get("stuUser/checkLogin")
}
/**登录接口
 @param  
    {
 *  phoneNumber: xxx,
    password: xx
 * }
 * @returns 
 *    {
   "code":"200",         // 成功状态码 
   "message":"success"   // 成功状态描述
   "data":{
    "token":"... ..." // 用户id的token
    } 
**/
export const getLogin = (info) => {
  return request.post("stuUser/login", info)
}

/**根据token获取登录用户的stuId、uername
 * 
 * @param String token 
 * @returns 
 * {
 * "code":"200",         // 成功状态码 
   "message":"success"   // 成功状态描述
 * "data":
        stuUserInfo:{
            "stuId":xx
            "username":xx,
            "profilePictureUrl":xxx
        }
 * }
 */
export const getStuUserInfo = (token) => {
  return request.get("stuUser/getStuUserInfo")
}
/**验证注册时输入的手机号码是否存在
 * 
 * @param {*} key 
 * @param {*} value 
 * @returns 
 * 如果不存在，响应成功
 {
   "code":"200",
   "message":"success"
   "data":{}
}
否则，响应失败
{
   "code":"50x",
   "message":"xx已被注册"
   "data":{}
}
 */
export const checkPhoneNumber = (phoneNumber) => {
  return request.get(`stuUser/checkPhoneNumber/phoneNumber)`)
}

/**发送注册请求，将数据记录插入表中
 * 
 * @param 
 * {
    "username":"xxx",
    "password":"xxx", 
    "phoneNumber":"xxx",
    "studentNumber":"xxx"
}
 * @returns 
 {
   "code":"200",
   "message":"success"
   "data":{}
}
 */
export const register = (info) => {
  return request.post('stuUser/register', info)
}

/**发送请求，返回商品类型
 * 
 * @returns 
   "code":"200",
   "message":"success"
   "data":{
        goodsTypes:[
            "电脑外设",
            "学习用品",
            ..........
        ]
   }
 */
export const findAllTypes = () => {
  return request.get('portal/findAllTypes')
}
/**用户上传头像接口
 * 
 * 向后端发送图片文件，后端返回图片url
 * @param {*} file 
 * @returns 
 *    "code":"200",
   "message":"success"
   "data":{
        "url":"..."
   }
 */
export const uploadStuProfile = (formData) => {
  return request.post('stuUser/uploadStuProfile', formData)
}

/**获取分页数据接口
 * 
 * @param {*} info 
 * {
    "keyWords":"键盘", // 搜索商品关键字
    "type":0,           // 商品类型
    "pageNum":1,        // 页码数
    "pageSize":10     // 页大小
}
@returns
{
   "code":"200",
   "message":"success"
   "data":{
      "pageInfo":{
        "pageData":[
          {
            "goodsId":"1",                     // 商品id 
            "title":"x",   //     商品标题
            "typeId":"1",                    // 商品类别编号
            "pastHours":"3" ,              // 发布时间已过小时数
            "price":"1"                // 商品价格
        },
        ...
        ],
      "pageNum":x,    //页码数
      "pageSize":x,  // 页大小
      "totalPage"x, // 总页数
      "totalSize":x // 总记录数
    }
  }
}
 */
export const findGoods = (info) => {
  return request.post('portal/findGoods', info)
}

/**接收商品id,查询对应的商品详情数据
 * 
 * @param goodsId
 * @return
 * {
 **  "code":"200",
 *   "message":"success",
 *   "data":{
 *       "goods":{
 *           "goodsId":xx,
 *           "title":xx,
 *           "type":xx,
 *           "price":xx,
 *           "sellerName":xx,
 *           "goodsLocation":xx,
 *           "contactInfo":xx,
 *           "description":xx,
 *           "detailPictureUrls":[xx,xx,xx]
 *       }
 *   }
 * }
 */
export const findGoodsDetail = (goodsId) => {
  return request.get(`portal/findGoodsDetail/${goodsId}`)
}

/**接受举报信息对象，发送到后端
 * 
 * @param {*} reportInfo 
 * @returns 
 * {
    “code":200,
    "message":"success",
    "data":null
  }
 */
export const submitReportInfo = (reportInfo) => {
  return request.post('/report', reportInfo)
}

/**个人中心展示个人信息接口
 * 
 * @param stuId
 * @return
 *{
 *     "code": 200,
 *     "message": "success",
 *     "data": {
 *         "stuUser": {
 *             "stuId": xx,
 *             "username": xx,
 *             "phoneNumber": xx,
 *             "password": null,
 *             "institute": xx,
 *             "statusId": x,
 *             "profilePictureUrl": x,
 *             "isDeleted": x,
 *             "version": x,
 *             "createTime": x,
 *             "updateTime": x,
 *             "studentNumber": xx
 *         }
 *     }
 * }
 */
export const findPersonalInfo = (stuId) => {
  return request.get(`stuUser/showPersonalInfo/${stuId}`)
}
/**新用户数据
    * 更
    * @param studentUser
    * @return
    * {
    *     "code":"200",
    *     "message":"success"
    *     "data":null
    *     }
    */
export const updatePersonalInfo = (personalInfo,) => {
  return request.put("stuUser/updatePersonalInfo", personalInfo)
}

/**更新用户密码
 * 
 * @param {*} stuId 
 * @returns 
 * * {
      "code":"200",
      "message":"success"
      "data":null
      }
 */
export const updatePassword = (formData) => {
  return request.put("stuUser/updatePassword",formData)
}

/**查询某个用户上架或下架的商品的分页数据
     * 
     * @param personalGoodsPageVo
     * {
     *  "stuID":"xx", // 用户id
     *  "pageNum":1,        // 页码数
     *  "pageSize":10     // 页大小
     *  }
     * @return
        {
     * "code":"200",
     * "message":"success"
     * "data":{
     * "pageInfo":{
     *      "pageData":
     *      [{
     *      "goods_id":"1",                     // 商品id
     *      "title":"x",   //     商品标题
     *      "description":"x",                    // 商品描述
     *      "createTime":"x" ,              // 发布时间已过小时数
     *      "status":"x"  ,              // 商品状态
     *      "profilePictureUrlst":[1] //商品图片
     *      },
     *          ...
     *      ],
     *      "pageNum":x,    //页码数
     *      "pageSize":x,  // 页大小
     *      "totalPage"x, // 总页数
     *      "totalSize":x // 总记录数
     *    }

     * }
     * }
     */
export const findPersonalGoods=(info)=>{
  return request.post("goods/findPersonalGoods",info)
}
/**修改商品的状态，使其下架
 * 
 * @param {*} goodsId 
 * @returns 
 *   {
      "code":"200",
      "message":"success"
      "data":null
      }
 */
export const setGoodsStatusOff=(goodsId)=>{
  return request.put(`goods/setGoodsStatusOff/${goodsId}`)
}

/**用户上传商品一个或多个图片，后端返回所上传的图片url
 * 
 * @param {*} formData 
 * @returns 
 *  *   {
      "code":"200",
      "message":"success"
      "data":{
        "detailProfileUrls":[xx,xx]
      }
        
      }
 */
export const uploadGoodsImagesApi=(formData)=>{
  return request.post("goods/uploadGoodsImages",formData)
}

/**上架商品
 * 
 * @param {*} info 
 * {
        "title": xx,
        "typeId":xx,
        "price": xx,
        "description": xx,
        "goodsLocation":xx,
        "contactInfo": xx,
        "sellerName": x,
        "sellerStuId": xx,
        "createTime": xx,
        "detailPictureUrls": x
    }
 * @returns 
          "code":"200",
      "message":"success"
      "data":null  
      }
 */
export const publishGoodsApi=(info)=>{
  return request.post("goods/publishGoods",info)
}
/**编辑商品信息
 * 
 * @param {*} info 
 {      
        "goodsId":xx,
        "title": xx,
        "typeId":xx,
        "price": xx,
        "description": xx,
        "goodsLocation":xx,
        "contactInfo": xx,
        "detailPictureUrls": x
    }
 * @returns 
      code":"200",
      "message":"success"
      "data":null  
      }
 */
export const modifyGoodsApi=(info)=>{
  return request.post("goods/modifyGoods",info)
}

/**查询求购分页信息
 * 
 * * 
     * @param info
     * {
     *  "keyWords":"xx", // 关键字
     *  "pageNum":1,        // 页码数
     *  "pageSize":10     // 页大小
     *  }
     * @return
        {
     * "code":"200",
     * "message":"success"
     * "data":{
     * "pageInfo":{
     *      "pageData":
     *      [{
              "stu_id":xx,
              "useranme":xx,
              "info":xx,
              "pictureUrl":xx
     *      },
     *          ...
     *      ],
     *      "pageNum":x,    //页码数
     *      "pageSize":x,  // 页大小
     *      "totalPage"x, // 总页数
     *      "totalSize":x // 总记录数
     *    }

     * }
     * }
 */
export const getPurchaseInfoApi=(info)=>{
  return request.post("portal/getPurchaseInfo",info)
}

/**上传求购信息图片
 * 
 * @param {*} formData 
 * @returns 
 * {
 * code":"200",
   "message":"success"
   "data":{
      pictureUrl:xx
   }
   }
 */
export const uploadPurchaseImagesApi=(formData)=>{
  return request.post("purchase/uploadPurchaseImage",formData)
}

/**发布求购信息
 * 
 * @param {*} info 
 * {
 * "stuId":xx,
   "info":xx,
   "pictureUrl":xx}
 * @returns 
    * {
 * code":"200",
   "message":"success"
   "data":null
   }
 */
export const publishPurchaseInfoApi=(info)=>{
  return request.post("purchase/publishPurchaseInfo",info)
}

/**获取个人求购分页信息
 * 
 * @param {*} info 
 * @returns 
 */
export const getPersonalPurchaseInfoApi=(info)=>{
  return request.post("purchase/getPersonalPurchaseInfo",info)
}

export const deletePersonalPurchaseInfo=(id)=>{
  return request.delete(`purchase/${id}`)
}
