import dispatcher from './dispatcher';
import { resources } from '../shared/data/resources'; 
import socketIO from 'socket.io-client';

// const socket = socketIO('http://localhost:8080');

export default {
    //--------- actions from server ----------------------------------
    listenForServerActions: () => socket.on('ACTION', (action) => {
        console.info(`--------------------------------------------`);
        console.info(`received action: ${action.type}`);
        console.dir(action);
        console.info(`--------------------------------------------`);
        switch(action.type){
            case resources.ACTIONS.ADD.TYPE: {
                        dispatcher.dispatch({type: resources.ACTIONS.ADD.TYPE, agent: resources.AGENTS.API, data: action.data});
                        break;
            }
            case resources.ACTIONS.UPDATE_POSITION.TYPE: {
                        dispatcher.dispatch({type: resources.ACTIONS.UPDATE_POSITION.TYPE, agent: resources.AGENTS.API, data: action.data});
                        break;
            }
            case resources.ACTIONS.DELETE.TYPE: {
                        dispatcher.dispatch({type: resources.ACTIONS.DELETE.TYPE, agent: resources.AGENTS.API, data: action.data});
                        break;
            }                        
            default:
        }
    }),
    
    // entities actions from UI
    [resources.ACTIONS.ADD.TYPE]: (data) => {
        dispatcher.dispatch({type: resources.ACTIONS.ADD.TYPE, agent: resources.AGENTS.USER, data});
        socket.emit('ADD', { data });
    },
    [resources.ACTIONS.DELETE.TYPE]: (data) => dispatcher.dispatch({type: resources.ACTIONS.DELETE.TYPE, agent: resources.AGENTS.USER, data}),
    [resources.ACTIONS.UPDATE_POSITION.TYPE]: (data) => dispatcher.dispatch({type: resources.ACTIONS.UPDATE_POSITION.TYPE,  agent: resources.AGENTS.USER, data}),
    
    // map actions
    [resources.ACTIONS.MAP_CENTER.TYPE]: (data) => dispatcher.dispatch({type: resources.ACTIONS.MAP_CENTER.TYPE,  agent: resources.AGENTS.USER, data}),
    [resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE]: (data) => dispatcher.dispatch({type: resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE,  agent: resources.AGENTS.USER, data}),
    [resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE]: (data) => dispatcher.dispatch({type: resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE,  agent: resources.AGENTS.USER, data})
}