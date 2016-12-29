import React from 'react';
import Layers from './components/layers/layersView';
import ActiveLayer from './components/activeLayer/activeLayerView';

export default class UpperBar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
             <div style={componentStyle}>
                <Layers layers={this.props.layers}/>
                <ActiveLayer layer={this.props.activeLayer}/>
            </div>
        );
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