import React, { Component } from 'react';
import MiddleBox from '../../components/MiddleBox/middle-box'
import { EmailInput, PasswordInput, validateEmail } from '../../components/AuthFields/auth-fields'
import axios from 'axios'
import './login.css'

const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 2000,
  // withCredentials: true,
  // credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

const responseInterceptor = (response) => {
  return Promise.resolve(response)
}
const errorInterceptor = (error) => Promise.reject(error.response)
instance.interceptors.response.use(responseInterceptor, errorInterceptor)


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false,
                  email:'',
                  password:'',
                  error: undefined,
                  ready: false}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const name  = e.target.name
    const value = e.target.value

    let newState = Object.assign(this.state, {[name]: value})
    if (validateEmail(newState.email) && newState.password.length > 0) {
      newState.ready = true
    } else {
      newState.ready = false
    }

    this.setState({...newState})
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.ready) {
      this.setState({loading: true})
      const payload = {
        email: this.state.email,
        password: this.state.password
      }
      instance.post('/login', payload).then(res => {
        window.localStorage.setItem('user', JSON.stringify(res.data))
        this.props.history.push(res.headers.location)
      }).catch(err => {
        let msg
        if (err.data && err.data.error) { msg = err.data.error }
        else { msg = 'Something went wrong '}
        this.setState({loading: false, error: msg})
      })

    }
  }

  render() {
    return (
      <div>
      <MiddleBox title='Login'>
        <LoginForm onSubmit={this.handleSubmit}>
          <EmailInput onChange={this.handleChange} value={this.state.email} />
          <PasswordInput onChange={this.handleChange} value={this.state.password}/>
          <button
            type='submit'
            className={loadingClass(this.state.loading)}
            disabled={!this.state.ready}>
            Login
          </button>
          <p className='help is-danger has-text-centered'>{this.state.error}</p>
        </LoginForm>
      </MiddleBox>
      <HelperLiks />
      </div>
    )
  }
}


const loadingClass = (loading) => {
  if (loading) {
    return "button is-dark is-loading"
  } else {
    return "button is-dark"
  }
}

function HelperLiks(props){
  return (
    <p className="helper-links has-text-grey has-text-centered">
      <a href='/signup'>Sign Up</a>&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href='/forgot-password'>Forgot Password</a>&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href='/help'>Help</a>
    </p>)
}

function LoginForm(props) {
  return (
    <form className='login' action='/login' onSubmit={props.onSubmit}>
      {props.children}
    </form>
  )
}

export default Login
