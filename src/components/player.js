import React, { Component } from 'react'
import Comments from './comments'
import moment from 'moment'
import './player.css'

const broadcast = {"userID":"8ca21331-9884-4231-994f-aaa5492ef340",
                   "updatedAt":1525978973061,
                   "broadcastID":"17382146-1e78-4ab5-bcdd-b57c59376259",
                   "status":"DONE",
              "thumbnails":["0.jpg","1.jpg"],
              "createdAt":1525978733409,
              "bid":"17382146-1e78-4ab5-bcdd-b57c59376259",
              "title":"Another day on the tractor",
              "user":{
                "userID":"8ca21331-9884-4231-994f-aaa5492ef340",
                "lastName":"Gray",
                "updatedAt":1521345080836,
                "createdAt":1520663413968,
                "username":"melgray",
                "firstName":"Mel",
                "isVerified":true
              },
              "views":7,
              "opinion":"like"}

export default class Player extends Component {
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
        <UserInfo {...props}/>
        <hr />
      <Comments id={props.bid} />
    </section>
  )
}

function Video(props) {
  return (
    <video className='player'></video>
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

function BroadcastControls(props) {
  return (
    <div className='level-item'>
      <div className='level is-mobile'>
        <LevelItem><Button name='Like' opinion={props.opinion}/></LevelItem>
        <LevelItem><Button name='Dislike' opinion={props.opinion}/></LevelItem>
        <LevelItem><Button name='Report' opinion={props.opinion}/></LevelItem>
      </div>
    </div>
  )
}

function UserInfo(props) {
  return (
    <section className='card-content'>
      <div className='container'>
        <UserProfile />
      </div>
    </section>
  )
}

function UserProfile(props) {
  return (
    <div className='x'>
      <div className='level'>
        <div className='level-left'>
          <div className='level-item'>
            <figure className='image is-48x48'>
              <img src='user.png' />
            </figure>
          </div>

          <div className='level-item'>
            <ul>
              <li><p><a href='#' className='title is-6'>Mel Gray</a></p></li>
              <li><p><a href='#' className='subtitle is-6'>@melgray</a></p></li>
            </ul>
          </div>
        </div>

        <div className='level-right'>
            <a className='level-item button is-dark'>Subscribe</a>
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



class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: false}
    this.style = 'button is-dark'

    this.icons = {
      'Like': 'fas fa-thumbs-up',
      'Dislike': 'fas fa-thumbs-down',
      'Report': 'fas fa-flag'
    }
  }

  render() {

    const iconClass = this.icons[this.props.name] || 'fas'

    return (
      <a className='button is-dark'>
        <span className='icon is-small'>
          <i className={iconClass}></i>
        </span>
        <span>{this.props.name}</span>
      </a>
    )
  }
}
