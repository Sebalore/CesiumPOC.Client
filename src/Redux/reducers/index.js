// redux imports
import { combineReducers } from 'redux';

// reducers
import main from './main/main';
import sideMenu from './sideMenu/sideMenu';

const application = combineReducers({
    main,
    sideMenu
});

export default application;