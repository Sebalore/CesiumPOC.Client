import dispatcher from './dispatcher';
import { resources } from '../shared/data/resources'; 
import socketIO from 'socket.io';

const socket = socketIO('http://localhost:8080');

export default {
    //--------- general actions ----------------------------------
    update: (data) => dispatcher.dispatch({type: 'UPDATE', data}),
    
    // entities actions
    [resources.ACTIONS.ADD.TYPE]: (agent, data) => {
        dispatcher.dispatch({type: resources.ACTIONS.ADD.TYPE, agent, data});
        socket.emit('ADD', { data });
    },
    [resources.ACTIONS.DELETE.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.DELETE.TYPE, agent, data}),
    [resources.ACTIONS.UPDATE_POSITION.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.UPDATE_POSITION.TYPE,  agent, data}),
    [resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE,  agent, data}),
    
    // map actions
    [resources.ACTIONS.MAP_CENTER.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.MAP_CENTER.TYPE,  agent, data}),
    [resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE,  agent, data}),
    [resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE,  agent, data})
}