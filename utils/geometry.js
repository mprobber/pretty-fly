// @flow

export const radiusOfEarth = 6378100;

export const toRadians = (angle: number) => angle * (Math.PI / 180);
export const toDegrees = (angle: number) => angle * (180 / Math.PI);

export const getCurrentPosition = (
  heading: number,
  velocity: number,
  time: number,
  latitude: number,
  longitude: number,
) => {
  if (!velocity) {
    return;
  }
  // make sure this is in seconds
  const distance = velocity * (Date.now() / 1000 - time);

  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const h = toRadians(heading);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / radiusOfEarth) +
      Math.cos(lat1) * Math.sin(distance / radiusOfEarth) * Math.cos(h),
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(h) * Math.sin(distance / radiusOfEarth) * Math.cos(lat1),
      Math.cos(distance / radiusOfEarth) - Math.sin(lat2) * Math.sin(lat2),
    );

  return { latitude: toDegrees(lat2), longitude: toDegrees(lon2) };
};
