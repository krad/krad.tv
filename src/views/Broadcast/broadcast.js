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
    }
  }

  componentDidMount() {
    this.setState({loading: true})
    client.get('/broadcasts/'+this.props.broadcastId)
    .then(res => {
      this.setState({loading: false, error: undefined, broadcast: res.data})
    }).catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  render() {    console.log(this.state.error);
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
          <div className='left-section'>
            <Video {...stream} />
          </div>

          <div className='right-section'>
            <BroadcastInfo {...this.props} {...broadcast} />
          </div>
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
