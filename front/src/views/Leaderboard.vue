<template>
  <main class="leaderboard">
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div class="leaderboard__games">
        <h2 v-for="game in games"
        :key="game" @click="setActiveGame($event)">{{ game }}</h2>
      </div>
      <div class="leaderboard__separation"></div>
      <div class="leaderboard__title">
        <h3>Nom d'utilisateur</h3>
        <h3>Score</h3>
      </div>
      <div class="leaderboard__score" v-for="player in players"
      :key="players.indexOf(player) + 1">
        <router-link :to="{ name: 'Profile', params: { username: player.username }}"><span>{{ player.username }}</span></router-link>
        <span>{{ player.score }}</span>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Leaderboard',
  data() {
    return {
      activeGame: undefined,
      position: 0,
      players: undefined,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      games: 'games'
    })
  },
  methods: {
    async setActiveGame(event) {
      const games = document.querySelector('.leaderboard__games')
      games.childNodes.forEach(child => {
        child.classList.remove('active')
      })
      event.target.classList.add('active')
      this.activeGame = event.target.innerHTML
      try {
        const scoresRequestSettings = {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
        const res = await fetch(`${this.apiURL}/score/game/${this.activeGame}/`, scoresRequestSettings)
        const scores = await res.json()
        if (res.ok) {
          this.errorMessage = ''
          this.players = scores.filter(score => score.game === this.activeGame).sort((a, b) => b.score - a.score)
        }
        else {
          this.errorMessage = 'Request error.'
        }
      }
      catch {
        return this.errorMessage = 'Request error.'
      }
    }
  },
  async mounted() {
    const games = document.querySelector('.leaderboard__games')
    games.firstChild.classList.add('active')
    this.activeGame = games.firstChild.innerHTML
    try {
      const scoresRequestSettings = {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      const res = await fetch(`${this.apiURL}/score/game/${this.activeGame}/`, scoresRequestSettings)
      const scores = await res.json()
      if (res.ok) {
        this.errorMessage = ''
        this.players = scores.filter(score => score.game === this.activeGame).sort((a, b) => b.score - a.score)
      }
      else {
        this.errorMessage = 'Request error.'
      }
    }
    catch {
      return this.errorMessage = 'Request error.'
    }
  }
}
</script>

<style lang="sass" scoped>
.leaderboard
  width: 50vw
  margin: auto
  padding: 2.5vh 2.5vw
  border: 2px solid hsl(10, 99%, 50%)
  border-radius: 10px
  &__games
    display: flex
    justify-content: space-around
    > *
      &:hover
        cursor: pointer
        text-decoration: underline
      &.active
        color: hsl(10, 99%, 50%)
        text-decoration: underline
  &__separation
    margin: 0 12.5vw
    border-bottom: 1px solid hsl(10, 99%, 50%)
  &__title
    display: flex
    justify-content: space-between
  &__score
    display: flex
    justify-content: space-between
    border-bottom: 1px solid hsl(10, 99%, 50%)
    &:last-child
      border: none
    > *
      margin: .5em 0
    a
      color: inherit
      text-decoration: none
      font-weight: bold
      &:hover
        text-decoration: underline
.error
  color: red
  font-weight: bold

@media screen and (max-width: 1024px)
  .leaderboard
    width: 90vw
</style>