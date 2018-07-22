import React, { Component } from 'react'

export default class Header extends Component {

  render() {
    return (
      <nav role='navigation' className='navbar is-transparent is-fixed-top'>
        <LeftSection />
      </nav>
    )
  }

}

function LeftSection(props) {
  return (
    <div className='navbar-start'>
      <div className='navbar-brand'>
        <a href='/' className='navbar-item is-transparent'>
          <img src='krad.png' alt='krad.tv - pretty far out radical stuff'/>
        </a>
      </div>
    </div>
  )
}

function RightSection(props) {
  return (
    <div class="navbar-item">
        <div class="field is-grouped">
          <p class="control">
            <Link to='/signup' class="button is-info is-outlined">
              <span>Signup</span>
            </Link>
          </p>
          <p class="control">
            <Link to='/login' class="button is-info is-outlined">
              <span>Login</span>
            </Link>
          </p>
        </div>
    </div>
    )
}

function Link(props) {
  return (<a href={props.to}>{props.children}</a>)
}
