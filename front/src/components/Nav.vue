<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Nav',
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      user: 'user'
    })
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<template>
<div>
  <nav id="nav" v-if="isLoggedIn">
    <router-link to="/"><i class="fas fa-home"></i>Accueil</router-link> |
    <router-link :to="{ name: 'Profile', params: { username: user.username } }"><i class="fas fa-user"></i>Mon Profil</router-link> |
    <router-link :to="{ name: 'Logout' }"><i class="fas fa-sign-out-alt"></i>Déconnexion</router-link>
  </nav>
  <nav id="nav" v-else>
    <router-link to="/"><i class="fas fa-home"></i>Accueil</router-link> |
    <router-link to="/login"><i class="fas fa-sign-in-alt"></i>Connexion</router-link>
  </nav>
</div>
</template>

<style lang="sass" scoped>
#nav
  i
    margin-right: 5px
  a
    text-decoration: none
    font-weight: bold
    color: hsl(10, 99%, 50%)
    &.router-link-exact-active
      text-decoration: underline
    &:hover
      color: hsl(10, 99%, 40%)
</style>