// @flow
import { observable, computed } from 'mobx';
import { toDegrees, toRadians } from '../utils/geometry';

export default class Vector {
  @observable
  x: number;
  @observable
  y: number;
  @observable
  z: number;

  constructor(components: { x: number, y: number, z: number }) {
    Object.assign(this, components);
  }

  add(v: Vector): Vector {
    return new Vector({ x: this.x + v.x, y: this.y + v.y, z: this.z + v.z });
  }

  @computed
  get heading() {
    return toDegrees(Math.atan2(this.y, this.x));
  }

  @computed
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static fromHeading({
    velocity,
    heading,
    verticalRate,
  }: {
    velocity: number,
    heading: number,
    verticalRate: number,
  }) {
    const x = Math.cos(toRadians(heading)) * velocity;
    const y = Math.sin(toRadians(heading)) * velocity;
    const z = verticalRate;

    return new Vector({ x, y, z });
  }
}
