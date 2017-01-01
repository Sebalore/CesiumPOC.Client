import {EventEmitter} from 'events';
import dispatcher from './dispatcher';

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
        {
          cesiumId: null, //guid to be provided by cesium
          position: {
            longitude: -75.1668043913917,
            latitude: 39.90610546720464,
            height: 1.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.DMA].IMG}`,
            scale: 0.95
          }
        }
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
          cesiumId: null, //guid to be provided by cesium
          position: {
            longitude: 34.99249855493725,
            latitude: 32.79628841345832,
            height: 1.0
          },
          billboard: {
            imgUrl: `${resources.IMG.BASE_URL}${resources.LAYERS[resources.UAV].IMG}`,
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

  /**
 * get all layers names that avialable in the store
 * @returns {Array} string array of names
 */
  getAllExistLayersName() {
    return this
      .data
      .layers
      .map((currentLayer) => currentLayer.name);
  }

  /**
   * get the index of entity in the store by generated cesium id
   * @param {String} cesiumEntityId
   * @param {String} layerName
   * @returns {Object} the entity index and the layer index
   */
  getEntityIndexById(cesiumEntityId, layerName) {
    for (let layerIndex = 0; layerIndex < this.data.layers.length; layerIndex++) {
      const currentLayer = this.data.layers[layerIndex];

      if (currentLayer.name !== layerName) {
        continue;
      }

      for (let entityIndex = 0; entityIndex < currentLayer.entities.length; entityIndex++) {
        const currentEntity = currentLayer.entities[entityIndex];
        if (currentEntity.cesiumId && currentEntity.cesiumId === cesiumEntityId) {
          return {entityIndex, layerIndex};
        }
      }
    }

    return {entityIndex: -1, layerIndex: -1};
  }

  getData() {
    return this.data;
  }

  update(data) {
    this.data = data;
    return Promise.resolve(this.data);
  }['handle' + resources.ACTIONS.TOGGLE_LAYER.TYPE](agent, data) {
    return new Promise((resolve, reject) => {
      const layerIndex = data.layerIndex;

      if (layerIndex >= 0 && layerIndex < this.data.layers.length) {
        this.data.layers[layerIndex].active = !this.data.layers[layerIndex].active;
        this.emit('change', this.data);
        resolve(this.data.layers[layerIndex]);
      } else {
        const msg = `Layer index ${layerIndex} was not found in store.`;
        // console.error(msg);
        reject(msg);
      }
    });
  }['handle' + resources.ACTIONS.ADD.TYPE](agent, data) {
    return new Promise((resolve, reject) => {
      const layerName = data.layerName;
      const layerIndex = this
        .getAllExistLayersName()
        .indexOf(layerName);

      // TODO: if layer does not exist, add new layer to layers array
      if (layerName !== '' && layerIndex !== -1) {
        this
          .data
          .layers[layerIndex]
          .entities
          .push(data.entityToAdd);
        this.emit('change', this.data);
        resolve(this.data.layers[layerIndex]);
      } else {
        const msg = `Layer index ${layerIndex} was not found in store.`;
        // console.error(msg);
        reject(msg);
      }
    });
  }['handle' + resources.ACTIONS.SET_ENTITY_ID.TYPE](agent, data) {
    return new Promise((resolve, reject) => {

      const layerName = data.layerName;
      const layerIndex = this
        .getAllExistLayersName()
        .indexOf(layerName);

      // TODO: if layer does not exist, add new layer to layers array
      if (layerName !== '' && layerIndex !== -1) {
        this.data.layers[layerIndex].entities[data.entityIdx].cesiumId = data.cesiumId;
        this.emit('change', this.data);
        resolve(this.data.layers[layerIndex]);
      } else {
        const msg = `Layer index ${layerIndex} was not found in store.`;
        // console.error(msg);
        reject(msg);
      }
    });
  }['handle' + resources.ACTIONS.DELETE.TYPE](agent, data) {
    return new Promise((resolve, reject) => {
      const layerName = data.layerName, {entityIndex, layerIndex} = this.getEntityIndexById(data.cesiumId, layerName);

      // TODO: if layer does not exist, add new layer to layers array
      if (layerName !== '' && layerIndex !== -1) {
        this
          .data
          .layers[layerIndex]
          .entities
          .splice(entityIndex, 1);
        this.emit('change', this.data);
        resolve(this.data.layers[layerIndex]);
      } else {
        const msg = `Layer index ${layerIndex} was not found in store.`;
        // console.error(msg);
        reject(msg);
      }
    });
  }

  ['handle' +  resources.ACTIONS.UPDATE_POSITION.TYPE](agent, data) {
    return new Promise((resolve, reject) => {
      const layerName = data.layerName,
        {entityIndex , layerIndex } = this.getEntityIndexById(data.cesiumId, layerName);

      // TODO: if layer does not exist, add new layer to layers array
      if (layerName !== '' && layerIndex !== -1) {
        this.data.layers[layerIndex].entities[entityIndex].position = data.position;
        this.emit('change', this.data);
        resolve(this.data.layers[layerIndex]);
      } 
      else {
        const msg = `Layer index ${layerIndex} was not found in store.`;
        // console.error(msg);
        reject(msg);
      }
    });
  }

  handleActions(action) {

    switch (action.type) {
      case 'UPDATE':
        {
          this
            .update(action.data)
            .then(this.emit('change'))
            .catch();
          break;
        }
    }
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
        this['handle' + action.type](action.agent, action.data).then((actionResult) => {
          return new Promise((resolve, reject) => {
            eventData.result = actionResult;
            console.log(`[action ${action.agent}]:${action.type} store hadler. ${JSON.stringify(eventData)}`);
            this.emit('contextAwareActionExecuted', null, eventData);
            resolve(eventData);
          });
        }).catch(err => {
          eventData.error = err;
          console.error(`[action ${action.agent}]:${action.type} store hadler. ${JSON.stringify(eventData)}`);
          this.emit('contextAwareActionExecuted', err, eventData);
        });
      } else {
        //otherwise just fire the event
        console.warn(`[action ${action.agent}]:${action.type} has no handler in store.`);
        this.emit('contextAwareActionExecuted', null, eventData);
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
