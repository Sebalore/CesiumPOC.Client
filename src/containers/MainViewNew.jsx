// react imports
import React from 'react';

// redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions imports
import * as mainActions from '../Redux/actions/mainActions';

// sub components imports
import CesiumView from '../components/cesium/cesiumView';
import EntityTypes from '../components/entityTypes/entityTypesView';
import AddEntity from '../components/addEntity/addEntityView';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...mainActions }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    main: state.main
  };
}

class MainView extends React.Component
{
    componentDidMount() {
        setTimeout(() => {
            this.props.actions.setValue1(3);
        }, 5000);
    }

    render() {
        return (
            <div>
               <h1>{this.props.main.value1}</h1>
               <h1>{this.props.main.value2}</h1>
            </div>
        );
    }
}

//export default App;
export default connect(mapStateToProps, mapDispatchToProps)(MainView);