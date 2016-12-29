import React, {Component} from 'react';

//inner components
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';
// import {resources} from './shared/data/resources';

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
      entities: [
        {
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
    }
  ]
};

<<<<<<< HEAD
//resources
const  resources = require('shared/data/resources');
const initialViewState = {
    activeLayerIndex: 0,
    layers: [
        {
            name : resources.DMA,
            imgUrl : resources.IMG.BASE_URL + '/tank_gqfsf8.png',
            actions: [
              {
                id : resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
                description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
                imgUrl : resources.IMG.BASE_URL + '/tank_gqfsf8.png'
              }
            ],
            entities:[
              {

              }
            ]
        },{
            name : resources.UAV,
            imgUrl : resources.IMG.BASE_URL + '/jet_ppnyns.png',
            actions: [
              {
                id : resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
                description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
                imgUrl : resources.IMG.BASE_URL + '/jet_ppnyns.png'
              }
            ],
            entities: [
              {
                id : null, //guid to be provided by cesium
                position: {
                  longitude: -75.1668043913917,
                  latitude: 39.90610546720464,
                  height: 1.0
                },
                billboard: {
                  image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
                  scale: 0.95
                }
              }, {
                id: null, //guid to be provided by cesium
                position: {
                  longitude: -75.16617698856817,
                  latitude: 39.90607492083895,
                  height: 1.0
                },
                billboard: {
                  image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
                  scale: 0.95
                }
              }
            ]
        }
    ],
};

const store = [initialViewState];

=======
>>>>>>> d2bb99f7da83f841879b231275d2dc8c6217d8b0
export default class Main extends Component {


  onAddEntity = (entity, layerName) => {
      store[0].layers[layerName].entities.push(entiy);
      console.log(`${entity.id} added to ${layerName} layer.`);
  };

  onRemovEntity = (entity, layerName) => {
      store[0].layers[layerName].entities = 
        store[0].layers[layerName].entities.filter(e => !e.id || e.id!==entity.id);
      console.log(`${entity.id} removed from ${layerName} layer.`);
  };

  onUpdateEntityPosition = (entity, layerName) => {
      const idx = store[0].layers[layerName].entities.findIndex(e => e.id === entiy.id);
      if (idx) {
        store[0].layers[layerName].entities[idx].position = entity.position;
        console.log(`${entity.id} of ${layerName} layer had changed position to ${entity.position}.`);
      } else {
        console.error(`${entity.id} was not found in ${layerName} layer.`);
      }
  };

  render() {
    return (
      <div className="mainContainer">
<<<<<<< HEAD
        <UpperBar 
          layers={initialViewState.layers} 
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]}
        />
        <CesiumView 
          layers={initialViewState.layers} 
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]} 
          onAddEntity =  {this.onAddEntity}
          onRemovEntity = {this.onRemovEntity}
          onUpdateEntityPosition = {this.onUpdateEntityPosition}

        />
=======
        
        <CesiumView
          layers={initialViewState.layers}
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]}/>
>>>>>>> d2bb99f7da83f841879b231275d2dc8c6217d8b0
      </div>
    );
  }
}

/*
<UpperBar
          layers={initialViewState.layers}
          activeLayer={initialViewState.layers[initialViewState.activeLayerIndex]}/>
*/
