// redux imports
import { combineReducers } from 'redux';

// reducers
import main from './main/main';

const application = combineReducers({
    main
});

export default application;