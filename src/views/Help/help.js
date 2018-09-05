import React, { Component } from 'react'
import LoadingIndicator from '../../components/Loaders/bubbles'
import ErrorMessage from '../Error/error'
import Markdown from 'react-markdown'
import client from '../../network/client'
import './help.css'

const Help = ({ match }) => {
  return <RemoteMarkDownRender {...match.params} />
}

export class RemoteMarkDownRender extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false }
  }

  componentDidMount() {
    this.setState({loading: true})
    let url = urlFor(this.props.article || 'help')
    client.get(url).then(res => {
      this.setState({data: res.data, loading: false, error: undefined})
    }).catch(err => {
      this.setState({error: err})
    })
  }

  render() {
    if (this.state.loading) { return <LoadingIndicator /> }
    if (this.state.error) { return <ErrorMessage /> }

    return (
    <section className='section'>
      <div className='container box help-section'>
        <Markdown source={this.state.data} />
      </div>
    </section>)
  }
}


const urlFor = (article) => {
  if (process.env.NODE_ENV === 'development') {
    return devURL(article)
  }

  return `/${article}.md`
}

const devURL = (article) => {
  return `http://0.0.0.0:3001/${article}.md`
}

export default Help
