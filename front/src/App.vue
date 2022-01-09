<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

export default {
  name: 'App',
  data: () => ({
  }),
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="sass">
body
  margin: 0
  margin-bottom: 5vh
  padding: 0

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  text-align: center
  color: #2c3e50
  display: flex
  flex-direction: column

@media screen and (max-width: 1024px)
  body
    margin-bottom: 2.5vh

@media screen and (max-width: 768px)
  body
    margin-bottom: 5vh
</style>