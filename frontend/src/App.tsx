import React from 'react';
import logo from './logo.svg';
import { ChatComponent } from './chatComponent';
import './App.css';
import { ClientRequest } from 'http';

function App() {

  return (
    <>
      <div className='header'>
        <h1>Simple Chat example</h1>
      </div>
      <div className="App-header">
        <ChatComponent/>

      </div>
    </>
  );
}

export default App;
