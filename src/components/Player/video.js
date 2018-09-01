import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import LoadingIndicator from '../../components/Loaders/spinner'
import plainview from '@krad/plainview'

import playImg from './play-button.svg'
import pauseImg from './pause-button.svg'
import muteImg from './unmute.svg'
import unmuteImg from './mute.svg'
import reloadImg from './reload.svg'
import fullscreenImg from './fullscreen.svg'

import './player.css'

class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true,
                  playing: false,
                    muted: false,
                    ended: false,
            totalTimeCode: undefined,
          currentTimeCode: undefined,
          downloadPercent: 0,
            playedPercent: 0,
                  hovered: true,
               fullscreen: false,
                    error: undefined
        }

    this.handleClick                  = this.handleClick.bind(this)
    this.handleCanPlay                = this.handleCanPlay.bind(this)
    this.handleDownloadProgress       = this.handleDownloadProgress.bind(this)
    this.handlePlayProgress           = this.handlePlayProgress.bind(this)
    this.handleEnded                  = this.handleEnded.bind(this)
    this.handlePlay                   = this.handlePlay.bind(this)
    this.handlePause                  = this.handlePause.bind(this)
    this.handleReplay                 = this.handleReplay.bind(this)
    this.handleError                  = this.handleError.bind(this)
    this.handleMute                   = this.handleMute.bind(this)
    this.handleUnmute                 = this.handleUnmute.bind(this)
    this.handleEnded                  = this.handleEnded.bind(this)
    this.handleMouseEnter             = this.handleMouseEnter.bind(this)
    this.handleMouseLeave             = this.handleMouseLeave.bind(this)
  }

  handleClick(e) {
    switch (e.target.value) {
      case 'play':
        if (this._child.plainview) {
          if (this.state.ended) {
            this._child.plainview.replay()
          } else {
            if (this.state.playing) { this._child.plainview.pause() }
            else { this._child.plainview.play() }
          }
        }
        break
      case 'mute':
        if (this._child.plainview) {
          if (this.state.muted) { this._child.plainview.unmute() }
          else { this._child.plainview.mute() }
        }
        break
      case 'fullscreen':
        if (this._child.plainview) {
          console.log(this._child.plainview);
          this._child.plainview.requestFullScreen()
        }
        break
      default:
        break
    }

  }

  handleCanPlay() {
    this.setState({loading: false})
  }

  handleDownloadProgress(e) {
    this.setState({downloadPercent: e})
  }

  handlePlayProgress(percentDone, timecode, totalTimeCode) {
    this.setState({playedPercent: percentDone,
                 currentTimeCode: timecode,
                   totalTimeCode: totalTimeCode,
                         playing: true})
  }

  handlePlay()    { this.setState({playing: true}) }
  handlePause()   { this.setState({playing: false}) }
  handleReplay()  { this.setState({ended: false, playing: false})}

  handleError(e) {
    this.setState({loading: false, error: e})
    this._child.plainview.video.class = 'player player-with-error'
  }

  handleMute()    { this.setState({muted: true}) }
  handleUnmute()  { this.setState({muted: false}) }
  handleEnded()   {
    this.setState({ended: true})
  }

  handleMouseEnter() {
    this.setState({hovered: true})
  }

  handleMouseLeave() {
    if (this.state.playing) {
      this.setState({hovered: false})
    }
  }

  render() {

    let message
    if (this.state.error) {
      message = (<PlaybackError {...this.state.error} />)
    } else {
      if (this.state.loading) { message = (<LoadingIndicator />) }
      else { message = (<span></span>)}
    }

    return (
      <div className='player-wrapper'
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleMouseEnter}>

        {message}

        <Video
          ref={(child) => {this._child = child}}
          url={this.props.url}
          onCanPlay={this.handleCanPlay}
          onPlayProgress={this.handlePlayProgress}
          onDownloadProgress={this.handleDownloadProgress}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onReplay={this.handleReplay}
          onMute={this.handleMute}
          onUnmute={this.handleUnmute}
          onEnded={this.handleEnded}
          onError={this.handleError}
          error={this.state.error}
        />

        <PlayerControls
          type={this.props.type}
          clickHandler={this.handleClick}
          {...this.state}
        />
      </div>
    )
  }
}

