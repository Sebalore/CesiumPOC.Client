import React from 'react';
import Guid from 'guid';
import {resources} from '../../../../shared/data/resources'; 

//CONSTS
const componentStyle = {
    containerDiv : {
        display: 'inline-block',
        float: 'right',
        maxHeight: '100%',
        // maxWidth: '70%',
        backgroundColor: '#47494c',
        border: '2px solid black',
        width: '57vw',
        overflow: 'hidden',
    }, 
    li : {
        width: '6vw',
        listStyle: 'none',
    },
    ul : {
        margin: '0',
        marginTop: '8px',
        display: 'inline-flex',
        float: 'right',
    }
};

export default class Layers extends React.Component {
    constructor(props) {
        super(props);

        this.onListItemClicked = this.onListItemClicked.bind(this);
    }

    onListItemClicked(layer, idx) {
        this.props.actions[resources.ACTIONS.TOGGLE_LAYER.TYPE](resources.AGENTS.USER,{layerName: layer.name});
        this.refs[`li_${idx}`].style.borderTop = layer.active ? '1px solid white' : '';
    }

    render() {
        return (
            <div style = {componentStyle.containerDiv}>
                <ul style = {componentStyle.ul}>
                    {this.props.layers.map((layer, idx) => 
                    <li key={idx} style = {componentStyle.li} ref={`li_${idx}`}>
                        <div 
                            id={Guid.create()} 
                            style={this.props.setIconStyle(layer.imgUrl)} 
                            draggable='false' 
                            onClick = {() =>  this.onListItemClicked(layer, idx)}
                        />
                    </li>)}
                </ul>
            </div>
        );
    }
}


