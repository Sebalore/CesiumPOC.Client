import React from 'react';
import Guid from 'guid';
import {resources} from '../../../../shared/data/resources'; 

//CONSTS
const componentStyle = {
    containerDiv : {
        display: 'inline-block',
        float: 'right',
        height: '100%',
        backgroundColor: '#47494c',
        border: '2px solid black',
        width: '60vw',
        overflow: 'hidden',
    }, 
    li : {
        height: '100%',
        width: '2vw',
        listStyle: 'none',
        marginLeft: '25px',
    },
    ul : {
        height: '100%',
        margin: 'auto 2.5vw auto 0px',
        display: 'inline-flex',
        float: 'right',
    }
};

export default class EntityTypes extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onListItemClicked = this.onListItemClicked.bind(this);
        this.onStaticListItemClicked = this.onStaticListItemClicked.bind(this);
    }

    onListItemClicked(entityType, idx) {
        this.props.actions[resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE](resources.AGENTS.USER,{entityTypeName: entityType.name});
        this.refs[`svg${idx}`].style.backgroundColor = 
            entityType.active ? 
                '#c9953a' : 'white';
    }

    onStaticListItemClicked(idx) {
        this.refs[`svg${idx}`].style.backgroundColor = 
            this.refs[`svg${idx}`].style.backgroundColor === 'white' ? 
                '#c9953a' : 'white';
    }

    render() {
        return (
            <div style = {componentStyle.containerDiv}>
                <ul style = {componentStyle.ul}>
                    <li style = {componentStyle.li} ref="li_16">
                        <div
                            ref = "svg16"
                            style={this.props.setIconStyle('../../../../shared/images/icon_10.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(16)}
                        />
                    </li>
                    <li style = {componentStyle.li} ref="li_15">
                        <div
                            ref = "svg15"
                            style={this.props.setIconStyle('../../../../shared/images/icon_8.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(15)}
                        />
                    </li>
                   <li style = {componentStyle.li} ref="li_14">
                        <div
                            ref = "svg14"
                            style={this.props.setIconStyle('../../../../shared/images/icon_7.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(14)}
                        />
                    </li>
                    {
                        this.props.entityTypes.map((entityType, idx) => 
                            <li key={idx} style = {componentStyle.li} ref={`li_${idx}`}>
                                <div 
                                    ref = {`svg${idx}`}
                                    id={Guid.create()} 
                                    style={this.props.setIconStyle(entityType.imgUrl)} 
                                    draggable='false' 
                                    onClick = {() =>  this.onListItemClicked(entityType, idx)}
                                />
                            </li>)
                    }
                   <li style = {componentStyle.li} ref="li_13">
                        <div
                            ref = "svg13"
                            style={this.props.setIconStyle('../../../../shared/images/icon_4.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(13)}
                        />
                    </li>
                    <li style = {componentStyle.li} ref="li_11">
                        <div
                            ref = "svg11"
                            style={this.props.setIconStyle('../../../../shared/images/icon_2.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(11)}
                        />
                    </li>
                </ul>
            </div>
        );
    }
}

