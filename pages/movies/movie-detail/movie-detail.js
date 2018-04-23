// pages/movies/movie-detail/movie-detail.js

import {Movie} from 'class/Movie.js';
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let url = app.globalData.basicMovieUrl + '/v2/movie/subject/' + id

    let movie = new Movie(url)
    movie.getMovieData((movie) => {
      this.setData({
        movies: movie
      })
    })
    //util.httpMovie(url,this.processDoubanData)

  },
  processDoubanData:function(data){
    //判断数据不为空值，空值会报错
    let directors = {
      avatar: '',
      name: '',
      id: ''
    }
    if(data.directors[0] !== null){
      if(data.directors[0].avatars !== null){
        directors.avatar = data.directors[0].avatars.large
      }
      directors.name = data.directors[0].name
      directors.id = data.directors[0].id
    }
    let movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      summary: data.summary,
      genres: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      directors: directors,
      castsInfo: util.convertToCastInfos(data.casts),
      cast: util.convertToCastString(data.casts),
      year: data.year
    }
    this.setData({
      movies: movie
    })
  },
  onReady: function(){
    // let navigateTitle = this.data.movies.title
    // wx.setNavigationBarTitle({
    //   title: navigateTitle
    // })
  }
})