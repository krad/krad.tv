import React, { Component } from 'react';
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
  return (
    <div className='card-image'>
      <figure className='image is-16by9'>
        <a href={props.url}>
          <img src={props.stream.previewImage} alt='stream preview'/>
        </a>
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
  return (
    <div className='media'>
      <div className='media-content'>
        <a href={props.url}>
          <p className='title is-6'>{props.title}</p>
        </a>
      </div>
    </div>
  )
}

function UserDetails(props) {
  return (
    <div className='media'>
      <div className='media-left'>
        <figure className='image is-48x48'>
          <a href={props.links.channel}>
            <img src={props.profileImage} alt={[props.username, "profile image"].join(' ')}/>
          </a>
        </figure>
      </div>

      <div className='media-content'>
        <p><a href={props.links.channel} className='title is-6'>{props.name}</a></p>
        <p><a href={props.links.channel} className='subtitle is-6'>@{props.username}</a></p>
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
