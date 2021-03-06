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

    this.handleWindowResize = this.handleWindowResize.bind(this)
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentDidMount() {
    document.body.classList.remove('has-navbar-fixed-top')
    document.getElementsByTagName('nav')[0].classList.remove('is-fixed-top')

    this.setState({loading: true})
    client.get('/broadcasts/'+this.props.broadcastId)
    .then(res => {
      this.setState({loading: false, error: undefined, broadcast: res.data})
    }).catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  componentWillUnmount() {
    document.body.classList.add('has-navbar-fixed-top')
    document.getElementsByTagName('nav')[0].classList.add('is-fixed-top')
  }

  handleWindowResize() {
    /// Here to ensure that flex ALWAYS extends
    this.setState({resize: Date.now()})
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
        <div className='player-set-top' style={{maxHeight: `${window.innerHeight-52}px`, minHeight: `${window.innerHeight-52}px`}}>
          <div className='player-section'>
            <Video {...stream} />
          </div>

          <BroadcastInfo {...this.props} {...broadcast} />
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
