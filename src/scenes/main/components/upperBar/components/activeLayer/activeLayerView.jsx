import React from 'react';
import Guid from 'guid';

// exported consts
import {resources} from 'shared/data/resources';

//CONSTS
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

export default class ActiveLayer extends React.Component {
    render() {
        return (
            <div style = {componentStyle.containerDiv}>
                <ul style = {componentStyle.ul}>
                    {this.props.layer.actions.map((action, idx) => 
                    <li key={idx} style={componentStyle.li}>
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

