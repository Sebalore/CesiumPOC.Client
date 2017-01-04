import React from 'react';

export default class FlightCircleForm extends React.Component
{
    constructor(props) {
        super(props);

        this.onCancleBtnClicked = this.onCancleBtnClicked.bind(this);
        this.onOkBtnClicked = this.onOkBtnClicked.bind(this);
    }

    onOkBtnClicked(e) {
        e.preventDefault();
        this.props.onFormClosed();
    }

    onCancleBtnClicked(e) {
        e.preventDefault();
        this.props.onFormClosed();
    }

    render() {
        if (this.props.toDisplay) {
            return (
            <div style = {componentStyle.container} ref="container">
                <header style = {componentStyle.header}>
                    <h1 style = {componentStyle.header.h1}>Create Flight Area Circle</h1>
                </header>
                <section style = {componentStyle.section}>
                    <div style={componentStyle.section.line}>
                        <label style={componentStyle.section.label}>Name</label>
                        <input style={componentStyle.section.input} type="text" id="inputName"/>
                    </div>
                    
                    <div style={componentStyle.section.line}>
                        <label style={componentStyle.section.label}>Height</label>
                        <input style={componentStyle.section.input} type="text" id="inputHeight" type="number" min="0" max="1000000" step="50" defaultValue ="1000"/>
                    </div>
                    
                    <div style={componentStyle.section.line}>
                        <label style={componentStyle.section.label} >Radius</label>
                        <input style={componentStyle.section.input} type="text" id="inputRadius" type="number" min="5" max="30" step="5" defaultValue ="5"/>
                    </div>
                </section>
                <footer style={componentStyle.footer}>
                    <button style={componentStyle.footer.button.ok} onClick={ (e) =>  this.onOkBtnClicked(e) }>Ok</button>
                    <button style={componentStyle.footer.button.cancle} onClick={ (e) =>  this.onCancleBtnClicked(e) }>Cancle</button>
                </footer>
            </div>
            );
        }
        else {
            return null;
        }
    }
}

const componentStyle = {
    container : { 
        position: 'relative',
        top: '-111vh',
        left: '15vw',
        background: '#e3e5e8',
        height: '24vh',
        width: '18vw',
        border: '1px solid #3b3f44',
        borderRadius: '20px'
    },
    header : {
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
            margin: '0',
        }
    },
    section : {
        textAlign: 'center',
        height: '14vh',
        width: '100%',
        position: 'relative',
        top: '0',
        line: {
            height: '3vh',
            width: '85%',
            margin: '0 auto',
            marginTop: '1vh',
        },
        label: {
            float: 'left',
        },
        input : {
            float: 'right',
            width: '60%',
            textAlign: 'center'
        }
    },
    footer : {
        height: '3vh',
        position: 'relative',
        top: '0',
        width: '28%',
        margin: '0 auto',
        button: {
            ok :{
                float: 'left',
            },
            cancle: {
                float: 'right',
            }
        }
    },
};

FlightCircleForm.propTypes = {
    onFormClosed: React.PropTypes.func,
    entity: React.PropTypes.array,
    layerName: React.PropTypes.string,
    toDisplay: React.PropTypes.bool
};