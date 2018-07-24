import React from 'react';
import './middle-box.css'

function MiddleBox(props) {
  return (
    <div className='section'>
      <div className='container'>
        <div className='column is-6 is-offset-3'>
          <h3 className='title is-5 box-title'>{props.title}</h3>
          <div className='box'>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiddleBox
