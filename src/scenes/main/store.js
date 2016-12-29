import {EventEmitter} from 'events';
import dispatcher from './dispatcher';


//resources
const  resources = require('shared/data/resources');
const initialViewState = {
    activeLayerIndex: 0,
    layers: [
        {
            name : resources.DMA,
            imgUrl : resources.IMG.BASE_URL + '/tank_gqfsf8.png',
            actions: [
              {
                id : resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
                description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
                imgUrl : resources.IMG.BASE_URL + '/tank_gqfsf8.png'
              }
            ],
            entities:[
              {

              }
            ]
        },{
            name : resources.UAV,
            imgUrl : resources.IMG.BASE_URL + '/jet_ppnyns.png',
            actions: [
              {
                id : resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
                description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
                imgUrl : resources.IMG.BASE_URL + '/jet_ppnyns.png'
              }
            ],
            entities: [
              {
                id : null, //guid to be provided by cesium
                position: {
                  longitude: -75.1668043913917,
                  latitude: 39.90610546720464,
                  height: 1.0
                },
                billboard: {
                  image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
                  scale: 0.95
                }
              }, {
                id: null, //guid to be provided by cesium
                position: {
                  longitude: -75.16617698856817,
                  latitude: 39.90607492083895,
                  height: 1.0
                },
                billboard: {
                  image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
                  scale: 0.95
                }
              }
            ]
        }
    ],
};

class store extends EventEmitter {

    constructor() {
      super();
      this.data = initialViewState;
    }

    getInitialState() {
        return data;
    }

    incommingEntityPositionChange(entity) {

        //...do soething

        this.emit('incEntitiyPositionChange')
    }

    handleActions(action) {

        switch(action.type) {
            case 'INC_ENTITIY_POSITION_CHANGE' : {
                this.incommingEntityPositionChange(action.data);
            }
        }
    }
}

const theStore = new store;
dispatcher.register(theStore.handleActions.bind(theStore));
window.dispatcher = dispacher;
export default theStore;



