import React, { Component } from 'react'
import LoadingIndicator from '../../components/Loaders/bubbles'
import AuthenticationService from '../../services/auth-service'

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount() {
    AuthenticationService.logout()
    .then(res => {
      this.props.history.push(res.url)
    }).catch(err => {
      console.log(err);
    })
  }

  render () {
    if (this.state.loading) {
      return <LoadingIndicator />
    }

    return <div></div>
  }
}

export default Logout
