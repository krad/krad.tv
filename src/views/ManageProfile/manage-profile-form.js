import React, { Component } from 'react';
import { NameInput, PasswordInput } from '../../components/AuthFields/auth-fields'
import AuthenticationService from '../../services/auth-service'

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
    AuthenticationService.updateProfile(this.state.name, undefined, undefined)
    .then(res => {
      this.setState({loading: false})
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <UpdateProfileForm onSubmit={this.handleSubmit}>
        <NameInput onChange={this.handleChange} value={this.state.name} />
        <PasswordInput onChange={this.handleChange} label='Change Password' />
        <PasswordInput onChange={this.handleChange} label='Confirm Password' name='confirm_password' />
        <div className='field'>
          <button
            type='submit'
            className={loadingClass(this.state.loading)}>
            Update Profile
          </button>
        </div>
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
