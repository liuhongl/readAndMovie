let util = require('../../utils/util.js');
let app = getApp();

Page({
  data: {
    comingSoon:{},
    inTheater:{},
    top250:{},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },
  onLoad:function(){

    let comingSoonUrl = app.globalData.basicMovieUrl + 
      '/v2/movie/coming_soon?start=0&count=3',
        inTheaterUrl = app.globalData.basicMovieUrl + 
        '/v2/movie/in_theaters?start=0&count=3',
        top250Url = app.globalData.basicMovieUrl + 
        '/v2/movie/top250?start=0&count=3'

    this.getMovieListData(comingSoonUrl,'comingSoon','即将上映')
    this.getMovieListData(inTheaterUrl,'inTheater','正在热映')
    this.getMovieListData(top250Url,'top250','top250')
  },
  onMovieToDetail:function(event){
    let movieId = event.currentTarget.dataset.movieid
    let detailUrl = 'movie-detail/movie-detail?id=' + movieId
    wx.navigateTo({
      url: detailUrl
    })
  },
  onSearchTap:function(event){
    console.log
    let val = event.detail.value
    let searchUrl = app.globalData.basicMovieUrl +
      '/v2/movie/search?q=' + val
    this.getMovieListData(searchUrl,'searchResult','')
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onCancelTap: function(){
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },
  onMoreTap: function(event){
    let category = event.currentTarget.dataset.category
 
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  getMovieListData: function (url, settedKey, categoryTitle){
    let that = this
    
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.processDoubanData(res.data,settedKey,categoryTitle)
      },
      fail: function () {
        console.log('调用失败')
      }
    })
  },
  processDoubanData: function (movieDouban, settedKey, categoryTitle){
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

    //改名字，为了movie-list.wxml循环方便
    let readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
  }
}) 