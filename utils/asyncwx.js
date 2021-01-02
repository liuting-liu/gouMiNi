//promise形式  getSetting
//获取权限状态
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success:(result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
//获取收货地址
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success:(result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
//用户以前拒绝过授权 先引诱用户打开授权页面
export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success:(result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/*promise 形式 showModal
   @param {object} param0 参数
*/
//封装弹窗提示
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content: content,
      success: (res)=>{
        resolve(res);
        },
        fail:(err)=>{
          reject(err)
        }
      })
  })
}

/*promise 形式 showModal
   @param {object} param0 参数
*/
//封装弹窗提示
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon:'none',
      success: (res)=>{
        resolve(res);
        },
        fail:(err)=>{
          reject(err)
        }
      })
  })
}

//封装弹窗提示
export const login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}