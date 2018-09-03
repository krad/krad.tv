import React, { Component } from 'react';
import Video from '../../components/Player/video'
import LoadingIndicator from '../../components/Loaders/bubbles'
import ErrorMessage from '../Error/error'
import VODBroadcastInfo from './broadcast-info'
import ChatBox from '../../components/Chat/chat'
import client from '../../network/client'

import './broadcast.css'

const Broadcast = ({ match }) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  return <PlayerSetTop user={user} {...match.params} />
}

export default Broadcast

class PlayerSetTop extends Component {

  constructor(props) {
    super(props)
    this.state = {
      broadcast: undefined,
      loading: false,
      playerHeight: '0px'
    }

    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidMount() {
    this.setState({loading: true})
    client.get('/broadcasts/'+this.props.broadcastId)
    .then(res => {
      this.setState({loading: false, error: undefined, broadcast: res.data})
      this.handleWindowResize()
    }).catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  handleWindowResize() {
    const player    = document.getElementsByClassName('player-wrapper')[0]
    const heightTag = `${(window.innerHeight - player.offsetHeight) - 155}px`
    this.setState({playerHeight: heightTag})
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }

    if (this.state.error) {
      return <ErrorMessage error={this.state.error} />
    }

    if (this.state.broadcast) {
      const broadcast = this.state.broadcast
      const stream    = broadcast.stream

      return (
        <div className='player-set-top'>
          <Video {...stream} />
          <BroadcastInfo {...this.props} {...broadcast} playerHeight={this.state.playerHeight}/>
        </div>
      )
    }

    return <LoadingIndicator />
  }
}

function BroadcastInfo(props) {
  const stream = props.stream

  if (stream && stream.type === 'VOD') {
    return <VODBroadcastInfo {...props} />
  } else {
    return (<ChatBox {...props} />)
  }
}
