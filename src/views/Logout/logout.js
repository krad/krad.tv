import React, { Component } from 'react'
import LoadingIndicator from '../../components/Loaders/bubbles'
import client from '../../network/client'

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount() {
    client.post('/logout', {})
    .then(_ => {
      window.localStorage.removeItem('user')
      this.props.history.push('/')
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
