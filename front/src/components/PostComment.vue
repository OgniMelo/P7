<template>
  <div :id="id" class="comment">
    <div v-if="user.admin || user.username === username" class="comment__delete" :class="{ forDeletion: deletePopup, notForDeletion: !deletePopup }">
      <div class="comment__delete__background" @click="deletePopup = false"></div>
      <div class="comment__delete__popup">
        <h2 class="comment__delete__popup__title">Confirmer la suppression ?</h2>
        <p class="comment__delete__popup__error">{{ errorMessage }}</p>
        <div class="comment__delete__popup__choices">
          <p class="comment__delete__popup__choices__no" @click="deletePopup = false">Non</p>
          <p class="comment__delete__popup__choices__yes" @click="deleteComment(id)">Oui</p>
        </div>
      </div>
    </div>
    <div class="comment__info">
      <p class="comment__info__author" @click="goToProfile()">{{ username }}</p>
      <p class="comment__info__date">{{ ' - ' + createdAt }}</p>
    </div>
    <p class="comment__text">{{ text }}</p>
    <button v-if="user.admin || user.username === username" class="comment__delete__button" @click="deletePopup = true">Supprimer</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PostComment',
  props: {
    id: Number,
    userid: Number,
    username: String,
    text: String,
    createdAt: String
  },
  data() {
    return {
      deletePopup: false,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user'
    })
  },
  methods: {
    async deleteComment(id) {
      try {
        const deleteRequestSettings = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            postid: this.$route.params.id
          })
        }
        const res = await fetch(`${this.apiURL}/comment/${id}`, deleteRequestSettings)
        if (res.ok) {
          this.$emit('remove_comment', id)
          const comment = document.getElementById(id)
          comment.parentElement.removeChild(comment)
          return
        }
        else {
          const json = await res.json()
          return this.errorMessage = json.error
        }
      }
      catch {
        return this.errorMessage = 'Error when deleting comment.'
      }
    },
    async goToProfile() {
      try {
        await this.$router.push({ name: 'Profile', params: { username: this.username } })
      }
      catch {
        return
      }
    },
  }
}
</script>

<style lang="sass" scoped>
.comment
  position: relative
  margin-top: 15px
  padding: 10px
  display: flex
  flex-direction: column
  &__info
    display: flex
    align-items: flex-end
    &__author
      margin-right: 5px
      font-weight: bold
      &:hover
        cursor: pointer
        text-decoration: underline
    &__date
      margin: 0
      font-size: .75em
      align-self: center
  &__text
    margin: 5px
    padding: 5px
    text-align: left
    border-left: 1px solid grey
  &__delete__button
    cursor: pointer
    align-self: flex-start
    border: none
    border-radius: 10px
    background-color: red
    color: white
    &:hover
      filter: brightness(1.2)
  &__delete
    z-index: 2
    width: 100%
    height: 100%
    position: fixed
    top: 0
    left: 0
    &__background
      width: 100%
      height: 100%
      background-color: rgba(#000, .4)
    &__popup
      width: 500px
      height: 200px
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      display: flex
      flex-direction: column
      justify-content: space-around
      border-radius: 25px
      background-color: white
      box-shadow: 0 0 25px 5px black
      &__error
        text-align: center
      &__choices
        display: flex
        justify-content: space-around
        margin: 0 125px
        *
          cursor: pointer
          border: none
          border-radius: 25px
          font-weight: bold
          font-size: 1.2em
        &__yes
          color: hsl(0, 100%, 50%)
          &:hover
            color: hsl(0, 100%, 65%)
        &__no
          color: hsl(200, 100%, 50%)
          &:hover
            color: hsl(200, 100%, 60%)
.notForDeletion
  display: none

@media screen and (max-width: 768px)
  .comment__delete__popup
    width: 95%
</style>