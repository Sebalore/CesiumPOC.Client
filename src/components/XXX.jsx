import React from 'react';

import Tabs from './tabs/Tabs';
import PaneWrapper from './tabs/PanePropsProxyWrapper';
import First from './tabs/wrappedComponents/First';
import Second from './tabs/wrappedComponents/Second';

const FirstDecorated = PaneWrapper(First);
const SecondDecorated = PaneWrapper(Second);

const XXX = (props) => {
    const componentStyle = {
        backgroundColor: '#47494c',
        border: '1px solid black',
        height: '100%',
    };

    const onTabSwitchPressed = (name, index) => {
        if(name === 'upper') {
            props.actions.setUpperSelectedIndex(index);
        }
        else {
            props.actions.setLowerSelectedIndex(index);
        }
    };

    return (
        <div style = {componentStyle} >
            <Tabs name="upper" onTabSelect={onTabSwitchPressed} selected={props.upperSelectedIndex} style = {componentStyle.upper}>
                <FirstDecorated label="first"/>
                <SecondDecorated label="second"/>
            </Tabs>   
            <Tabs name="lower" onTabSelect={onTabSwitchPressed} selected={props.lowerSelectedIndex} style = {componentStyle.lower}>
                <FirstDecorated label="first"/>
                <SecondDecorated label="second"/>
            </Tabs> 
        </div>
    );
};

export default XXX;

XXX.propTypes = {
    actions: React.PropTypes.object.isRequired,
    upperSelectedIndex: React.PropTypes.number.isRequired,
    lowerSelectedIndex: React.PropTypes.number.isRequired,
};

