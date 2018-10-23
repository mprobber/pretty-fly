// @flow
import { observable, action, computed } from 'mobx';
import Vector from './Vector';
import { getCurrentPosition } from '../utils/geometry';

export default class Plane {
  colors = {};

  @observable
  callsign;
  @observable
  countryOfOrigin;
  @observable
  timestamp;
  @observable
  lastContact;
  @observable
  longitude;
  @observable
  latitude;
  @observable
  barometricAltitude;
  @observable
  onGround;
  @observable
  verticalRate;
  @observable
  geometricAltitude;
  @observable
  vector;
  @observable
  red = Math.random() * 255;
  @observable
  green = Math.random() * 255;
  @observable
  blue = Math.random() * 255;

  constructor(openSkyResponse: Object[]) {
    this.updatePlane(openSkyResponse);
  }

  @action
  updatePlane(attributes) {
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
      longitude,
      latitude,
      barometricAltitude,
      onGround,
      verticalRate,
      geometricAltitude,
      vector,
    });
  }

  @computed
  get callString(): ?string {
    const match = this.callsign.trim().match(/^([^\d]+)(\d+)$/);
    if (match) {
      return match[1];
    }
    return undefined;
  }

  @computed
  get color(): string {
    if (!this.callString || !this.vector.magnitude || this.onGround) {
      return undefined;
    }
    if (!this.colors[this.callString]) {
      const color = '#' + (((1 << 24) * Math.random()) | 0).toString(16);
      this.colors[this.callString] = color;
    }
    return this.colors[this.callString];
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
