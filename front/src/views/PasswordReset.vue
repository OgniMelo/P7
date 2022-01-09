<template>
<main>
  <div v-if="!isReset" class="reset">
    <h2>Réinitialisation du mot de passe</h2>
    <form action="javascript:void(0);" method="post">
      <div class="reset__inputline">
        <input v-model="email" class="reset__inputline__email" type="email" name="email" id="email" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="email">Mail</label>
      </div>
      <input @click="askReset()" type="submit" value="Réinitialisation">
    </form>
    <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
    <div class="options">
      <router-link :to="{ name: 'Login' }">Vous avez déjà un compte ?</router-link>
      <router-link :to="{ name: 'Register' }">Vous n'avez pas de compte ?</router-link>
    </div>
  </div>
  <div v-else class="reset">
    <h2>Réinitialisation du mot de passe</h2>
    <form action="javascript:void(0);" method="post">
      <div class="reset__inputline">
        <input v-model="password" :class="{ validInput: isPasswordValid, invalidInput: !isPasswordValid && password.length > 0 }" class="reset__inputline__password" type="password" name="password" id="password" placeholder="ﾠ" required>
        <label class="label" for="password">Nouveau mot de passe</label>
      </div>
      <div class="reset__inputline">
        <input v-model="passwordConfirmation" class="reset__inputline__password" :class="{ validInput: passwordConfirmation.length > 0 && password === passwordConfirmation, invalidInput: passwordConfirmation.length > 0 && password !== passwordConfirmation }" type="password" name="confirmation" id="confirmation" placeholder="ﾠ" required>
        <label class="label" for="confirmation">Confirmer le mot de passe</label>
      </div>
      <input @click="reset()" type="submit" value="Réinitialisation">
    </form>
    <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
    <div class="options">
      <router-link :to="{ name: 'Login' }">Vous avez déjà un compte ?</router-link>
      <router-link :to="{ name: 'Register' }">Vous n'avez pas de compte ?</router-link>
    </div>
  </div>
</main>
</template>

<script>
const zxcvbn = require('zxcvbn')
import { mapState } from 'vuex'

export default {
  name: 'PasswordReset',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      isReset: false,
      errorMessage: '',
      requestError: true
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
    }),
    isPasswordValid() {
      return this.password.length > 0 && zxcvbn(this.password).score > 1
    }
  },
  methods: {
    async askReset() {
      if (!this.email.length) {
        return
      }
      const requestSettings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email
        })
      }
      try {
        const res = await fetch(`${this.apiURL}/auth/reset`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.requestError = false
          this.errorMessage = json.message
        }
        else {
          this.requestError = true
          this.errorMessage = json.message
          return
        }
      }
      catch(err) {
        this.requestError = true
        return this.errorMessage = 'Request error.'
      }
      this.email = ''
    },
    async reset() {
      if (!this.password.length || !this.passwordConfirmation.length) {
        return
      }
      if (!this.isPasswordValid) {
        return this.errorMessage = 'New password is not strong enough.'
      }
      const requestSettings = {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: this.$route.query.token,
          userid: this.$route.query.id,
          password: this.password
        })
      }
      try {
        const res = await fetch(`${this.apiURL}/auth/reset`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.requestError = false
          this.errorMessage = json.message
          return setTimeout(async () => {
            await this.$router.push({ name: 'Login' })
          }, 2000)
        }
        else {
          this.requestError = true
          this.errorMessage = json.message
        }
      }
      catch(err) {
        this.requestError = true
        return this.errorMessage = 'Request error.'
      }
      this.password = ''
      this.passwordConfirmation = ''
    }
  },
  mounted() {
    this.isReset = this.$route.query.token && this.$route.query.id
  }
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none

.reset
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

    input[type="password"], input[type="email"], input[type="text"]
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

.error
  color: red
  font-weight: bold

  &.validInput
    color: rgb(0, 185, 0)

@media screen and (max-width: 1024px)
  .reset
    width: 95vw
</style>