const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//创建数组来表现star评分
const convertToStarsArray = (num) => {
  let arr = []
      num = num.toString().substring(0,1)
  for(let i = 0; i < 5; i++){
    if(i < num){
      arr.push(1)
    }else{
      arr.push(0)
    }
  }
  return arr
}
//https request请求豆瓣数据
function httpMovie(url,callback){
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'json'
    },
    success: function (res) {
      callback(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function convertToCastString(casts){
  let castsjoin = ''
  for (let idx in casts){
    castsjoin = castsjoin + casts[idx].name + '/'
  }
  return castsjoin.substring(0, castsjoin.length - 2)
}

function convertToCastInfos(casts){
  let castArr = []
  
  for (let idx in casts){
    let obj = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name
    }

    castArr.push(obj)
  }

  return castArr    
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  httpMovie: httpMovie,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos 
}

