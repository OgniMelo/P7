<template>
<main class="creation">
  <div>
    <label for="title">Titre : ({{ title.length }}/255)</label>
    <input v-model="title" class="creation__title" type="text" name="title" maxlength="255">
  </div>
  <div>
    <label for="description">Description :</label>
    <textarea v-model="description" class="creation__description" type="text" name="description" rows="10"></textarea>
  </div>
  <div>
    <label for="media">Attacher une image/vidéo :</label>
    <input type="file" class="creation__media" name="media"
    accept="image/jpg, image/jpeg, image/png, image/gif, video/x-msvideo, video/mp4, video/mpeg, video/ogg, video/mp2t, video/webm, video/3gpp, video/3gpp2">
  </div>
  <button class="creation__button" @click="createPost()">Publier</button>
  <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
</main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PostCreation',
  data() {
    return {
      title: '',
      description: '',
      media: new FormData(),
      errorMessage: '',
      requestError: false
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user'
    })
  },
  methods: {
    async createPost() {
      const media = document.querySelector('.creation__media').files[0]
      this.media = new FormData()
      this.media.append('media', media)
      const post = {
        author: this.user.username,
        title: this.title,
        description: this.description
      }
      this.media.append('post', JSON.stringify(post))
      const postRequestSettings = {
        method: 'POST',
        credentials: 'include',
        body: this.media
      }
      try {
        const res = await fetch(`${this.apiURL}/post`, postRequestSettings)
        const json = await res.json()
        if (res.ok) {
          this.requestError = false
          this.errorMessage = 'Post publié.'
          await this.$router.push({ name: 'Post', params: { id: json.postid } })
        }
        else {
          this.requestError = true
          return this.errorMessage = json.error
        }
      }
      catch {
        this.requestError = true
        return this.errorMessage = 'Error when creating post.'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.creation
  width: 50vw
  margin: 0 25vw
  display: flex
  flex-direction: column
  align-items: center
  row-gap: 20px
  > div
    width: 100%
    display: flex
    flex-direction: column
    & label
      text-align: left
      font-weight: bold
  &__description
    resize: vertical
  &__button
    font-size: 1.2em
    cursor: pointer
    border-radius: 50px
    background-color: transparent
    transition-property: color background-color
    transition-duration: 250ms
    color: hsl(195, 100%, 50%)
    border: 2px solid hsl(195, 100%, 50%)
    &:hover
      color: white
      background-color: hsl(195, 100%, 50%)
.error
  color: red
  font-weight: bold
  &.validInput
    color: rgb(0, 185, 0)

@media screen and (max-width: 1024px)
  .creation
    width: 95vw
    margin: 0 2.5vw
</style>