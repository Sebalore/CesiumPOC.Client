import React, {Component} from 'react';

//inner components
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';

const baseCloudURL = 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391';
const images = [
  baseCloudURL + '/tank_gqfsf8.png', //tankURL
  baseCloudURL + '/jet_ppnyns.png' //jetURL
];

const entities = [
  {
    position: {
      longitude: -75.1668043913917,
      latitude: 39.90610546720464,
      height: 1.0
    },
    billboard: {
      image: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391/tank_gqfsf8.png',
      scale: 0.95
    }
  }, {
    position: {
      longitude: -75.16617698856817,
      latitude: 39.90607492083895,
      height: 1.0
    },
    billboard: {
      image: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391/tank_gqfsf8.png',
      scale: 0.95
    }
  }
];
export default class Main extends Component {

  render() {
    return (
      <div className="mainContainer">
        <UpperBar images={images}/>
        <CesiumView entities={entities} />
      </div>
    );
  }
}
