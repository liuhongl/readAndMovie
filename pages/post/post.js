var postsDate = require('../../data/post-data.js')

Page({
  data:{
    imageUrls:[
      {
        url: '/image/post/xiaolong.jpg',
        id: 3
      },
      {
        url: '/image/post/vr.png',
        id: 4
      },
      {
        url: '/image/iqiyi.png',
        id: 5
      }
    ],
    readingNum: 0,
    autoplay: true,
    interval: 5000,
    indicatorDots: true,
    circular: true
  },
  onLoad:function(){
    this.setData({
      postList: postsDate.postList
    })
    
    //查看次数
    //let readingkeys = wx.getStorageSync('reading_key')
    // for(let i = 0,length = postList.length; i < length; i++){
    //   console.log(length)
    //   // this.setData({
    //   // readingNum:  
    //   // }) 
    //   console.log(readingkeys)
    //   console.log(this.data.readingNum)
    // }
   
  },
  onPostTap: function (event) {
    let postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: '/pages/post/post-detail/post-detail?id='+postId
    })
  },
  onSwiperTap: function (event) {
    let postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: '/pages/post/post-detail/post-detail?id=' + postId
    })
  }
})