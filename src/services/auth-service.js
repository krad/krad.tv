import client from '../network/client'

const AuthenticationService = {
  isLoggedIn: false,

  login: (email, password) => {
    let self = this
    return new Promise((resolve, reject) => {
      client.post('/login', {email: email, password: password})
      .then(res => {
        handleAuthSuccess(res, self, resolve)
      }).catch(err => {
        handleAuthFailure(err, self, reject)
      })
    })
  },

  signup: (email, username, password, passwordConfirmation) => {
    let self = this
    return new Promise((resolve, reject) => {
      const payload = {
        email: email,
        username: username,
        password: password,
        passwordConfirmation: passwordConfirmation
      }
      client.post('/signup', payload)
      .then(res => {
        handleAuthSuccess(res, self, resolve)
      }).catch(err => {
        handleAuthFailure(err, self, reject)
      })
    })
  },

  logout: () => {
    let self = this
    return new Promise((resolve, reject) => {
      client.post('/logout', {})
      .then(_ => {
        self.isLoggedIn = false
        self.user       = undefined
        window.localStorage.removeItem('user')
        resolve({url: '/'})
      }).catch(err => {
        reject(err)
      })
    })
  }

}

const handleAuthSuccess = (res, self, resolve) => {
  const user       = res.data
  const userString = JSON.stringify(user)
  window.localStorage.setItem('user', userString)
  self.isLoggedIn  = true
  self.user        = user
  resolve({user: self.user, url: res.headers.location})
}

const handleAuthFailure = (err, self, reject) => {
  let msg
  if (err.data && err.data.error) { msg = err.data.error }
  else { msg = 'Something went wrong '}
  self.user       = undefined
  self.isLoggedIn = false
  reject(msg)
}

export default AuthenticationService
