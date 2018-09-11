import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthenticationService from '../../services/auth-service'
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
      user: user,
      showTimestamps: true
    }

    this.handleConnect      = this.handleConnect.bind(this)
    this.handleMessage      = this.handleMessage.bind(this)
    this.handleError        = this.handleError.bind(this)
    this.handleDisconnect   = this.handleDisconnect.bind(this)
    this.handleSubmit       = this.handleSubmit.bind(this)
    this.handleChange       = this.handleChange.bind(this)
    this.handleOption       = this.handleOption.bind(this)
    this.handleAuthChange   = this.handleAuthChange.bind(this)
  }

  componentDidMount() {
    AuthenticationService.addObserver(this.handleAuthChange)
    this.setState({loading: true})
    this.socket           = new WebSocket(websocketURL(this.props))
    this.socket.onopen    = this.handleConnect
    this.socket.onmessage = this.handleMessage
    this.socket.onerror   = this.handleError
    this.socket.onclose   = this.handleDisconnect
  }

  componentWillUnmount() {
    AuthenticationService.removeObserver(this.handleAuthChange)
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
    this.scrollToBottom()
  }

  handleError(err) {

  }

  handleDisconnect() {

  }

  handleOption(e) {
    if (e.target.name === 'login') {
      const event = new CustomEvent('showAuthModal')
      document.dispatchEvent(event)
    }

    if (e.target.name === 'timestamps') {
      this.setState({showTimestamps: !this.state.showTimestamps})
    }
  }

  handleAuthChange() {
    this.setState({ user: AuthenticationService.user })
  }

  scrollToBottom() {
    let chatMessages = document.getElementsByClassName('chat-messages')[0]
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight
    }
  }

  render() {
    return (
      <div className='chat-box'>
        <div className='chat-header'>{this.props.title}</div>

        <MessagesBox {...this.state} {...this.props}/>

        <SubmitForm
          {...this.state}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          onOption={this.handleOption}
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
  const messages = props.messages.map((m, idx) => (<li key={idx}><Message {...m} showTimestamps={props.showTimestamps} /></li>))
  return (<ul className='chat-messages-list'>{messages}</ul>)
}

function Message(props) {
  let ts    = new moment(props.timestamp)
  let entry = []
  if (props.showTimestamps) { entry.push(<span key='ts' className='ts'>{ts.format('HH:mm')}</span>) }
  if (props.user) { entry.push(<span key='username' className='username'>{props.user}:</span>) }

  entry.push(<span key='message' className='chat-message'>{props.body}</span>)
  return (<div>{entry.map(e => e)}</div>)
}

function SubmitForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <ChatControls {...props} />
    </form>
  )
}

function ChatControls(props) {
  if (props.user) { return <LoggedInChatControls {...props} /> }
  else { return <LoggedOutChatControls {...props} /> }
}

function LoggedOutChatControls(props) {

  const loginClick = (e) => {
    const event = new CustomEvent('showAuthModal')
    document.dispatchEvent(event)
  }

  return (
    <div className='chat-bar-controls'>
      <LoggedOutLeftControls {...props} />
      <LoggedOutRightControls loginClick={loginClick} />
    </div>
  )
}

function LoggedOutLeftControls(props) {
  let tsLabel = props.showTimestamps ? 'Hide timestamps' : 'Show timestamps'

  return (
    <div className='controls-left'>

      <div className='dropdown is-up is-hoverable'>
        <div className='dropdown-trigger'>
          <button className='button is-text'>
            <FontAwesomeIcon icon='cog'/>
          </button>
        </div>
        <div className='dropdown-menu'>
          <div className='dropdown-content'>
            <a className='dropdown-item' onClick={props.onOption} name='login'>Login</a>
            <a className='dropdown-item' onClick={props.onOption} name='timestamps'>{tsLabel}</a>
          </div>
        </div>

      </div>
    </div>
  )
}

function LoggedOutRightControls(props) {
  return (
    <div className='controls-right'>
      <button className='chat-control button' onClick={props.loginClick}>Register to chat</button>
    </div>
  )
}

function LoggedInChatControls(props) {
  return (
    <div className='control field has-addons chat-submit'>
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
