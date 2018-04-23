let util = require('../../../utils/util.js');
let app = getApp();

// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',
    navigateTitle: '',
    counter: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let category = options.category
    this.setData({
      navigateTitle: category
    })

    let dataUrl = ''

    switch (category){
      case '即将上映':
        dataUrl = app.globalData.basicMovieUrl +
          '/v2/movie/coming_soon'
      break;
      case '正在热映':
        dataUrl = app.globalData.basicMovieUrl +
          '/v2/movie/in_theaters'
        break;
      case 'top250':
        dataUrl = app.globalData.basicMovieUrl +
          '/v2/movie/top250'
        break;
    }
    this.setData({
      requestUrl: dataUrl
    })
    util.httpMovie(dataUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  processDoubanData: function (movieDouban) {
    let movies = []
    for (let idx in movieDouban.subjects) {
      let subject = movieDouban.subjects[idx]
      let title = subject.title

      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }

      let temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        coverageUrl: subject.images.large,
        average: subject.rating.average,
        movieId: subject.id
      }
      movies.push(temp)
    }

    let totalMovie = {}
    if(!this.data.isEmpty){
      totalMovie = this.data.movies.concat(movies)
    }else{
      totalMovie = movies
      this.data.isEmpty = false
    }
  
    
    this.setData({
      movies: totalMovie
    })
    this.data.counter += 20 
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  }, 
  onReachBottom:function(){
    let nextUrl = this.data.requestUrl + '?start=' + this.data.counter + '&count=20'
    util.httpMovie(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onMovieToDetail: function (event) {
    let movieId = event.currentTarget.dataset.movieid
    let detailUrl = '../movie-detail/movie-detail?id=' + movieId
    wx.navigateTo({
      url: detailUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let navigateTitle = this.data.navigateTitle
    wx.setNavigationBarTitle({
      title: navigateTitle
    })
  },
  onPullDownRefresh: function(event){
    let refreshUrl = this.data.requestUrl + '?start=0&count=20'
    this.data.movies={}
    this.data.isEmpty = true
    this.data.count = 0
    util.httpMovie(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})