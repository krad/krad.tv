import React, { Component } from 'react'
import AuthenticationService from '../../services/auth-service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './header.css'

export default class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: AuthenticationService.isLoggedIn,
      user: AuthenticationService.user,
      showMenu: false
    }

    this.handleAuthChange   = this.handleAuthChange.bind(this)
    this.handleBurgerClick  = this.handleBurgerClick.bind(this)
  }

  componentDidMount() {
    AuthenticationService.addObserver(this.handleAuthChange)
  }

  componentWillUnmount() {
    AuthenticationService.removeObserver(this.handleAuthChange)
  }

  handleAuthChange() {
    this.setState({
      isLoggedIn: AuthenticationService.isLoggedIn,
      user: AuthenticationService.user
    })
  }

  handleBurgerClick() {
    this.setState({showMenu: !this.state.showMenu})
  }

  render() {
    return (
      <nav className='navbar is-fixed-top is-transparent'>
        <LeftSection {...this.state} burgerToggle={this.handleBurgerClick}/>
        <NavbarMenu {...this.state} />
      </nav>
    )
  }
}

const navbarMenuClass = (props) => {
  if (props.showMenu) {
    return 'navbar-menu is-active'
  }
  return 'navbar-menu'
}

function LeftSection(props) {
  return (
    <div className='navbar-brand is-expanded'>
      <a href='/' className='navbar-item is-transparent'>
        <img src='/krad.png' alt='krad.tv - pretty far out radical stuff'/>
      </a>
      <SearchSection />
      <div className={burgerMenuClass(props)} aria-expanded='false' onClick={props.burgerToggle}>
        <span aria-hidden='true'></span>
        <span aria-hidden='true'></span>
        <span aria-hidden='true'></span>
      </div>
    </div>
  )
}

const burgerMenuClass = (props) => {
  if (props.showMenu) {
    return 'navbar-burger is-active'
  }
  return 'navbar-burger'
}

function SearchSection(props) {
  return (
    <div className='navbar-item search-item'>
      <div className='field has-addons search-field'>
        <div className='control has-icons-left is-expanded'>
          <input type='text' className='input is-small' placeholder='' />
          <span className='icon is-small is-left'>
            <FontAwesomeIcon icon='search' />
          </span>
        </div>
        <div className='control'>
          <a className='button is-small'>Search</a>
        </div>
      </div>
    </div>
  )
}

function NavbarMenu(props) {
  return (
    <div className={navbarMenuClass(props)}>
      <div className='navbar-start'></div>
      <div className='navbar-end'>
        <RightSection {...props} />
      </div>
    </div>
  )
}

function RightSection(props) {
  if (props.isLoggedIn) {
    return (<AuthenticatedRightSection {...props} />)
  } else {
    return (<UnauthenticatedRightSection {...props} />)
  }
}

function AuthenticatedRightSection(props) {
  const user = props.user
  const profileImage = user.profileImage || '/User.png'
  return (
    <div className='navbar-item has-dropdown is-hoverable'>
      <a className='navbar-link'>
        <div className='media'>
          <div className='media-left'>
            <img src={profileImage} className='rounded level-item' alt={[user.username, 'profile image'].join(' ')} />
          </div>
          <div className='media-content'>
            <span className='content'>
              <p className='title is-6 user-fullname'>{user.name}</p>
              <p className='subtitle is-7 user-username'>{user.username}</p>
            </span>
          </div>
        </div>
      </a>

      <div className='navbar-dropdown'>
        <a className='navbar-item' href='/profile'>Manage Profile</a>
        <hr className='navbar-divider' />
        <a className='navbar-item' href='/logout'>Logout</a>
      </div>
    </div>
  )
}

function UnauthenticatedRightSection(props) {
  return (
    <div className="navbar-item">
        <div className="field is-grouped">
          <RightSectionControl title='Signup' path='/signup' className='button' />
          <RightSectionControl title='Login' path='/login' className='button' />
        </div>
    </div>
  )
}

function RightSectionControl(props) {
  return (
    <p className='control'>
      <a href={props.path} className={props.className}>
        <span>{props.title}</span>
      </a>
    </p>
  )
}
