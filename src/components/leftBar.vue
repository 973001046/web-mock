<template>
  <div>
    <el-row class="tac">
      <el-menu
        :default-active="activeRouter"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleOpen"
      >
        <el-menu-item v-for="(nav, index) in navList" :key="index" :index="nav.value">
          <i class="el-icon-s-platform"></i>
          <span class="apiTitle" slot="title">{{nav.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'leftBar',
  computed: mapState(['activeRouter', 'navList']),
  data () {
    return {
      active: '0'
    }
  },
  methods: {
    ...mapMutations(['changeActiveRouter', 'setRouter', 'setApiList']),
    ...mapActions(['saveApi']),
    handleOpen (key, keyPath) {
      this.changeActiveRouter(keyPath[0])
      this.getApiList(this.navList[key].title)
    },
    getList () {
      this.$http.get('/getApi/navigation').then(res => {
        this.setRouter(res.dir[0].data)
      })
    },
    getApiList (title) {
      this.saveApi(title)
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
.tac {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
}
.el-menu {
  height: 100%;
}
.apiTitle {
  width: 100px;
}
</style>
