import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header/header'
// import Footer from './components/Footer/footer'

import Home from './views/Home/home'
import Broadcast from './views/Broadcast/broadcast'
import Login from './views/Login/login'
import Signup from './views/Signup/signup'
import ForgotPassword from './views/ForgotPassword/forgot-password'
import ManageProfile from './views/ManageProfile/manage-profile'
import Help from './views/help'
import Terms from './views/terms'
import Privacy from './views/privacy'

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <main className='container '>
        <Router>
          <Switch>
            <Route exact path ='/' component={Home} />
            <Route path='/watch/:broadcastID' component={Broadcast} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/profile' component={ManageProfile} />
            <Route path='/forgot-password' component={ForgotPassword}/>
            <Route path='/help' component={Help} />
            <Route path='/tos' component={Terms} />
            <Route path='/privacy' component={Privacy} />
          </Switch>
        </Router>
        </main>
      </div>
    );
  }
}

export default App;
