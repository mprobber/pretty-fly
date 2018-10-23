// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Sky from '../models/Sky';
import Map from '../components/map';

class App extends Component {
  sky: Sky = new Sky();

  componentDidMount() {
    this.sky.fetch();
    window.sky = this.sky;
  }

  render() {
    return (
      <div className="App">
        <Map sky={this.sky} />
      </div>
    );
  }
}

export default observer(App);
