import React from 'react';

const FlightCircleForm = (props) => {
    return (
        <div style={props.style.form}>
            <header style={props.style.header}>
                <h1 style={props.style.header.h1}>Create Flight Area Circle</h1>
            </header>
            <section style={props.style.section}>
                <div style={props.style.section.line}>
                    <label style={props.style.section.label}>Label</label>
                    <input style={props.style.section.input} 
                        type="text" 
                        id="inputName"
                        value={props.entity.label}/>
                </div>

                <div style={props.style.section.line}>
                    <label style={props.style.section.label}>Height</label>
                    <input
                        style={props.style.section.input}
                        type="text"
                        id="inputHeight"
                        type="number"
                        min="0"
                        max="1000000"
                        step="500"
                        value = {props.entity.position.height}/>
                </div>

                <div style={props.style.section.line}>
                    <label style={props.style.section.label}>Radius</label>
                    <input
                        style={props.style.section.input}
                        type="text"
                        id="inputRadius"
                        type="number"
                        min="1000"
                        max="1000000"
                        step="500"
                        value={props.entity.radius}/>
                </div>
            </section>
            <footer style={props.style.footer}>
                <button
                    style={props.style.footer.button.ok}
                    onClick={(e) => props.onFormClose(e, Object.assign({}, {
                    label: document.getElementById('inputName').value,
                    radius: Number(document.getElementById('inputRadius').value),                    
                    position: {
                        height: Number(document.getElementById('inputHeight').value),
                        ...props.entity.position
                    },
                    ...props.entity
                }))}>Ok</button>
                <button
                    style={props.style.footer.button.cancle}
                    onClick={(e) => props.onFormClose(e, null)}>Cancel</button>
            </footer>
        </div>
    );
};

export default FlightCircleForm;

FlightCircleForm.propTypes = {
    onFormClosed: React.PropTypes.func
};