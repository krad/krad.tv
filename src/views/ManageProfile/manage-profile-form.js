import React, { Component } from 'react';
import { NameInput, PasswordInput } from '../../components/AuthFields/auth-fields'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 2000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

class ManageProfileForm extends Component {

  constructor(props) {
    super(props)
    this.state        = {loading: false, ...props.user}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const name  = e.target.name
    const value = e.target.value
    this.setState({[name]: value})
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({loading: true})
    console.log(this.props.user);
    let payload = { name: this.state.name }
    instance.post('/profile', payload).then(res => {
      this.setState({loading: false})
      window.localStorage.setItem('user', JSON.stringify(res.data))
    }).catch(err => {
      let msg
      if (err.data && err.data.error) { msg = err.data.error }
      else { msg = 'Something went wrong '}
      this.setState({loading: false, error: msg})
    })
  }

  render() {
    return (
      <UpdateProfileForm onSubmit={this.handleSubmit}>
        <NameInput onChange={this.handleChange} value={this.state.name} />
        <PasswordInput onChange={this.handleChange} label='Change Password' />
        <PasswordInput onChange={this.handleChange} label='Confirm Password' name='confirm_password' />
        <button
          type='submit'
          className={loadingClass(this.state.loading)}>
          Update Profile
        </button>
      </UpdateProfileForm>
    )
  }

}

function UpdateProfileForm(props) {
  return (
    <form className='update-profile' action='/profile' onSubmit={props.onSubmit}>
      {props.children}
    </form>
  )
}

const loadingClass = (loading) => {
  if (loading) {
    return "button is-dark is-pulled-right is-loading"
  } else {
    return "button is-dark is-pulled-right"
  }
}

export default ManageProfileForm
