// react imports
import React from 'react';
import ReactDOM from 'react-dom';

// redux imports
import { Provider } from 'react-redux';

// initial state from all the reducers
import mainInitialState from './Redux/reducers/main/mainIntialState';

// import configuration
import configureStore from './Redux/reducers/configureStore';

// Other Components Imports
import MainView from './containers/MainViewNew.jsx';


function getInitialState () {
  const _initState = {
    main: mainInitialState
  };
  return _initState;
}

const store = configureStore(getInitialState());

ReactDOM.render(
    <Provider store={store}>
        <MainView/> 
    </Provider>, document.getElementById('root'));
