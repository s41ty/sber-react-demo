// jshint esversion:6

import React from 'react';
import { createAssistant, createSmartappDebugger } from '@sberdevices/assistant-client';
import { SBER_TOKEN } from './token.js';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { commands: ["Starting..."] };
  }

  componentDidMount() {
    const state = {};
    const recoveryState = {};
    
    const initialize = (getState, getRecoveryState) => {
      if (process.env.NODE_ENV === 'development') {
          return createSmartappDebugger({ token: SBER_TOKEN, initPhrase: 'Запусти попкорн', getState, getRecoveryState });
      }
      return createAssistant({ getState, getRecoveryState });
    };
  
    const assistant = initialize(() => state, () => recoveryState);
  
    assistant.on('start', () => {
      console.log(`start`);
      let state = this.state;
      state.commands.push('Connected...');
      this.setState(state);
    });

    assistant.on('data', (command) => {
      console.log(`command: ${JSON.stringify(command)}`);
      let state = this.state;
      state.commands.push(JSON.stringify(command));
      this.setState(state);

      if (command.navigation) {
        switch(command.navigation.command) {
          case 'UP':
            break;
          case 'DOWN':
            break;
          default:
        }
      }
      else if (command.smart_app_data) {
        // ваша команда
      }
    });

    // eslint-disable-next-line
    const handleOnClick = (command) => {
      // отправка ServerAction
      assistant.sendData({ action: { action_id: 'some_action_name', parameters: command } });
    };
  }

  render() {
    return <div id="background">
             <div id="container">
             {this.state.commands.map(command => (
               <li>{command}</li>
             ))}
             </div>
           </div>;
  }
}

export default App;