<template>
<div :id="id" class="post" @click="navigate($event)">
  <div v-if="user.admin || user.username === author" class="post__delete" @mouseover="hovered = 'delete'" @mouseleave="hovered = 'post'" :class="{ forDeletion: deletePopup }">
    <div class="post__delete__background" @click="deletePopup = false"></div>
    <div class="post__delete__popup">
      <h2 class="post__delete__popup__title">Confirmer la suppression ?</h2>
      <p class="post__delete__popup__error">{{ errorMessage }}</p>
      <div class="post__delete__popup__choices">
        <p class="post__delete__popup__choices__no" @click="deletePopup = false">Non</p>
        <p class="post__delete__popup__choices__yes" @click="deletePost(id)">Oui</p>
      </div>
    </div>
  </div>
  <div class="post__info">
    <p class="post__info__author" @mouseover="hovered = 'author'" @mouseleave="hovered = 'post'">{{ author }}</p>
    <p class="post__info__date">{{ ' - ' + createdAt }}</p>
  </div>
  <h2 class="post__title">{{ title }}</h2>
  <p v-if="description" class="post__description" :class="{ blur: $route.name === 'Home' }">{{ description }}</p>
  <div v-if="media" class="post__media">
    <img v-if="mediaType === 'image'" :id="id + '__img'" class="post__media__img" @mouseover="hovered = 'image'" @mouseleave="hovered = 'post'">
    <video v-else :id="id + '__video'" class="post__media__video" @mouseover="hovered = 'video'" @mouseleave="hovered = 'post'" controls></video>
  </div>
  <div class="post__options">
    <button class="post__options__upvote" :class="{ liked: upvotes.find(elem => elem.postid === id) }" @mouseover="hovered = 'vote'" @mouseleave="hovered = 'post'">{{ nbUpvote }}<i class="fas fa-thumbs-up"></i>Upvote</button>
    <button class="post__options__comment" @mouseover="hovered = 'comment'" @mouseleave="hovered = 'post'">{{ nbComment }}<i class="fas fa-comment"></i>Commenter</button>
    <button class="post__options__share" @mouseover="hovered = 'share'" @mouseleave="hovered = 'post'"><i class="fas fa-share"></i>Partager</button>
    <button v-if="user.admin || user.username === author" class="post__delete__button" @mouseover="hovered = 'delete'" @mouseleave="hovered = 'post'" @click="deletePopup = true"><i class="fas fa-trash-alt"></i>Supprimer</button>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Post',
  props: {
    id: Number,
    author: String,
    title: String,
    description: String,
    media: String,
    createdAt: String
  },
  data() {
    return {
      hovered: 'post',
      mediaType: '',
      nbUpvote: 0,
      nbComment: 0,
      deletePopup: false,
      errorMessage: '',
      functions: {
        'post': this.goToPost,
        'author': this.goToProfile,
        'vote': this.useVote,
        'comment': this.goToPost,
        'share': this.useShare,
        'image': this.openImage
      },
      videoMimeType: {
        'avi': 'video/x-msvideo',
        'mp4': 'video/mp4',
        'mpeg': 'video/mpeg',
        'ogv': 'video/ogg',
        'ts': 'video/mp2t',
        'webm': 'video/webm',
        '3gp': 'video/3gpp',
        '3g2': 'video/3gpp2'
      }
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user',
      upvotes: 'upvotes',
      isLoggedIn: 'isLoggedIn'
    }),
    postUrl() {
      return document.location.href + 'post/' + this.id
    }
  },
  methods: {
    ...mapActions(['addUpvote', 'deleteUpvote']),
    async deletePost(id) {
      try {
        const deleteRequestSettings = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
        const res = await fetch(`${this.apiURL}/post/${id}`, deleteRequestSettings)
        if (res.ok) {
          if (this.$route.name === 'Home') {
            this.$emit('remove_post', id)
            const post = document.getElementById(id)
            post.parentElement.removeChild(post)
            return
          }
          this.errorMessage = 'Suppression du post effectuée.'
          return setTimeout(async () => {
            try {
              await this.$router.push({ name: 'Home' })
            }
            catch {
              return
            }
          }, 1250)
        }
        else {
          const json = await res.json()
          return this.errorMessage = json.error
        }
      }
      catch {
        return this.errorMessage = 'Error when deleting post.'
      }
    },
    navigate(event) {
      if (this.hovered !== 'delete' && this.hovered !== 'video') {
        this.functions[this.hovered](event)
      }
    },
    async goToPost() {
      try {
        await this.$router.push({ name: 'Post', params: { id: this.id } })
      }
      catch {
        return
      }
    },
    async goToProfile() {
      try {
        await this.$router.push({ name: 'Profile', params: { username: this.author } })
      }
      catch {
        return
      }
    },
    async useVote() {
      if (!this.isLoggedIn) {
        return
      }
      var action
      if (this.upvotes.find(elem => elem.postid === this.id)) {
        action = 'delete'
      }
      else {
        action = 'add'
      }
      try {
        const method = action === 'delete' ? 'DELETE' : 'POST'
        const voteRequestSettings = {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            author: this.author
          })
        }
        const res = await fetch(`${this.apiURL}/upvote/${action}/${this.id}`, voteRequestSettings)
        if (res.ok) {
          action === 'delete' ? this.deleteUpvote(this.id) && this.nbUpvote-- : this.addUpvote(this.id) && this.nbUpvote++
        }
      }
      catch {
        return
      }
    },
    useShare(event) {
      navigator.clipboard.writeText(this.postUrl)
      const copied = document.createElement('span')
      copied.innerHTML = 'Lien copié !'
      copied.style.userSelect = 'none'
      copied.style.position = 'fixed'
      copied.style.top = `${event.y}px`
      copied.style.left = `${event.x}px`
      copied.style.padding = '10px'
      copied.style.backgroundColor = 'rgba(0, 0, 0, .5)'
      document.body.appendChild(copied)
      setTimeout(() => {
        document.body.removeChild(copied)
      }, 750)
    },
    openImage() {
      window.open(this.media, '_blank')
    }
  },
  async created() {
    try {
      const upvotesRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/upvote/post/${this.id}`, upvotesRequestSettings)
      const nbUpvote = await res.json()
      if (res.ok) {
        this.nbUpvote = nbUpvote
      }
      const commentsRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res2 = await fetch(`${this.apiURL}/comment/post/${this.id}`, commentsRequestSettings)
      const nbComment = await res2.json()
      if (res2.ok) {
        this.nbComment = nbComment.length
      }
    }
    catch {
      return
    }
  },
  beforeMount() {
    if (this.media) {
      const imagesExt = ['jpg', 'png', 'gif']
      const mediaExt = this.media.split('.').pop()
      if (imagesExt.includes(mediaExt)) {
        this.mediaType = 'image'
      }
      else {
        this.mediaType = 'video'
      }
    }
  },
  mounted() {
    if (this.media) {
      const mediaExt = this.media.split('.').pop()
      if (this.mediaType === 'image') {
        const container = document.getElementById(this.id + '__img')
        container.src = this.media
        container.alt = this.media
      }
      else {
        const container = document.getElementById(this.id + '__video')
        container.src = this.media
        container.type = `${this.videoMimeType[mediaExt]}`
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.post
  position: relative
  cursor: pointer
  padding: 10px 5px
  margin-bottom: 50px
  border: 1px solid hsl(10, 99%, 50%)
  border-radius: 10px
  overflow: hidden
  &:hover
    box-shadow: 0 0 7.5px hsl(10, 99%, 50%)
  &__info
    display: flex
    align-items: flex-end
    &__author
      margin: 0 5px 0 0
      font-weight: bold
      &:hover
        text-decoration: underline
    &__date
      margin: 0
      font-size: .75em
      align-self: center
  &__title
    text-align: left
    font-size: 1.2em
  &__description
    max-height: 250px
    text-align: left
    overflow: hidden
    &.blur
      mask-image: linear-gradient(180deg, #000 60%, transparent)
  &__media
    > *
      max-height: 25%
      max-width: 50%
  &__options
    margin-top: 25px
    display: flex
    align-items: center
    .liked
      color: hsl(10, 99%, 50%)
    > *
      padding: 5px
      border: none
      border-radius: 3px
      cursor: pointer
      background-color: transparent
      font-size: 1em
      &:hover
        background-color: rgba(135, 138, 140, .2)
    i
      margin: 0 5px
    &__share:active
      color: hsl(10, 99%, 50%)
  &__delete
    z-index: 2
    width: 100%
    height: 100%
    position: fixed
    top: 0
    left: 0
    display: none
    &__button:hover
      background-color: red
      color: white
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
.forDeletion
  display: inherit

@media screen and (max-width: 768px)
  .post__options
    height: 50%

  .post__delete__popup
    width: 95%
</style>