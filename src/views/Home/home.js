import React, { Component } from 'react';
import {  Link } from 'react-router-dom'
import LoadingIndicator from '../../components/Loaders/bubbles'
import axios from 'axios'
import './home.css'

const instance = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  timeout: 2000,
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {loading: false }
  }

  componentDidMount() {
    this.setState({loading: true})
    instance.get('/broadcasts')
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
  const previewImage  = stream.previewImage || 'Film.png'
  const url           = '/watch/' + props.id
  return (
    <div className='card-image'>
      <figure className='image is-16by9'>
        <Link to={url}>
          <img className='previewImage' src={previewImage} alt='stream preview'/>
        </Link>
      </figure>
    </div>
  )
}

function BroadcastInfo(props) {
  return (
    <div className='card-content'>
      <UserDetails {...props.user} />
      <BroadcastDetails {...props} />
    </div>
  )
}

function BroadcastDetails(props) {
  const title = props.title
  const url   = '/watch/' + props.id
  return (
    <div className='media'>
      <div className='media-content'>
        <Link to={url}>
          <p className='broadcastTitle title is-6'>{title}</p>
        </Link>
      </div>
    </div>
  )
}

function UserDetails(props) {

  const profileImage = props.profileImage || 'User.png'

  return (
    <div className='media'>
      <div className='media-left'>
        <figure className='image is-48x48'>
          <img src={profileImage} alt={[props.username, "profile image"].join(' ')}/>
        </figure>
      </div>

      <div className='media-content'>
        <p><a className='title is-6'>{props.name}</a></p>
        <p><a className='subtitle is-6'>@{props.username}</a></p>
      </div>

    </div>
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
