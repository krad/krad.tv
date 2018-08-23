import React from 'react';
import './middle-box.css'

function MiddleBox(props) {

  let boxWidth
  let titleWidth
  switch (props.width) {
    case 'wide':
      boxWidth   = 'column is-10 is-offset-1'
      titleWidth = 'title box-title is-5'
      break;
    default:
      boxWidth   = 'column is-6 is-offset-3'
      titleWidth = 'title is-5 box-title'
  }

  return (
    <div className='section'>
      <div className='container'>
        <div className={boxWidth}>
          <h3 className={titleWidth}>{props.title}</h3>
          <div className='box'>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiddleBox
