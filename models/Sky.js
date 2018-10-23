// @flow
import request from 'superagent';
import { observable, computed, runInAction } from 'mobx';
import Vector from './Vector';
import Plane from './Plane';

export default class Sky {
  @observable
  planes: { [string]: Plane } = {};

  _timer;

  @computed
  get averageSpeed(): number {
    const { v } = Object.keys(this.planes).reduce(
      (runningTotal, icao) => {
        const plane = this.planes[icao];

        return {
          v: runningTotal.v.add(plane.vector),
          count: runningTotal.count + 1,
        };
      },
      { v: new Vector({ x: 0, y: 0, z: 0 }), count: 0 },
    );

    return v.magnitude;
  }

  @computed
  get topCallsigns(): { [string]: number } {
    const counts = Object.keys(this.planes).reduce((count, icao) => {
      const plane = this.planes[icao];
      const airline = plane.callString;

      if (!airline) {
        return count;
      }

      if (!count[airline]) {
        count[airline] = 0;
      }
      count[airline]++;
      return count;
    }, {});

    return Object.keys(counts)
      .map(airline => ({
        airline,
        count: counts[airline],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  fetch = async () => {
    clearTimeout(this._timer);
    const response = await request.get(
      'https://opensky-network.org/api/states/all',
    );

    runInAction(() =>
      response.body.states.forEach(([icao, ...args]) => {
        if (this.planes[icao]) {
          this.planes[icao].updatePlane(args);
        } else {
          this.planes[icao] = new Plane(args);
        }
      }),
    );

    if (!window.plane) {
      window.plane = this.planes[Object.keys(this.planes)[0]];
    }
    this._timer = setTimeout(this.fetch, 10000);
  };
}
