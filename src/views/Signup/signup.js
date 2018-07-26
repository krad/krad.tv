import React, { Component } from 'react'
import MiddleBox from '../../components/MiddleBox/middle-box'
import { UsernameField, EmailInput, PasswordInput, validateEmail } from '../../components/AuthFields/auth-fields'
import axios from 'axios'
import './signup.css'

const instance = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  timeout: 2000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

const responseInterceptor = (response) => {
  return Promise.resolve(response)
}
const errorInterceptor = (error) => Promise.reject(error.response)
instance.interceptors.response.use(responseInterceptor, errorInterceptor)


class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false,
                  email:'',
                  username:'',
                  password:'',
                  passwordConfirm: '',
                  error: undefined,
                  ready: false}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const name  = e.target.name
    const value = e.target.value

    let newState = Object.assign(this.state, {[name]: value})
    if (validateEmail(newState.email) &&
        newState.password.length > 0 &&
        newState.password === newState.passwordConfirm) {
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
        username: this.state.username,
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirm
      }
      instance.post('/signup', payload).then(res => {
          this.props.history.push(res.headers.location)
      }).catch(err => {
        let msg
        if (err.data && err.data.error) { msg = err.data.error }
        else { msg = 'Something went wrong '}
        this.setState({loading: false, error: msg, ready: false})
      })
    }
  }

  render() {
    return (
      <div>
      <MiddleBox title='Signup'>
        <SignupForm onSubmit={this.handleSubmit}>
          <EmailInput onChange={this.handleChange} value={this.state.email} />
          <UsernameField name='Username' onChange={this.handleChange} value={this.state.username} />
          <PasswordInput onChange={this.handleChange} value={this.state.password}/>
          <PasswordInput
            onChange={this.handleChange}
            value={this.state.passwordConfirm}
            label="Confirm Password"
            name="passwordConfirm"/>
          <button
            type='submit'
            className={loadingClass(this.state.loading)}
            disabled={!this.state.ready}>
            Signup
          </button>
          <p className='help is-danger has-text-centered'>{this.state.error}</p>
        </SignupForm>
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
      <a href='/login'>Login</a>&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href='/forgot-password'>Forgot Password</a>&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href='/help'>Help</a>
    </p>)
}

function SignupForm(props) {
  return (
    <form className='signup' action='/signup' onSubmit={props.onSubmit}>
      {props.children}
    </form>
  )
}

export default Signup
