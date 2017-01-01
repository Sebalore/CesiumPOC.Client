import dispatcher from './dispatcher';
import { resources } from '../../shared/data/resources.js'; 

export default {
    //--------- general actions ----------------------------------
    update: (data) => dispatcher.dispatch({type: 'UPDATE', data}),

    //--------- "smart" context aware actions -----------------------------------------------------------------
    [resources.ACTIONS.ADD.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.ADD.TYPE, agent, data}),
    [resources.ACTIONS.DELETE.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.ADD.TYPE, agent, data}),
    [resources.ACTIONS.UPDATE_POSITION.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.UPDATE_POSITION.TYPE,  agent, data}),
    [resources.ACTIONS.MAP_CENTER.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.MAP_CENTER.TYPE,  agent, data}),
    [resources.ACTIONS.TOGGLE_LAYER.TYPE]: (agent, data) => dispatcher.dispatch({type: resources.ACTIONS.TOGGLE_LAYER.TYPE,  agent, data})
}