import {resources} from '../../shared/data/resources';

import internalData from '../../shared/data/entityTypesInternalData';

/**
 * @param {Array} entityTypes
 */
export const setEntityTypes = (entityTypes) => ({
  type: 'SET_ENTITY_TYPES',
  data: entityTypes
});

/**
 * @param {Array} entityTypesInfo
 */
export const setAddableEntityTypesInfo = (entityTypesInfo) => ({
  type: 'SET_ADDABLE_ENTITY_TYPES_INFO',
  data: entityTypesInfo
});

/**
 * handle initial data fetch from the server ( for now it is inner data source )
 */
export function fetchAllLayersData(){
  return dispatch => {
    // set all entities layers info
    dispatch(setEntityTypes(internalData.entityTypes));
    // get and set addable entity types info
    const entityTypesArray = internalData.entityTypes.filter(layer => {
          const add = resources.ACTIONS.ADD;
          const hasUserAgent = add.AGENTS.some(agent => agent === resources.AGENTS.USER);
          const hasLayer = true; 

          return layer.active && hasUserAgent && hasLayer;
      }).map(layer =>{
        return {name: layer.name, imgUrl: layer.imgUrl};
      });

    dispatch(setAddableEntityTypesInfo(entityTypesArray));
    };
}

/**
 * @param {String} entityIdToDelete
 */
export const deleteEntity = (entityIdToDelete) => ({
  type: 'DELETE_ENTITY',
  data: entityIdToDelete
});

/**
 * @param {String} entityIdUpdate
 * @param {Object} entityPosition
 */
export const setEntityPosition = (entityIdUpdate, entityPosition) => ({
  type: 'SET_ENTITY_POSITION',
  data: {
    entityIdUpdate, entityPosition
  }
});

/**
 * @param {Object} entityToAdd
 */
export const addEntity = (entityTypeName, entityToAdd) => ({
  type: 'ADD_ENTITY',
  data: {
    entityToAdd,
    entityTypeName
  }
});

/**
 * @param {String} entityTypeName
 */
export const toggleEntityTypeActivation = (entityTypeName) => ({
  type: 'TOGGLE_ENTITY_TYPE_ACTIVATION',
  data: entityTypeName
});

/**
 * @param {Boolean} isOn
 */
export const setDrawingZiahStatus = (isOn) => ({
  type: 'SET_DRAWING_ZIAH_STATUS',
  data: isOn
});
