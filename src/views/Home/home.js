import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import LoadingIndicator from '../../components/Loaders/bubbles'
import { makeTimeCode } from '@krad/plainview'
import client from '../../network/client'
import moment from 'moment'
import './home.css'


export default class Home extends Component {

  constructor(props) {
    super(props)
    // console.log(process.env.REACT_APP_KRAD_API_BASE_PATH);
    this.state = {loading: false }
  }

  componentDidMount() {
    this.setState({loading: true})
    client.get('/broadcasts')
    .then(res => {
      this.setState(Object.assign({loading: false, error: undefined}, res.data))
    })
    .catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }

    if (this.state.error) {
      return <ErrorMessage error={this.state.error} />
    }

    if (this.state.broadcasts) {
        return <BroadcastList broadcasts={this.state.broadcasts} />
    }

    return <EmptyMessage />
  }
}

function BroadcastList(props) {
  return (
    <section className='section'>
      <div className='container'>
        <div className='columns is-multiline'>
          {props.broadcasts.map(broadcast => <BroadcastCard key={broadcast.id} {...broadcast} />)}
        </div>
      </div>
    </section>
  )
}

function BroadcastCard(props) {
  return (
    <div className='column is-one-third'>
      <div className='card bm--card-equal-height'>
        <BroadcastPoster {...props} />
        <BroadcastInfo {...props} />
      </div>
    </div>
  )
}

function BroadcastPoster(props) {
  const stream        = props.stream || {}
  const previewImage  = stream.thumbnail || '/colorbars.jpg'

  const url           = '/watch/' + props.id
  return (
    <div className='card-image'>
      <figure className='image is-16by9'>
        <Link to={url}>
          <img className='preview-img' src={previewImage} alt='stream preview'/>
        </Link>
      </figure>
      <BroadcastTimeCode {...props.stream} />
    </div>
  )
}

function BroadcastInfo(props) {
  return (
    <div className='card-content'>
      <BroadcastDetails {...props} />
    </div>
  )
}

function BroadcastTimeCode(props) {
  let timecode = '00:00'

  if (props.duration) {
    timecode = makeTimeCode(props.duration)
  }


  if (props.type.toLowerCase() === 'live') {
    timecode = <BroadcastTimeCodeLive {...props} />

  }

  return (
    <span className='is-overlay preview-time-wrapper'>
      <span className='preview-time-info'>{timecode}</span>
    </span>
  )
}

function BroadcastTimeCodeLive(props) {
  return (
    <span className='live-time-code'>
      <span><i className="live-icon fas fa-circle"/></span>
      <span>LIVE</span>
    </span>
  )
}

function BroadcastDetails(props) {
  const title         = props.title
  const broadcastURL  = '/watch/' + props.id
  const user          = props.user
  const channelURL    = '/channel/' + user.username
  const avatar        = user.profileImage || '/User.png'
  const userAlt       = [user.username, "'s profile image'"].join('')

  return (
    <div className='media broadcast-details'>
      <div className='media-left'>
        <figure className='image is-48x48 is-1by1'>
          <Link to={channelURL}>
            <img className='profile-img' src={avatar} alt={userAlt}/>
          </Link>
        </figure>
      </div>

      <div className='media-content'>
          <p className='broadcast-title title is-6 is-size-6-mobile is-size-7-tablet is-size-6-desktop'>
            <Link to={broadcastURL}>{title}</Link>
          </p>
          <p className='subtitle is-7 user-subtitle'>
            <span>
              <Link to={channelURL}>@{user.username}</Link>
            </span>
            <br />
            <BroadcastStats {...props}/>
          </p>
      </div>
    </div>
  )
}

function BroadcastStats(props) {
  let createdAt = moment(props.createdAt).fromNow()

  return (
    <span className='subtitle is-7'>
      112k views &bull; {createdAt}
    </span>
  )
}

function EmptyMessage() {
  return (
    <section className='section'>
      <div className='container'>
        <h1 className='title'>No Broadcasts Found</h1>
        <h3 className='subtitle'>Please try again...</h3>
      </div>
    </section>
  )
}

function ErrorMessage(props) {
  return (
    <section className='section'>
      <h1 className='title'>Something went wrong.</h1>
      <h3 className='subtitle'>Ooohhh noooooo!!!</h3>
    </section>
  )
}
