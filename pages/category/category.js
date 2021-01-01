//引入发送请求封装的promise方法
import { request } from "../../request/index"

// pages/category/category.js
Page({
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //被点击的左侧的菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],
  onLoad: function (options) {
      /*0.web存储数据和小程序存储不同
        1.写代码的方式不一样
        web:localStorage.setItem("key","value") localStorage.getItem("key")
        小程序中:wx.setStorageSync('keys',"value")  wx.getStorageSync('keys") 
        2.存的时候有没有做类型转换
        web:不管存入的是什么类型的数据,最终都会先调用toString() 把数据转为字符串再存进去
        小程序:不存在 类型转换的这个操作 存什么数据进去获取的就是什么类型的数据
      1.发送请求之前判断本地存储中有没有旧数据 {timeDare.now.data:[...]}
      2.没有 旧数据直接发送新请求
      3.有旧的数据  同时 旧的数据也没有过期就是用本地存储中的旧数据即可*/

      //1.获取本地存储中的数据
      const Cates=wx.getStorageSync('cates')
      //2.判断是否
      if(!Cates){
        //不存在,发送请求获取数据
        this.getCart();
      }else{
        //有旧的数据 判断有没有过期 定义一个过期时间
        if(Date.now()-Cates.time>1000*10){
          //重新发送请求
          this.getCart();
        }else{
          //可以使用旧的数据  获取本地存储的数据
          this.Cates=Cates.data;
          //渲染左边菜单和右边商品内容数据
          let leftMenuList=this.Cates.map(v=>v.cat_name);
          let rightContent=this.Cates[0].children;
          this.setData({
            leftMenuList:leftMenuList,
            rightContent:rightContent
      })
        }
      }
  },
  //获取分类数据
  async getCart(){
    // request({url:'/categories'})
    // .then(result=>{
    //   //将后台返回的信息放入存储数组中
    //   this.Cates=result.data.message;
    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates})
    //   //构造左侧大菜单数据  map用于遍历数组 元素值 v  返回 数组对象中的cat_name
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品分类数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     //将后台返回的左侧菜单数据和右侧商品分类数据放入data变量中
    //     leftMenuList:leftMenuList,
    //     rightContent:rightContent
    //   })
    // })

    //1.使用es7的async await发送异步请求  result=.then(result=>{})中的res
    const result=await request({url:'/categories'})
       //result.data.message放入公共请求参数中  简化返回值
       this.Cates=result;
      //把接口的数据存入到本地存储中
      wx.setStorageSync('cates',{time:Date.now(),data:this.Cates})
      //构造左侧大菜单数据  map用于遍历数组 元素值 v  返回 数组对象中的cat_name
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品分类数据
      let rightContent=this.Cates[0].children;
      this.setData({
        //将后台返回的左侧菜单数据和右侧商品分类数据放入data变量中
        leftMenuList:leftMenuList,
        rightContent:rightContent
      })
  },
  //左侧菜单点击切换事件
  handleItemTap(e){
    //1.获取被点击的标题身上的索引值
    let {index}=e.currentTarget.dataset
    //3.根据不同的索引来渲染右侧的商品内容
    let rightContent=this.Cates[index].children;
    //2.给data中的currentIndex赋值
    this.setData({
      currentIndex:index,
      rightContent:rightContent,
       //重新设置 右侧内容的scroll-view标签距离顶部的距离
      screenTop:0
    })
  }
})