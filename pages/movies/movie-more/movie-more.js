// pages/movies/movie-more/movie-more.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    navigatorBarTitle: '',
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    var movieHead = options.movieHead;
    this.data.navigatorBarTitle = movieHead;
    var baseUrl = app.globalData.doubanBase;
    var dataUrl = '';
    switch (movieHead) {
      case "正在热映":
        dataUrl = baseUrl + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        dataUrl = baseUrl + '/v2/movie/coming_soon';
        break;
      case "豆瓣TOP":
        dataUrl = baseUrl + '/v2/movie/top250';
        break;
    }
    util.http(dataUrl, this.getMovieInstructionData);
    this.data.requestUrl = dataUrl;
  },
  getMovieInstructionData: function (doubanMoviesData) {
    var movies = [];
    for (var idx in doubanMoviesData.subjects) {
      var subject = doubanMoviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 5) {
        var title = title.substring(0, 5) + '...';
      }
      var dataGroup = {
        title: title,
        images: subject.images.medium,
        stars: util.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        movieId: subject.id
      }
      movies.push(dataGroup);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigatorBarTitle,
    })
  },
  /*下拉刷新*/
  onScrollTopEvent: function (event) {
    console.log("下拉");
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this. getMovieInstructionData);
    wx.showNavigationBarLoading();
  },
  /* 上拉加载更多*/
  onScrollDownEvent: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" +
      this.data.totalCount + "&count=20";
    util.http(nextUrl, this.getMovieInstructionData);
    wx.showNavigationBarLoading();
  },
 /*------------跳转到详情页面--------------*/
 onMovieTap:function(event){
   console.log(event);
   var movieId = event.currentTarget.dataset.movieid;
   wx.navigateTo({
     url: '../movie-detail/movie-detail?movieId='+movieId,
   })
 }
})