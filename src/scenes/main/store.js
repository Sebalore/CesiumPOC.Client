import {EventEmitter} from 'events';
import dispatcher from './dispatcher';

//resources
import {resources} from '../../shared/data/resources';
const initialViewState = {
  layers: [
    {
      name: resources.DMA,
      imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
      active: true,
      actions: [
        {
          id: resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png'
        }
      ],
      entities: [
        // {
        //   position: {
        //     longitude: -75.1668043913917,
        //     latitude: 39.90610546720464,
        //     height: 1.0
        //   },
        //   billboard: {
        //     image: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391/tank_gqfsf8.png',
        //     scale: 0.95
        //   }
        // }
        {
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
    }, 
    {
      name: resources.UAV,
      imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png',
      active: true,
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [
        {
          id: null, //guid to be provided by cesium
          position: {
            longitude: -75.1668043913917,
            latitude: 39.90610546720464,
            height: 1.0
          },
          billboard: {
            image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
            scale: 0.95
          }
        }, 
        // {
        //   id: null, //guid to be provided by cesium
        //   position: {
        //     longitude: -75.16617698856817,
        //     latitude: 39.90607492083895,
        //     height: 1.0
        //   },
        //   billboard: {
        //     image: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
        //     scale: 0.95
        //   }
        // }
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
    this.data = data
    return Promise.resolve(this.data);
  }

  ['handle' +  resources.ACTIONS.TOGGLE_LAYER.TYPE](agent, data) {
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
  }

  handleActions(action) {

    switch (action.type) {
      case 'UPDATE':
        {
          this.update(action.data)
              .then(this.emit('change'))
              .catch();
          break;
        }
    }
  }

  handleContextAwareActions(action) {
    if (resources.ACTIONS[action.type]) {
      const  eventData = {
        agent: action.agent,
        data: action.data,
        result: null,
        error: null
      };
      if (typeof this['handle' + action.type] === 'function') {
          //execute the action if there is a matching function defined in store
          this['handle' + action.type](action.agent, action.data)
          .then((actionResult) => {
            return new Promise((resolve, reject) => {
              eventData.result = actionResult;
              console.log(`[action ${action.agent}]:${action.type} store hadler. ${JSON.stringify(eventData)}`);
              this.emit('contextAwareActionExecuted', null, eventData);
              resolve(eventData);
            });
          })
          .catch(err => {
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
