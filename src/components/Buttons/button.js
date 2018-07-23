import React from 'react'

function Button(props) {
  const style = props.style || 'button is-dark'
  return (
    <a onClick={props.onClick} className={style}>
      {props.children}
    </a>
  )
}

function Icon(props) {
  return (
    <span className='icon is-small'>
      <i className={props.icon}></i>
    </span>
  )
}

export { Button, Icon }
