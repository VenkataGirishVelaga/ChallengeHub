import { getDistance } from "geolib";

export function calculateDistance(
  prevLat: number,
  prevLng: number,
  currLat: number,
  currLng: number
) {
  return getDistance(
    {
      latitude: prevLat,
      longitude: prevLng,
    },
    {
      latitude: currLat,
      longitude: currLng,
    }
  );
}