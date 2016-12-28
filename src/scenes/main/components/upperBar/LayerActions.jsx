import React from 'react';

export default class LayerActions extends React.Component {
    render() {
        return (
            <div style = {componentStyle}>
                <h1>Hello LayerActions</h1>
            </div>
        );
    }    
}

// React.PropTypes = {

// };

const componentStyle = {
    color: 'blue',
    display: 'inline-block',
    float: 'right'
};