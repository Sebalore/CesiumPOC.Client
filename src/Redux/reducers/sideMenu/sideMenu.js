import initialState from './initialState';
import {deepClone} from '../../../utills/services';

const sideMenuReducer = (state = initialState, action) => {

    const newState = deepClone(state); 

    switch (action.type) {

        case 'SET_MENU_STATUS':
            newState.isOpen = action.data;
            return newState;
        
        default:
            return state;
    }
};

export default sideMenuReducer;