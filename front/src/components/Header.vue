<script>
import  Nav from './Nav.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Header',
  components: {
    Nav
  },
  data() {
    return {
      searchInput: undefined
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      isLoggedIn: 'isLoggedIn',
      usersList: 'usersList',
      search: 'search'
    }),
    searchedUsers: function () {
      return this.usersList.filter(user => user.username.toLowerCase().includes(this.search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(this.search.toLowerCase()) || user.lastName.toLowerCase().includes(this.search.toLowerCase())).slice(0, 5)
    }
  },
  methods: {
    ...mapActions(['setSearch']),
    async goToProfile(username) {
      try {
        await this.$router.push({ name: 'Profile', params: { username } })
        this.setSearch('')
      }
      catch {
        return
      }
    },
    changeSearch(event) {
      this.setSearch(event.target.value)
    }
  },
  updated() {
    this.searchInput = document.querySelector('#search')
    if (this.searchInput) {
      this.searchInput.value = this.search
    }
  }
}
</script>

<template>
<header id="header">
  <div id="logo">
    <router-link to="/">
      <h1 id="logo__title"><img id="logo__img" src="../assets/logo/icon-left-font.png" alt="Logo Groupomania"/></h1>
    </router-link>
  </div>
  <div v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register' && this.$route.name !== 'PasswordReset'" class="search">
    <input @input="changeSearch($event)" id="search" class="search__input" :class="{ searching: searchedUsers.length }" type="text" autocomplete="off" name="search" placeholder="Rechercher un utilisateur...">
    <div v-if="search && searchedUsers.length" class="search__results">
      <div class="search__results__user" v-for="user in searchedUsers"
      :key="user.userid" @click="goToProfile(user.username)">
        <p>{{ user.username }}</p>
        <p>{{ user.firstName + ' ' + user.lastName }}</p>
      </div>
    </div>
    <div v-else-if="search && !searchedUsers.length" class="search__results">
      <p>Aucun résultat trouvé</p>
    </div>
  </div>
  <Nav></Nav>
</header>
</template>

<style lang="sass" scoped>
#header
  height: 10vh
  margin-bottom: 25px
  padding: 1vh 1vw
  display: flex
  justify-content: space-between
  align-items: center

#logo
  height: 75%
  &__img
    height: 100%
  &__title
    height: 100%
    margin: 0

.search
  position: relative
  height: 25%
  width: 300px
  &__input
    padding: 5px
    height: 100%
    width: 100%
    border: 2px solid hsl(10, 99%, 50%)
    border-radius: 10px
    outline: none
    &:not(:focus) + .search__results
      display: none
    &.searching + .search__results
      display: inherit
  &__results
    padding: 5px
    position: relative
    bottom: 0
    z-index: 1
    width: 100%
    border-radius: 5px
    background-color: hsl(0, 0%, 97.5%)
    box-shadow: 0 2px 5px black
    &__user
      padding: 5px 0
      > p
        margin: 5px 0
      &:hover
        cursor: pointer
        background-color: hsl(10, 99%, 75%)

@media screen and (max-width: 1024px)
  #header
    height: 5vh

@media screen and (max-width: 768px)
  #header
    height: 20vh
    flex-direction: column
    justify-content: space-around
  #logo
    height: 25%
  .search
    height: 10%
</style>