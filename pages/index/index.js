var app = getApp();
Page({
  data:{
      userInfo:{}
  },
  onReady: function (options) {
      var userInfo = app.globalData.userInfo;
      this.setData({
          userInfo:userInfo
      })
  },
  knowMore:function(){
      wx.switchTab({
          url:"/pages/posts/posts"
      })
  }
})