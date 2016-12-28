import React, {Component} from 'react';

//inner components
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';


const baseCloudURL = 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391';
const images = [
    baseCloudURL + '/tank_gqfsf8.png', //tankURL
    baseCloudURL + '/jet_ppnyns.png' //jetURL
];
export default class Main extends Component {

  render() {
    return (
      <div className="mainContainer">
        <UpperBar images = {images} />
        <CesiumView />
      </div>
    );
  }
}
