import React, {Component} from 'react';
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  timeout: 2000
})

const responseInterceptor = (response) => response
const errorInterceptor = (error) => Promise.reject(error.response)
instance.interceptors.response.use(responseInterceptor, errorInterceptor)

class UsernameField extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false, error: undefined, ready: false}
    this.bubbleChange = props.onChange
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.bubbleChange(e)
    let payload = {[e.target.name]: e.target.value}

    if (e.target.value !== '') {
      this.setState({loading: true})
      instance.post('/username', payload).then(res => {
        this.setState({loading: false, error: undefined, ready: true})
      }).catch(err => {
        this.setState({loading: false, error: err.data.error, ready: false})
      })
    } else {
      this.setState({ready: false})
    }
  }

  render() {
    let controlClassName = ['control', 'has-icons-left']
    if (this.state.loading) { controlClassName.push('is-loading') }
    if (this.state.error) { controlClassName.push('has-icons-right') }
    if (this.state.ready) { controlClassName.push('has-icons-right') }
    controlClassName = controlClassName.join(' ')

    let rightIcon = (<span></span>)
    if (this.state.ready) { rightIcon = <SuccessIcon /> }
    if (this.state.error) { rightIcon = <FailureIcon /> }

    let inputClassname = ['input']
    if (this.state.error) { inputClassname.push('is-danger') }
    if (this.state.ready) { inputClassname.push('is-success') }
    inputClassname = inputClassname.join(' ')

    let helpClass = ['help']
    if (this.state.error) { helpClass.push('is-danger') }
    if (this.state.ready) { helpClass.push('is-success') }
    helpClass = helpClass.join(' ')

    let helpMessage = ''
    if (this.state.error) { helpMessage = this.state.error }

    return (
      <div>
        <label htmlFor='username'>Username</label>
        <FormField
          className={controlClassName}
          helpClass={helpClass}
          helpMessage={helpMessage}>

          <input
            className={inputClassname}
            type='text'
            name='username'
            placeholder='radperson'
            onChange={this.handleChange}
          />
          <UserIcon />
          {rightIcon}
        </FormField>
      </div>
    )
  }
}

function TextInput(props) {
  return (
    <div>
      <label htmlFor={props.name}>{props.name}</label>
      <FormField>
        <input
          className='input'
          type='text'
          placeholder={props.placeholder}
          name={props.name}
          onChange={props.onChange}
          value={props.value} />
      </FormField>
    </div>
  )
}

function EmailInput(props) {
  return (
    <div>
      <label htmlFor='email'>Email</label>
      <FormField className='control has-icons-left'>
        <input
          className='input'
          type='email'
          name='email'
          placeholder='iam@krad.tv'
          onChange={props.onChange}
          value={props.value} />
        <EmailIcon />
      </FormField>
    </div>
  )
}

function PasswordInput(props) {
  const label = props.label || 'Password'
  const name  = props.name || 'password'
  return (
    <div>
      <label htmlFor='password'>{label}</label>
      <FormField className='control has-icons-left'>
        <input
          className='input'
          type='password'
          name={name}
          onChange={props.onChange}
          value={props.value} />

        <PasswordIcon />
      </FormField>
    </div>
  )
}

function FormField(props) {
  const controlClass  = props.className || 'control'
  const helpClass     = props.helpClass || 'help'
  const helpMessage   = props.helpMessage || ''

  return (
    <div className='field'>
      <div className={controlClass}>
        {props.children}
      </div>
      <p className={helpClass}>{helpMessage}</p>
    </div>
  )
}

function EmailIcon(props) {
  return (
    <LeftIcon>
      <i className='fas fa-envelope'></i>
    </LeftIcon>
  )
}

function UserIcon(props) {
  return (
    <LeftIcon>
      <i className='fas fa-user'></i>
    </LeftIcon>
  )
}

function PasswordIcon(props) {
  return (
    <LeftIcon>
      <i className='fas fa-key'></i>
    </LeftIcon>
  )
}

function SuccessIcon(props) {
  return (
    <RightIcon>
      <i className='fas fa-check'></i>
    </RightIcon>
  )
}

function FailureIcon(props) {
  return (
    <RightIcon>
      <i className='fas fa-exclamation-triangle'></i>
    </RightIcon>
  )
}

function LeftIcon(props) {
  return (
    <span className='icon is-small is-left'>
      {props.children}
    </span>
  )
}

function RightIcon(props) {
  return (
    <span className='icon is-small is-right'>
      {props.children}
    </span>
  )
}

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase())
}


export { TextInput, UsernameField, EmailInput, PasswordInput, validateEmail }
