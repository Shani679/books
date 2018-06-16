import React, { Component } from 'react';
import './App.css';
import Library from'./components/Library/Library.js'
import styled from 'styled-components'

const AppContainer = styled.div`
  padding:30px;
  background: #5a5757;
  font-family: 'Lato', sans-serif;
`;

const Header = styled.header`
  text-align:center;
  display:flex;
  justify-content:center;
  color:#e0d5c3;
`



class App extends Component {
  render() {
    return (
      <AppContainer>
        <Header>
          <h1>Books Library</h1>
        </Header>
        <Library></Library>
      </AppContainer>

    );
  }
}

export default App;
