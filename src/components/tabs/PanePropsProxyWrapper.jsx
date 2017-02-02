'use strict';

import React from 'react';

export default ppHOC;
/**
 * @param {React.Component} WrappedComponent
 * @returns {WrappedComponent}
 */
function ppHOC(WrappedComponent) {
  return class PanePropsProxyWrapper extends React.Component {
    render() {
      return (<WrappedComponent {...this.props}/>);
    }
  };
} 