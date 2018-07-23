import React, { Component } from 'react'
import moment from 'moment'
import './comments.css'

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a fermentum felis. Nam iaculis pharetra elit. Integer lacinia pulvinar hendrerit. Phasellus hendrerit non tellus sit amet consequat. Nullam dapibus mollis risus, vel suscipit justo vulputate sit amet. Cras a sodales tortor, nec fermentum nulla. Vestibulum dapibus, diam in hendrerit commodo, purus tellus commodo risus, sed blandit neque ante in nisl. Pellentesque lobortis diam in est aliquam, tincidunt maximus est'
const users = ['melgray', 'williii', 'stacie', 'laine']

const random = (max) => {
  return Math.floor(Math.random() * max)
}

const comments = {
  results: [
    {id: '1', createdAt: 1525978733409, comment: lorem, replies: 20, user: {id: 1, username: users[random(users.length-1)], avatar: '/user.png',_links: {profile: '/profile/1'}}},
    {id: '2', createdAt: 1525978733409, comment: lorem, replies: 4, user: {id: 1, username: users[random(users.length-1)], avatar: 'user.png', _links: {profile: '/profile/1'}}},
    {id: '3', createdAt: 1525978733409, comment: lorem, replies: 35, user: {id: 1, username: users[random(users.length-1)], avatar: 'user.png', _links: {profile: '/profile/1'}}},
    {id: '4', createdAt: 1525978733409, comment: lorem, replies: 99, user: {id: 1, username: users[random(users.length-1)], avatar: 'user.png', _links: {profile: '/profile/1'}}},
    {id: '5', createdAt: 1525978733409, comment: lorem, replies: 232, user: {id: 1, username: users[random(users.length-1)], avatar: 'user.png', _links: {profile: '/profile/1'}}}

  ],
  totalCount: 5000,
  _links: { next: '/comment/page-2' }
}

const Loading = () => <div>Loading...</div>;


export default class Comments extends Component {

  constructor(props) {
    super(props)
    this.state = {comments: undefined, next: undefined, prev: undefined, totalCount: undefined}
  }

  componentDidMount() {
    setTimeout(() => {
      const next = comments._links.next
      const prev = comments._links.prev
      this.setState({comments: comments.results,
                         next: next,
                         prev: prev,
                   totalCount: comments.totalCount})
    }, 2000)
  }

  render() {
    var body
    if (this.state.comments) {
      body = this.state.comments.map(comment => <Comment key={comment.id} {...comment} />)
    } else {
      body = <Loading />
    }

    return (
      <div className=''>
        <CommentCount {...this.state} />
        {body}
        <CommentInput />
      </div>
    )
  }
}

function Comment(props) {
  return (
    <CommentWraper {...props.user}>
      <CommentUserInfo {...props.user} />
      <CommentBody {...props} />
      <CommentReactionControls />
    </CommentWraper>
  )
}

function CommentCount(props) {
  if (props.totalCount) {
    return (<h1 className='title is-4'>{props.totalCount} comments</h1>)
  } else {
    return <h1></h1>
  }

}

function CommentWraper(props) {
  return (
    <div className='comment'>
      <div className='media'>
        <div className='media-left'>
          <CommentUserImage {...props} />
        </div>

        <div className='media-content'>
          {props.children}
        </div>

      </div>
    </div>
  )
}

function CommentBody(props) {
  return (<div className='media'>{props.comment}</div>)
}

function CommentUserInfo(props) {
  return <p><a className='title is-6' href={props._links.profile}>@{props.username} - {moment(props.createdAt).fromNow()}</a></p>
}

function CommentUserImage(props) {
  return (
    <figure className='image is-48x48'>
      <img className='rounded' src={props.avatar} alt='User avatar' />
    </figure>)
}

class CommentInput extends Component {

  constructor(props) {
    super(props)
    this.state        = {comment: ''}
    this.maxInput     = props.maxInput || 512
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    if (e.target.value.length <= this.maxInput) {
      this.setState({comment: e.target.value})
    } else {
      e.preventDefault()
    }
  }

  render() {
    return (
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src="user.png" className='rounded' alt='User avatar' />
          </p>
        </figure>
        <div className="media-content">
          <div className="field">
            <p className="control">
              <textarea
                className="textarea"
                placeholder="Add a comment..."
                onChange={this.handleChange}
                value={this.state.comment} />
            </p>
        </div>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <a className="button is-dark">Submit</a>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">{this.state.comment.length} / {this.maxInput}</div>
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
