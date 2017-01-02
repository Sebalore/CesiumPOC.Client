import {EventEmitter} from 'events';
import Guid from 'guid';

import dispatcher from './dispatcher';
import { linearCoordinatesGenerator } from './services';

//resources
import {resources} from '../../shared/data/resources';

const initialViewState = {
  layers: [
    {
      name: resources.DMA,
      imgUrl: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.DMA].IMG}`,
      active: true,
      actions: [
        {
          id: resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.DMA].IMG}`
        }
      ],
      entities: [
        // {
        //   id: Guid.create(),
        //   cesiumId: null, //guid to be provided by cesium
        //   label: `${resources.DMA}: Yossi`,
        //   position: {
        //     longitude: 34.99249855493725,
        //     latitude: 32.79628841345832,
        //     height: 1.0
        //   },
        //   billboard: {
        //     image: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.DMA].IMG}`,
        //     scale: 0.95
        //   }
        // }
      ]
    }, {
      name: resources.UAV,
      imgUrl: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.UAV].IMG}`,
      active: true,
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.UAV].IMG}`
        }
      ],
      entities: [
        {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.UAV}: Sebastian`,
          position: {
            longitude: 34.99249855493725,
            latitude: 32.79628841345832,
            height: 1.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.UAV].IMG}`,
            scale: 0.95
          }
        }
      ]
    }
  ]
};

class _store extends EventEmitter {

  constructor() {
    super();
    this.data = initialViewState;
  }

  getData() {
    return this.data;
  }

  update(data) {
    this.data = data;
    return Promise.resolve(this.data);
  }
  
  ['handle' + resources.ACTIONS.TOGGLE_LAYER.TYPE](agent, data) {
    return new Promise((resolve) => {
      const layerName = data.layerName;
      const layerIndex = this.data.layers.findIndex(l => l.name===layerName);
      this.data.layers[layerIndex].active = !this.data.layers[layerIndex].active;
      resolve(this.data.layers[layerIndex]);
    });
  }
  
  ['handle' + resources.ACTIONS.ADD.TYPE](agent, data) {
    return new Promise((resolve) => {
      const layerName = data.layerName;
      const layerIndex = this.data.layers.findIndex(l => l.name===layerName);
      if (agent===resources.AGENTS.USER) {
        data =  {
          id: Guid.create(),
          layerName: layerName,
          position: data.position,
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.LAYERS[layerName].IMG}`,
            scale: 0.95
          }
        }         
      }
      this.data.layers[layerIndex].entities.push(data);
      resolve(data);
    });
  }
  
  ['handle' + resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](agent, data) {
    return new Promise((resolve) => {
      const layerName = data.layerName;
      const layerIndex = this.data.layers.findIndex(l => l.name===layerName);
      const entityIndex = this.data.layers[layerIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.layers[layerIndex].entities[entityIndex].cesiumId = data.cesiumId;
      resolve(this.data.layers[layerIndex].entities[entityIndex]);
    });
  }
  
  ['handle' + resources.ACTIONS.DELETE.TYPE](agent, data) {
      return new Promise((resolve) => {
      const layerName = data.layerName;
      const layerIndex = this.data.layers.findIndex(l => l.name===layerName);
      const entityIndex = this.data.layers[layerIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.layers[layerIndex].entities.splice(entityIndex, 1);   
      resolve(true);
    });
  }

  ['handle' +  resources.ACTIONS.UPDATE_POSITION.TYPE](agent, data) {
      return new Promise((resolve) => {
      const layerName = data.layerName;
      const layerIndex = this.data.layers.findIndex(l => l.name===layerName);
      const entityIndex = this.data.layers[layerIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.layers[layerIndex].entities[entityIndex].position = data.position;
      resolve(this.data.layers[layerIndex].entities[entityIndex]);
    });
  }

  handleContextAwareActions(action) {
    if (resources.ACTIONS[action.type]) {
      const eventData = {
        agent: action.agent,
        type: action.type,
        data: action.data,
        result: null,
        error: null
      };
      if (typeof this['handle' + action.type] === 'function') {
        //execute the action if there is a matching function defined in store
        this['handle' + action.type](action.agent, action.data)
        .then((actionResult) => {
            this.emit('change', this.data);
            return Promise.resolve(actionResult);
        })
        .then((actionResult) => {
          eventData.result = actionResult;
          // console.log(`[action ${action.agent}]:${action.type} store hadler. ${JSON.stringify(eventData)}`);
          this.emit('contextAwareActionExecuted', null, eventData);          
          return Promise.resolve(eventData);
        })
        .catch(err => {
          eventData.error = err;
          console.error(`[action ${action.agent}]:${action.type} store hadler. ${JSON.stringify(err)}`);
          this.emit('contextAwareActionExecuted', err, eventData);
        });
      } else {
        //otherwise just fire the event
        console.warn(`[action ${action.agent}]:${action.type} has no handler in store.`);
        this.emit('contextAwareActionExecuted', null, eventData);
      }
    }
  }

  handleActions(action) {
    switch (action.type) {
      case 'UPDATE':
        {
          this.update(action.data).then(this.emit('change')).catch();
          break;
        }
      case 'DEBUG_1':
        {
          //---- for testing movement ------------------------------------------------------------------- 
          const initial = {
            longitude: 34.99249855493725,
            latitude:  32.79628841345832,
            height: 1.0
          };

          const dest = {
            longitude: -75.16617698856817,
            latitude: 39.90607492083895,
            height: 1000.0
          };

          const velocity = {
            longitude: 0.006,
            latitude: 0.004,
            height: 50.0
          };
          //----------------------------------------------------------------------------------------------
          const coordinatesGenerator = linearCoordinatesGenerator(initial, dest, velocity);
          window.coGen = coordinatesGenerator; 
          setInterval(() => {
            const cords = coordinatesGenerator.next();
              if(!cords.done) {
                dispatcher.dispatch({
                  type: resources.ACTIONS.UPDATE_POSITION.TYPE,
                  agent: resources.AGENTS.API,
                  data: {
                      entityId: initialViewState.layers[1].entities[0].id,
                      layerName: resources.UAV,
                      position: cords.value
                  }                              
                });                
                // dispatcher.dispatch({
                //   type: resources.ACTIONS.ADD.TYPE,
                //   agent: resources.AGENTS.API,
                //   data: {
                //       id: Guid.create(),
                //       layerName: 'DynamicMissionArea',
                //       position: cords.value,
                //       billboard: {
                //         image: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.DMA].IMG}`,
                //         scale: 0.95
                //       }
                //   }                              
                // });
              } else {
                console.log('generator done.');
              }
          }, 3000);
          break;
        }
    }
  }
}

const store = new _store;
dispatcher.register(store.handleActions.bind(store));
dispatcher.register(store.handleContextAwareActions.bind(store));
window.dispatcher = dispatcher;
window.store = store;
export default store;
