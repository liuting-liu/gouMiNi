/* 
  1.获取用户的收货地址
    绑定单机事件
    调用小程序内置 API 获取用户的收货地址  wx.chooseAddress

  2.获取 用户 对小程序所授权获取地址的 权限 状态 scope
    1.假设 用户 点击获取收货地址的提示框 确定 authSetting  scope.address
      scope 值 为true  获取收货地址
    2.假设用户从来没有调用过 收货地址的api
      scope 值 为undefined  z直接调用收货地址
    3.假设用户点击获取收货地址的提示框 取消
      scope 值 为false  
      1.诱导用户自己打开授权设置页面内当用户重新给与获取地址权限的时候
      2.获取收货地址
    4.把获取到的收货地址存储到本地存储中

  2.页面加载完毕
    0.onload  onshow
    1.获取本地存储的地址数据
    2.把数据设置给data中的一个变量

  3.onShow  商品添加到购物车内
    0.回到了商品详情页面 第一次添加尚平的时候 手动添加了属性
      1.num=1
      2.checked=true
    1.获取缓存中的购物车数组
    2.把购物车数据填充到data中

  4.全选的实现
    0.onShow 获取缓存中的购物车数组
    1.根据狗驱车中的商品数据 判断所有商品选中checked=true  否则有一个没被选 checked=false
*/
// 引入封装好的异步函数
import {getSetting,chooseAddress,openSetting} from "../../utils/asyncwx"
Page({
  data: {
    //本地存储的地址数据
    address:{},
    //存储添加购物车数组
    cart:[],
    //购物车商品全选状态
    allChecked:false
  },
  onShow(){
    //1.获取缓存中的收货地址信息
    const address=wx.getStorageSync('address')
    //1.获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    //1.计算全选  遍历购物车数据 every遍历数组中所有元素 每一个回调函数都返回true那么every返回值true
    //只要有一个回调函数返回了false every就返回false
    //空数组调用every 返回值就是true
    const allChecked=cart.length?cart.every(v=>v.checked):false
    //2.给data变量赋值
    this.setData({
      //收货地址
      address,
      //购物车数据
      cart,
      //购物车选中状态
      allChecked
    })
  },
  onLoad: function (options) {

  },
  async handleChooseAddress(){
    try {
     //1.获取权限状态
      const res1=await getSetting();
      const scopeAddress=res1.authSetting["scope.address"];
     //2.判断权限状态
      if(scopeAddress===false){
     //3.先诱导用户打开授权页面
      await openSetting();
  }
     //3.调用获取收货地址的api
       const address=await chooseAddress();
       address.all=address.proviceName+address.cityName+address.countyName+address.detailInfo;
    //4.将获取的收货地址存储到缓存中
    wx.setStorageSync('address', address)
    } catch (error) {
        console.log(error)
    }
  },
  
  //点击 收货地址
//   handleChooseAddress(){
//     //1.获取权限状态
//   wx.getSetting({
//     success:(result)=>{
//       //2.获取权限状态 发现一些 属性名很怪异的时候,要使用[]形式来获取属性值
//       const scopeAddress=result.authSetting["scope.address"]
//       //3.判断scope的状态
//       if(scopeAddress===true || scopeAddress===undefined){
//         //获取收货地址
//         wx.chooseAddress({
//           success: (result1) => {
//             console.log(result1)
//           },
//         })
//       }else{
//         //4.用户以前拒绝过授权 先引诱用户打开授权页面
//         wx.openSetting({
//           success:(result2)=>{
//             //5.可以调用 收货地址代码
//             wx.chooseAddress({
//               success: (result3) => {
//                 console.log(result3)
//               },
//             })
//           }
//         })
//       }
//     }
//   })
  
//   //1.获取权限状态
//   const res1=await getSetting();
//   const scopeAddress=res1.authSetting["scope.address"];
//   //2.判断权限状态
//   if(scopeAddress===false){
//      //3.先诱导用户打开授权页面
//      await openSetting();
//   }
//      //3.调用获取收货地址的api
//      const res2=await chooseAddress();
//      console.log(res2)
// }
})