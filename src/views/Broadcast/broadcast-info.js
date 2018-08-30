import React, { Component } from 'react';
import {  Link } from 'react-router-dom'
import moment from 'moment'
import client from '../../network/client'
// import Comments from '../../components/Comments/comments'

function VODBroadcastInfo(props) {
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

export default VODBroadcastInfo

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

    client.post(url, payload).then(res => {
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
        <UserProfile {...props} />
    </section>
  )
}

function UserProfile(props) {
  const avatar = props.profileImage || '/User.png'

  return (
    <div>
        <figure className='image is-48x48'>
            <img src={avatar} alt='user avatar' className='profile-image' />
        </figure>

        <ul>
          <li><p><Link to={['/channel', props.id].join('/')} className='title is-6' >{props.name}</Link></p></li>
          <li><p><Link to={['/channel', props.id].join('/')} className='subtitle is-6' >@{props.username}</Link></p></li>
        </ul>

          {/* <span className='level-item'><SubscribeButton /></span> */}
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
