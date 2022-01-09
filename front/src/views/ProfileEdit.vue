<template>
<main id="profile__edit">
  <div class="modify">
    <section class="modify__image">
      <img class="modify__image__pfp" :src="pfp" :alt="`Photo de profil de ${username}`">
      <input type="file" class="modify__image__new" name="newpfp" accept="image/jpg, image/jpeg, image/png">
    </section>
    <span class="modify__separation"></span>
    <div action="javascript:void(0);" method="post" class="modify__inputs">
      <div class="modify__inputs__inputline">
        <input v-on:keyup.enter="modify()" v-model="firstName" :class="{ validInput: isFirstNameValid, invalidInput: !isFirstNameValid && firstName.length > 0 }" class="modify__inputs__inputline__firstname" type="text" name="firstName" id="firstName" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="firstName">Prénom</label>
      </div>
      <div class="modify__inputs__inputline">
        <input v-on:keyup.enter="modify()" v-model="lastName" :class="{ validInput: isLastNameValid, invalidInput: !isLastNameValid && lastName.length > 0 }" class="modify__inputs__inputline__lastname" type="text" name="lastName" id="lastName" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="lastName">Nom</label>
      </div>
      <div class="modify__inputs__inputline">
        <input v-on:keyup.enter="modify()" v-model="username" :class="{ validInput: isUsernameValid, invalidInput: !isUsernameValid && username.length > 0 }" class="modify__inputs__inputline__username" type="text" name="username" id="username" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="username">Nom d'utilisateur</label>
      </div>
      <div class="modify__inputs__inputline">
        <input v-on:keyup.enter="modify()" v-model="email" :class="{ validInput: isEmailValid, invalidInput: !isEmailValid && email.length > 0 }" class="modify__inputs__inputline__email" type="email" name="email" id="email" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="email">Mail</label>
      </div>
      <div class="modify__inputs__inputline">
        <input v-on:keyup.enter="modify()" v-model="password" :class="{ validInput: isPasswordValid, invalidInput: !isPasswordValid && password.length > 0 }" class="modify__inputs__inputline__password" type="password" name="password" id="password" placeholder="ﾠ" autocomplete="off" required>
        <label class="label" for="password">Mot de passe</label>
      </div>
      <div v-if="user.admin" class="modify__inputs__inputline__admin">
        <label class="label" for="admin">Administrateur</label>
        <input v-model="admin" type="checkbox" name="admin" id="admin" required>
      </div>
    </div>
  </div>
  <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
  <section class="options">
    <button class="options__save" @click="modify()">Enregistrer</button>
  </section>
</main>
</template>

<script>
const zxcvbn = require('zxcvbn')
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProfileEdit',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      errorMessage: 'ﾠ',
      pfp: '',
      admin: false,
      requestError: true
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user'
    }),
    isFirstNameValid() {
      const nameRegex = /^[A-zÀ-ú' -]*$/
      return this.firstName.length > 0 && this.firstName.match(nameRegex)
    },
    isLastNameValid() {
      const nameRegex = /^[A-zÀ-ú' -]*$/
      return this.lastName.length > 0 && this.lastName.match(nameRegex)
    },
    isUsernameValid() {
      const usernameRegex = /^[A-Za-z0-9_.-]*$/g
      return this.username.length > 4 && this.username.match(usernameRegex)
    },
    isEmailValid() {
      const mailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
      return this.email.length > 0 && this.email.match(mailRegex)
    },
    isPasswordValid() {
      return this.password.length > 0 && zxcvbn(this.password, [this.email, this.username, this.firstName, this.lastName]).score > 1
    }
  },
  methods: {
    ...mapActions(['setUser']),
    async modify() {
      if (!(this.isFirstNameValid && this.isLastNameValid && this.isUsernameValid && this.isEmailValid)) {
        return this.errorMessage = 'Please correct the informations.'
      }

      const img = document.querySelector('.modify__image__new').files[0]
      const pfp = new FormData()
      pfp.append('pfp', img)
      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
        password: this.password,
        admin: this.admin
      }
      pfp.append('user', JSON.stringify(user))
      const requestSettings = {
        method: 'POST',
        credentials: 'include',
        body: pfp
      }
      try {
        const res = await fetch(`${this.apiURL}/user/${this.$route.params.username}`, requestSettings)
        const json = await res.json()
        if (res.ok) {
          this.requestError = false
          this.errorMessage = json.message
          if (this.user.username === this.$route.params.username) {
            this.setUser(json.user)
          }
          await this.$router.push({ name: 'Profile', params: { username: this.username } })
        }
        this.requestError = true
        this.errorMessage = json.message
      }
      catch(err) {
        this.requestError = true
        return this.errorMessage = 'Request error.'
      }
    }
  },
  async created() {
    if (!this.user.admin && this.user.username !== this.$route.params.username)
      return await this.$router.push({ name: 'Profile', params: { username: this.$route.params.username } })
    const requestSettings = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
    try {
      const res = await fetch(`${this.apiURL}/user/${this.$route.params.username}`, requestSettings)
      const json = await res.json()
      if (res.ok) {
        this.firstName = json.firstName
        this.lastName = json.lastName
        this.username = json.username
        this.email = json.email
        this.pfp = json.pfp
        this.admin = json.admin
      }
      else {
        this.errorMessage = 'Erreur lors de la récupération des informations.'
      }
    }
    catch {
      this.errorMessage = 'Erreur lors de la récupération des informations.'
      return
    }
  }
}
</script>

