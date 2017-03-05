var postsData = require('../../data/data_host.js')
var app = getApp();
Page({
  data:{
    posts:{},
    swiper:{},
    userInfo:{}
  },
  onLoad:function(options){
    var user = app.globalData.userInfo;
    this.setData({
     posts: postsData.postList,
     swiper: postsData.swiperList,
     userInfo:user
    })
    console.log(this.data.userInfo)
  },
  postDetail:function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url:"post-detail/post-detail?postId="+postId+"&type=post"
    })
  },
  swiperDetail:function(event){
    var postId = event.currentTarget.dataset.swiperid;
    wx.navigateTo({
      url:"post-detail/post-detail?postId="+postId+"&type=swiper"
    })
  },
})