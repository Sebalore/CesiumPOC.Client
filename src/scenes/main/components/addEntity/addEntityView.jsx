import React from 'react';
import Guid from 'guid';

//CONSTS
import {resources} from '../../../../shared/data/resources';

const componentStyle = {
    containerDiv: {
        display: 'inline-block',
        float: 'left',
        maxHeight: '100%',
        width: '32.7vw',
        marginLeft: '1px',
        listStyle: 'none',
        backgroundColor: '#47494c',
        border: '2px solid black',
    },
    li: {
        width: '2vw',
        listStyle: 'none',
        marginLeft: '25px',
    },
    ul: {
        display: 'inline-flex',
        margin: '0',
        marginTop: '8px',
        float: 'right',
        marginRight: '14px',
    },
    image: {
        maxHeight: resources.IMG.MAX_HEIGHT,
        width: '100%',
        height: '100%',
        color: 'white',
        fill: 'currentColor'
    }
};

export default class AddEntity extends React.Component {
    render() {
        if (this.props.layers) {
            return (
                <div style={componentStyle.containerDiv}>
                    <ul style={componentStyle.ul}>
                        <li style={componentStyle.li}>
                            <div style={this.props.setIconStyle('icon_7.svg')} draggable='false'/>
                        </li>
                        <li style={componentStyle.li}>
                            <div style={this.props.setIconStyle('icon_8.svg')} draggable='false'/>
                        </li>
                        {this.props.layers.map((layer, idx) => <li key={idx} style={componentStyle.li}>
                                <div 
                                    id={Guid.create()} 
                                    data-layerName = {layer.name}
                                    style={this.props.setIconStyle(layer.imgUrl)} 
                                    draggable='true' 
                                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', e.target.id); }}
                                />
                            </li>)}
                    </ul>
                </div>
            );
        } else {
            return (
                <div style={componentStyle.containerDiv}>
                    .....
                </div>
            );
        }
    }
}
