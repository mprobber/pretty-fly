// @flow
import * as React from 'react';
import styled from 'styled-components';

export default class Map extends React.Component {
  state = { running: false, width: null, height: null };
  ref: React.ElementRef<*>;

  componentDidMount() {
    const { width, height } = this.ref.getBoundingClientRect();
    this.setState({ width, height, running: true }, () =>
      window.requestAnimationFrame(this.draw),
    );
  }

  draw = () => {
    const {
      ref,
      state: { running, width, height },
    } = this;

    if (!ref || !running) {
      return;
    }

    const lat = height / 180;
    const lon = width / 360;

    const ctx = ref.getContext('2d');

    Object.keys(this.props.sky.planes).forEach(icao => {
      const plane = this.props.sky.planes[icao];
      if (!plane.color) {
        return;
      }

      const { currentPosition } = plane;

      if (!currentPosition) {
        return;
      }

      const y = height - (currentPosition.latitude + 90) * lat;
      const x = (currentPosition.longitude + 180) * lon;

      ctx.fillStyle = plane.color;
      ctx.fillRect(x, y, 0.3, 0.3);
    });
    setTimeout(() => window.requestAnimationFrame(this.draw), 100);
  };

  canvasRef = (ref: React.ElementRef<*>) => {
    this.ref = ref;
  };

  render() {
    return (
      <Canvas
        width={this.state.width}
        height={this.state.height}
        ref={this.canvasRef}
      />
    );
  }
}

const Canvas = styled.canvas`
  position: fixed;
  width: 100%;
  height: 100%;
`;
