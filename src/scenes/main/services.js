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
