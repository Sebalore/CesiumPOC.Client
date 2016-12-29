import React from 'react';
import Guid from 'guid';
import {resources} from '../../../../../../shared/data/resources.js'; 

//CONSTS
// const componentStyle = {
//     color: 'GREEN',
//     display: 'inline-block',
//     maxHeight: '50px',
//     maxWidth: '400px'
// };

const imageStyle = {
    maxHeight: resources.IMG.MAX_HEIGHT,
    width: 'auto',
    height: 'auto'
};

export default class Layers extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    {this.props.layers.map((layer, idx) => 
                    <li key={idx}>
                        <img style={imageStyle} 
                            id = {Guid.create()}
                            src={layer.imgUrl}
                            draggable='true'
                            onDragStart={ (e) => { 
                                e.dataTransfer.setData('text/plain', e.target.id);
                            }}
                        />
                    </li>)}
                </ul>
            </div>
        );
    }
}


