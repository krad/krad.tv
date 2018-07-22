import React, { Component } from 'react'
import './comments.css'

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a fermentum felis. Nam iaculis pharetra elit. Integer lacinia pulvinar hendrerit. Phasellus hendrerit non tellus sit amet consequat. Nullam dapibus mollis risus, vel suscipit justo vulputate sit amet. Cras a sodales tortor, nec fermentum nulla. Vestibulum dapibus, diam in hendrerit commodo, purus tellus commodo risus, sed blandit neque ante in nisl. Pellentesque lobortis diam in est aliquam, tincidunt maximus est'

const users = ['@melgray', '@williii', '@stacie', '@laine']

const random = (max) => {
  return Math.floor(Math.random() * max)
}

export default class Comments extends Component {
  render() {
    return (
      <div className='container'>
          <h1 className='title is-4'>5404 comments</h1>
          <Comment user={users[random(users.length)]} comment={lorem}/>
          <Comment user={users[random(users.length)]} comment={lorem}/>
          <Comment user={users[random(users.length)]} comment={lorem}/>
          <Comment user={users[random(users.length)]} comment={lorem}/>
          <CommentInput />
      </div>
    )
  }
}

function Comment(props) {
  return (
    <div className='comment'>
      <div className='media'>
        <div className='media-left'>
          <figure className='image is-48x48'>
            <img className='rounded' src='user.png' />
          </figure>
        </div>
        <div className='media-content'>
          <p><a href='#' className='title is-6'>{props.user}</a> - {random(24)} hours ago</p>
        <div className='media'>{props.comment}</div>

        <CommentReactionControls />
        </div>
      </div>
    </div>
  )
}

class CommentInput extends Component {
  render() {
    return (
<article className="media">
  <figure className="media-left">
    <p className="image is-64x64">
      <img src="user.png" className='rounded' />
    </p>
  </figure>
  <div className="media-content">
    <div className="field">
      <p className="control">
        <textarea className="textarea" placeholder="Add a comment..."></textarea>
      </p>
    </div>
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <a className="button is-dark">Submit</a>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          0 / 1024
        </div>
      </div>
    </nav>
  </div>
</article>
)
  }
}

function CommentReactionControls(props) {
  return (
    <div className='comment-reactions'>
      <a className='reaction'>
        <span className='icon is-small'><i className='fas fa-thumbs-up'> </i></span>
      </a>

      <a className='reaction'>
        <span className='icon is-small'><i className='fas fa-thumbs-down'> </i></span>
      </a>

      <a className='reaction'>
        <span className='icon is-small'><i className='fas fa-flag'> </i></span>
      </a>

      <a className='reaction'>
        <span>REPLY</span>
      </a>
    </div>
  )
}
