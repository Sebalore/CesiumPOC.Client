import React from 'react';
import Guid from 'guid';

//CONSTS
import {resources} from '../../../../shared/data/resources';

const componentStyle = {
    containerDiv: {
        display: 'inline-block',
        float: 'left',
        height: '100%',
        width: '30.5vw',
        listStyle: 'none',
        backgroundColor: '#47494c',
        border: '2px solid black',
    },
    li: {
        width: '2vw',
        height: '100%',
        listStyle: 'none',
        marginLeft: '25px',
    },
    ul: {
        display: 'inline-flex',
        height: '100%',
        margin: 'auto 0',
        marginRight: '2.5vw',
        float: 'right',
        paddingLeft: '0'
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
                                    style={this.props.setIconStyle(layer.imgUrl)} 
                                    draggable='true' 
                                    onDragStart={(e) => { e.dataTransfer.setData('text', layer.name); }}
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
