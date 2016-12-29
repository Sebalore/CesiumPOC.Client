import React, {Component} from 'react';

//inner components
import actions from './actions'; 
import store from './store';
import CesiumView from './components/cesium/cesiumView';
import UpperBar from './components/upperBar/upperBarView';


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
