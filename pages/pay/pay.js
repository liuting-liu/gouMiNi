/*
  1.页面加载的时候
    1.从缓存中获取购物车数据  渲染到页面中
      这些数据  checked=true
  2.支付按钮
    1.先判断缓存中有没有token
    2.没有 跳转到授权页面 进行获取token
    3.有token
*/
// 引入封装好的异步函数
import {getSetting,chooseAddress,openSetting,showModal, showToast} from "../../utils/asyncwx"
Page({
  data: {
    //本地存储的地址数据
    address:{},
    //存储添加购物车数组
    cart:[],
    //总价格
    totalPrice:0,
    //总数量
    totalNum:0
  },
  onShow(){
    //1.获取缓存中的收货地址信息
    const address=wx.getStorageSync('address')
    //1.获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked)
    this.setData({address})
      //总数量 总价格  计算
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v => {
        totalPrice=v.num*v.goods_price;
        totalNum+=v.num
      });
        this.setData({
          cart,
          totalNum,totalPrice,
          address
        });
  },
  //点击 支付
  handleOrderPay(){
    const token=wx.getStorageSync('token')
  }
})