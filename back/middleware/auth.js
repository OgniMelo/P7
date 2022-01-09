const jwt = require('jsonwebtoken')
const cookie = require('cookie')

module.exports = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const errorMessage = 'Unauthorized request.'
  if (!Object.entries(cookies).length) {
    return res.redirect(401, '/login')
  }

  const { access, refresh } = cookies
  const userid = getUserId(access) || getUserId(refresh)
  if (!userid) {
    return res.redirect(401, '/login')
  }
  try {
    if (!verifyToken(userid, access)) {
      throw errorMessage
    }
  }
  catch {
    try {
      if (!verifyToken(userid, refresh)) {
        throw errorMessage
      }
      else {
        const newToken = createAccessToken(userid)
        res.setHeader('Set-Cookie', [
          cookie.serialize(
            'access', newToken.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              maxAge: newToken.expiration,
              sameSite: 'strict',
              path: '/'
            }
          )
        ])
      }
    }
    catch {
      return res.redirect(401, '/login')
    }
  }
  next()
}

const createAccessToken = (userid) => {
  const accessTokenExpiration = 5 * 60 // 5min
  const accessToken = jwt.sign({ userid }, process.env.TOKEN_SECRET, { expiresIn: accessTokenExpiration })
  return { token: accessToken, expiration: accessTokenExpiration }
}

const createRefreshToken = (userid) => {
  const refreshTokenExpiration = 24 * 60 * 60 // 24h
  const refreshToken = jwt.sign({ userid }, process.env.TOKEN_SECRET, { expiresIn: refreshTokenExpiration })
  return { token: refreshToken, expiration: refreshTokenExpiration }
}

const verifyToken = (id, token) => {
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
  const { userid } = decodedToken
  return id === userid
}

const getUserId = (token) => {
  if (!token) return
  var userid
  try {
    userid = jwt.verify(token, process.env.TOKEN_SECRET).userid
  }
  catch {
    return userid
  }
  return userid
}

module.exports.createAccessToken = createAccessToken
module.exports.createRefreshToken = createRefreshToken
module.exports.verifyToken = verifyToken
module.exports.getUserId = getUserId