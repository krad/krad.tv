import React, { Component } from 'react';
import './player.css'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='player-wrapper'>
        <video className='player' poster={this.props.thumbnails[0]}></video>
        <PlayerControls />
      </div>
    )
  }
}

function PlayerControls(props) {
  return (
    <div className='player-controls'>

      <div className="player-progress">
        <progress className='progress-bar download-progress' min='0' max='100' value='50'></progress>
        <progress className='progress-bar play-progress' min='0' max='100' value='10'></progress>
      </div>

      <button className='player-button play'>Play</button>
      <button className='player-button mute'>Mute</button>
      <button className='player-button timecode'>0:00 / 0:00</button>

      <span className='right-controls'>
        <button className='player-button full-screen'>Fullscreen</button>
      </span>
    </div>
  )
}


export default Video
