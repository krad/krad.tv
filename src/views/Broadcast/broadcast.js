import React, { Component } from 'react';
import Video from '../../components/Player/video'
import Comments from '../../components/comments'
import { LikeBroadcastButton, DislikeBroadcastButton, ReportBroadcastButton, SubscribeButton } from '../../components/Buttons/opinion-button'
import moment from 'moment'

const broadcast = {
  "id": "17382146-1e78-4ab5-bcdd-b57c59376259",
  "updatedAt": 1525978973061,
  "createdAt": 1525978733409,
  "title": "UI Mockup Stream",
  "previewThumbnail": "https://doxvmry0pd5ic.cloudfront.net/17382146-1e78-4ab5-bcdd-b57c59376259/0.jpg",
  "views": 7,
  "status": "VOD",
  "playlist": "https://krad.tv/example.playlist.m3u8",
  "user": {
    id: "8ca21331-9884-4231-994f-aaa5492ef340",
    "name": "Some Guy",
    "username": "melgray",
    "avatar": "http://localhost:3001/user.png",
    _links: {
      profile: "/profile/8ca21331-9884-4231-994f-aaa5492ef340"
    }
  }
}

export default class Broadcast extends Component {

  constructor(props) {
    super(props)
    this.state = {broadcast: undefined}
  }

  componentDidMount() {
    this.setState({broadcast: broadcast})
  }

  render() {
    return (
      <div id='watch' className='container'>
        <Video {...broadcast} />
        <BroadcastInfo {...broadcast}/>
      </div>
    )
  }
}

function BroadcastInfo(props) {
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
        <hr />
      <Comments id={props.bid} />
    </section>
  )
}

function BroadcastDetails(props) {
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{moment(broadcast.createdAt).fromNow()}</p>
      <p className='subtitle'>{props.views} views</p>
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
      <Details />
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
