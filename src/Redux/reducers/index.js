// redux imports
import { combineReducers } from 'redux';

// reducers
import main from './main/main';
import sideMenu from './sideMenu/sideMenu';
import uiControllers from './uiControllers/uiControllers';

const application = combineReducers({
    main,
    sideMenu,
    uiControllers
});

export default application;