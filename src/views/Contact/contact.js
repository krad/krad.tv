import React, { Component } from 'react';
import MiddleBox from '../../components/MiddleBox/middle-box'

class Contact extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      message: '',
    }
  }

  render() {
    return (
      <MiddleBox title='Contact Us' width='wide'>
        hi
      </MiddleBox>
    )
  }
}


export default Contact
