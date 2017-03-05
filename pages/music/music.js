var data = require('../../data/data_host.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    musicHeadPic: 'http://img1.gtimg.com/gamezone/pics/hv1/163/37/1944/126418198.jpg',
    ListDescription: '京都key社动画音乐集',
    Datas: '',
    musicLists: '',
    frontPlayId: '',
    playId: 'a',
    location: 'local',
    searchValue: '',

  },
  onLoad: function (options) {
    var that = this;
    var Datas = data.swiperList;
    var datas = data.postList;
    Datas.push(...datas);
    this.setData({
      Datas: Datas
    })
    this.processMusicData();
    /*wx.onBackgroundAudioPause(function () {
      var currentPlayId = that.data.playId;
      that.setData({
        playId: 'a',
        frontPlayId: currentPlayId
      })
    })*/
    /*wx.onBackgroundAudioPlay(function () {
      that.setData({
        playId: that.data.frontPlayId
      })
    })*/
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //处理本地音乐数据
  processMusicData: function () {
    var Datas = this.data.Datas;
    var musicLists = [];
    var title;
    for (var idx in Datas) {
      var musicData = Datas[idx];
      if (musicData.music.title.length >= 6) {
        title = musicData.music.title.substring(0, 6) + '...'
      } else {
        title = musicData.music.title
      }
      musicData = {
        url: musicData.music.url,
        title: title,
        duration: musicData.music.duration,
        musicId: idx
      }
      musicLists.push(musicData);
    }
    this.setData({
      musicLists: musicLists
    })
  },
  //处理搜索音乐数据
  processSearchMusicData: function (data) {
    console.log(data)
    var listTitle = data.result.name;
    wx.setNavigationBarTitle({ title: listTitle });
    var musicDatas = data.result.tracks;
    var musics = []
    for (var idx in musicDatas) {
      var music = {};
      var musicData = musicDatas[idx];
      if (musicData.name.length >= 8) {
        var name = musicData.name.substring(0, 8) + '...';
      } else {
        var name = musicData.name;
      }
      music = {
        title: name,
        url: 'http://link.hhtjim.com/163/' + musicData.id + '.mp3',
        duration: this.dealDuration(musicData.duration),
        musicId: idx,
      }
      musics.push(music)
    }
    this.setData({
      musicLists: musics,
      musicHeadPic: data.result.coverImgUrl,
      ListDescription: this.dealDescription(data.result.description),
      searchValue:''
    })
  },
  dealDuration: function (duration) {
    var a = duration / 1000;
    var min = parseInt(a / 60);
    var second = parseInt((duration - (min * 60000)) / 1000)
    if (second >= 0 && second <= 9) {
      second = '0' + second;
    }
    return min + ':' + second;
  },
  dealDescription:function(res){
    if(res == null ){
      return '';
    }
    else if(res.length >= 55){
      return res.substring(0,55)+'...'
    }else{
      return res
    }
  },
  //播放音乐
  playMusic: function (res) {
    var that = this;
    var idx = res.currentTarget.dataset.idx;
    wx.playBackgroundAudio({
      dataUrl: that.data.musicLists[idx].url,
      title: that.data.musicLists[idx].title,
      success: function (res) {
        that.setData({
          playId: idx
        })
        console.log(that.data.playId)
      }
    })
  },
  //音乐暂停
  pauseMusic: function (res) {
    wx.pauseBackgroundAudio();
    this.setData({
      playId: 'a'
    })
  },
  //搜索音乐
  onMusicSearch: function (res) {
    var listId = res.detail.value;
    var searchUrl = app.globalData.wangyiBase + 'id=' + listId;
    console.log(searchUrl)
    util.http(searchUrl, this.processSearchMusicData)
    this.setData({
      location: 'search'
    })
  }
})