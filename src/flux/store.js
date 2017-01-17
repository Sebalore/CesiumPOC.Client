import {EventEmitter} from 'events';
import dispatcher from './dispatcher';

//resources
import {resources} from '../shared/data/resources';
import initialViewState from './storeIntialState';

class _store extends EventEmitter {

  constructor() {
    super();
    this.data = initialViewState;
  }

  getData() {
    return this.data;
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
  
  ['handle' + resources.ACTIONS.ADD.TYPE](eventData) {
    return new Promise((resolve) => {
      const entityTypeName = eventData.data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      
      this.data.entityTypes[entityTypeIndex].entities.push(eventData.data);
      resolve(eventData.data);
    });
  }

  ['handle' + resources.ACTIONS.DELETE.TYPE](eventData) {
      return new Promise((resolve) => {
      const entityTypeName = eventData.data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      const entityIndex = this.data.entityTypes[entityTypeIndex].entities.findIndex(e => e.id===eventData.data.id);
      
      this.data.entityTypes[entityTypeIndex].entities.splice(entityIndex, 1);   
      resolve(true);
    });
  }

  ['handle' +  resources.ACTIONS.UPDATE_POSITION.TYPE](eventData) {
      return new Promise((resolve) => {
      const entityTypeName = eventData.data.entityTypeName;
      const entityTypeIndex = this.data.entityTypes.findIndex(l => l.name===entityTypeName);
      const entityIndex = this.data.entityTypes[entityTypeIndex].entities.findIndex(e => e.id===eventData.data.id);
      if (entityIndex!==-1) {
        this.data.entityTypes[entityTypeIndex].entities[entityIndex].position = eventData.data.position;
        resolve(this.data.entityTypes[entityTypeIndex].entities[entityIndex]);
      } else {
        eventData.action = resources.ACTIONS.ADD.TYPE;
        resolve( this['handle' + eventData.action](eventData));
      }
    });
  }

  handleActions(action) {
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
        this['handle' + action.type](eventData)
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
}

const store = new _store;

dispatcher.register(store.handleActions.bind(store));
window.dispatcher = dispatcher;
window.store = store;

export default store;
