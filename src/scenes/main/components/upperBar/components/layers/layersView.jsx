import React from 'react';
import Guid from 'guid';
import {resources} from '../../../../../../shared/data/resources.js'; 

//CONSTS
const imageStyle = {
    maxHeight: resources.IMG.MAX_HEIGHT,
    width: 'auto',
    height: 'auto'
};

const componentStyle = {
    containerDiv : {
        display: 'inline-block',
        float: 'right',
        maxHeight: '100%',
        maxWidth: '400px',
        overflow: 'hidden'
    }, 
    li : {
        listStyle: 'none',
        marginRight: '15px',
    },
    ul : {
        marginTop: '16px',
        display: 'inline-flex',
    }
};

export default class Layers extends React.Component {

    render() {
        return (
            <div style = {componentStyle.containerDiv}>
                <ul style = {componentStyle.ul}>
                    {this.props.layers.map((layer, idx) => 
                    <li key={idx} style = {componentStyle.li}>
                        <img style={imageStyle} 
                            id = {Guid.create()}
                            src={layer.imgUrl}
                            onClick = {() =>  this.props.actions.setActiveLayer(idx)}
                        />
                    </li>)}
                </ul>
            </div>
        );
    }
}


