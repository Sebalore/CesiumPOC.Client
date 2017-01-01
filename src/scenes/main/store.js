import {EventEmitter} from 'events';
import dispatcher from './dispatcher';

//resources
import {resources} from '../../shared/data/resources';
const initialViewState = {
  activeLayerIndex: 0,
  layers: [
    {
      name: resources.DMA,
      imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png',
      actions: [
        {
          id: resources.LAYERS[resources.DMA].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.DMA].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/tank_gqfsf8.png'
        }
      ],
      entities: [
        {
          position: {
            longitude: -75.1668043913917,
            latitude: 39.90610546720464,
            height: 1.0
          },
          billboard: {
            image: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391/tank_gqfsf8.png',
            scale: 0.95
          }
        }
      ]
    }, 
    {
      name: resources.UAV,
      imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png',
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
    },
        {
      name: resources.UAV,
      imgUrl: 'http://downloadicons.net/sites/default/files/home-home-icon-90085.png', //resources.IMG.BASE_URL + '/jet_ppnyns.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [

      ]
    },
        {
      name: resources.UAV,
      imgUrl: 'http://4.bp.blogspot.com/--ddYKXz6fpc/Uh1NrRYLtVI/AAAAAAAAAPA/Bd16ChUzC2Q/s1600/home-icon.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [
  
      ]
    },
    {
      name: resources.UAV,
      imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [
  
      ]
    },
    {
      name: resources.UAV,
      imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png',
      actions: [
        {
          id: resources.LAYERS[resources.UAV].ACTIONS.ADD.ID,
          description: resources.LAYERS[resources.UAV].ACTIONS.ADD.DESC,
          imgUrl: resources.IMG.BASE_URL + '/jet_ppnyns.png'
        }
      ],
      entities: [
  
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

  setActiveLayer(layerIndex) {
    return new Promise((resolve, reject) => {
      if (layerIndex>=0) {
        this.data.activeLayerIndex = layerIndex;
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
          .catch()
          break;
        }
      case 'SET_ACTIVE_LAYER':
        {
          this.setActiveLayer(action.layerIndex)
          .then((newActiveLayer) => {
            this.emit('activeLayerChanged', null, newActiveLayer);
          })
          .catch((err) => {
               this.emit('activeLayerChanged', err);
          })
          break;
        }
    }
  }
}

const store = new _store;
dispatcher.register(store.handleActions.bind(store));
window.dispatcher = dispatcher;
export default store;

// onAddEntity = (entity, layerName) => {   store[0]     .layers[layerName]
// .entities     .push(entiy);   console.log(`${entity.id} added to ${layerName}
// layer.`); }; onRemovEntity = (entity, layerName) => {
// store[0].layers[layerName].entities = store[0]     .layers[layerName]
// .entities     .filter(e => !e.id || e.id !== entity.id);
// console.log(`${entity.id} removed from ${layerName} layer.`); };
// onUpdateEntityPosition = (entity, layerName) => {   const idx = store[0]
// .layers[layerName]     .entities     .findIndex(e => e.id === entiy.id);   if
// (idx) {     store[0].layers[layerName].entities[idx].position =
// entity.position;     console.log(`${entity.id} of ${layerName} layer had
// changed position to ${entity.position}.`);   } else {
// console.erroror(`${entity.id} was not found in ${layerName} layer.`);   } };
