import { createLinearCoordinatesGenerator } from '../utills/services';
import {resources} from '../shared/data/resources';
import Guid from 'guid';

export default  {
  entityTypes: [
    {
      name: resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN,
      active: true,
      entities: []
    }, 
    {
      name: resources.ENTITY_TYPE_NAMES.DMA,
      active: true,
      entities: []
    }, 
    {
      name: resources.ENTITY_TYPE_NAMES.VISINT,
      active: true,
      entities: []
    }, 
    {
      name: resources.ENTITY_TYPE_NAMES.SIGINT,
      active: true,
      entities: []
    }
  ]
};