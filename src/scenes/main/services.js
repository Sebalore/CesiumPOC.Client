
export function * linearCoordinatesGenerator(origin, destination, velocity) {
    var currentPosition = origin;
    // console.log(JSON.stringify(currentPosition));
    // console.log(JSON.stringify(destination));
    while (currentPosition.height <= destination.height) {
        console.log(JSON.stringify(currentPosition));
        currentPosition = {
            longitude: currentPosition.longitude + velocity.longitude,
            latitude: currentPosition.latitude + velocity.latitude,
            height: currentPosition.height + velocity.height
        };
        yield currentPosition;
    }
}

