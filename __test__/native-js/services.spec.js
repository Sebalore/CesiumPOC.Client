import { isEmptyObject, isPointIsInsideCircle } from '../../src/utills/services'

describe('Test File: services.js || Function :: isEmptyObject', () => {
  it('should determine if the object is empty.', () => {
    // inputs
    const obj = {}
    const result = isEmptyObject(obj)

    // result
    const expectedResult = true

    expect(result).toEqual(expectedResult)
  })

  it('should determine if the object is empty.', () => {
    // inputs
    const obj = {
      key: 123
    }, 
    result = isEmptyObject(obj);

    // result
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });
});

describe('Test File: services.js || Function :: isPointIsInsideCircle', () => {
  it('should determine if point is in circle', () => {
    // inputs
    const p1 = {
        x: 0,
        y: 0
      },
      circle = {
        center: {
          x: 10,
          y: 10
        },
        radius: 3
    },
        
    result = isPointIsInsideCircle(p1.x, p1.y, circle.center.x, circle.center.y, circle.radius);

    // result
    const expectedResult = false;

    expect(result).toEqual(expectedResult);
  });
});
