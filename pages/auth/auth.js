import {request} from "../../request/index"
import {login} from '../../utils/asyncwx.js'
Page({
  data: {

  },
  //获取用户信息
  async handleGetUserInfo(e){
    //1.获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail;
    //2.获取小程序登录后的code
    const {code}=await login();
    console.log(code)
  }
})