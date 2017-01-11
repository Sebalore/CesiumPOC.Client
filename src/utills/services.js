export function createLinearCoordinatesGenerator (velocity) {
    return function * (origin) {
        let forever = true;
        while (forever) {
            let currentPosition = origin;
            for (let i = 0; i < 32; i++) {
                currentPosition.longitude += velocity.longitude;
                currentPosition.latitude += velocity.latitude;
                currentPosition.height += velocity.height;
              
                yield currentPosition;
            }
        }
    }
}

/**
 * check if a given point is in circle
 * @param {Number} pointX  
 * @param {Number} pointY 
 * @param {Number} circleCenterX 
 * @param {Number} circleCenterY 
 * @param {Number} circleRadius 
 */
export function isPointIsInsideCircle(pointX, pointY, circleCenterX, circleCenterY, circleRadius) {
    const xDistance = pointX - circleCenterX,
        yDistance = pointY - circleCenterY, // simply calculate d = √[(xp−xc)2+(yp−yc)2]
        distanceBetweenPoints = Math.sqrt( (xDistance * xDistance) + (yDistance * yDistance) );

        return distanceBetweenPoints < circleRadius;
}

export function defined(object) {
    return (object !== undefined && object !== null);
}


/**
 * @param {Object} obj
 */
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
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
