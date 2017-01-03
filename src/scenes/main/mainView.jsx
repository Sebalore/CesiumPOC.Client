import React, {Component} from 'react';

//inner components
import actions from './actions';
import store from './store';
import CesiumView from './components/cesium/cesiumView';
import Layers from './components/layers/layersView';
import AddEntity from './components/addEntity/addEntityView';
import {resources} from '../../shared/data/resources';

export default class Main extends Component {

  componentWillMount() {
    this.setLayers(store.data.layers);
    this.setAddableEntityLayersInfo(store.data.layers);
    store.on('layersChanged', this.setLayers.bind(this));
    store.on('activeLayersChanged', this.setAddableEntityLayersInfo.bind(this));
    
  }

  componentDidMount() {
    store.on('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions.bind(this.refs.cesium));
    window.dispatcher.dispatch({type: 'DEBUG_1'});
  } 

  componentWillUnmount() {
    store.removeListener('change', this.setLayers);
    store.removeListener('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions);
  }

  setLayers(layers) {
    this.setState({layers});
  }

  setAddableEntityLayersInfo(layers) {
    this.setState({
      addableEntityLayersInfo: layers
      .filter(l => {
          const add = resources.ACTIONS.ADD;
          const hasUserAgent = add.AGENTS.find(agent => agent === resources.AGENTS.USER) !== undefined;
          const hasLayer = add.LAYERS.find(layer => layer === l.name) !== undefined;
          return l.active && hasUserAgent && hasLayer;
      }).map(l =>{
        return {name: l.name, imgUrl: l.imgUrl};
      })
    });
  }


  setIconStyle(imgName) {
    const lastSlash = imgName.lastIndexOf("/");
    const parsedImage = imgName.substring(lastSlash + 1, imgName.length);
    const newStyle = JSON.parse(JSON.stringify(componentStyle.icon)); // deep cloning
    const concreteDisplay = `url(${resources.IMG.BASE_URL}${parsedImage}) no-repeat 50% 50%`;

    newStyle.WebkitMask = concreteDisplay;
    newStyle.mask = concreteDisplay;

    return newStyle;
  }

  render() {
    if (this.state && this.state.layers) {
      return (
        <div className="mainContainer" style={componentStyle}>
          <div style={componentStyle.mainComponentSon}>
            <Layers 
              layers={this.state.layers} 
              actions={actions} 
              setIconStyle={this.setIconStyle}/>
            <AddEntity
              layersInfo={this.state.addableEntityLayersInfo}
              actions={actions}
              setIconStyle={this.setIconStyle}/>
          </div>
          <CesiumView 
            layers={this.state.layers} 
            actions={actions} 
            ref='cesium'/>
        </div>
      );
    } else {
      return (
        <div>.....WTF?</div>
      );
    }
  }
}

const componentStyle = {

  position: 'fixed',
  height: '100%',
  width: '100%',
  top: '0',
  left: '0',
  mainComponentSon: {
    top: '0',
    left: '0',
    fontSize: '30px',
    width: '91vw',
    height: '6vh',
    margin: '0 auto'
  },
  icon: {
    width: '48px',
    height: '100%',
    display: 'inline-block',
    WebkitMaskSize: 'cover',
    maskSize: 'cover',
    backgroundColor: 'white'
  },
};
