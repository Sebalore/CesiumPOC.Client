//------ LAYER NAMES --------------
const UAV = 'UAV';
const DMA = 'DynamicMissionArea';
//--------------------------------- ------- ACTION NAMES ------------
const ADD = 'ADD';
const DELETE = 'DELETE';
const UPDATE_POSITION = 'UPDATE_POSITION';
const MAP_CENTER = 'MAP_CENTER';
const TOGGLE_LAYER = 'TOGGLE_LAYER';
const SET_ENTITY_CESIUM_ID = 'SET_ENTITY_CESIUM_ID';
//--------------------------------- ------ AGENTS ------------------
const USER = 'USER';
const API = 'API';
//--------------------------------

export const resources = {
    UAV: UAV,
    DMA: DMA,
    IMG: {
        BASE_URL: 'src/shared/images/',
        SCALE: '25%',
        MAX_WIDTH: '65px',
        MAX_HEIGHT: '45px'
    },
    AGENTS: {
        USER: USER,
        API: API
    },
    LAYERS: {
        [DMA]: {
            IMG: 'icon_9.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new destination point'
                }
            }
        },
        [UAV]: {
            IMG: 'icon_5.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new UAV'
                }
            }
        }
    },
    ACTIONS: {
        ADD: {
            TYPE: ADD,
            DESC: 'Add a new entity',
            LAYERS: [
                DMA, UAV
            ], //ON WHAT LAYERS CAN THIS ACTION BE PERFORMED
            AGENTS: [
                USER, API
            ], //WHOS CAN PERFORM ACTION
            IMG: 'layer'
        },
        DELETE: {
            TYPE: DELETE,
            DESC: 'Delete an entity',
            LAYERS: [
                DMA, UAV
            ],
            AGENTS: [
                USER, API
            ],
            IMG: 'icon_7.svg'
        },
        UPDATE_POSITION: {
            TYPE: UPDATE_POSITION,
            DESC: 'Change position coordinates (and rotation?) of entity',
            LAYERS: [
                DMA, UAV
            ],
            AGENTS: [USER, API]
        },
        MAP_CENTER: {
            TYPE: MAP_CENTER,
            DESC: 'Change map camera view to center on the entity',
            LAYERS: [
                DMA, UAV
            ],
            AGENTS: [USER]
        },
        SET_ENTITY_CESIUM_ID : {
            TYPE: SET_ENTITY_CESIUM_ID,
            DESC: 'add generated cesiumId to added object in the store',
            LAYERS: [
                DMA, UAV
            ],
            AGENTS: [USER]
        },
        TOGGLE_LAYER: {
            TYPE: TOGGLE_LAYER,
            DESC: 'Torn on/off layer on the map',
            LAYERS: [
                DMA, UAV
            ],
            AGENTS: [USER]
        }
    }
};