<style lang="sass" scoped>
#profile__edit
  >  .modify, > .options
    margin: 0 25vw
    margin-bottom: 2.5vh
    padding: 2.5vh 2.5vw
.modify
  display: flex
  gap: 30px
  text-align: left
  border: 1px solid hsl(10, 99%, 55%)
  border-radius: 25px
  box-shadow: 0 0 20px hsl(10, 99%, 65%)
  h2
    margin-bottom: .5em
  p
    margin: 0
  &__separation
    margin: 5vh 0
    border-right: 1px solid hsl(10, 99%, 65%)
  &__image
    align-self: center
    flex: 1
    &__pfp
      max-width: 300px
      max-height: 300px
      object-fit: contain
    &__new
      margin-top: 25px
  &__inputs
    flex: 3
.options
  height: 45px
  display: flex
  justify-content: center
  gap: 30px
  &__save
    color: rgb(0, 185, 0)
    border: 2px solid rgb(0, 185, 0)
    font-size: 1.2em
    cursor: pointer
    border-radius: 50px
    background-color: transparent
    transition-property: color background-color
    transition-duration: 250ms
    &:hover
      color: white
      background-color: rgb(0, 185, 0)

.modify__inputs
  background-color: #ffffff
  margin: 25px auto
  display: flex
  flex-direction: column
  justify-content: space-evenly
  padding-top: 20px

  input[type="password"], input[type="email"], input[type="text"]
    width: 75%
    height: 30px
    border: 0
    border-bottom: 1px solid #dee0e4
    outline: none
    padding: 0 15px
    transition-property: border
    transition-duration: 200ms

    &.invalidInput
      border-bottom: 1px solid red

    &.validInput
      border-bottom: 1px solid rgb(0, 185, 0)

  &__inputline
    position: relative
    margin: 15px 0

    .label
      color: #cccccc
      position: absolute
      pointer-events: none
      top: 5px
      left: 3%
      transition: all 0.1s ease

    input:focus ~ .label,
    input:not(:focus):not(:placeholder-shown) ~ .label,
    input:not(:focus):valid ~ .label
      top: -15px
      left: 2%
      font-size: .85em
      opacity: 1
      color: #404040
    &__admin
      display: flex
      input
        accent-color: hsl(10, 99%, 50%)

.error
  color: red
  font-weight: bold

  &.validInput
    color: rgb(0, 185, 0)

@media screen and (max-width: 1024px)
  #profile__edit
    >  .modify, > .options
      margin: 0 2.5vw

  .profile__separation
      margin: 2.5vh 0

@media screen and (max-width: 768px)
  #profile__edit
    >  .modify, > .options
      margin: 0 2.5vw

  .modify
    flex-direction: column
    &__image
      display: flex
      flex-direction: column
      justify-content: center
    &__separation
      border-bottom: 1px solid hsl(10, 99%, 65%)
      margin: 0 2.5vh
    &__inputs
      margin: 0
      input[type="password"], input[type="email"], input[type="text"]
        width: 90%
</style>