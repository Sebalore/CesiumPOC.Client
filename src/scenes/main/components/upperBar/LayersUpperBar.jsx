import React from 'react';

import LayersSelection from './LayersSelection.jsx';
import LayerActions from './LayerActions.jsx';

export default class LayersUpperBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={componentStyle}>
                <LayersSelection/>
                <LayerActions/>
            </div>
        );
    }
}

// React.PropTypes = {

// };

const componentStyle = {
    top: '0',
    left: '0',
    fontSize: '30px',
    backgroundColor: '#47494c'
};