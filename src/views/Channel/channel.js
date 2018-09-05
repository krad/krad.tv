import React, { Component } from 'react';
import LoadingIndicator from '../../components/Loaders/bubbles'
import ErrorMessage from '../Error/error'
import client from '../../network/client'

import './channel.css'

const Channel = ({ match }) => {
  const username = match.params.username
  return <ChannelPage username={username} />
}

export default Channel


class ChannelPage extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false}
  }

  componentDidMount() {
    this.setState({loading: true})
    client.get(`/channels/${this.props.username}`).then(res => {
      this.setState({user: res.data, loading: false})
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    if (this.state.loading) { return <LoadingIndicator /> }
    if (this.state.user) {
      return(<div><Hero {...this.state.user} /></div>)
    } else {
      return(<div></div>)
    }
  }
}

function Hero(props) {
  const broadcasts     = props.broadcasts
  const broadcastCount = broadcasts.length
  return (
    <section className='hero is-white'>
      <div className='hero-body'>
        <div className='container'>
          <div className='media'>

            <div className='media-left'>
              <figure className='image is-100x100'>
                <img src='/User.png' alt='profile pic thing' />
              </figure>
            </div>

            <div className='media-content user-top-info'>
              <p className='title'>{props.name}</p>
              <p className='subtitle is-5'>@{props.username}</p>
              <p className='subtitle is-6'>{broadcastCount} broadcasts</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
