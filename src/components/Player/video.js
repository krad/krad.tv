import React, { Component } from 'react';
import LoadingIndicator from '../../components/Loaders/spinner'
import './player.css'

class Video extends Component {
  render() {
    return (
      <div className='player-wrapper'>
        <LoadingIndicator />
        <video className='player' poster={this.props.previewThumbnail}></video>
        <PlayerControls />
      </div>
    )
  }
}

class PlayerControls extends Component {

  constructor(props) {
    super(props)
    this.state = {playing: true, muted: false, downloadProgress: 0, playProgress: 0}

    this.handlePlayPause        = this.handlePlayPause.bind(this)
    this.handleMute             = this.handleMute.bind(this)
    this.handleFullscreen       = this.handleFullscreen.bind(this)
    this.handleDownloadProgress = this.handleDownloadProgress.bind(this)
    this.handlePlayProgress     = this.handlePlayProgress.bind(this)

    setInterval(() => {
      this.handleDownloadProgress(this.state.downloadProgress+2)
    }, 500)

    setInterval(() => {
      this.handlePlayProgress(this.state.playProgress+1)
    }, 1000)
  }

  handleDownloadProgress(progress) {
    this.setState({downloadProgress: progress})
  }

  handlePlayProgress(progress) {
    this.setState({playProgress: progress})
  }

  handlePlayPause() {
    this.setState({playing: !this.state.playing})
  }

  handleMute() {
    this.setState({muted: !this.state.muted})
  }

  handleFullscreen() { }

  render() {
    return (
      <div className='player-controls'>

        <div className="player-progress">
          <progress className='progress-bar download-progress' min='0' max='100' value={this.state.downloadProgress}></progress>
          <progress className='progress-bar play-progress' min='0' max='100' value={this.state.playProgress}></progress>
        </div>

        <button
          onClick={this.handlePlayPause}
          className='player-button play'>
          {this.state.playing ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={this.handleMute}
          className='player-button mute'>
          {this.state.muted ? 'Unmute' : 'Mute' }
        </button>

      <button className='player-button timecode'>0:00 / 0:00</button>

        <span className='right-controls'>
          <button
            onClick={this.handleFullscreen}
            className='player-button full-screen'>Fullscreen</button>
        </span>
      </div>
    )
  }
}

export default Video
