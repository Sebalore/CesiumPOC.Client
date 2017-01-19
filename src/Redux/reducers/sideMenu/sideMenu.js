import initialState from './initialState';
import {deepClone} from '../../../utills/services';

const sideMenuReducer = (state = initialState, action) => {

    const newState = deepClone(state); 

    switch (action.type) {
        
        default:
            return state;
    }
};

export default sideMenuReducer;