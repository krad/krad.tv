import client from '../network/client'

let observers = []

class AuthenticationService {

  static get isLoggedIn() {
    return (this.user !== undefined && this.user !== null)
  }

  static get user() {
    return JSON.parse(window.localStorage.getItem('user'))
  }

  static login(email, password) {
    let self = this
    return new Promise((resolve, reject) => {
      client.post('/login', {email: email, password: password})
      .then(res => {
        handleAuthSuccess(res, self, resolve)
      }).catch(err => {
        handleAuthFailure(err, self, reject)
      })
    })
  }

  static signup(email, username, password, passwordConfirmation) {
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
  }

  static updateProfile(name, password, passwordConfirmation) {
    let self = this
    return new Promise((resolve, reject) => {
      let payload = {}
      if (name)     { payload.name = name }
      if (password) { payload.password = password }
      if (passwordConfirmation) { payload.passwordConfirmation = passwordConfirmation }
      client.post('/profile', payload).then(res => {
        handleAuthSuccess(res, self, resolve)
      }).catch(err => {
        handleAuthFailure(err, self, reject)
      })
    })
  }

  static uploadAvatar(avatar, config) {
    let self = this
    return new Promise((resolve, reject) => {
      client.post('/profile/avatar', avatar, config)
      .then(res => {
        self.user.profileImage = res.data.profileImage
        window.localStorage.setItem('user', JSON.stringify(self.user))
        observers.forEach(o => { o() })
        resolve({profileImage: res.data.profileImage})
      }).catch(err => {
        observers.forEach(o => { o() })
        reject(err)
      })
    })
  }

  static logout() {
    return new Promise((resolve, reject) => {
      client.post('/logout', {})
      .then(_ => {
        window.localStorage.removeItem('user')
        observers.forEach(o => { o() })
        resolve({url: '/'})
      }).catch(err => {
        reject(err)
      })
    })
  }

  static addObserver(observer) {
    observers.push(observer)
  }

  static removeObserver(observer) {
    console.log('remove observer', observer);
  }
}


const handleAuthSuccess = (res, self, resolve) => {
  const user       = res.data
  const userString = JSON.stringify(user)
  window.localStorage.setItem('user', userString)
  observers.forEach(o => { o() })
  resolve({user: self.user, url: res.headers.location})
}

const handleAuthFailure = (err, self, reject) => {
  let msg
  if (err.data && err.data.error) { msg = err.data.error }
  else { msg = 'Something went wrong '}
  window.localStorage.removeItem('user')
  observers.forEach(o => { o() })
  reject(msg)
}

export default AuthenticationService
