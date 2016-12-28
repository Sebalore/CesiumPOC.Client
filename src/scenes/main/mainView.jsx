import React, {Component} from 'react';

//inner components
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';

// resources
import resources from '../../shared/data/resources';

const initialViewState = {
  activeLayerIndex: 0,
  layers: [
    {
      name: resources.DMA,
      imgUrl: resources.BASE_IMG_URL + '/tank_gqfsf8.png',
      actions: [
        {
          id: resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC

        }
      ],
      entities: [
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
      ]
    }, {
      name: resources.UAV,
      imgUrl: resources.BASE_IMG_URL + '/jet_ppnyns.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC

        }
      ],
      entities: []
    }
  ]
};

export default class Main extends Component {

  render() {
    return (
      <div className="mainContainer">
        
        <CesiumView
          layers={initialViewState.layers}
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]}/>
      </div>
    );
  }
}

/*
<UpperBar
          layers={initialViewState.layers}
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]}/>
*/
