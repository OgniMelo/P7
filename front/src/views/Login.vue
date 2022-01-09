<template>
<main class="login">
  <h2>Connexion</h2>
  <form action="javascript:void(0);" method="post">
    <div class="login__inputline">
      <input v-model="email" :class="{ validInput: isEmailValid, invalidInput: !isEmailValid && email.length > 0 }" class="login__inputline__email" type="email" name="email" id="email" placeholder="ﾠ" autocomplete="off" required>
      <label class="label" for="email">Mail</label>
    </div>
    <div class="login__inputline">
      <input v-model="password" :class="{ validInput: password.length > 0 }" class="login__inputline__password" type="password" name="password" id="password" placeholder="ﾠ" autocomplete="off" required>
      <label class="label" for="password">Mot de passe</label>
    </div>
    <input @click="login()" type="submit" value="Se connecter">
  </form>
  <p id="error">{{ errorMessage }}</p>
  <div class="options">
    <router-link :to="{ name: 'Register' }">Vous n'avez pas de compte ?</router-link>
    <router-link :to="{ name: 'PasswordReset' }">Mot de passe oublié ?</router-link>
  </div>
</main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      apiURL: 'apiURL',
      user: 'user'
    }),
    isEmailValid() {
      const mailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      return this.email.match(mailRegex)
    }
  },
  methods: {
    ...mapActions(['changeLoginState', 'setUser', 'setUpvotes']),
    async login() {
      const requestSettings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      }
      try {
        const res = await fetch(`${this.apiURL}/auth/login`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.changeLoginState(true)
          this.setUser(json.user)
        }
        else {
          this.errorMessage = json.message
          return
        }
      }
      catch(err) {
        return this.errorMessage = 'Request error.'
      }
      try {
        const upvotesRequestSettings = {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
        const res = await fetch(`${this.apiURL}/upvote/user/${this.user.username}`, upvotesRequestSettings)
        const upvotes = await res.json()
        if (res.ok) {
          this.setUpvotes(upvotes)
          await this.$router.push({ name: 'Home' })
        }
      }
      catch(err) {
        return
      }
    }
  }
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none

.login
  width: 35vw
  background-color: #ffffff
  margin: auto

  h2
    text-align: center
    color: #5b6574
    font-size: 1.5em
    padding: 20px 0
    border-bottom: 1px solid #dee0e4

  form
    display: flex
    flex-direction: column
    padding-top: 20px

    input[type="password"], input[type="email"]
      width: 75%
      height: 30px
      border: none
      border-bottom: 1px solid #dee0e4
      outline: none
      padding: 0 15px
      transition-property: border
      transition-duration: 200ms

      &.invalidInput
        border-bottom: 1px solid red

      &.validInput
        border-bottom: 1px solid rgb(0, 185, 0)

    input[type="submit"]
      width: 75%
      align-self: center
      padding: 15px
      margin-top: 20px
      background-color: hsl(10, 99%, 50%)
      border: none
      cursor: pointer
      font-weight: bold
      color: #ffffff
      transition: background-color 250ms
      border-radius: 15px

      &:hover
        background-color: hsl(10, 99%, 45%)

  &__inputline
    position: relative
    margin: 15px 0

    .label
      color: #cccccc
      position: absolute
      pointer-events: none
      top: 5px
      left: 12%
      transition: all 0.1s ease

    input:focus ~ .label,
    input:not(:focus):not(:placeholder-shown) ~ .label,
    input:not(:focus):valid ~ .label
      top: -15px
      left: 11%
      font-size: .85em
      opacity: 1
      color: #404040

.options
  display: flex
  flex-direction: column
  a
    margin: 5px auto

#error
  font-weight: bold
  color: red

@media screen and (max-width: 1024px)
  .login
    width: 95vw
</style>