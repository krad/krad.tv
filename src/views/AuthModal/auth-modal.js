import React, { Component } from 'react';
import Login from '../Login/login'
import Signup from '../Signup/signup'
import './auth-modal.css'

class AuthenticationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      form: 'login'
    }

    this.handleClose  = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)

    document.addEventListener('showAuthModal', () => {
      this.setState({isActive: true})
    })
  }

  handleClose() {
    this.setState({isActive: false})
  }

  handleToggle(e) {
    this.setState({form: e.target.innerHTML.toLowerCase()})
  }

  render() {
    let title
    let body

    const authCallback = () => {
      if (this.state.isActive) { this.setState({isActive: false}) }
    }

    if (this.state.form === 'login') {
      title = 'Login to Continue'
      body  = <Login compact={true} loginCallback={authCallback} />
    } else {
      title = 'Signup to Continue'
      body = <Signup compact={true} signupCallback={authCallback} />
    }

    return (
      <Modal isActive={this.state.isActive}>
        <ModalHeader title={title} onClose={this.handleClose} />

        <section className='modal-card-body'>
          {body}
        </section>

        <ModalFooter onToggle={this.handleToggle} {...this.state} />
      </Modal>
    )
  }
}


function Modal(props) {
  let className = 'modal'
  if (props.isActive) { className += ' is-active' }
  return (
    <div className={className}>
      <div className='modal-background'></div>
      <div className='modal-card'>
        {props.children}
      </div>
    </div>
  )
}

function ModalHeader(props) {
  return (
    <div className='modal-card-head'>
      <p className='modal-card-title'>{props.title}</p>
      <button className='delete' aria-label='close' onClick={props.onClose} />
    </div>
  )
}

function ModalFooter(props) {
  return (
    <footer className='modal-card-foot modal-footer'>
      <div className='tabs is-centered is-toggle'>
        <ul>
          <FooterLink title='Login' {...props} />
          <FooterLink title='Signup' {...props} />
        </ul>
      </div>
    </footer>
  )
}

function FooterLink(props) {
  let className = props.title.toLowerCase() === props.form ? 'is-active' : ''
  return (
    <li className={className}>
      <a onClick={props.onToggle}>{props.title}</a>
    </li>
  )
}

export default AuthenticationModal
