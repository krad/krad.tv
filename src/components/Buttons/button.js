import React, { Component } from 'react'

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {isLoading: false}
    this.style = 'button is-dark'

    this.icons = {
      'Like': 'fas fa-thumbs-up',
      'Dislike': 'fas fa-thumbs-down',
      'Report': 'fas fa-flag'
    }

    const iconClass = this.icons[this.props.name] || 'fas'
    this.matched = props.name.toLowerCase() === props.opinion ? true : false
    if (this.matched) {
      this.contents = <span> {props.name+'d!'} </span>
    } else {
      this.contents = <span><Icon icon={iconClass} /><span>{props.name}</span></span>
    }

  }

  render() {

    return (
      <a className='button is-dark'>
        {this.contents}
      </a>
    )
  }
}

function Icon(props) {
  return (
    <span className='icon is-small'>
      <i className={props.icon}></i>
    </span>
  )
}

export { Button }
