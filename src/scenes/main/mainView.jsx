import React, {Component} from 'react';
import Guid from 'guid';

//inner components
import actions from './actions'; 
import store from './store';
import CesiumView from './components/cesium/cesiumView';
import Layers from './components/layers/layersView';
import AddEntity from './components/addEntity/addEntityView';
import {resources} from '../../shared/data/resources'; 

export default class Main extends Component {

  componentWillMount() {
    this.setState({
      layers: store.data.layers
    });    
    store.on('change', this.setLayers.bind(this));
  }

  componentDidMount() {
    store.on('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions.bind(this.refs.cesium));
    
    window.dispatcher.dispatch({type: 'DEBUG_1'});
  }

  componentWillUnmount() {
    store.removeListener('change', this.setLayers);
    store.removeListener('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions);
  }

  setLayers(data) {
    this.setState({
      layers: store.data.layers
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
            ref='cesium'         
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
