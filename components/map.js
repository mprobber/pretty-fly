// @flow
import * as React from 'react';
import styled from 'styled-components';
import type Sky from '../models/Sky';

type StateType = { running: boolean, width: number, height: number };

type PropsType = { sky: Sky };

export default class Map extends React.Component<PropsType, StateType> {
  // TODO add resize event listener
  state = { running: false, width: 0, height: 0 };
  ref: React.ElementRef<*>;

  componentDidMount() {
    const { width, height } = this.ref.getBoundingClientRect();
    this.setState({ width, height, running: true }, () =>
      window.requestAnimationFrame(this.draw),
    );
  }

  componentWillUnmount() {
    this.setState({ running: false });
  }

  draw = () => {
    const {
      ref,
      state: { running },
      aspectRatioWidthAndHeight: { width, height },
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

  get aspectRatioWidthAndHeight() {
    const { width, height } = this.state;
    const calculatedWidth = (16 * height) / 9;
    const calculatedHeight = (9 * width) / 16;

    if (calculatedWidth < width) {
      return { height, width: calculatedWidth };
    }

    return { height: calculatedHeight, width };
  }

  render() {
    const { width, height } = this.aspectRatioWidthAndHeight;
    return <Canvas width={width} height={height} ref={this.canvasRef} />;
  }
}

const Canvas = styled.canvas`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};
`;
