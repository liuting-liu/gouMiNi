// pages/detail/detail.js
//0.引入用力发送请求的方法  路径补全
import {request} from "../../request/index"
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航数据
    catesList:[],
    //楼层数据
    floorList:[]
  },
  //页面开始加载就会触发的事件
  onLoad: function (options) {
    //1.发送异步请求获取轮播图数据 通过promise优化
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // })
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  //获取轮播图数据  自定义事件
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result=>{
      this.setData({
        //简化返回值  result.data.message放入公共请求参数中
        swiperList:result
      })
    })
  },
  //获取分类导航数据
  getCatesList(){
    request({url:'/home/catitems'})
    .then(result=>{
      this.setData({
        catesList:result
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({url:'/home/floordata'})
    .then(result=>{
      this.setData({
        floorList:result
      })
    })
  }
})