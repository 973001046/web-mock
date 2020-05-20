<template>
  <div id="app">
    <header>CHH MOCK</header>
    <div class="content">
      <aside>
        <left-bar></left-bar>
      </aside>
      <article>
        <router-view />
      </article>
    </div>
    <!-- <footer>FOOTER</footer> -->
  </div>
</template>

<script>
import leftBar from '@/components/leftBar'

export default {
  name: 'Index',
  components: { leftBar },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header,
footer,
article,
aside {
  color: #fff;
  min-height: 60px;
  display: flex;
  position: relative;
}
header,
footer {
  background-color: #434744;
  align-items: center;
  justify-content: center;
}
aside {
  background-color: #3ba0e9;
}
article {
  min-height: 300px;
  /* background-color: rgba(0, 0, 0, 0.6); */
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: auto;
  display: flex;
}
.content article {
  flex: auto;
}
.content aside {
  flex: none;
  width: 200px;
}
</style>
