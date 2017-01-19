// react basics
import React from 'react';

// components
import XXX from '../components/XXX';

export default class SideMenu extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style = {componentStyle}>
                {
                    // this.props.sideMenu.isOpen ?
                    this.props.controllers.isOpen ?
                        <XXX 
                            upperSelectedIndex = {this.props.controllers.upperSelectedIndex}
                            lowerSelectedIndex = {this.props.controllers.lowerSelectedIndex}
                            actions = {this.props.actions}
                        />  :
                        <div id = "openMenuBtn"
                            style={Object.assign({}, this.props.setIconStyle('icon_1.svg'), componentStyle.icon) } 
                            onClick={() => this.props.actions.setMenuStatus(true)}
                        />
                }
            </div>
        );
    }
}

SideMenu.propTypes = {
    actions: React.PropTypes.object.isRequired,
};

const componentStyle = {
    position: 'relative',
    float: 'right',
    top: '-127vh',
    width: '26%',
    height: '92%',
    marginRight: '4.5vw',
    icon : {
        width: '110px',
        position: 'relative',
        paddingRight: '35vw',
        height: '17%',
    },

};
