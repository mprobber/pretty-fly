// @flow
import { observable, action, computed } from 'mobx';
import Vector from './Vector';
import { getCurrentPosition } from '../utils/geometry';

type AttributesType = [
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  boolean,
  number,
  number,
  number,
  mixed,
  number,
];
export default class Plane {
  colors = {};

  @observable
  callsign: string;
  @observable
  countryOfOrigin: string;
  @observable
  timestamp: number;
  @observable
  lastContact: number;
  @observable
  longitude: number;
  @observable
  latitude: number;
  @observable
  barometricAltitude: number;
  @observable
  onGround: boolean;
  @observable
  verticalRate: number;
  @observable
  geometricAltitude: number;
  @observable
  vector: Vector;
  @observable
  red = Math.random() * 255;
  @observable
  green = Math.random() * 255;
  @observable
  blue = Math.random() * 255;

  constructor(openSkyResponse: AttributesType) {
    this.updatePlane(openSkyResponse);
  }

  @action
  updatePlane = (attributes: AttributesType) => {
    const [
      callsign,
      countryOfOrigin,
      timestamp,
      lastContact,
      longitude,
      latitude,
      barometricAltitude,
      onGround,
      velocity,
      heading,
      verticalRate,
      ,
      geometricAltitude,
    ] = attributes;

    const vector = Vector.fromHeading({ velocity, heading, verticalRate });

    Object.assign(this, {
      callsign,
      countryOfOrigin,
      timestamp,
      lastContact,
      barometricAltitude,
      onGround,
      verticalRate,
      geometricAltitude,
      vector,
    });

    Object.assign(this, { latitude, longitude });
  };

  @computed
  get callString(): ?string {
    const match = this.callsign.trim().match(/^([^\d]+)(\d+)$/);
    if (match) {
      return match[1];
    }
    return undefined;
  }

  @computed
  get color(): ?string {
    const { callString, vector, onGround } = this;

    if (!callString || !vector.magnitude || onGround) {
      return undefined;
    }
    if (!this.colors[callString]) {
      const color = '#' + (((1 << 24) * Math.random()) | 0).toString(16);
      this.colors[callString] = color;
    }
    return this.colors[callString];
  }

  @computed
  get currentPosition() {
    return getCurrentPosition(
      this.vector.heading,
      this.vector.magnitude,
      this.timestamp,
      this.latitude,
      this.longitude,
    );
  }
}
