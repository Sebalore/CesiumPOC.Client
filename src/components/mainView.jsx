import React, {Component} from 'react';

//inner components
import actions from '../flux/actions';
import store from '../flux/store';
import CesiumView from './cesium/cesiumView';
import EntityTypes from './entityTypes/entityTypesView';
import AddEntity from './addEntity/addEntityView';

// resources
import {resources} from '../shared/data/resources';

export default class Main extends Component {

  componentWillMount() {
    this.setEntityTypes(store.data.entityTypes);
    this.setAddableEntityTypesInfo(store.data.entityTypes);
    store.on('entityTypesChanged', this.setEntityTypes.bind(this));
    store.on('activeEntityTypesChanged', this.setAddableEntityTypesInfo.bind(this));
  }

  componentDidMount() {
    store.on('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions.bind(this.refs.cesium));
    
    //window.dispatcher.dispatch({type: 'DEBUG_1'});
    actions.listenForServerActions();
  } 

  componentWillUnmount() {
    store.removeListener('entityTypesChanged', this.setEntityTypes);
    store.removeListener('activeEntityTypesChanged', this.setAddableEntityTypesInfo);
    store.removeListener('contextAwareActionExecuted', this.refs.cesium.handleContextAwareActions);
  }

  setEntityTypes(entityTypes) {
    this.setState({entityTypes});
  }

  setAddableEntityTypesInfo(entityTypes) {
    this.setState({
      addableEntityTypesInfo: entityTypes
      .filter(l => {
          const add = resources.ACTIONS.ADD;
          const hasUserAgent = add.AGENTS.some(agent => agent === resources.AGENTS.USER);
          const hasLayer = true; 
          return l.active && hasUserAgent && hasLayer;
      }).map(l =>{
        return {name: l.name, imgUrl: resources.ENTITY_TYPES[l.name].ACTIONS.ADD.IMG};
      })
    });
  }

  setIconStyle(imgName) {
    const lastSlash = imgName.lastIndexOf('/');
    const parsedImage = imgName.substring(lastSlash + 1, imgName.length);
    const newStyle = JSON.parse(JSON.stringify(componentStyle.icon)); // deep cloning
    const concreteDisplay = `url(${resources.IMG.BASE_URL}${parsedImage}) no-repeat 50% 50%`;

    newStyle.WebkitMask = concreteDisplay;
    newStyle.mask = concreteDisplay;

    return newStyle;
  }

  render() {
    if (this.state && this.state.entityTypes) {
      return (
        <div className="mainContainer" style={componentStyle}>
          <div style={componentStyle.mainComponentSon}>
            <EntityTypes 
              entityTypes={this.state.entityTypes} 
              actions={actions} 
              setIconStyle={this.setIconStyle}/>
            <AddEntity
              entityTypesInfo={this.state.addableEntityTypesInfo}
              actions={actions}
              setIconStyle={this.setIconStyle}/>
          </div>
          <CesiumView 
            entityTypes={this.state.entityTypes} 
            actions={actions} 
            ref='cesium'
          />
        </div>
      );
    } else {
      return (
        <div>there is a problem, please refresh the page</div>
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
