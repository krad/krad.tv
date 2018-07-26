import React, { Component } from 'react';
// import LoadingIndicator from '../../components/Loaders/bubbles'

export default class ManageProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false, user: undefined}
  }

  render() {
    return (
      <div className='manage-profile'>
        <h1>Manage Profile</h1>
      </div>
    )
  }
}
