import React, { Component } from 'react';
import MiddleBox from '../../components/MiddleBox/middle-box'
import { EmailInput, PasswordInput } from '../../components/AuthFields/auth-fields'
import './signup.css'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false,
                  email:'',
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
    if (validEmail(newState.email) &&
        newState.password.length > 0 &&
        newState.password == newState.passwordConfirm) {
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
    }
  }

  render() {
    return (
      <div>
      <MiddleBox title='Signup'>
        <SignupForm onSubmit={this.handleSubmit}>
          <EmailInput onChange={this.handleChange} value={this.state.email} />
          <PasswordInput onChange={this.handleChange} value={this.state.password}/>
          <PasswordInput
            onChange={this.handleChange}
            value={this.state.passwordConfirm}
            label="Confirm Password"
            name="passwordConfirm"/>
          <a
            onClick={this.handleSubmit}
            className={loadingClass(this.state.loading)}
            disabled={!this.state.ready}>
            Signup
          </a>
          <p className='help is-danger has-text-centered'>{this.state.error}</p>
        </SignupForm>
      </MiddleBox>
      <HelperLiks />
      </div>
    )
  }
}


const validEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase())
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
