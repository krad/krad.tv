import React from 'react'
import RemoteButton from './remote-button'

function LikeBroadcastButton(props) {
  return (
    <RemoteButton
      name='Like'
      value='like'
      selectedState='Liked!'
      selected={props.selected}
      icon='fas fa-thumbs-up'
      broadcast={props.broadcast}
      onSuccess={props.onSuccess}
    />
  )
}

function DislikeBroadcastButton(props) {
  return (
    <RemoteButton
      name='Dislike'
      value='dislike'
      selectedState='Disliked :('
      selected={props.selected}
      icon='fas fa-thumbs-down'
      broadcast={props.broadcast}
      onSuccess={props.onSuccess}
    />
  )
}

function ReportBroadcastButton(props) {
  return (
    <RemoteButton
      name='Report'
      value='flag'
      selectedState='Reported!'
      selected={props.selected}
      icon='fas fa-flag'
      broadcast={props.broadcast}
      onSuccess={props.onSuccess}
    />
  )
}

function SubscribeButton(props) {
  return (
    <RemoteButton
      name='Subscribe'
      selectedState='Subscribed!'
      icon='fas fa-plus'
      onSuccess={props.onSuccess}
    />
  )
}

export { LikeBroadcastButton, DislikeBroadcastButton, ReportBroadcastButton, SubscribeButton}
