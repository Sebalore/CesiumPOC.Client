'use strict';

import React from 'react';
import Guid from 'guid';


const AddEntity =  (props) => {
    
    const onDrawPointsClicked = (event, entityType) => {
        event.preventDefault();

        if(entityType.name === this.context.resources.ENTITY_TYPE_NAMES.ZIAH) {
            // toggle the state
            props.actions.setDrawingZiahStatus(!props.drawingZiahOn);
        }
    };

    const contextTypes = {
      resources: PropTypes.object.isRequired,
    }
    
    if (props.entityTypesInfo) {
        const { resources } = this.context;
        return (
            <div style={componentStyle.containerDiv}>
                <ul style={componentStyle.ul}>
                    <li style={componentStyle.li}>
                        <div style={props.setIconStyle('icon_7.svg')} draggable='false'/>
                    </li>
                    <li style={componentStyle.li}>
                        <div 
                            style={props.setIconStyle('icon_8.svg')} 
                            draggable='false'
                            onClick={ (e) => { onDrawPointsClicked(e, {name: resources.ENTITY_TYPE_NAMES.ZIAH}); }}
                        />
                    </li>
                    {
                        props.entityTypesInfo.map((entityType, idx) => 
                        <li key={idx} style={componentStyle.li}>
                            <div 
                                id={Guid.create()} 
                                style={props.setIconStyle(resources.ENTITY_TYPES[entityType.name].ACTIONS.ADD.IMG)} 
                                draggable='true' 
                                onDragStart={(e) => { e.dataTransfer.setData('text', entityType.name); }}
                                onClick={ (e) => { onDrawPointsClicked(e, entityType); }}
                            />
                        </li>)
                    }
                </ul>
            </div>
        );
    } 
    else {
        return ( <div style={componentStyle.containerDiv}> ..... </div> );
    }
};

export default AddEntity;

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