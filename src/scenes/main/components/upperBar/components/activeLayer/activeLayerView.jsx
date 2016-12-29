import React from 'react';
import Guid from 'guid';

//CONSTS
import {resources} from 'shared/data/resources';
const componentStyle = {
    color: 'blue',
    display: 'inline-block',
    float: 'right',
    maxHeight: '50px',
    maxWidth: '300px'
};

const imageStyle = {
    maxHeight: resources.IMG.MAX_HEIGHT,
    width: 'auto',
    height: 'auto'
};

export default class ActiveLayer extends React.Component {
    render() {
        return (
            <div style = {componentStyle}>
                <ul>
                    {this.props.layer.actions.map((action, idx) => 
                    <li key={idx}>
                        <img style={imageStyle} 
                            id = {Guid.create()}
                            src={action.imgUrl}
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

