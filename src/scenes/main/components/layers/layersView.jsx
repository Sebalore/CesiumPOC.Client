import React from 'react';
import Guid from 'guid';
import {resources} from '../../../../shared/data/resources'; 

//CONSTS
const componentStyle = {
    containerDiv : {
        display: 'inline-block',
        float: 'right',
        maxHeight: '100%',
        maxWidth: '400px',
        overflow: 'hidden',
        // border: '2px solid black',
        // marginTop: '-2px',
        // marginRight: '-2px'
    }, 
    li : {
        width: '6vw',
        listStyle: 'none',
    },
    liSelected : {
        border: '1px solid white'
    },
    ul : {
        margin: '0',
        marginTop: '8px',
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

                        <div 
                            id={Guid.create()} 
                            style={this.props.setIconStyle(layer.imgUrl)} 
                            draggable='false' 
                            onClick = {() =>  this.props.actions[resources.ACTIONS.TOGGLE_LAYER.TYPE](resources.AGENTS.USER,{layerName: layer.name})}
                        />
                    </li>)}
                </ul>
            </div>
        );
    }
}


