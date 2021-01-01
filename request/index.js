//同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
  //被调用了几次数据请求就会加加
  ajaxTimes++;
  //显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  //定义公共的url
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      //上边的公共url加使用页面传入的url参数
      url:baseUrl+params.url,
      // 成功状态调用resolve
      success:result=>{
        //简化返回值
        resolve(result.data.message)
      },
      //失败状态调用reject
      fail:err=>{
        reject(err)
      },
      //不论成功或失败都会调用的函数 关闭正在等待的图标
     complete:()=>{
       //数据请求回来次数就会减减
       ajaxTimes--;
       if(ajaxTimes==0){
         //当请求次数为0的时候就关闭当前正在等待的图标
        wx.hideLoading();
       }
     }
    })
  })
}