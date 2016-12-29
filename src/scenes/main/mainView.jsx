import React, {Component} from 'react';

//inner components
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';
// import {resources} from './shared/data/resources';




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
      </div>
    );
  }
}
