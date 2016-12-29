import dispatcher from './dispatcher';

export default {
    //refresh: () => dispatcher.dispatch({type: 'REFRESH'}),
    update: (data) => dispatcher.dispatch({type: 'UPDATE', data}),
    setActiveLayer: (layerIndex) => dispatcher.dispatch({type: 'SET_ACTIVE_LAYER', layerIndex})
}