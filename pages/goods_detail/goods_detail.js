// pages/goods_detail/goods_detail.js
/* 1.发送请求 获取页面数据
   2.点击轮播图 预览大图
      给轮播图绑定点击事件
      调用小程序api previewImage
  3.点击加入购物车
      先绑定点击事件
      获取缓存中的购物车数据 数组格式
      先判断 当前商品是否已经存在于购物车
      已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
      不存在于购物车的数组中 直接给购物车添加一个新数组 新元素 带上购物数量属性 num 重新把购物车数组 填充回缓冲中
      弹出提示
*/
import {request} from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  //商品对象
  GoodsInfo:{},
  onLoad: function (options) {
    const {goods_id}=options;
    console.log(goods_id)
    this.getGoodsDetail(goods_id);
  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}})
    //将请求回来的数据放入全局商品对象中
    this.GoodsInfo=goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        //iphone部分手机 不识别 webp图片格式
        //1.webp  改为1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
  },
  //点击轮播图放大预览
  handlePrevireImage(e){
    //1.构造要预览的图片数组  
    //遍历商品对象数组返回图片数据
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid)
    //2.接受传递过来的图片url
    const current=e.currentTarget.dataset.url
    wx.previewImage({
      urls:urls,
      //要点击的那张图片
      current:current
    })
  },
  //点击 加入购物车事件
  handleCartAdd(){
    //1.获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    //2.判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    //3.判断 不存在第一次添加
    if(index==-1){
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //3.已经存在购物车数据  执行 num++
      cart[index].num++;
    }
    //5.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart)
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      //true 防止用户手抖 疯狂点击
      mask:true
    })
  }
})