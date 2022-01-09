<template>
<main id="posts" class="posts">
  <div class="error">{{ errorMessage }}</div>
  <div v-if="isLoggedIn" class="posts__new">
    <router-link :to="{ name: 'PostCreation' }" class="posts__new__link">+ Créer un nouveau post</router-link>
  </div>
  <Post v-for="post in posts"
  v-on:remove_post="removePost"
  :key="post.id"
  :id="post.id"
  :author="post.author"
  :title="post.title"
  :description="post.description"
  :media="post.media"
  :createdAt="new Date(post.createdAt).toLocaleString().slice(0, -3).replace(',', ' -')"></Post>
</main>
</template>

<script>
import Post from '../components/Post.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    Post
  },
  data() {
    return {
      errorMessage: '',
      posts: [],
      offset: 0,
      cached: false
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: 'isLoggedIn',
      apiURL: 'apiURL',
      user: 'user',
      likes: 'likes'
    })
  },
  methods: {
    removePost(id) {
      this.posts.splice(this.posts.indexOf(this.posts.find(post => post.id === id)), 1)
    },
    async loadPosts() {
      const doc = document.documentElement
      const posts = document.getElementById('posts')

      const scrollPos = doc.scrollTop + window.innerHeight
      const postsEnd = posts?.offsetHeight - posts?.offsetTop

      if (!(scrollPos >= postsEnd)) {
        return
      }

      if (this.cached) {
        return
      }

      try {
        const postsRequestSettings = {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
        }
        const res = await fetch(`${this.apiURL}/post/offset/${this.offset}/`, postsRequestSettings)
        const posts = await res.json()
        if (res.ok) {
          if (!posts.length) {
            this.cached = true
            return
          }
          for (const post of posts) {
            if (!this.posts.find(elem => elem.id === post.id)) {
              this.posts.push(post)
            }
          }
          this.offset += posts.length
        }
        else {
          this.errorMessage = posts.error
        }
      }
      catch(err) {
        console.log(err)
        return this.errorMessage = 'Request error.'
      }
    }
  },
  async beforeMount() {
    try {
      const postsRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/post/`, postsRequestSettings)
      const posts = await res.json()
      if (res.ok) {
        this.posts = posts
        this.offset += posts.length
      }
      else {
        this.errorMessage = posts.error
      }
    }
    catch(err) {
      return this.errorMessage = 'Request error.'
    }
  },
  mounted() {
    window.onscroll = () => { this.loadPosts() }
  }
}
</script>

<style lang="sass" scoped>
.posts
  width: 50vw
  margin: 0 25vw
  &__new
    margin-bottom: 25px
    &__link
      text-decoration: none
      cursor: pointer
      background-color: transparent
      border: none
      font-size: 1.5em
      color: hsl(195, 100%, 50%)
      &:hover
        color: hsl(195, 100%, 65%)
.error
  color: red
  font-weight: bold

@media screen and (max-width: 1024px)
  .posts
    width: 95vw
    margin: 0 2.5vw
</style>