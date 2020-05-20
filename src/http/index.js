import Fly from 'flyio/dist/npm/fly'
var fly = new Fly()

fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  // request.headers['X-Tag'] = 'flyio'
  request.baseURL = 'http://192.168.2.120:3000'
  return request
})

fly.interceptors.response.use(
  (response) => {
    // 只将请求结果的data字段返回
    return response.data
  }
)

export default fly
