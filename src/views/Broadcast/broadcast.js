import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'

import Video from '../../components/Player/video'
import Comments from '../../components/Comments/comments'
import { LikeBroadcastButton, DislikeBroadcastButton, ReportBroadcastButton, SubscribeButton } from '../../components/Buttons/opinion-button'
import LoadingIndicator from '../../components/Loaders/bubbles'


const instance = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  timeout: 2000,
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

export default class Broadcast extends Component {

  constructor(props) {
    super(props)
    this.state = {broadcast: undefined, loading: false}
  }

  componentDidMount() {
    this.setState({loading: true})
    instance.get('/broadcasts/1')
    .then(res => {
      this.setState({loading: false, error: undefined, broadcast: res.data})
    }).catch(err => {
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

    const broadcast = this.state.broadcast
    return (
      <div id='watch' className='container'>
        <Video {...this.state.broadcast} />
        <BroadcastInfo {...this.state.broadcast}/>
      </div>
    )
  }
}

function BroadcastInfo(props) {
  console.log(props);
  return (
    <section className='section'>
        <div className='level'>
          <div className='level-left'>
            <BroadcastDetails {...props} />
          </div>
          <div className='level-right'>
            <BroadcastControls {...props} />
          </div>
        </div>
        <hr />
        <UserInfo {...props.user}/>
        <Details {...props} />
        <hr />
      <Comments id={props.bid} />
    </section>
  )
}

function BroadcastDetails(props) {
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{moment(props.createdAt).fromNow()}</p>
      <p className='subtitle'>{props.viewCount > 0 ? props.viewCount.toLocaleString() + ' views' : '' }</p>
    </div>
  )
}

class BroadcastControls extends Component {

  constructor(props) {
    super(props)
    this.state        = {selected: undefined}
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(selected) {
    console.log(selected, selected==='like');
    this.setState({selected: selected})
  }

  render() {
    return (
      <div className='level-item'>
        <div className='level is-mobile'>
          <LevelItem>
            <LikeBroadcastButton
              broadcast='123'
              selected={this.state.selected==='like'}
              onSuccess={this.handleSubmit} />
          </LevelItem>

          <LevelItem>
            <DislikeBroadcastButton
              broadcast='123'
              selected={this.state.selected==='dislike'}
              onSuccess={this.handleSubmit} />
          </LevelItem>

          <LevelItem>
            <ReportBroadcastButton
              broadcast='123'
              selected={this.state.selected==='flag'}
              onSuccess={this.handleSubmit} />
          </LevelItem>
        </div>
      </div>
    )
  }
}


function UserInfo(props) {
  return (
    <section className='card-content'>
      <div className=''>
        <UserProfile {...props} />
      </div>
    </section>
  )
}

function UserProfile(props) {
  return (
    <div>
      <div className='level broadcast-user-info'>
        <div className='level-left'>
          <div className='level-item'>
            <figure className='image is-48x48'>
              <img src='user.png' alt='user avatar' />
            </figure>
          </div>

          <div className='level-item'>
            <ul>
              <li><p><a href='#' className='title is-6'>{props.name}</a></p></li>
              <li><p><a href='#' className='subtitle is-6'>@{props.username}</a></p></li>
            </ul>
          </div>
        </div>

        <div className='level-right'>
          <span className='level-item'><SubscribeButton /></span>
        </div>
      </div>
    </div>
  )
}

function Details(props) {
  return (
    <div className='media'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a fermentum felis. Nam iaculis pharetra elit. Integer lacinia pulvinar hendrerit.
    </div>
  )
}

function LevelItem(props) {
  return (
    <div className='level-item has-text-centered'>
      {props.children}
    </div>
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
