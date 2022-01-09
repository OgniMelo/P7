<template>
<main v-if="loaded" id="post">
  <Post
  :key="post.id"
  :id="post.id"
  :author="post.author"
  :title="post.title"
  :description="post.description"
  :media="post.media"
  :createdAt="new Date(post.createdAt).toLocaleString().slice(0, -3).replace(',', ' -')"></Post>
  <div v-if="isLoggedIn" class="post__comment">
    <textarea v-model="commentText" class="post__comment__text" name="comment" rows="10"></textarea>
    <button class="post__comment__button" @click="postComment()">Commenter</button>
  </div>
  <div v-else class="post__comment">
    <h2 class="post__comment__login">Vous devez être connecté pour pouvoir poster un commentaire.</h2>
  </div>
  <p class="error" :class="{ validInput: !requestError, invalidInput: requestError }">{{ errorMessage }}</p>
  <div class="post__commentslist">
    <PostComment v-for="comment in comments"
    v-on:remove_comment="removeComment"
    :key="comment.id"
    :id="comment.id"
    :userid="comment.userid"
    :username="comment.username"
    :text="comment.text"
    :createdAt="new Date(comment.createdAt).toLocaleString().slice(0, -3).replace(',', ' -')"></PostComment>
  </div>
</main>
</template>

<script>
import Post from '../components/Post.vue'
import PostComment from '../components/PostComment.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Post,
    PostComment
  },
  data() {
    return {
      comments: [],
      post: {},
      offset: 0,
      commentText: '',
      errorMessage: '',
      requestError: true,
      loaded: false
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      isLoggedIn: 'isLoggedIn',
      user: 'user'
    })
  },
  methods: {
    removeComment(id) {
      this.comments.splice(this.comments.indexOf(this.comments.find(comment => comment.id === id)), 1)
    },
    async postComment() {
      if (!this.commentText) {
        this.requestError = true
        return this.errorMessage = 'Le commentaire ne peut pas être vide.'
      }
      const body = {
        userid: this.user.userid,
        username: this.user.username,
        postid: this.post.id,
        text: this.commentText
      }
      try {
        const commentRequestSettings = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(body)
        }
        const res = await fetch(`${this.apiURL}/comment/post/${this.$route.params.id}`, commentRequestSettings)
        const json = await res.json()
        if (res.ok) {
          this.commentText = ''
          this.errorMessage = ''
          this.requestError = false
          this.comments.push(json.newComment)
        }
        else {
          this.requestError = true
          return this.errorMessage = json.error
        }
      }
      catch {
        this.requestError = true
        return this.errorMessage = 'Error when posting comment.'
      }
    }
  },
  async beforeMount() {
    try {
      const postRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/post/${this.$route.params.id}`, postRequestSettings)
      const post = await res.json()
      if (res.ok) {
        this.loaded = true
        this.post = post
      }
      else {
        this.$router.push({ name: 'Home' })
      }
    }
    catch {
      return
    }
    try {
      const commentsRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/comment/post/${this.$route.params.id}`, commentsRequestSettings)
      const comments = await res.json()
      if (res.ok) {
        this.comments = comments
      }
    }
    catch {
      return
    }
  }
}
</script>

<style lang="sass" scoped>
#post
  width: 50vw
  margin: 0 25vw
  display: flex
  flex-direction: column
.post
  &__description
    mask-image: linear-gradient(180deg, #000 0%, transparent)
  &__comment
    width: 100%
    display: flex
    flex-direction: column
    align-items: center
    &__text
      width: 75%
      resize: vertical
    &__button
      width: 25%
      min-width: 150px
      margin-top: 10px
      padding: 5px 0
      cursor: pointer
      border: none
      border-radius: 25px
      background-color: hsl(10, 99%, 55%)
      &:hover
        background-color: hsl(10, 99%, 60%)
  &__commentslist
    margin-top: 25px
.error
  color: red
  font-weight: bold
  &.validInput
    color: rgb(0, 185, 0)

@media screen and (max-width: 1024px)
  #post
    width: 95vw
    margin: 0 2.5vw
</style>