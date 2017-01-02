
export function * linearCoordinatesGenerator(origin, destination, velocity) {
    var currentPosition = origin;

    for(let i = 0 ; i < 5 ; i ++) {
        currentPosition = {
            longitude: currentPosition.longitude + velocity.longitude * 100000000,
            latitude: currentPosition.latitude + velocity.latitude * 100000000,
            height: currentPosition.height
        };
        yield currentPosition;
    }
}

