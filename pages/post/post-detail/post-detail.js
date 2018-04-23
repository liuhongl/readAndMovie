var postsDate = require('../../../data/post-data.js')
var app = getApp()

Page({
  data:{
    isPlayingMusic: false
  },
  onLoad: function(options){
    let postId = options.id
    this.setData({
      nCurrentPostId: postId
    })
    let postData = postsDate.postList[postId]
    this.setData({
      postData: postData
    })

    // let readingkeys = wx.getStorageSync('reading_key')
    
    // if(readingkeys){
    //   readingkeys[postId] += 1
    // }else{
    //   readingkeys = {}
    //   readingkeys[postId] = 1
    // }
    // wx.setStorageSync('reading_key', readingkeys)

    //全部文章收藏状态
    //collect_key ={
    //   1:false,
    //   2:true
    // }


    let postCollecteds = wx.getStorageSync('collect_key')
    if (postCollecteds){
      let postCollected = postCollecteds[postId]
      this.setData({
        collected: postCollected
      })
    }else{
      postCollecteds = {}
      postCollecteds[postId] = false
      //添加收藏状态
      //console.log(postCollecteds)
      wx.setStorageSync('collect_key', postCollecteds)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentPostId === postId){
      this.setData({
        isPlayingMusic: true
      })
    }
    this.onAudioMonitor()
    
  },
  onAudioMonitor:function(){
    wx.onBackgroundAudioPlay(() => {
      // let pages = getCurrentPages()
      // let currentPage =  pages[pages.length - 1]
      // if (currentPage.data.nCurrentPostId === this.data.nCurrentPostId) {
      //   if (app.globalData.g_currentPostId == this.data.nCurrentPostId) {
          this.setData({
            isPlayingMusic: true
          })
      //   }
      // }
      
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentPostId = this.data.nCurrentPostId
    })
    wx.onBackgroundAudioPause(() => {     
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentPostId = null
    })
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentPostId = null
    })
  },
  onCollectTap: function (event) {
    let postCollecteds = wx.getStorageSync('collect_key')
    let postCollected = postCollecteds[this.data.nCurrentPostId]
    postCollected = !postCollected
    //更新缓存
    postCollecteds[this.data.nCurrentPostId] = postCollected
    this.showToast(postCollected, postCollecteds)
  },
  getPostStorage:function() {
    wx.getStorage({
      key:'collect_key',
      success: res => {
        console.log(res.data)
        let postCollecteds = res.data
        let postCollected = postCollecteds[this.data.nCurrentPostId]
        postCollected = !postCollected
        //更新缓存
        postCollecteds[this.data.nCurrentPostId] = postCollected
        this.showToast(postCollected, postCollecteds)
      }
    })
    
  },
  onShareAppMessage:function(res){
    if(res.form === 'button'){
      console.log(res.from.target)
    }

    return {
      title: '文章详情',
      path: '/image/post/post-detail?id=' + this.data.nCurrentPostId,
      success: res => {
        console.log(res.shareTickets)
      }
    }
  },
  showModal: function (postCollected, postCollecteds){
    wx.showModal({
      title: '收藏',
      content: postCollected?'收藏该文章?' :'取消收藏该文章',
      cancelText: '取消',
      confirmText: '确定',
      success: (res)=> {
        if(res.confirm){
          //改变收藏状态
          this.setData({
            collected: postCollected
          })
          //缓存收藏状态
          wx.setStorageSync('collect_key', postCollecteds)
        }
      }
    })
  },
  showToast: function (postCollected, postCollecteds){
    //改变收藏状态
    this.setData({
      collected: postCollected
    })
    //缓存收藏状态
    wx.setStorageSync('collect_key', postCollecteds)
     wx.showToast({
      title: postCollected?'收藏成功':'取消成功',
      duration:1000,
      icon:'success'
    });
  },
  onAudioTap: function(event){
    let postId = this.data.nCurrentPostId
    let audio = postsDate.postList[postId]
    if(!this.data.isPlayingMusic){
      wx.playBackgroundAudio({
        dataUrl: audio.music.url,
        title: audio.music.title,
        coverImgUrl: audio.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }else{
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    }
  }
})