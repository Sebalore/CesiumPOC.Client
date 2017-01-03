//------ LAYER NAMES --------------
const UAV = 'UAV';
const HELICOPTERS = 'Helicopters';
const DMA = 'DynamicMissionArea';
const FLIGHT_CIRCLE = 'FlightCircle';
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
    FLIGHT_CIRCLE: FLIGHT_CIRCLE,
    DMA: DMA,
    UAV: UAV,
    HELICOPTERS: HELICOPTERS,
    MAP_CENTER: {
        longitude: 34.99249855493725,
        latitude:  32.79628841345832,
        height: 1.0
    },
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
        [FLIGHT_CIRCLE]: {
            IMG: 'icon_1.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new flight circle.',
                    IMG: 'icon_11.svg'
                }
            }
        },
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
        },
        [HELICOPTERS]: {
            IMG: 'icon_3.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new helicopter'
                }
            }
        }        
    },
    ACTIONS: {
        ADD: {
            TYPE: ADD,
            DESC: 'Add a new entity',
            LAYERS: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
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
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
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
                DMA, UAV, HELICOPTERS
            ],
            AGENTS: [USER, API]
        },
        MAP_CENTER: {
            TYPE: MAP_CENTER,
            DESC: 'Change map camera view to center on the entity',
            LAYERS: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        SET_ENTITY_CESIUM_ID : {
            TYPE: SET_ENTITY_CESIUM_ID,
            DESC: 'add generated cesiumId to added object in the store',
            LAYERS: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        TOGGLE_LAYER: {
            TYPE: TOGGLE_LAYER,
            DESC: 'Torn on/off layer on the map',
            LAYERS: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        }
    }
};
