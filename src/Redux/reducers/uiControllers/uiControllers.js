import initialState from './initialState';
import {deepClone} from '../../../utills/services';

const uiControllersReducer = (state = initialState, action) => {

    const newState = deepClone(state); 

    switch (action.type) {
        /**  ------------------------------------- Nevbar  -------------------------------------  **/

        /** ------------------------------------- Sidebar  -------------------------------------  **/
        case 'SET_UPPER_SELECTED_INDEX':
            newState.SideBar.upperSelectedIndex = action.data;
            return newState;

        case 'SET_LOWER_SELECTED_INDEX':
            newState.SideBar.lowerSelectedIndex = action.data;
            return newState;
        
        case 'SET_MENU_STATUS':
            newState.SideBar.isOpen = action.data;
            return newState;
        
        default:
            return state;
    }
};

export default uiControllersReducer;