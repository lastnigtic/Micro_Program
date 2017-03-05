var postsData = require('../../../data/data_host.js')
var app = getApp();
Page({
  data: {
    userInfo:{},
    postDetail:{}
  },

  onLoad: function (options) {
    var that = this;
    var user = app.globalData.userInfo;
    if (options.type == 'post') {
      this.setData({
        postDetail: postsData.postList[options.postId],
        postId: options.postId,
        userInfo:user
      });
    } else {
      this.setData({
        postDetail: postsData.swiperList[options.postId],
        postId: options.postId,
        userInfo:user
      })
    }
    this.getCollectData();
    this.musicEventListener();
    wx.playBackgroundAudio({
      dataUrl: that.data.postDetail.music.url,
      title: that.data.postDetail.music.title,
      success: function (res) {
        that.setData({
          isplaying: true
        })
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },

  onUnload: function () {
    wx.stopBackgroundAudio()
  },
  //音乐控制----------------------------------------------------
  musicEventListener: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplaying: true
      });
      wx.onBackgroundAudioPause(function () {
        that.setData({
          isplaying: false
        })
      })
    })
  },

  //页面收藏功能---------------------------------------------------
  getCollectData: function () {
    //获取收藏缓存值
    var postsCollected = wx.getStorageSync('collection_state');
    //如果有数值，则设置collected为相应的值
    if (postsCollected) {
      var postCollected = postsCollected[this.data.postId];
      this.setData({
        collected: postCollected
      })
    }
    //如果没有数值，则设置collected为空
    else {
      var postsCollected = {};
      postsCollected[this.data.postId] = false;
      wx.setStorageSync('collection_state', postsCollected)
    };
  },
  onCollection: function () {
    //获取收藏的缓存数据
    var collected_catch = wx.getStorageSync('collection_state');
    //获取当前文章是否收藏的缓存数据
    var collect_catch = collected_catch[this.data.postId];
    //取反
    collect_catch = !collect_catch;
    //赋值到缓存数据中
    collected_catch[this.data.postId] = collect_catch;
    wx.setStorageSync('collection_state', collected_catch);
    //显示是否收藏
    this.setData({
      collected: collect_catch
    })
    wx.showToast({
      "title": collect_catch ? '收藏成功' : '取消成功'
    })
  },
  onShare: function () {
    var itemList = ['分享给微信好友', '分享到朋友圈', '分享到微博', '分享到QQ'];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (res.tapIndex + 1) {
          wx.showToast({
            "title": "点了也没用"
          })
        }
      }
    })
  },

  //音乐控制-------------------------------------------------
  onMusic: function () {
    var that = this;
    if (that.data.isplaying) {
      wx.pauseBackgroundAudio({
        success: function (res) {
          that.setData({
            isplaying: false
          })
        }
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: that.data.postDetail.music.url,
        title: that.data.postDetail.music.title,
        success: function (res) {
          that.setData({
            isplaying: true
          })
        }
      })
    }
  },
})