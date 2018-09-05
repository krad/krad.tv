import React, { Component } from 'react';
import { BroadcastList } from '../Home/home'
import { NoResultsErrorMessage } from '../Error/error'


class SearchResults extends Component {
  constructor(props) {
    super(props)
    this.state = {broadcasts: props.location.state.searchResults.search}
  }

  render() {
    if (this.state.broadcasts) {
      return <BroadcastList broadcasts={this.state.broadcasts} />
    }

    return <NoResultsErrorMessage />
  }

}

export default SearchResults
