import React from 'react';

function ErrorMessage(props) {
  if (props.error.code) {
    switch (props.error.code) {
      case 'ECONNABORTED':
        return <TimeoutErrorMessage {...props} />
      default:
        return <GeneralErrorMessage {...props} />
    }
  }

  switch (props.error.message) {
    case 'Network Error':
      return <NetworkErrorMessage {...props} />
    default:
      return <GeneralErrorMessage {...props} />
  }
}

function GeneralErrorMessage(props) {
  return (
    <ErrorBox title='Oooohhh nooooo!!!!'>
      <p>Something went wrong.</p>
      <p>Please try again</p>
    </ErrorBox>
  )
}

function TimeoutErrorMessage(props) {
  return (
    <ErrorBox title='Timed Out'>
      <p>Site took too long to respond</p>
      <p>Try loading again</p>
      <RetryButton {...props} />
    </ErrorBox>
  )
}

function NetworkErrorMessage(props) {
  return (
    <ErrorBox title='Network Trouble'>
      <p>Trouble connecting to the network.</p>
      <p>Please check your connection</p>
      <RetryButton {...props} />
    </ErrorBox>
  )
}

function NoResultsErrorMessage(props) {
  return (
    <ErrorBox title='No results found'>
      <p>Couldn't find what you were looking for, sorry.</p>
    </ErrorBox>
  )
}


function RetryButton(props) {
  return (
    <a className='button' onClick={props.retry}>
      <span className='icon'>
        <i className='fa fa-sync'></i>
      </span>
      <span>Retry</span>
    </a>
  )
}

function ErrorBox(props) {
  let boxWidth   = 'column is-6 is-offset-3'
  let titleWidth = 'title is-5 box-title'

  return (
    <div className='section'>
    <div className='container'>
      <div className={boxWidth}>
        <h3 className={titleWidth}>{props.title}</h3>
        <div className='box error-box'>
          {props.children}
        </div>
      </div>
    </div>
  </div>)
}

export default ErrorMessage
export { NoResultsErrorMessage }