class Video extends Component {

  constructor(props) {
    super(props)
    this.plainview                    = new plainview(props.url)
    this.plainview.logLevel           = 5
    this.plainview.onCanPlay          = props.onCanPlay
    this.plainview.onPlayProgress     = props.onPlayProgress
    this.plainview.onDownloadProgress = props.onDownloadProgress
    this.plainview.onPlay             = props.onPlay
    this.plainview.onPause            = props.onPause
    this.plainview.onReplay           = props.onReplay
    this.plainview.onError            = props.onError
    this.plainview.onMute             = props.onMute
    this.plainview.onUnmute           = props.onUnmute
    this.plainview.onEnded            = props.onEnded
  }

  componentDidMount() {
    const video          = ReactDOM.findDOMNode(this)
    this.plainview.video = video
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (<video className='player'></video>)
  }
}

function PlayerControls(props) {

  let controls
  if (props.type === 'LIVE') {
    controls = <LivePlayerControls {...props} />
  } else {
    controls = <VODPlayerControls {...props} />
  }

  return (
    <div className='player-controls' style={{opacity: props.hovered ? 1 : 0}}>
      {controls}
    </div>
  )
}

function VODPlayerControls(props) {
    return (
        <div>
          <PlayerProgress {...props} />
          <PlayButton {...props} />
          <MuteButton {...props} />
          <Timecode {...props} />
          <FullScreenButton />
        </div>
  )
}

function LivePlayerControls(props) {
  return (
    <div>
      <MuteButton {...props} />
      <StateLabel {...props} />
      <FullScreenButton />
    </div>)
}

function PlayerProgress(props) {
  return (
    <div className="player-progress">
      <progress className='progress-bar download-progress' min='0' max='100' value={props.downloadPercent}></progress>
      <progress className='progress-bar play-progress' min='0' max='100' value={props.playedPercent}></progress>
    </div>
  )
}

function MuteButton(props) {
  let muteButton
  if (props.muted) { muteButton = unmuteImg }
  else { muteButton = muteImg }

  return (<input
    type='image'
    onClick={props.clickHandler}
    value='mute'
    alt='mute/unmute control'
    className='player-button mute'
    src={muteButton} />
  )
}

function PlayButton(props) {
  let playButton
  if (props.playing) { playButton = pauseImg }
  else { playButton = playImg }
  if (props.ended) { playButton = reloadImg }

  return (
    <input
      type='image'
      onClick={props.clickHandler}
      value='play'
      alt='play/pause control'
      className='player-button play'
      src={playButton} />
  )
}

function Timecode(props) {
  let timeCode
  if (props.currentTimeCode && props.totalTimeCode) {
    timeCode = [props.currentTimeCode, props.totalTimeCode].join(' / ')
  } else {
    timeCode = (<span></span>)
  }

  return (<span className='player-button timecode'>{timeCode}</span>)
}

function StateLabel(props) {
  let label = 'LIVE'
  if (props.error) {
    label = 'ERROR'
  }

  return (
    <span className='player-button status-button'>
      <span className='icon has-text-danger'>
        <i className="fas fa-circle" />
        <span className='status-label'>{label}</span>
      </span>
    </span>
  )
}

function FullScreenButton(props) {
  return (
    <input
      type='image'
      onClick={props.clickHandler}
      alt='fullscreen control'
      value='fullscreen'
      className='player-button full-screen'
      src={fullscreenImg}
    />
  )
}

function PlaybackError(props) {
  return(
    <div className='playback-error-message'>
      <h1>Playback Error</h1>
      <p>Something went wrong, sorry about that.</p>
      <p>Please try again later</p>
    </div>
  )
}

export default Player
