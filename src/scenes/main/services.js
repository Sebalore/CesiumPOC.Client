export function createLinearCoordinatesGenerator (velocity) {
    return function * (origin) {
        const forever = true;
        while (forever) {
            let currentPosition = origin;
            for (let i = 0; i < 64; i++) {
                currentPosition = {
                    longitude: currentPosition.longitude + velocity.longitude,
                    latitude: currentPosition.latitude + velocity.latitude,
                    //height: currentPosition.height + velocity.height
                };
                yield currentPosition;
            }
        }
    }
}

export function getDistanceBetweenPoints(point1, point2) {
    // const φ1 = lat1.toRadians();
    // const φ2 = lat2.toRadians();
    // const Δφ = (lat2-lat1).toRadians();
    // const Δλ = (lon2-lon1).toRadians();

    const φ1 = point1.latitude;
    const φ2 = point2.latitude;
    const Δφ = point2.latitude - point1.latitude;
    const Δλ = point2.longitude - point1.longitude;
    const R = 6371e3; // metres


    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c;

    return d;    
}
