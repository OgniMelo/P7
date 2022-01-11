import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Register from '../views/Register.vue'
import PasswordReset from '../views/PasswordReset.vue'
import Profile from '../views/Profile.vue'
import ProfileEdit from '../views/ProfileEdit.vue'
import PostCreation from '../views/PostCreation.vue'
import Post from '../views/Post.vue'
import Leaderboard from '../views/Leaderboard.vue'
import Snake from '../views/Snake.vue'
import PageNotFound from '../views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/notFound',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/passwordReset',
    name: 'PasswordReset',
    component: PasswordReset
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/user/:username',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/user/:username/edit',
    name: 'ProfileEdit',
    component: ProfileEdit,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post',
    name: 'PostCreation',
    component: PostCreation,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  {
    path: '/games/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: '/games/snake',
    name: 'Snake',
    component: Snake
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

import store from '../store/index'

router.beforeEach(async (to, from, next) => {
  store.commit('SET_SEARCH', '')
  if (!store.state.isLoggedIn)
    await autoLogin()
  if (!to.matched.length)
    return next({ name: 'PageNotFound' })
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isLoggedIn) {
      next({ name: 'Login' })
    }
    else {
      await getUsersList()
      next()
    }
  }
  else {
    if (store.state.isLoggedIn && (to.name === 'Login' || to.name === 'Register' || to.name === 'PasswordReset')) {
      await getUsersList()
      next({ name: 'Home' })
    }
    else {
      await getUsersList()
      next()
    }
  }
})

const autoLogin = async () => {
  const requestSettings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({
      autoLogin: true
    })
  }
  try {
    const res = await fetch(`${store.state.apiURL}/auth/login`, requestSettings)
    const json = await res.json()
    if (res.ok) {
      store.commit('SET_LOGIN_STATE', true)
      store.commit('SET_USER', json.user)
    }
  }
  catch (err) {
    return
  }
  try {
    const upvotesRequestSettings = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }
    const res = await fetch(`${store.state.apiURL}/upvote/user/${store.state.user.username}`, upvotesRequestSettings)
    const upvotes = await res.json()
    if (res.ok) {
      store.commit('SET_UPVOTES', upvotes)
    }
  }
  catch(err) {
    return
  }
}

const getUsersList = async () => {
  try {
    const usersRequestSettings = {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }
    const res = await fetch(`${store.state.apiURL}/user`, usersRequestSettings)
    const users = await res.json()
    if (res.ok) {
      store.commit('SET_USERS_LIST', users.sort((a, b) => a.username.localeCompare(b.username)))
    }
  }
  catch(err) {
    return
  }
}

export default router