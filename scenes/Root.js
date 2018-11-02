// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled, { createGlobalStyle } from 'styled-components';
import Sky from '../models/Sky';
import Map from '../components/Map';
import { normalize } from 'polished';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    background-color: #000;
}
${normalize()}`;

class App extends Component<{}> {
  sky: Sky = new Sky();

  componentDidMount() {
    this.sky.fetch();
    window.sky = this.sky;
  }

  render() {
    return (
      <Background>
        <Map sky={this.sky} />
        <BodyStyles />
      </Background>
    );
  }
}

const Background = styled.div`
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export default observer(App);
