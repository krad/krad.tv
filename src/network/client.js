import axios from 'axios'

const client = axios.create({
  baseURL: process.env.REACT_APP_KRAD_API_BASE_PATH,
  timeout: 8000,
  withCredentials: true,
  credentials: 'same-origin',
  transformResponse: (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }
})

export default client
