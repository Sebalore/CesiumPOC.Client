
export function * linearCoordinatesGenerator(origin, destination, velocity) {
    var currentPosition = origin;

    for(let i = 0 ; i < 5 ; i ++) {
        currentPosition = {
            longitude: currentPosition.longitude + velocity.longitude,
            latitude: currentPosition.latitude + velocity.latitude ,
            height: currentPosition.height + velocity.height
        };
        yield currentPosition;
    }
}

