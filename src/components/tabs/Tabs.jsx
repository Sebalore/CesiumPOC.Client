'use strict';

import React from 'react';

export default class Tabs extends React.Component 
{
    constructor(props) {
        super(props);

        // this.state = {
        //     selected: this.props.selected
        // };

        this.onClick = this.onClick.bind(this);
        this.renderTitles = this.renderTitles.bind(this);
        this.getOneLabel = this.getOneLabel.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.selected !== this.props.selected) {
            this.props.onTabSelect(this.props.name, newProps.selected);
        }
    }

    onClick(event, index) {
        event.preventDefault();
        this.props.onTabSelect(this.props.name, index);
    }

    renderTitles() {
        const children = React.Children.toArray(this.props.children);

        return (
            <ul style={componentStyle.tabsLabels}>
                { children.map(this.getOneLabel) }
            </ul>
        );
    }

    getOneLabel(child, index) {
        const basicStyle = componentStyle.tabsLabels.li.a,
            activeStyle = Object.assign({}, basicStyle, componentStyle.tabsLabels.li.aActive ),
            myStyle = this.props.selected === index ?
                activeStyle :  basicStyle;

        return (
            <li key={index} style = {componentStyle.tabsLabels.li}>
                <a href="#" 
                    style={myStyle}
                    onClick={ e => this.onClick(e, index) }>
                    {child.props.label}
                </a>
            </li>
        );
    }

    renderBody() {
        const children = React.Children.toArray(this.props.children);

        return (
            <div style = {componentStyle.tabsContent}>
                {children[this.props.selected]}
            </div>
        );
    }

    render() {
        return (
            <div style={componentStyle.tabs}>
                {this.renderTitles()}
                {this.renderBody()}
            </div>
        );
    }
}

const componentStyle = {
    tabs: {
        margin: '25px',
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '3px',
        height: '45%'
    },
    tabsLabels: {
        margin: '0',
        padding: '0',
        li : {
            display: 'inline-block',
            a: {
                padding: '8px 12px',
                display: 'block',
                color: '#444',
                textDecoration: 'none',
            },
            aActive: {
                borderBottom: '2px solid #337ab7',
            }
        }
    },
    tabsContent: {
        padding: '25px',
    }
};

Tabs.propTypes = {
    selected: React.PropTypes.number,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]).isRequired
};

Tabs.defaultProps = {
    selected: 0
};
