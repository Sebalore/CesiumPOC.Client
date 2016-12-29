const  UAV  = 'UAV';
const  DMA = 'DynamicMissionArea';

export const resources =  {
    UAV: UAV,
    DMA: DMA,
    IMG : {
        BASE_URL: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391',
        SCALE: '25%',
        MAX_WIDTH: '65px',      
        MAX_HEIGHT: '45px',

    },
    LAYERS: {
        [DMA]: {
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new destination point'
                }
            }
        },
        [UAV]: {
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new UAV'
                }
            }
        }        
    }
};

module.exports = resources;
