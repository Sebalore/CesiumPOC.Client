
export function * linearCoordinatesGenerator(origin, destination, velocity) {
    var currentPosition = origin;
    // console.log(JSON.stringify(currentPosition));
    // console.log(JSON.stringify(destination));
    while (currentPosition.height <= destination.height) {
        console.log(JSON.stringify(currentPosition));
        currentPosition = {
            longitude: currentPosition.longitude + velocity.longitude,
            altitude: currentPosition.altitude + velocity.altitude,
            height: currentPosition.height + velocity.height
        };
        yield currentPosition;
    }
}

