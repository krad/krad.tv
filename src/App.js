import React, { Component } from 'react';
import Header from './components/header'
import Footer from './components/footer'
import Player from './components/player'
import './App.css';

class App extends Component {
  render() {
    return (
      <main className='container'>
        <Header />
        <Player />
        <Footer />
      </main>
    );
  }
}

export default App;
