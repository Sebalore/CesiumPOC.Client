import React from 'react';

const XXX = (props) => {
    const componentStyle = {
        backgroundColor: '#47494c',
        border: '1px solid black',
        upper : {
            height: '46vh',
            width: '100%',
            borderBottom: '1px solid black',
        },
        lower : {
            height: '46vh',
            width: '100%',
        }
    };
    
    return (
        <div style = {componentStyle} onClick={() => props.actions.setMenuStatus(false)}>
            <div style = {componentStyle.upper}>
                Upper
            </div>
            <div style = {componentStyle.lower}>
                Lower
            </div>
        </div>
    );
};

export default XXX;

XXX.propTypes = {
    actions: React.PropTypes.object.isRequired,
};
