import initialState from './mainIntialState';
import {deepClone, isEmptyObject} from '../../../utills/services';

const mainReducer = (state = initialState, action) => {

    const newState = deepClone(state); 

    switch (action.type) {

        case 'SET_ENTITY_TYPES':
        {
            newState.entityTypes = action.data;
            return newState;
        }
        case 'SET_ADDABLE_ENTITY_TYPES_INFO':
        {
            newState.addableEntityTypesInfo = action.data;
            return newState;
        }
        case 'DELETE_ENTITY':
        {
            const unReached = -1;
            const entityIdx = getEntityById(action.data, state.entityTypes);

            if(entityIdx != unReached) {
                newState.entityTypes.splice(entityIdx, 1);
            }
            
            return newState;
        }
        case 'ADD_ENTITY':
        {
            const unReached = -1,
                whereToAdd = getEntityTypeIdx(newState.entityTypes, action.data.entityTypeName);

            if(whereToAdd !== unReached) {
                newState.entityTypes[whereToAdd].entities.push(action.data.entityToAdd);
            }
  
            return newState;
        }
        case 'SET_ENTITY_POSITION':
        {
            const entityDetails = getEntityById(action.data.entityIdUpdate, state.entityTypes);

            if(!isEmptyObject(entityDetails)) {
                newState.entityTypes[entityDetails.entityTypeIndex].entities[entityDetails.entityIndex].position = action.data.entityPosition;
            }

            return newState;
        }
        case 'TOGGLE_ENTITY_TYPE_ACTIVATION':
        {
             const unReached = -1,
                whereToAdd = getEntityTypeIdx(newState.entityTypes, action.data);

            if(whereToAdd !== unReached) {
                newState.entityTypes[whereToAdd].active = !newState.entityTypes[whereToAdd].active;
            }
  
            return newState;
        }
        
        default:
            return state;
    }
};

export default mainReducer;

// -------------------------------------------- helper functions -------------------

/**
 * get entity index in the container array by his id
 * @param {String} entityId
 * @param {Array} entityTypesContianer
 * @returns {Object} the entity index if found, otherwise empty object
 */
export function getEntityById(entityId, entityTypesContianer) {
    const entityDetails = {};

    for(let i = 0 ; i < entityTypesContianer.length; i++) {
        const currentEntityType = entityTypesContianer[i];

        for(let j = 0 ; j < currentEntityType.entities.length; j++) {
            if (currentEntityType.entities[j].id === entityId) {
                entityDetails.entityIndex = j;
                entityDetails.entityTypeIndex = i;
                break;
            }
        }
    }

    return entityDetails;
}

/**
 * get entity type index by name
 * @param {Array} entityTypeArr
 * @param {String} entityTypeName
 * @returns {Number} -1 if not found
 */
export function getEntityTypeIdx(entityTypeArr, entityTypeName) {
    let idxToReturn = -1;

    for(let i = 0 ; i < entityTypeArr.length; i++) {
        if(entityTypeArr[i].name === entityTypeName) {
            idxToReturn = i;
            break;
        }
    }

    return idxToReturn;
}