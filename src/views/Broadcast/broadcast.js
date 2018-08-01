import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment'

import Video from '../../components/Player/video'
// import Comments from '../../components/Comments/comments'
import LoadingIndicator from '../../components/Loaders/bubbles'

import './broadcast.css'


const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 2000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    if (data) { return JSON.parse(data) }
  }
})

const Broadcast = ({ match }) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  return <PlayerSetTop user={user} {...match.params} />
}

export default Broadcast

class PlayerSetTop extends Component {

  constructor(props) {
    super(props)
    this.state = {broadcast: undefined, loading: false}
  }

  componentDidMount() {
    this.setState({loading: true})
    instance.get('/broadcasts/'+this.props.broadcastId)
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
      <div className='broadcast-set-top'>
        <Video {...broadcast} />
        <BroadcastInfo {...this.props} {...broadcast}/>
      </div>
    )
  }
}

function BroadcastInfo(props) {
  return (
    <section className='section'>
        <BroadcastDetails {...props} />
        <hr />
        <UserInfo {...props.user}/>
        <Details {...props} />
        <hr />
        {/* <Comments {...props} /> */}
    </section>
  )
}

function BroadcastDetails(props) {
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{moment(props.createdAt).fromNow()}</p>

      <div className='level'>
        <div className='level-left'>
          <p className='subtitle'>{props.viewCount > 0 ? props.viewCount.toLocaleString() + ' views' : '' }</p>
        </div>
        <div className='level-right'>
          <BroadcastControls {...props} />
        </div>
      </div>

    </div>
  )
}

class BroadcastControls extends Component {

  constructor(props) {
    super(props)
    this.state        = {selected: undefined, loading: false}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(opinion) {
    this.setState({selected: opinion, loading: true})
    const url = ['/broadcasts', this.props.broadcastId, 'react'].join('/')
    const payload = {reaction: opinion}

    instance.post(url, payload).then(res => {
      this.setState({loading: false})
    }).catch(err => {
      this.setState({loading: false, selected: undefined})
    })
  }

  render() {
    return (
      <div className='level-item'>
        <div className='level is-mobile'>
          <LevelItem>
            <ReactionButton
              name='Like'
              selectedLabel='Liked!'
              onClick={this.handleClick}
              {...this.state}
            />
          </LevelItem>

          <LevelItem>
            <ReactionButton
              name='Dislike'
              selectedLabel='Disliked :('
              onClick={this.handleClick}
              {...this.state}
            />
          </LevelItem>

          <LevelItem>
            <ReactionButton
              name='Report'
              selectedLabel='Reported!'
              onClick={this.handleClick}
              {...this.state}
            />
          </LevelItem>
        </div>
      </div>
    )
  }
}

function ReactionButton(props) {
  let className   = ['button', 'is-dark']
  let label
  if (props.name.toLowerCase() === props.selected) {
    label = props.selectedLabel
    if (props.loading) { className.push('is-loading') }
  } else {
    label = props.name
  }

  className = className.join(' ')
  return (
    <span
      className={className}
      onClick={() => props.onClick(props.name.toLowerCase()) }
      value={props.name.toLowerCase()}
      >
        <ReactionIcon name={props.name.toLowerCase()} />
        <span>{label}</span>
    </span>
  )
}

function ReactionIcon(props) {
  const icons = {
    like: 'fas fa-thumbs-up',
    dislike: 'fas fa-thumbs-down',
    report: 'fas fa-flag',
  }

  return (
    <span className='icon is-small'>
      <i className={icons[props.name]} />
    </span>
  )
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
  let avatar
  if (props.profileImage) { avatar = [process.env.REACT_APP_KRAD_ASSET_BASE_PATH, props.profileImage].join('') }
  else { avatar = '/User.png' }

  return (
    <div>
      <div className='level broadcast-user-info'>
        <div className='level-left'>
          <div className='level-item'>
            <figure className='image is-48x48 is-square'>
              <img src={avatar} alt='user avatar' className='profileImage' />
            </figure>
          </div>

          <div className='level-item'>
            <ul>
              <li><p><a className='title is-6'>{props.name}</a></p></li>
              <li><p><a className='subtitle is-6'>@{props.username}</a></p></li>
            </ul>
          </div>
        </div>

        <div className='level-right'>
          {/* <span className='level-item'><SubscribeButton /></span> */}
        </div>
      </div>
    </div>
  )
}

function Details(props) {
  return <div className='media'>{props.description}</div>
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
