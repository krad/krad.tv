import React from 'react'
import { BrowserRouter as Link } from 'react-router-dom'
import './footer'

function Footer(props) {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='columns'>
          <OpenSourceColumn />
          <StreamersColumn />
          <AdvertisersColumn />
        </div>
        <div className='level'>
          <div className='level-left'></div>
          <div className='level-right'>
            <a href='/tos' className='level-item is-size-7'>Terms</a>
            <a href='/privacy' className='level-item is-size-7'>Privacy</a>
            <p className='level-item is-size-7'>krad.tv &copy; 2018</p>
          </div>
        </div>
      </div>

    </footer>
  )
}

function Column(props) {
  return (
    <div className='column is-3'>{props.children}</div>
  )
}

function ViewersColumn(props) {
  return (
    <Column>
      <h3 className='title is-5'>Viewers</h3>
      <a className='subtitle is-6'>About krad.tv</a>
    </Column>
  )
}

function OpenSourceColumn(props) {
  return (
    <Column>
      <h3 className='title is-5'>Open Source</h3>
      <ul>
        <li><a href='https://github.com/krad' className='subtitle is-6'>Github</a></li>
        <li><a href='https://github.com/krad/plainview' className='subtitle is-6'>plainview</a></li>
        <li><a href='https://github.com/krad/morsel' className='subtitle is-6'>morsel</a></li>
        <li><a href='https://github.com/krad/pupil' className='subtitle is-6'>pupil</a></li>
        <li><a href='https://github.com/krad/memento' className='subtitle is-6'>memento</a></li>
        <li><a href='https://github.com/krad/slugline' className='subtitle is-6'>slugline</a></li>
      </ul>
    </Column>
  )
}

function StreamersColumn(props) {
  return (
    <Column>
      <h3 className='title is-5'>Streamers</h3>
      <a className='subtitle is-6'>How to stream content</a>
    </Column>
  )
}

function AdvertisersColumn(props) {
  return (
    <Column>
      <h3 className='title is-5'>Advertisers</h3>
      <a className='subtitle is-6'>How to advertise</a>
    </Column>
  )
}


export default Footer
