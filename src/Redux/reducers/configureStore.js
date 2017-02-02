'use strict';

/**
 * ## Imports
 *
 * redux functions
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/**
* ## Reducer
* The reducer contains the 2 reducers from
* tradingArea, global
*/
import reducer from './index.js';

/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */
const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * tradingArea, global
 *
 */
export default function configureStore (initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}