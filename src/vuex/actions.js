import fly from '../http/index'

export const saveApi = ({ commit }, title) => {
  fly.get(`/getApi/${title}`).then(res => {
    commit('setApiList', res.dir)
  })
}
