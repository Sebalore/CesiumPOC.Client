import {EventEmitter} from 'events';
import dispatcher from './dispatcher';

//resources
import {resources} from '../../shared/data/resources';
import initialViewState from './storeIntialState';

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

      if (typeof this['handle' + action.type] === 'function') {
        //execute the action if there is a matching function defined in store
        this['handle' + action.type](action.agent, action.data)
        .then((actionResult) => {
            this.emit('entityTypesChanged', this.data.entityTypes);
            return Promise.resolve(actionResult);
        })
        .then((actionResult) => {
          eventData.result = actionResult;
          this.emit('contextAwareActionExecuted', null, eventData);          
          return Promise.resolve(eventData);
        })
        .catch(err => {
          eventData.error = err;
          this.emit('contextAwareActionExecuted', err, eventData);
          return Promise.reject(err);
        });
      } 
      else { // if not a function, just fire the event
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
          initialViewState.entityTypes.find(l => l.name===resources.ENTITY_TYPE_NAMES.AIRPLANE).entities.forEach(e =>{
            const gen = e.gen(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                  dispatcher.dispatch({
                    type: resources.ACTIONS.UPDATE_POSITION.TYPE,
                    agent: resources.AGENTS.API,
                    data: {
                      // TODO: add billboard
                        entityTypeName: resources.ENTITY_TYPE_NAMES.AIRPLANE,
                        entityId: e.id,
                        position: cords.value,
                        label: `AIRPLANE-${e.id}`
                    }                              
                  });                
                }
            }, 2000);            
          });
          
          initialViewState.entityTypes.find(l => l.name===resources.ENTITY_TYPE_NAMES.HELICOPTER).entities.forEach(e =>{
            const gen = e.gen(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                  dispatcher.dispatch({
                    type: resources.ACTIONS.UPDATE_POSITION.TYPE,
                    agent: resources.AGENTS.API,
                    data: {
                      // TODO: add billboard
                        entityTypeName: resources.ENTITY_TYPE_NAMES.HELICOPTER,
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
