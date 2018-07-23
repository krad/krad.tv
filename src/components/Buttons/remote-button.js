import React, { Component } from 'react'
import { Button, Icon } from './button'

class RemoteButton extends Component {
  constructor(props) {
    super(props)
    this.state        = { loading: false, selected: props.selected }
    this.iconPosition = props.iconPosition || 'before'
    this.style        = props.style || 'button is-dark'
    this.spacer       = '&nbsp;'
    this.handleClick  = this.handleClick.bind(this)
    this.onSuccess    = props.onSuccess
  }

  handleClick() {
    this.setState({loading: true})
    setTimeout(() => {
      this.setState({loading: false})
      this.onSuccess(this.props.value)
    }, 1000)
  }

  render() {
    if (this.state.loading) {
      return <LoadingButton {...this} />
    }

    if (this.state.selected) {
      return <SelectedButton {...this.props} />
    } else {
      return <NotSelectedButton {...this} {...this.props} />
    }
  }
}

function SelectedButton(props) {
  return <Button><span>{props.selectedState}</span></Button>
}

function NotSelectedButton(props) {
  let buttonContents = [<span key='name'>{props.name}</span>]

  if (props.icon) {
    if (props.iconPosition === 'before') {
      buttonContents.unshift(<Icon key='icon' icon={props.icon} />)
    } else {
      buttonContents.push(<Icon key='icon' icon={props.icon} />)
    }
  }

  return (
    <Button onClick={props.handleClick} {...props}>
      {buttonContents}
    </Button>
  )
}

function LoadingButton(props) {
  return <Button style={props.style + ' is-loading'}>{props.spacer}</Button>
}

export default RemoteButton
