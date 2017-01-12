import initialState from './mainIntialState';
import {deepClone} from '../../../utills/services';

const mainReducer = (state = initialState, action) => {

    let newState = deepClone(state); 

    switch (action.type) {

        case 'SET_VALUE_1':
            newState.value1 = action.data;
            return newState;

        case 'SET_VALUE_2':
            newState.value2 = action.data;
            return newState;
        
        default:
            return state;
    }
};

export default mainReducer;