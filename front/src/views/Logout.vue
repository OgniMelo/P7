<template>
<main id="logout">
</main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Logout',
  computed: {
    ...mapState({
      apiURL: 'apiURL'
    })
  },
  methods: {
    ...mapActions(['changeLoginState', 'setUser', 'logout'])
  },
  async created() {
    try {
      const requestSettings = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/auth/logout`, requestSettings)
      if (res.ok) {
        this.changeLoginState(false)
        this.setUser({})
        return this.$router.push({ name: 'Login' })
      }
    }
    catch {
      return
    }
  }
}
</script>