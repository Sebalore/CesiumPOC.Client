import React from 'react';
import Guid from 'guid';

//CONSTS
import {resources} from '../../../../shared/data/resources';

const componentStyle = {
    containerDiv : {
        color: 'blue',
        display: 'inline-block',
        float: 'left',
        maxHeight: '50px',
        maxWidth: '300px',
        listStyle: 'none'
    }, 
    li : {
        listStyle: 'none',
    },
    ul : {
         display: 'inline-flex',
         margin: '7px 0',
    }
};

const imageStyle = {
    maxHeight: resources.IMG.MAX_HEIGHT,
    width: 'auto',
    height: 'auto'
};

export default class AddEntity extends React.Component {
    render() {
        if (this.props.layers) {
            return (
                <div style = {componentStyle.containerDiv}>
                    <ul style = {componentStyle.ul}>
                        {this.props.layers.map((layer, idx) => 
                        <li key={idx} style={componentStyle.li} > 
                            <img
                                style={imageStyle}
                                id={Guid.create()}
                                src={layer.imgUrl}
                                draggable='true'
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', e.target.id);
                            }}/>
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
