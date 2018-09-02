import React, { Component } from 'react'
import LoadingIndicator from '../../components/Loaders/eqwave'
import ErrorMessage from '../Error/error'
import axios from 'axios'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './comments.css'

const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 2000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

const responseInterceptor = (response) => {
  return Promise.resolve(response)
}
const errorInterceptor = (error) => Promise.reject(error.response)
instance.interceptors.response.use(responseInterceptor, errorInterceptor)


export default class Comments extends Component {

  constructor(props) {
    super(props)
    this.state = {loading: false,
                  comments: [],
                       url: '/comments?broadcast='+props.broadcastId,
                      next: undefined,
                      prev: undefined,
                totalCount: undefined}

    this.handleAddComment = this.handleAddComment.bind(this)
  }

  componentDidMount() {
    this.source = axios.CancelToken.source();
    this.setState({loading: true})
    instance.get(this.state.url, {CancelToken: this.source.token})
    .then(res => {
      this.setState({loading: false, error: undefined, ...res.data})
    }).catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  componentWillUnmount() {
    this.source.cancel()
  }

  handleAddComment(comment) {
    let comments = this.state.comments
    if (!comments) { comments = []}
    comment.user = this.props.user
    comments.push(comment)
    const totalCount = this.state.totalCount || 0
    this.setState({comments: comments, totalCount:totalCount+1})
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }

    if (this.state.error) {
      return <ErrorMessage error={this.state.error} />
    }

    return (
      <div className='comments'>
        <CommentCount {...this.state} />
        {this.state.comments.map(comment => <Comment key={comment.id} {...comment} />)}
        <CommentInput user={this.props.user} onAdd={this.handleAddComment} {...this.props}/>
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
    return <span></span>
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
  return (<div className='media'>{props.body}</div>)
}

function CommentUserInfo(props) {
  return <p><a className='title is-6'>@{props.username} - {moment(props.createdAt).fromNow()}</a></p>
}

function CommentUserImage(props) {
  let avatar
  if (props.profileImage) { avatar = [process.env.REACT_APP_KRAD_ASSET_BASE_PATH, props.profileImage].join('') }
  else { avatar = '/User.png' }

  return (
    <figure className='image is-48x48 is-square'>
      <img width='48' height='48' className='rounded profileImage' src={avatar} alt='User avatar' />
    </figure>)
}

class CommentInput extends Component {

  constructor(props) {
    super(props)
    this.state        = {comment: '', loading: false, error: undefined, submited: false}
    this.maxInput     = props.maxInput || 1024
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    if (e.target.value.length <= this.maxInput) {
      this.setState({comment: e.target.value})
    } else {
      e.preventDefault()
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({loading: true})
    const payload = {
      broadcast: this.props.broadcastId,
      body: this.state.comment
    }
    instance.post('/comment', payload)
    .then(result => {
      this.setState({loading: false, submitted: true})
      this.props.onAdd(result.data)
    }).catch(err => {
      let msg
      if (err.data && err.data.error) { msg = err.data.error }
      else { msg = 'Something went wrong'}
      this.setState({loading: false, error: msg})
    })
  }

  render() {
    if (this.state.submitted) {
      return <span></span>
    }

    return <NewCommentForm
      user={this.props.user}
      onSubmit={this.handleSubmit}
      onChange={this.handleChange}
      comment={this.state.comment}
      loading={this.state.loading}
      maxInput={this.maxInput}
    />

  }
}

function NewCommentForm(props) {
  let buttonClass = 'button is-dark'
  if (props.loading) { buttonClass += ' is-loading' }

  const user = props.user
  if (!user) {
    return <span></span>
  }

  let avatar
  if (props.profileImage) { avatar = [process.env.REACT_APP_KRAD_ASSET_BASE_PATH, props.profileImage].join('') }
  else { avatar = '/User.png' }

  return (
      <form action='/comments' onSubmit={props.onSubmit}>
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64 is-square">
            <img src={avatar} className='rounded profileImage' alt={user.username + ' avatar'} />
          </p>
        </figure>
        <div className="media-content">
          <div className="field">
            <p className="control">
              <textarea
                className="textarea"
                placeholder="Add a comment..."
                onChange={props.onChange}
                value={props.comment}
                disabled={props.loading} />
            </p>
        </div>
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <button type='submit' className={buttonClass}>Submit</button>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">{props.comment.length} / {props.maxInput}</div>
          </div>
        </nav>
      </div>
    </article>
    </form>
  )
}


function CommentReactionControls(props) {
  return (
    <div className='comment-reactions'>
      <a className='reaction'>
        <span className='icon is-small'><FontAwesomeIcon icon='thumbs-up' /></span>
      </a>

      <a className='reaction'>
        <span className='icon is-small'><FontAwesomeIcon icon='thumbs-down' /></span>
      </a>

      <a className='reaction'>
        <span className='icon is-small'><FontAwesomeIcon icon='flag' /></span>
      </a>

      <a className='reaction'>
        <span>REPLY</span>
      </a>
    </div>
  )
}
