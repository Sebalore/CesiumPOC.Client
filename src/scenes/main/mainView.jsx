import React, {Component} from 'react';

//inner components
import actions from './actions'; 
import store from './store';
import CesiumView from './components/cesium/cesiumView';
import Layers from './components/layers/layersView';
import AddEntity from './components/addEntity/addEntityView';
import {resources} from '../../shared/data/resources.js'; 
/*
const initialViewState = {
  addEntityIndex: 0,
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
    this.setState({
      layers: store.data.layers
    });    
    store.on('change', (data) =>{
      this.setState({
        layers: store.data.layers
      });
    });
  }

  render() {
    if (this.state && this.state.layers) {
      const layers = this.state.layers;
      const addableEntityLayers = this.state.layers.filter(l => {
        const add = resources.ACTIONS.ADD;
        const hasUserAgent = add.AGENTS.find(agent => agent === resources.AGENTS.USER) !== undefined;
        const hasLayer = add.LAYERS.find(layer => layer === l.name) !== undefined;
        
        return l.active && hasUserAgent && hasLayer;
      });
      return (
        <div className="mainContainer">
          <div style={componentStyle}>
              <Layers 
                  layers={layers} 
                  actions={actions}
              />
              <AddEntity 
                  layers={addableEntityLayers} 
                  actions={actions}
              />
          </div>
          <CesiumView 
            layers={layers} 
            actions = {actions}  
            store = {store}         
          />
        </div>
      );      
    } else {
      return (<div>.....WTF?</div> );
    }
  }
}

const componentStyle = {
    top: '0',
    left: '0',
    fontSize: '30px',
    backgroundColor: '#47494c',
    width: '100vw',
    height: '6vh',
};
