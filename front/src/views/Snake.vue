<template>
<main class="snake">
	<button @click="startGame()" id="startButton" type="button">Jouer !</button>
	<div class="grid"></div>
	<p id="score">Score: {{ score }}</p>
</main>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Snake',
  data() {
    return {
      btnStart: undefined,
      grid: undefined,
      score: 0,
      baseSpeed: 180,
      speed: 0,
      playerCurrentIndex: 777,
      direction: 'r',
      player: [],
      updatePosition: undefined,
      width: 40,
      squares: [],
      layout: [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
      ],
    }
  },
  computed: {
    ...mapState({
      apiURL: 'apiURL',
      user: 'user'
    })
  },
  methods: {
    createBoard() {
      for (let i=0; i < this.layout.length; i++) {
        this.squares.pop()
        if (this.grid.childNodes.length > 0)
          this.grid.removeChild(this.grid.childNodes[0])
      }
      for (let i=0; i < this.layout.length; i++) {
        const square = document.createElement('div')
        this.grid.appendChild(square)
        this.squares.push(square)

        if (this.layout[i] === 0) {
          this.squares[i].classList.add('wall')
        }
        else if (this.layout[i] === 1) {
          this.squares[i].classList.add('empty')
        }
      }
    },
    erasePlayer() {
      this.player.forEach(member => {
        this.squares[member].classList.remove('player')
      })
    },
    drawPlayer() {
      this.player.forEach(member => {
        this.squares[member].classList.add('player')
      })
    },
    spawnApple() {
      let rand = 0
      do {
        rand = Math.floor(Math.random() * this.width * this.width)
      } while (this.squares[rand].classList.contains('wall') || this.squares[rand].classList.contains('player'))
      this.squares[rand].classList.add('apple')
    },
    eatApple(applePosition) {
      this.score += 1
      this.speed -= this.baseSpeed / (this.width * this.width - this.width * 4)
      this.player.push(this.player[this.player.length - 1])
      this.squares[applePosition].classList.remove('apple')
      this.spawnApple()
      clearInterval(this.updatePosition)
      this.updatePosition = setInterval(this.move, this.speed)
    },
    gameOver() {
      clearInterval(this.updatePosition)
      if (this.user.username) {
        this.saveScore()
      }
      this.btnStart.disabled = false
      this.btnStart.style.visibility = 'visible'
    },
    move() {
      this.erasePlayer()
      let newIndex
      let tmp
      switch (this.direction) {
        case 'l':
          newIndex = this.playerCurrentIndex - 1
          break;
        case 'r':
          newIndex = this.playerCurrentIndex + 1
          break;
        case 'u':
          newIndex = this.playerCurrentIndex - this.width
          break;
        case 'd':
          newIndex = this.playerCurrentIndex + this.width
          break;
      }

      if (this.squares[newIndex].classList.contains('wall') || this.player.find(index => index === newIndex) === newIndex)
        this.gameOver()
      else if (this.squares[newIndex].classList.contains('apple'))
        this.eatApple(newIndex)

      this.playerCurrentIndex = newIndex

      for (let i=0; i < this.player.length; i++) {
        tmp = this.player[i]
        this.player[i] = newIndex
        newIndex = tmp
      }
      this.drawPlayer()
    },
    initVariables() {
      this.score = 0
      this.speed = this.baseSpeed + 100
      this.playerCurrentIndex = 777
      this.direction = 'r'
      this.player = []
      this.player.push(this.playerCurrentIndex)
      this.player.push(this.playerCurrentIndex - 1)
      this.player.push(this.playerCurrentIndex - 2)
    },
    startGame() {
      this.btnStart.disabled = true
      this.btnStart.style.visibility = 'hidden'

      this.initVariables()
      this.createBoard()
      this.drawPlayer()
      this.spawnApple()

      this.updatePosition = setInterval(this.move, this.speed)
    },
    changeDirection(e) {
      switch(e.keyCode) {
        case 37: //Arrow Left
          this.direction = 'l'
          e.preventDefault()
          break
        case 38: //Arrow Up
          this.direction = 'u'
          e.preventDefault()
          break
        case 39: //Arrow Right
          this.direction = 'r'
          e.preventDefault()
          break
        case 40: //Arrow Down
          this.direction = 'd'
          e.preventDefault()
          break
        case 32: //Space
          break
      }
    },
    async saveScore() {
      const requestSettings = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          game: 'Snake',
          score: this.score
        })
      }
      try {
        await fetch(`${this.apiURL}/score/${this.user.username}`, requestSettings)
      }
      catch (err) {
        return console.error(err)
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.changeDirection)
    this.btnStart = document.getElementById('startButton');
    this.grid = document.querySelector('.grid')
  }
}
</script>

<style lang="sass">
.grid
  margin: auto
  display: flex
  flex-wrap: wrap
  border: solid black
  width: 60vh
  height: 60vh

.grid div
  width: 1.5vh
  height: 1.5vh

.wall
  background-color: black

.empty
  background-color: brown

.apple
  background-color: red

.player
  background-color: lime

#startButton
  margin: 5px auto
  border-radius: 10px
  font-size: 1.5em
  border: 2px solid hsl(10, 99%, 55%)
  background-color: transparent
  color: hsl(10, 99%, 55%)
  height: 45px
  cursor: pointer
  &:hover
    background-color: hsl(10, 99%, 55%)
    color: white

#score
  margin: 5px auto
  font-size: 1.5em
  text-align: center
  font-weight: bold
  color: red
</style>