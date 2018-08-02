import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import LoadingIndicator from '../../components/Loaders/spinner'
import plainview from 'plainview/plainview'

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
               fullscreen: false
        }

    this.handleClick                  = this.handleClick.bind(this)
    this.handleCanPlay                = this.handleCanPlay.bind(this)
    this.handleDownloadProgress       = this.handleDownloadProgress.bind(this)
    this.handlePlayProgress           = this.handlePlayProgress.bind(this)
    this.handleEnded                  = this.handleEnded.bind(this)
    this.handlePlay                   = this.handlePlay.bind(this)
    this.handlePause                  = this.handlePause.bind(this)
    this.handleReplay                 = this.handleReplay.bind(this)
    this.handleMute                   = this.handleMute.bind(this)
    this.handleUnmute                 = this.handleUnmute.bind(this)
    this.handleEnded                  = this.handleEnded.bind(this)
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
                   totalTimeCode: totalTimeCode})
  }

  handlePlay()    { this.setState({playing: true}) }
  handlePause()   { this.setState({playing: false}) }
  handleReplay()  { this.setState({ended: false, playing: false})}

  handleMute()    { this.setState({muted: true}) }
  handleUnmute()  { this.setState({muted: false}) }
  handleEnded()   {
    this.setState({ended: true})
  }

  render() {
    let loading
    if (this.state.loading) { loading = (<LoadingIndicator />) }
    else { loading = (<span></span>)}

    return (
      <div className='player-wrapper'>
        {loading}
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
        />
        <PlayerControls {...this.state} clickHandler={this.handleClick} />
      </div>
    )
  }
}

class Video extends Component {

  constructor(props) {
    super(props)
    this.plainview                    = new plainview(props.url)
    this.plainview.onCanPlay          = props.onCanPlay
    this.plainview.onPlayProgress     = props.onPlayProgress
    this.plainview.onDownloadProgress = props.onDownloadProgress
    this.plainview.onPlay             = props.onPlay
    this.plainview.onPause            = props.onPause
    this.plainview.onReplay           = props.onReplay
    this.plainview.onMute             = props.onMute
    this.plainview.onUnmute           = props.onUnmute
    this.plainview.onEnded            = props.onEnded
  }

  componentDidMount() {
    const video = ReactDOM.findDOMNode(this)
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
  let playButton
  if (props.playing) { playButton = pauseImg }
  else { playButton = playImg }

  if (props.ended) { playButton = reloadImg }


  let muteButton
  if (props.muted) { muteButton = unmuteImg }
  else { muteButton = muteImg }

    return (
      <div className='player-controls'>

        <div className="player-progress">
          <progress className='progress-bar download-progress' min='0' max='100' value={props.downloadPercent}></progress>
          <progress className='progress-bar play-progress' min='0' max='100' value={props.playedPercent}></progress>
        </div>

          <input
            type='image'
            onClick={props.clickHandler}
            value='play'
            alt='play/pause control'
            className='player-button play'
            src={playButton} />

          <input
            type='image'
            onClick={props.clickHandler}
            value='mute'
            alt='mute/unmute control'
            className='player-button mute'
            src={muteButton} />

          <span className='player-button timecode'>
            {props.currentTimeCode} / {props.totalTimeCode}
          </span>

          <input
            type='image'
            onClick={props.clickHandler}
            alt='fullscreen control'
            value='fullscreen'
            className='player-button full-screen'
            src={fullscreenImg}
          />

      </div>
    )
}

export default Player
