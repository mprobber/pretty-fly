// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { normalize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';
import Sky from './models/Sky';
import Map from './components/Map';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    background-color: #000;
    height: 100vh;
}
${normalize()}`;

class App extends Component<{}> {
  sky: Sky = new Sky();

  componentDidMount() {
    this.sky.fetch();
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.sky.title}</title>
        </Helmet>

        <Background>
          <Map sky={this.sky} />
          <BodyStyles />
        </Background>
      </React.Fragment>
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
