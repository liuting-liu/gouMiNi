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
    1.根据购物车中的商品数据 判断所有商品选中checked=true  否则有一个没被选 checked=false

  5.总价格和总数量
    1.都需要商品被选中 才进行计算操作
    2.获取购物车数组
    3.遍历
    4.判断商品是否被选中
    5.总价格=商品的单价+商品的数量
    6.总数量+=商品的数量
    7.把计算后的价格和数量 设置回data中即可
  
  6.商品选中功能
    1.绑定change事件
    2.获取到被修改的商品对象
    3.商品对象的选中状态 取反
    4.重新填充同data中的缓存中
    5.重新计算全选 总价格 总数量

  7.全选和反选
    1.全选复选框绑定事件 change
    2.获取data中的全选变量 allchecked
    3.直接取反 allchecked=！allchecked、
    4.遍历购物车数组 让里面商品 选中状态跟随 allchecked 改变而改变
    5.把购物车数组和allchecked重新设置回data 把购物车重新设置回缓存中

  8.商品数量的编辑功能
    1. 加 减 绑定同一个点击事件 区分的关键 自定义属性
      1.+ “+1”
      2.- “-1”
    2.传递被点击的商品id goods_id
    3.获取data中的购物车数组 来获取需要被修改的商品对象
    4.当购物车数量-=1  同时用户 点击 “-”  
     弹窗提示 询问用户 是否要删除  wx.showModel
      1.确定 直接执行删除
      2.取消  什么都不做
    5.直接修改商品对象的数量  num
    6.把cart数组 重新设置回缓存中 和data中 this.setCart

  9.点击结算
    1.判断有没有收货地址
    2.判断用户有没有选购商品
    3.经过以上验证 跳转到支付页面
*/
// 引入封装好的异步函数
import {getSetting,chooseAddress,openSetting,showModal, showToast} from "../../utils/asyncwx"
Page({
  data: {
    //本地存储的地址数据
    address:{},
    //存储添加购物车数组
    cart:[],
    //购物车商品全选状态
    allChecked:false,
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

    this.setData({address})
    this.setCart(cart)
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

//商品选中事件
  handleItemChange(){
    //1.获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //2.获取购物车数组
    let {cart}=this.data;
    //3.找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //4.选中的状态取反
    cart[index].checked=!cart[index].checked;
    //5,6 把购物车数据重新设置回data中的缓存中

    this.setCart(cart);
  },
  //设置购物车状态同时 重新计算 底部工具栏的数据全选总价格 购买的数量
  setCart(cart){
    let allChecked=true;
    //总数量 总价格  计算
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice=v.num*v.goods_price;
        totalNum+=v.num
      }else{
        allChecked=false
      }
    });
      //判断数组是否为空
      allChecked=cart.length!=0?allChecked:false
      this.setData({
        cart,
        totalNum,totalPrice,allChecked
      });
      wx.setStorageSync('cart', cart);
  },
  //商品全选功能
  handleItemAllCheck(){
    //1.获取data中的数据
    let {cart,allChecked}=this.data;
    //2.修改值
    allChecked=!allChecked;
    //3.循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked)
    //4.把修改后得值 填充回data或者缓存中
    this.setCart(cart)
  },
  //商品数量的编辑功能
  async handleItemNumEdit(e){
    //1.获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //2.获取购物车属猪
    let {cart}=this.data;
    //3.找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    //4.判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      //4.1弹窗提示
      const res=await showModal({content:"您是否要删除"})
      if(res.confirm){
        cart.split(index,1);
        this.setCart(cart);
      }
     }else{
        //5.进行修改数量
        cart[index].num+=operation;
       //6.设置回缓存的data中
       this.setCart(cart);
      }
    },
  //点击结算功能
  async handlePay(){
    //1.判断收货地址
    const {address}=this.data;
    if(address.username){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //2.判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //3.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})