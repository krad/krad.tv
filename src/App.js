import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import AuthenticationService from './services/auth-service'
import Header from './components/Header/header'
import Home from './views/Home/home'
import Broadcast from './views/Broadcast/broadcast'
import Channel from './views/Channel/channel'
import Login from './views/Login/login'
import Logout from './views/Logout/logout'
import Signup from './views/Signup/signup'
import ForgotPassword from './views/ForgotPassword/forgot-password'
import ManageProfile from './views/ManageProfile/manage-profile'
import Submission from './views/Submission/submission'
import SearchResults from './views/Search/search'
import Contact from './views/Contact/contact'
import Help from './views/Help/help'
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faKey, faCheck, faEnvelope, faExclamationTriangle,
         faAddressCard, faCircle, faThumbsUp, faThumbsDown, faFlag,
         faUpload, faSync, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser, faKey, faCheck, faEnvelope,
  faExclamationTriangle, faAddressCard,
  faCircle, faThumbsUp, faThumbsDown, faFlag,
  faUpload, faSync, faSearch
)

class App extends Component {
  render() {
    return (
      <div>
        <Router>
        <div>
          <Header />
            <Route exact path ='/' component={Home} />
            <Route exact path='/watch/:broadcastId' component={Broadcast} />
            <Route exact path='/watch/:broadcastId/room/:roomId' component={Broadcast} />
            <Route path='/channel/:username' component={Channel} />
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
            <Route path='/signup' component={Signup} />
            <Route path='/forgot-password' component={ForgotPassword}/>
            <AuthenticatedRoute path='/profile' component={ManageProfile} />
            <AuthenticatedRoute path='/submit' component={Submission} />
            <Route exact path='/help' component={Help} />
            <Route exact path='/help/:article' component={Help} />
            <Route exact path='/contact' component={Contact} />
            <Route exact path='/search' component={SearchResults} />
          </div>
        </Router>
      </div>
    );
  }
}

const AuthenticatedRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    AuthenticationService.isLoggedIn === true ?
    <Component {...props}/> :
    <Redirect to={{pathname: '/login', state: { from: props.location } }} />
  )} />
)

export default App;
