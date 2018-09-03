import React, { Component } from 'react';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './manage-profile-avatar.css'

const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 8000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})

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
      instance.post('/profile/avatar', formData, config)
      .then(res => {
        let user          = this.props.user
        user.profileImage = res.data.profileImage
        window.localStorage.setItem('user', JSON.stringify(user))
        this.setState({uploading: false, profileImage: res.data.profileImage})
      }).catch(err => {
        this.setState({uploading: false})
        console.log(err);
      })
    }
  }

  render() {
    return (
      <div>
        <div className='profile-image'>
          <UserProfileImage {...this.state}/>
        </div>
        <div className='upload-button'>
          <FileUploadButton
            fileInput={this.fileInput}
            onChange={this.handleChange}
            fileName={this.state.fileName} />
        </div>
        <ProgressBar {...this.state} />
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
    bar = <progress className='upload-progress' value={props.uploadProgress} max='100'></progress>
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
