import { createLinearCoordinatesGenerator } from './services';
import {resources} from '../../shared/data/resources';
import Guid from 'guid';

export default initialViewState;
const initialViewState = {
  entityTypes: [
    {
      name: resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN].IMG}`,
      active: true,
      actions: [{
          id: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN].ACTIONS.ADD.IMG}`
        }
      ],
      entities: []
    }, {
      name: resources.ENTITY_TYPE_NAMES.DMA,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].IMG}`,
      active: true,
      actions: [{
          id: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.DMA].ACTIONS.ADD.IMG}`
        }
      ],
      entities: []
    }, 
    {
      name: resources.ENTITY_TYPE_NAMES.AIRPLANE,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].IMG}`,
      active: true,
      actions: [{
          id: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.IMG}`
        },
      ],
      entities: [{
          id: Guid.create(), //serial number on planes tail;
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.ENTITY_TYPE_NAMES.AIRPLANE}: 001`,
          missionId : 123,
          position: {
            longitude: resources.MAP_CENTER.longitude - 0.075,
            latitude: resources.MAP_CENTER.latitude - 0.04,
            height: 1000.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          uavData: {
            orientation : {
              yaw : null,
              pitch: null,
              roll : null
            },
            windData: {
              direction: null,
              speed : null
            },
            velocity:{
              north : null,
              east: null,
              down: null
            }
          }, 
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.002,
            latitude: 0.001,
            height: 250
          })
        } , {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.ENTITY_TYPE_NAMES.AIRPLANE}: 002`,
           missionId : 777,
          position: {
            longitude: resources.MAP_CENTER.longitude - 0.05,
            latitude: resources.MAP_CENTER.latitude + 0.03,
            height: 1500.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.IMG}`,
            rotation: -90,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.001,
            latitude: -0.002,
            height: 250
          })
        }, {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.ENTITY_TYPE_NAMES.AIRPLANE}: 003`,
          position: {
            longitude: resources.MAP_CENTER.longitude + 0.085,
            latitude: resources.MAP_CENTER.latitude + 0.02,
            height: 750.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.AIRPLANE].ACTIONS.ADD.IMG}`,
            rotation: 90,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: -0.001,
            latitude: -0.00002,
            height: 250
          })
        }
      ]
    }, {
      name: resources.ENTITY_TYPE_NAMES.HELICOPTER,
      imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].IMG}`,
      active: true,
      actions: [{
          id: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].ACTIONS.ADD.ID,
          description: resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].ACTIONS.ADD.DESC,
          imgUrl: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].ACTIONS.ADD.IMG}`
        }
      ],
      entities: [{
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.ENTITY_TYPE_NAMES.HELICOPTER}: 001`,
          position: {
            longitude: resources.MAP_CENTER.longitude, // + 0.065,
            latitude: resources.MAP_CENTER.latitude, // - 0.085,
            height: 69.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: -0.00001,
            latitude: 0.0001,
            height: 250
          })
        } , {
          id: Guid.create(),
          cesiumId: null, //guid to be provided by cesium
          label: `${resources.ENTITY_TYPE_NAMES.HELICOPTER}: 002`,
          missionId : 888,
          position: {
            longitude: resources.MAP_CENTER.longitude  + 0.0065,
            latitude: resources.MAP_CENTER.latitude - 0.0085,
            height: 250.0
          },
          billboard: {
            image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[resources.ENTITY_TYPE_NAMES.HELICOPTER].ACTIONS.ADD.IMG}`,
            scale: 0.95
          },
          gen:  createLinearCoordinatesGenerator({
            longitude: 0.00001,
            latitude: -0.0001,
            height: 250
          })
        }
      ]
    }
  ]
};