import React from 'react'
import MiddleBox from '../../components/MiddleBox/middle-box'
import ManageProfileAvatar from './manage-profile-avatar'
import ManageProfileForm from './manage-profile-form'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 2000,
  // withCredentials: true,
  // credentials: 'same-origin',
  transformResponse: (data) => {
    return JSON.parse(data)
  }
})


function ManageProfile(props) {
    const userJSON = window.localStorage.getItem('user')
    const user     = JSON.parse(userJSON)

    return (
      <MiddleBox title='Manage Profile' width='wide'>
        <div className='columns'>
          <div className='column is-4'>
            <ManageProfileAvatar user={user} />
          </div>

          <div className='column is-8'>
            <ManageProfileForm user={user} />
          </div>
        </div>
      </MiddleBox>
    )
}

export default ManageProfile
