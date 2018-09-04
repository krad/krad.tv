import React from 'react';
import './middle-box.css'

function MiddleBox(props) {

  let boxWidth
  let titleWidth
  switch (props.width) {
    case 'wide':
      boxWidth   = 'column is-10 is-5'
      titleWidth = 'title is-5 box-title'
      break;
    default:
      boxWidth   = 'column is-5'
      titleWidth = 'title is-5 box-title'
  }

  return (
    <div className='columns is-centered middle-box'>
      <div className={boxWidth}>
        <h3 className={titleWidth}>{props.title}</h3>
        <div className='box'>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default MiddleBox
