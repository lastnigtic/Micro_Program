var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    inTheater:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    containerShow:true,
    searchPannelShow:false,
  },
  onLoad: function (options) {
    var douban = app.globalData.doubanBase;
    var in_theatersUrl = douban + '/v2/movie/in_theaters?start=0&count=3';
    var coming_soonUrl = douban + '/v2/movie/coming_soon?start=0&count=3';
    var top250Url = douban + '/v2/movie/top250?start=0&count=3';
    this.getMovieData(in_theatersUrl,'inTheater','正在热映');
    this.getMovieData(coming_soonUrl,'comingSoon','即将上映');
    this.getMovieData(top250Url,'top250','豆瓣TOP');
  },
  getMovieData: function (url,movieKey,movieHead) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "movie"
      },
      success: function (res) {
        that.getMovieIntrustionData(res.data,movieKey,movieHead);
        console.log(res);
      },
    })
  },
  getMovieIntrustionData:function(doubanMoviesData,movieKey,movieHead){
    var movies = [];
    for (var idx in doubanMoviesData.subjects){
      var subject = doubanMoviesData.subjects[idx];
      var title = subject.title;
      if(title.length >= 5){
        var title = title.substring(0,5) + '...';
      }
      var dataGroup = {
        title:title,
        images:subject.images.medium,
        stars:util.convertToStarsArray(subject.rating.stars),
        average:subject.rating.average,
        movieId:subject.id
      }
      movies.push(dataGroup);
    }
    var moviesData = {};
    moviesData[movieKey] = {
      movieHead:movieHead,
      movies:movies
      }

    this.setData(moviesData);
  },
  /*--------------跳转到更多---------------*/
  onMoreMovie:function(event){
    var movieHead = event.currentTarget.dataset.moviehead;
    wx.navigateTo({
      url: 'movie-more/movie-more?movieHead='+movieHead
    })
  },
  /*----------------搜索页面----------------*/
  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPannelShow:true,
    })
  },
  onBindBlur:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieData(searchUrl,"searchResult","");
  },
  cancelSearch:function(event){
    this.setData({
      containerShow:true,
      searchPannelShow:false,
    })
  },
 /*------------跳转到详情页面--------------*/
 onMovieTap:function(event){
   console.log(event);
   var movieId = event.currentTarget.dataset.movieid;
   wx.navigateTo({
     url: 'movie-detail/movie-detail?movieId='+movieId,
   })
 }
})