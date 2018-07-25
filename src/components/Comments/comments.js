import React, { Component } from 'react'
import LoadingIndicator from '../../components/Loaders/eqwave'
import axios from 'axios'
import moment from 'moment'
import './comments.css'

const instance = axios.create({
  baseURL: 'http://0.0.0.0:3000/',
  timeout: 2000,
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

export default class Comments extends Component {

  constructor(props) {
    super(props)
    this.state = {loading: false,
                  comments: [],
                      next: undefined,
                      prev: undefined,
                totalCount: undefined}
  }

  componentDidMount() {
    this.source = axios.CancelToken.source();
    this.setState({loading: true})
    instance.get('/comments?broadcast=1', {CancelToken: this.source.token})
    .then(res => {
      this.setState({loading: false, error: undefined, ...res.data})
    }).catch(err => {
      this.setState({loading: false, error: err})
    })
  }

  componentWillUnmount() {
    this.source.cancel()
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
  return (<div className='media'>{props.body}</div>)
}

function CommentUserInfo(props) {
  return <p><a className='title is-6'>@{props.username} - {moment(props.createdAt).fromNow()}</a></p>
}

function CommentUserImage(props) {
  const avatar = props.avatar || 'User.png'
  return (
    <figure className='image is-48x48'>
      <img className='rounded' src={avatar} alt='User avatar' />
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


function ErrorMessage(props) {
  return (
    <section className='section'>
      <h1 className='title'>Something went wrong.</h1>
      <h3 className='subtitle'>Ooohhh noooooo!!!</h3>
    </section>
  )
}
