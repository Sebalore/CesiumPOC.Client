import {EventEmitter} from 'events';
import Guid from 'guid';

import dispatcher from './dispatcher';
import { createLinearCoordinatesGenerator } from './services';

//resources
import {resources} from '../../shared/data/resources';

const initialViewState = {
  entityTypes: [
        {
      name: resources.FLIGHT_CIRCLE,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.FLIGHT_CIRCLE].IMG}`,
      active: true,
      actions: [
        {
          id: resources.ENTITY_TYPES[resources.DMA].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.FLIGHT_CIRCLE].ACTIONS.ADD.IMG}`
        }
      ],
      entities: [
        // {
        //   id: Guid.create(),
        //   cesiumId: null, //guid to be provided by cesium
        //   label: `${resources.FLIGHT_CIRCLE}: Yossi`,
        //   position: {
        //     longitude: 34.99249855493725,
        //     latitude: 32.79628841345832,
        //     height: 1.0
        //   },
        //   billboard: {
        //     image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.FLIGHT_CIRCLE].ACTIONS.ADD.IMG}`,
        //     scale: 0.95
        //   }
        // }
      ]
    },
    {
      name: resources.DMA,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.DMA].IMG}`,
      active: true,
      actions: [
        {
          id: resources.ENTITY_TYPES[resources.DMA].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.DMA].ACTIONS.ADD.IMG}`
        }
      ],
      entities: [
      ]
    }, {
      name: resources.UAV,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.UAV].IMG}`,
      active: true,
      actions: [
        {
          id: resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.IMG}`
        }
      ],
      entities: [
        {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.UAV}: 001`,
          position: {
            longitude: resources.MAP_CENTER.longitude - 0.075,
            latitude: resources.MAP_CENTER.latitude - 0.04,
            height: 1000.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.002,
            latitude: 0.001,
            height: 1000
          })
        } , {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.UAV}: 002`,
          position: {
            longitude: resources.MAP_CENTER.longitude - 0.05,
            latitude: resources.MAP_CENTER.latitude + 0.03,
            height: 1500.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.IMG}`,
            rotation: -90,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.001,
            latitude: -0.002,
            height: 1000
          })
        }, {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.UAV}: 003`,
          position: {
            longitude: resources.MAP_CENTER.longitude + 0.085,
            latitude: resources.MAP_CENTER.latitude + 0.02,
            height: 750.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.UAV].ACTIONS.ADD.IMG}`,
            rotation: 90,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: -0.001,
            latitude: -0.00002,
            height: 1000
          })
        }
      ]
    }, {
      name: resources.HELICOPTERS,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.HELICOPTERS].IMG}`,
      active: true,
      actions: [
        {
          id: resources.ENTITY_TYPES[resources.HELICOPTERS].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.HELICOPTERS].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.HELICOPTERS].ACTIONS.ADD.IMG}`
        }
      ],
      entities: [
        {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.HELICOPTERS}: 001`,
          position: {
            longitude: resources.MAP_CENTER.longitude, // + 0.065,
            latitude: resources.MAP_CENTER.latitude, // - 0.085,
            height: 69.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.HELICOPTERS].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: -0.00001,
            latitude: 0.0001,
            height: 1000
          })
        } , {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.HELICOPTERS}: 002`,
          position: {
            longitude: resources.MAP_CENTER.longitude  + 0.0065,
            latitude: resources.MAP_CENTER.latitude - 0.0085,
            height: 250.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.HELICOPTERS].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.00001,
            latitude: -0.0001,
            height: 1000
          })
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
  
  ['handle' + resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE](agent, data) {
    return new Promise((resolve) => {
      const entityTypeName = data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      this.data.entityTypes[entityTypeIndex].active = !this.data.entityTypes[entityTypeIndex].active;
      this.emit('activeEntityTypesChanged', this.data.entityTypes);
      resolve(this.data.entityTypes[entityTypeIndex]);
    });
  }
  
  ['handle' + resources.ACTIONS.ADD.TYPE](agent, data) {
    return new Promise((resolve) => {
      const entityTypeName = data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      this.data.entityTypes[entityTypeIndex].entities.push(data);
      resolve(data);
    });
  }
  
  ['handle' + resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](agent, data) {
    return new Promise((resolve) => {
      const entityTypeName = data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      const entityIndex = this.data.entityTypes[entityTypeIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.entityTypes[entityTypeIndex].entities[entityIndex].cesiumId = data.cesiumId;
      resolve(this.data.entityTypes[entityTypeIndex].entities[entityIndex]);
    });
  }
  
  ['handle' + resources.ACTIONS.DELETE.TYPE](agent, data) {
      return new Promise((resolve) => {
      const entityTypeName = data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      const entityIndex = this.data.entityTypes[entityTypeIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.entityTypes[entityTypeIndex].entities.splice(entityIndex, 1);   
      resolve(true);
    });
  }

  ['handle' +  resources.ACTIONS.UPDATE_POSITION.TYPE](agent, data) {
      return new Promise((resolve) => {
      const entityTypeName = data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      const entityIndex = this.data.entityTypes[entityTypeIndex].entities.findIndex(e => e.id===data.entityId);
      this.data.entityTypes[entityTypeIndex].entities[entityIndex].position = data.position;
      resolve(this.data.entityTypes[entityTypeIndex].entities[entityIndex]);
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
      //TODO: check if action is aplliable to entityType
      if (typeof this['handle' + action.type] === 'function') {
        //execute the action if there is a matching function defined in store
        this['handle' + action.type](action.agent, action.data)
        .then((actionResult) => {
            this.emit('entityTypesChanged', this.data.entityTypes);
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
          // const initial = {
          //   longitude: 34.99249855493725,
          //   latitude:  32.79628841345832,
          //   height: 1.0
          // };

          // const dest = {
          //   longitude: -75.16617698856817,
          //   latitude: 39.90607492083895,
          //   height: 1000.0
          // };

          const velocity = {
            longitude: 0.000,
            latitude: 0.000,
            height: 50.0
          };
          //----------------------------------------------------------------------------------------------
          
          initialViewState.entityTypes.find(l => l.name===resources.UAV).entities.forEach(e =>{
            const gen = e.gen(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                  dispatcher.dispatch({
                    type: resources.ACTIONS.UPDATE_POSITION.TYPE,
                    agent: resources.AGENTS.API,
                    data: {
                        entityTypeName: resources.UAV,
                        entityId: e.id,
                        position: cords.value,
                        label: `UAV-${e.id}`
                    }                              
                  });                
                }
            }, 2000);            
          });
          
          initialViewState.entityTypes.find(l => l.name===resources.HELICOPTERS).entities.forEach(e =>{
            const gen = e.gen(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                  dispatcher.dispatch({
                    type: resources.ACTIONS.UPDATE_POSITION.TYPE,
                    agent: resources.AGENTS.API,
                    data: {
                        entityTypeName: resources.HELICOPTERS,
                        entityId: e.id,
                        position: cords.value,
                        label: `helicopter-${e.id}`
                    }                              
                  });                
                }
            }, 2000);            
          });

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
