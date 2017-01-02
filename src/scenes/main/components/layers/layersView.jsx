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
        width: '2vw',
        listStyle: 'none',
        marginLeft: '25px',
    },
    ul : {
        margin: '0',
        marginTop: '8px',
        marginRight: '15px',
        display: 'inline-flex',
        float: 'right',
    }
};

export default class Layers extends React.Component {
    constructor(props) {
        super(props);

        this.onListItemClicked = this.onListItemClicked.bind(this);
        this.onStaticListItemClicked = this.onStaticListItemClicked.bind(this);
    }

    onListItemClicked(layer, idx) {
        this.props.actions[resources.ACTIONS.TOGGLE_LAYER.TYPE](resources.AGENTS.USER,{layerName: layer.name});
        this.refs[`svg${idx}`].style.backgroundColor = 
            layer.active ? 
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
                        this.props.layers.map((layer, idx) => 
                            <li key={idx} style = {componentStyle.li} ref={`li_${idx}`}>
                                <div 
                                    ref = {`svg${idx}`}
                                    id={Guid.create()} 
                                    style={this.props.setIconStyle(layer.imgUrl)} 
                                    draggable='false' 
                                    onClick = {() =>  this.onListItemClicked(layer, idx)}
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
                   <li style = {componentStyle.li} ref="li_12">
                        <div
                            ref = "svg12"
                            style={this.props.setIconStyle('../../../../shared/images/icon_3.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(12)}
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
                    <li style = {componentStyle.li} ref="li_10">
                        <div
                            ref = "svg10"
                            style={this.props.setIconStyle('../../../../shared/images/icon_1.svg')} 
                            draggable='false' 
                            onClick = {() =>  this.onStaticListItemClicked(10)}
                        />
                    </li>
                </ul>
            </div>
        );
    }
}


