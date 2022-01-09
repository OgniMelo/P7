<script>
export default {
  name: 'Footer',
  computed: {
    getCurrentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<template>
<footer id="footer">
  <p id="footer__copyright">Copyright Ogniter {{ getCurrentYear }}</p>
</footer>
</template>

<style lang="sass" scoped>
#footer
  position: fixed
  bottom: 0
  width: 100%
  height: 5vh
  display: flex
  justify-content: center
  align-items: center
  background: hsl(10, 99%, 50%)
  &__copyright
    margin: 0

@media screen and (max-width: 1024px)
  #footer
    height: 2.5vh

@media screen and (max-width: 768px)
  #footer
    height: 5vh
</style>