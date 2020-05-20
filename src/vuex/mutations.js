export const changeActiveRouter = (state, index) => {
  state.activeRouter = index
}

export const setRouter = (state, dir) => {
  state.navList = dir
}

export const setApiList = (state, dir) => {
  state.apiList = dir
}
