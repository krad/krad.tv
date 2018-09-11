import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import MiddleBox from '../../components/MiddleBox/middle-box'
import { EmailInput, PasswordInput, validateEmail } from '../../components/AuthFields/auth-fields'
import AuthenticationService from '../../services/auth-service'
import './login.css'

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
      const email    = this.state.email
      const password = this.state.password
      AuthenticationService.login(email, password)
      .then(res => {
        this.setState({redirect: true, serverRedirect: res.url})
      }).catch(err => {
        this.setState({loading: false, error: err})
      })
    }
  }

  render() {
    if (this.state.redirect) {
      if (this.props.loginCallback) {
        this.props.loginCallback()
        return <div />
      } else {
        const { from } = this.props.location.state || { from: {pathname: this.state.serverRedirect}}
        return <Redirect to={from} />
      }
    }

    if (this.props.compact) {
      return <LoginForm onSubmit={this.handleSubmit} onChange={this.handleChange} {...this.state} />
    }

    return (
      <div>
      <MiddleBox title='Login'>
        <LoginForm
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          {...this.state} />
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

function Form(props) {
  return (
    <form className='login' action='/login' onSubmit={props.onSubmit}>
      {props.children}
    </form>
  )
}

function LoginForm(props) {
  return (
    <Form onSubmit={props.onSubmit}>
      <EmailInput onChange={props.onChange} value={props.email} />
      <PasswordInput onChange={props.onChange} value={props.password}/>
      <button
        type='submit'
        className={loadingClass(props.loading)}
        disabled={!props.ready}>
        Login
      </button>
      <p className='help is-danger has-text-centered'>{props.error}</p>
    </Form>
  )
}

export default Login
