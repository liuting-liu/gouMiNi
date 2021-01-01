/* A用户上滑页面 滚动条触底就会加载下一页数据
     1.找到滚动条触底事件  微信小程序开发文档
     2.判断还有没有下一页数据
        获取到总页数
          总页数=Math.ceil(总条数/页面=容量 pagesize)
        获取到当前的页码
        只要判断当期页码是否大于等于总页数
        表示没有下一页
     3.假如没有下一页数据 弹出一个提示
     4.假如还有下一页数据  来加载下一页数据
        当前的页码++
        重新发送请求
        数据请求回来 要对data中的数组进行拼接而不是替
    2.下拉刷新页面
      触发下拉事件  需要在页面的json文件中开启一个配置项
        找到触发下拉刷新的事件
      重置 数据  数组
      重置页码设置为1
      重新发送请求
      数据请求回来 需要手动的关闭 等待效果
*/
import {request} from '../../request/index.js';
// import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[],
  },
  //接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    this.QueryParams.cid=options.cid;
    this.getGoodList();
  },
  //获取商品列表数据
  async getGoodList(){
    const res=await request({url:'/goods/search',data:this.QueryParams});
    //获取总条数
    let total=res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的窗口  没有调用下拉刷新窗口直接关闭也不会报错
    wx.stopPullDownRefresh();
  },
  

  //标题的点击事件从子组件传参来的
  tabsItemChange(e){
    console.log(e)
    //1.获取被点击的标题索引
    const {index}=e.detail;
    //2.修改原数组
    //2.1获取原数组值
    let {tabs}=this.data;
    //2.2遍历数组中的选项 
    tabs.forEach((v,i)=> i===index ? v.isActive=true : v.isActive=false)
    //2.3
   this.setData({
     tabs
    })
  },
  //页面上滑 滚动条触底事件
  onReachBottom(){
    //1.还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      wx.showToast({
        title: '没有下一页数据',
      })
    }else{
      //还有下一页数据  页码加加 重新发送请求
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    //1.重置数组
    this.setData({
      goodList:[]
    })
    //2.重置页码
    this.QueryParams.pagenum=1;
    //3.发送请求
    this.getGoodList();
  }
})