import React, { Component } from 'react';
import moment from 'moment'
import './chat.css'

const WEBSOCKET_BASE_PATH = process.env.REACT_APP_KRAD_WEBSOCKET_PATH

class ChatBox extends Component {
  constructor(props) {
    super(props)

    const userJSON = window.localStorage.getItem('user')
    const user     = JSON.parse(userJSON)

    this.state = {
      messages: [],
      message: '',
      loading: undefined,
      ready: false,
      user: user
    }

    this.handleConnect      = this.handleConnect.bind(this)
    this.handleMessage      = this.handleMessage.bind(this)
    this.handleError        = this.handleError.bind(this)
    this.handleDisconnect   = this.handleDisconnect.bind(this)
    this.handleSubmit       = this.handleSubmit.bind(this)
    this.handleChange       = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.setState({loading: true})
    this.socket           = new WebSocket(websocketURL(this.props))
    this.socket.onopen    = this.handleConnect
    this.socket.onmessage = this.handleMessage
    this.socket.onerror   = this.handleError
    this.socket.onclose   = this.handleDisconnect
  }

  componentWillUnmount() {
    this.socket.close()
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.message.length > 0) {
      this.setState({loading: true})
      this.socket.send(this.state.message)
      this.setState({message:'', loading: false})
    }
  }

  handleChange(e) {
    this.setState({message: e.target.value})
  }

  handleConnect() {
    this.setState({loading: false})
  }

  handleMessage(msg) {
    const parsed = JSON.parse(msg.data)
    let messages = this.state.messages
    messages.push(parsed)
    this.setState({messages: messages})
  }

  handleError(err) {

  }

  handleDisconnect() {

  }


  render() {
    return (
      <div className='chat-box'>
        <div className='chat-header'>{this.props.title}</div>

        <MessagesBox {...this.state} {...this.props}/>

        <SubmitForm
          message={this.state.message}
          loading={this.state.loading}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}


function MessagesBox(props) {
  return (
    <div className='control chat-messages'>
      <Messages {...props} />
    </div>
  )
}

function Messages(props) {
  const messages = props.messages.map((m, idx) => (<li key={idx}><Message {...m} /></li>))
  return (<ul className='chat-messages-list'>{messages}</ul>)
}

function Message(props) {
  let ts    = new moment(props.timestamp)
  let entry = [(<span key='ts' className='ts'>{ts.format('HH:mm')}</span>)]

  if (props.user) {
    entry.push(<span key='username' className='username'>{props.user}:</span>)
  }

  entry.push(<span key='message' className='chat-message'>{props.body}</span>)

  return (<div>{entry.map(e => e)}</div>)
}

function SubmitForm(props) {
  return (
    <div className='chat-submit'>
      <form onSubmit={props.onSubmit}>
      <div className='control field has-addons'>
          <div className='control is-expanded'>
            <input
              className='input is-small'
              type='text'
              value={props.message}
              onChange={props.onChange}
              disabled={props.loading ? true : false}
            />
          </div>
          <div className='control'>
            <a className={submitButtonClass(props.loading)}
              onClick={props.onSubmit}>Submit</a>
          </div>
      </div>
    </form>
    </div>
  )
}

function submitButtonClass(loading) {
  if (loading) { return 'button is-small is-loading' }
  else { return 'button is-small' }
}

const websocketURL = (props) => {
  let url
  let basePath = WEBSOCKET_BASE_PATH
  if (basePath.slice(0, 1) === '/') {
    let loc = window.location
    if (loc.protocol === "https:") { basePath = "wss:" }
    else { basePath = "ws:" }
    basePath += "//" + loc.host
    basePath += WEBSOCKET_BASE_PATH
  }

  url = `${basePath}/${props.broadcastId}`
  if (props.roomId) { url += `/${props.roomId}` }
  return url
}

export default ChatBox
