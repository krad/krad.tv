import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthenticationService from '../../services/auth-service'

import './manage-profile-avatar.css'

class ManageProfileAvatar extends Component {
  constructor(props) {
    super(props)
    this.state          = {uploading: false, profileImage: props.user.profileImage}
    this.fileInput      = React.createRef()
    this.handleProgress = this.handleProgress.bind(this)
    this.handleChange   = this.handleChange.bind(this)
  }

  handleProgress(progress) {
    const p = Math.round((progress.loaded / progress.total) * 100)
    this.setState({uploadProgress: p})
  }

  handleChange(e) {
    const file = this.fileInput.current.files[0]
    if (file) {
      let formData = new FormData()
      formData.set('avatar', file, file.name)

      const config = {
        headers: {'Content-Type': 'multipart/form-data'},
        onUploadProgress: this.handleProgress
      }

      this.setState({uploading: true, fileName: file.name})
      AuthenticationService.uploadAvatar(formData, config)
      .then(res => {
        this.setState({uploading: false, profileImage: res.profileImage})
      }).catch(err => {
        this.setState({uploading: false, error: err})
      })
    }
  }

  render() {
    return (
      <div>
        <div className='profile-image'>
          <UserProfileImage {...this.state}/>
        </div>

        <ProgressBar {...this.state} />

        <div className='upload-button'>
          <FileUploadButton
            fileInput={this.fileInput}
            onChange={this.handleChange}
            fileName={this.state.fileName} />
        </div>
      </div>
    )
  }
}

function UserProfileImage(props) {
  const avatar = props.profileImage || '/User.png'

  return (
    <figure className='image is-square'>
      <img src={avatar} alt='user avatar' />
    </figure>
  )
}

function ProgressBar(props) {

  let bar
  if (props.uploading) {
    bar = <progress className='upload-progress progress is-small is-info' value={props.uploadProgress} max='100'></progress>
  } else {
    bar = <div></div>
  }

  return bar
}

function FileUploadButton(props) {

  const label = props.fileName || 'Choose a file...'

  return (
    <div className='file is-centered'>
      <label className='file-label'>

        <input
          className='file-input'
          type='file'
          name='avatar'
          ref={props.fileInput}
          onChange={props.onChange} />

        <span className='file-cta'>
          <span className='file-icon'>
            <FontAwesomeIcon icon='upload' />
          </span>
          <span className='file-label'>{label}</span>
        </span>

      </label>
    </div>
  )
}

export default ManageProfileAvatar
