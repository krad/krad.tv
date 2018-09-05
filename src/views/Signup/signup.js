import React, { Component } from 'react'
import MiddleBox from '../../components/MiddleBox/middle-box'
import { UsernameField, EmailInput, PasswordInput, validateEmail } from '../../components/AuthFields/auth-fields'
import AuthenticationService from '../../services/auth-service'
import './signup.css'

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

      const email           = this.state.email
      const username        = this.state.username
      const password        = this.state.password
      const passwordConfirm = this.state.passwordConfirm

      AuthenticationService.signup(email, username, password, passwordConfirm)
      .then(res => {
        this.props.history.push(res.url)
      }).catch(err => {
        this.setState({loading: false, error: err, ready: false})
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
