import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header/header'

import Home from './views/Home/home'
import Broadcast from './views/Broadcast/broadcast'
import Channel from './views/Channel/channel'
import Login from './views/Login/login'
import Logout from './views/Logout/logout'
import Signup from './views/Signup/signup'
import ForgotPassword from './views/ForgotPassword/forgot-password'
import ManageProfile from './views/ManageProfile/manage-profile'
import Help from './views/help'
import Terms from './views/terms'
import Privacy from './views/privacy'
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faKey, faCheck, faEnvelope, faExclamationTriangle,
         faAddressCard, faCircle, faThumbsUp, faThumbsDown, faFlag, faUpload, faSync } from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser, faKey, faCheck, faEnvelope,
  faExclamationTriangle, faAddressCard,
  faCircle, faThumbsUp, faThumbsDown, faFlag, faUpload, faSync
)


class App extends Component {
  render() {
    return (
      <div className='app-wrapper'>
        <Header />
        <main className='container'>
        <Router>
          <Switch>
            <Route exact path ='/' component={Home} />
            <Route exact path='/watch/:broadcastId' component={Broadcast} />
            <Route exact path='/watch/:broadcastId/room/:roomId' component={Broadcast} />
            <Route path='/channel/:channelId' component={Channel} />
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
            <Route path='/signup' component={Signup} />
            <Route path='/profile' component={ManageProfile} />
            <Route path='/forgot-password' component={ForgotPassword}/>
            <Route path='/help' component={Help} />
            <Route path='/tos' component={Terms} />
            <Route path='/privacy' component={Privacy} />
          </Switch>
        </Router>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
