let util = require('../../../../utils/util.js');
let app = getApp();

class Movie{
  constructor(url){
    this.url = url
  }
  getMovieData(cb){
    this.cb = cb
    util.httpMovie(this.url, this.processDoubanData.bind(this))
  }
  processDoubanData (data) {
    if(!data){
      return
    }

    let directors = {
      avatar: '',
      name: '',
      id: ''
    }
    if (data.directors[0] !== null) {
      if (data.directors[0].avatars !== null) {
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
    this.cb(movie)
  }
}

export {Movie}