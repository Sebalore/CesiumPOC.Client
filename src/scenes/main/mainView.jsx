import React, {Component} from 'react';

//inner components
import actions from './actions'; 
import store from './store';
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';

import {resources} from '../../shared/data/resources.js'; 
/*
const initialViewState = {
  activeLayerIndex: 0,
  layers: [
    {
      name: resources.DMA,
      imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
      actions: [
        {
          id: resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png'
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
      imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [
        {
          id: null, //guid to be provided by cesium
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
  ]
};
*/

export default class Main extends Component {

  componentWillMount() {
    window.store = store;
    this.setState({
      layers: store.data.layers,
      activeLayer: store.data.layers[store.data.activeLayerIndex]
    });    
    store.on('activeLayerChanged', (err, activeLayer) =>{
      if (!err) {
        this.setState({
          activeLayer: activeLayer
        });
      } else {
        console.error(err);
      }
    });
    // store.on('change', ()=>{
    //   this.setState({
    //     data: store.getData()
    //   })
    // })
  }

  render() {
    if (this.state && this.state.layers) {
      const layers = this.state.layers;
      const activeLayer = this.state.activeLayer;
      const { update, setActiveLayer } = actions;
      return (
        <div className="mainContainer">
          <UpperBar 
            layers={layers} 
            activeLayer={activeLayer}
            actions = {actions}
          />
          <CesiumView 
            layers={layers} 
            activeLayer={activeLayer}
            actions = {actions}           
          />
        </div>
      );      
    } else {
      return (<div>.....WTF?</div> );
    }
  }
}
