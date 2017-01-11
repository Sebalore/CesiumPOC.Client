import React from 'react';

import FlightCircleForm from './flightCircleForm';

//-----------------resources----------------------------------------
import {resources} from '../../../shared/data/resources'; 

export default class EntityForm extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    onFormClose = (e, entity) => {
        e.preventDefault();
        this.props.onFormClose({entity});
    };

    componentWillMount() {
        Object.assign(componentStyle.form, {top: this.props.position.top, left: this.props.position.left})
    }

    render() {
        switch (this.props.entity.entityTypeName) {
            case resources.ENTITY_TYPE_NAMES.AIRPLANE:
            case resources.ENTITY_TYPE_NAMES.FLIGHT_AREA:
            case resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_OUT:
            case resources.ENTITY_TYPE_NAMES.FORBIDEN_FLIGHT_AREA:
            case resources.ENTITY_TYPE_NAMES.HELICOPTER:
                {
                    break;
                }
            case resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN:
                {
                    return (<FlightCircleForm  entity= {this.props.entity} style={componentStyle} onFormClose={this.onFormClose.bind(this)}/>);
                }
        }
        return(
            <div style={componentStyle.form}>
                <header style={componentStyle.header}>
                    <h1 style={componentStyle.header.h1}>{this.props.entity.entityTypeName}</h1>
                </header>
                <section style={componentStyle.section}>
                    <div style={componentStyle.section.line}>
                        <label style={componentStyle.section.label}>Label</label>
                        <input style={componentStyle.section.input} 
                            type="text" 
                            id="inputName"
                            defaultValue={this.props.entity.label}/>
                    </div>
                </section>
                <footer style={componentStyle.footer}>
                    <button
                        style={componentStyle.footer.button.ok}
                        onClick={(e) => this.onFormClose.bind(this)(e, Object.assign({}, {
                        ...this.props.entity,
                        label: document.getElementById('inputName').value
                    }))}>Ok</button>
                    <button
                        style={componentStyle.footer.button.cancle}
                        onClick={(e) => this.onFormClose.bind(this)(e, null)}>Cancel</button>
                </footer>
            </div>          
        );
    }
};



const componentStyle = {
    form: {
    visibility: 'visible',
    display: 'block',
    position: 'fixed',
    overflow: 'hidden',
    background: 'gray',
    border: '1px solid #47494c',
    borderRadius: '5px',
    top: 20 + 'vh',
    left: 15 + 'vw'        
    },
    container: {
        position: 'relative',
        top: '-111vh',
        left: '15vw',
        background: '#e3e5e8',
        height: '24vh',
        width: '18vw',
        border: '1px solid #3b3f44',
        borderRadius: '20px'
    },
    header: {
        fontSize: '1.5vh',
        background: '#9b9da0',
        borderRadius: '20px 20px 0 0',
        textAlign: 'center',
        height: '5vh',
        width: '100%',
        position: 'relative',
        top: '0',
        h1: {
            height: '100%',
            width: '100%',
            margin: '0'
        }
    },
    section: {
        textAlign: 'center',
        height: '14vh',
        width: '100%',
        position: 'relative',
        top: '0',
        line: {
            height: '3vh',
            width: '85%',
            margin: '0 auto',
            marginTop: '1vh'
        },
        label: {
            float: 'left'
        },
        input: {
            float: 'right',
            width: '60%',
            textAlign: 'center'
        }
    },
    footer: {
        height: '3vh',
        position: 'relative',
        top: '0',
        width: '50%',
            margin: '0 auto',
            marginTop: '1vh',
        button: {
            ok: {
                float: 'left'
            },
            cancle: {
                float: 'right'
            }
        }
    }
};

FlightCircleForm.propTypes = {
    onFormClosed: React.PropTypes.func
};