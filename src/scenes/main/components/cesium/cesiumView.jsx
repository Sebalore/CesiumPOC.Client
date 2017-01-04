  
// Base Imports
import React from 'react';
import path from 'path';
import Guid from 'guid';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// outer components 
import FlightCircleForm from './FlightCircleForm.jsx';

// ---------------------------------------------Cesium Imports----------------------------------------------------

//----------------!!!!Cesium sources setup!!!!! -------------------------------
///!!! Reuired for Webpack.!!!!!
///Ensure that BUILD_DIR points to the right folder 
///and that the Cesium files are copied there from /node_modules/cesium/Build/Cesium
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl._cesiumScriptRegex = /(.*?)\/Cesium\w*\.js(?:\W|$)/i;
const BUILD_DIR = path.resolve(__dirname, 'dist');
BuildModuleUrl.setBaseUrl(BUILD_DIR);
//-----------------------------------------------------------------------------

// Set Cesium default key to avoid warning on screen.
import BingMapsApi from 'cesium/Source/Core/BingMapsApi';
BingMapsApi.defaultKey = 'ApKtWGAVLWzzHvuvGZFWTRIXrsyLJ5czBuu9MkIGAdWwsQpXz_GiC55jbSnI43Qq';

//various Cesium objects
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
//import JulianDate from 'cesium/Source/Core/JulianDate';
//import Entity from 'cesium/Source/DataSources/Entity';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import 'cesium/Source/Widgets/widgets.css';
import Math from 'cesium/Source/Core/Math';
import CustomDataSource from 'cesium/Source/DataSources/CustomDataSource.js';
import LabelGraphics from 'cesium/Source/DataSources/LabelGraphics.js';

import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType.js';
//-----------------------------------------------------------------------------------------------------------------

//-----------------resources----------------------------------------
import {resources} from '../../../../shared/data/resources.js'; 


// Consts
const componentStyle = {
    general: {
        width: '100vw',
        height: '95vh',
    },
    fullSizeDimentions: {
        height : '95%',
        margin: '5px auto'
    },
    map : {
        height: '95%',
        width: '91vw',
        margin: '0 auto',
    },
    altimeter : {
        position: 'relative',
        top: '-70vh',
        marginLeft: '120px'
    },
    tooltip : {
        display: 'block',
        position: 'fixed',
        overflow: 'hidden',
        width: '188px',
        height: '43px',
        background: 'white',
        border: '1px solid #47494c',
        borderRadius: '5px',
        visibility: 'hidden',
        textAlign: 'center',
    },
    editEntityForm: {
        width: '234px',
        top: '-671px',
        left: '221px',
        height: '200px',
        backgroundColor: '#aaaaaa',
        position: 'relative',
        visibility: 'hidden',
  },
  formH1: {
    background: '#615a5a',
    borderBottom: '1px solid black',
    textAlign: 'center'
  }
};

const initialViewState = {
    activeEntityType: null,
    entityTypes: [],
    zoomHeight: 20000,
    center: {
      x: resources.MAP_CENTER.longitude,
      y: resources.MAP_CENTER.latitude,
    },
    options: {
        timeline: false,
        animation: true,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,  // allow the info box to pop up when selecting an entity
        navigationHelpButton: false,
        shadows: false,
        sceneModePicker: false,
        sceneMode: 3, //Cesium.SceneMode.SCENE3D
        selectionIndicator: true,   // allow a green box that displayed around the selected entity
        baseLayerPicker: false,
        geocoder: false,
    }
};

export default class CesiumView extends React.Component {

    constructor(props) {
        super(props);

        // class members
        this.viewState = initialViewState;
        this.zoomedEntity = null;
        this.selectedEntity = null;
        this.selectedLayerName = null;
        this.currentDisplayForm = '';

       // class methods
        this.onDrop = this.onDrop.bind(this);
        this.handleContextAwareActions = this.handleContextAwareActions.bind(this);
        this.onFlightCircleFormClosed = this.onFlightCircleFormClosed.bind(this);
    }

    componentDidMount() {

        let entity, selectedEntity;
        const dragging = false, isFirstClick = true;

        this.viewer = new CesiumViewer(this.refs.map, this.viewState.options);
        this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);  

        this.viewer.camera.lookAt(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));

        // subscribe viewer entities
        // this.viewer.entities.collectionChanged.addEventListenter( (collection, added, removed, changed) => console.log('entities collection changed!'));

        // map the data sources from the entityTypes
        this.props.entityTypes.forEach(entityType => this.createEntityTypeDataSource(entityType));

        this.setMapEventHandlers(this.viewer, this.handler, entity, selectedEntity, dragging, isFirstClick);
    }

    handleContextAwareActions(error, eventData) {
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error);
            } 
            else {
                const ds = this.viewer.dataSources;
                const entityTypeIdx = this.props.entityTypes.findIndex(l => l.name === eventData.data.entityTypeName);
                const entityTypeIsActive = entityTypeIdx> -1 && this.props.entityTypes[entityTypeIdx].active;               
                const entityTypeDataSource = ds.get(Array.from(ds).findIndex((fuckThis, i) => ds.get(i).name===eventData.data.entityTypeName));

                switch (eventData.type) {
                    case resources.ACTIONS.TOGGLE_ENTITY_TYPE.TYPE: {
                        entityTypeDataSource.show = !entityTypeDataSource.show;
                        break;   
                    } 
                    case resources.ACTIONS.DELETE.TYPE: {
                        if (entityTypeIsActive) {
                            if(eventData.agent === resources.AGENTS.USER) {
                                if (entityTypeDataSource && entityTypeDataSource.entities) {
                                    entityTypeDataSource.entities.removeById(eventData.data.cesiumId);
                                }
                            }
                        }
                        break;
                    }                    
                    case resources.ACTIONS.ADD.TYPE:
                    case resources.ACTIONS.UPDATE_POSITION.TYPE: {
                        if (entityTypeIsActive) {
                            if (eventData.type === resources.ACTIONS.UPDATE_POSITION.TYPE) {
                                const entityToUpdate = entityTypeDataSource.entities.getById(eventData.result.cesiumId);
                                entityTypeDataSource.entities.remove(entityToUpdate);   

                                // real update
                                // TODO: uncomment when we have replay from cesium forum

                                // console.log('------------------------change entity position------------------');
                                // console.log('before: ', entityToUpdate.position);
                                // entityToUpdate.position = Cartesian3.fromDegrees(eventData.data.position.latitude, eventData.data.position.longitude, 1000);                           
                                // console.log('after: ', entityToUpdate.position);                             
                            }

                            const addedEntity = entityTypeDataSource.entities.add(this.generateEntity(eventData.result.position, eventData.result.billboard, {
                                label: new LabelGraphics({
                                    text: eventData.result.label || '...', 
                                    show: false
                                })
                            }));
                            
                            this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
                                resources.AGENTS.USER,
                                {
                                    entityTypeName: eventData.data.entityTypeName,
                                    entityId: eventData.result.id,
                                    cesiumId: addedEntity.id
                                });
                        }
                        break;
                    }
                    case resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE: {

                        const entity = eventData.data.entity || this.zoomedEntity;
                        if(!this.zoomedEntity) {
                            this.viewer.zoomTo(entity, {
                                heading : 0,
                                pitch: -Math.PI/2,
                                range: this.viewState.zoomHeight/2  //TODO: calculate it according to entity size
                            });

                            this.zoomedEntity = entity;
                        } else {
                            //revert to default view
                            entity.billboard.scale = 1;

                            this.viewer.camera.lookAt(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                            this.zoomedEntity = null;
                        }

                    }
                }

                resolve(eventData);
            } 
        });
    }

    /**
     * maps the entities array of a entityType to a newly created cesium CustomDataSource object
     * @param {Object} entityType the entityType object
     */
    createEntityTypeDataSource(entityType) {
        const entityTypeDataSource = new CustomDataSource(entityType.name);
        entityType.entities.map(e => {
            const cesiumEntity = entityTypeDataSource.entities.add(this.generateEntity(e.position, e.billboard, {label: new LabelGraphics({text: e.label || 'nothing here', show: false})})); 
            this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
                resources.AGENTS.USER, {
                    entityTypeName: entityType.name,
                    entityId: e.id,
                    cesiumId: cesiumEntity.id
                }
            ); 
            
        });

        this.viewer.dataSources.add(entityTypeDataSource);
    }

    /**
     * generate entity by params
     * @param {position} a position object containinf longitude and latitude in degrees (or radians?) and height in meters
     * @param {billboard} billboard object
     * @returns {Object} an object that can be added to cesium entities collection
     */
    generateEntity(position, billboard, others) {
        const cesiumEntity =  {
                position: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                billboard,
                ...others
        };
        return cesiumEntity;
    }

    setMapEventHandlers(viewer, handler, entity, selectedEntity, dragging, isFirstClick) {
            // Get mouse position on screeמ (unrelated to Cesium viewer object)
            let x, y;
            window.onmousemove = function (e) {
                x = e.clientX;
                y = e.clientY;
            };                    

            // Drag & Drop 
            handler.setInputAction( click => 
            {
                const pickedObject = viewer.scene.pick(click.position);
                
                if (this.defined(pickedObject)) 
                {
                    entity = pickedObject.id;
                    //entity.billboard.scale = 1.2;
                    dragging = true;
                    viewer.scene.screenSpaceCameraController.enableInputs = false;
                }
            }, ScreenSpaceEventType.LEFT_DOWN);

            // dragging handler
            handler.setInputAction( movement => 
            {
                const tooltipInfo = this.refs.movementToolTip;

                if (dragging) 
                {
                    entity.position = viewer.camera.pickEllipsoid(movement.endPosition);
                }
                else {
                    const pickedObject = viewer.scene.pick(movement.endPosition);

                    // handle tooltip display on the screen
                    if (this.defined(pickedObject)) {
                        tooltipInfo.style.visibility = 'visible';
                        tooltipInfo.style.top = (y - 70) + 'px';
                        tooltipInfo.style.left = (x - 20) + 'px';                          
                        tooltipInfo.innerHTML = pickedObject.id.label ? pickedObject.id.label.text._value : '... add a toolptip for this object';

                        setTimeout(() => tooltipInfo.style.visibility = 'hidden', 7000);
                    }
                }

            }, ScreenSpaceEventType.MOUSE_MOVE);

            // mouse up handler
            handler.setInputAction( () => 
            {
                dragging = false;
                viewer.scene.screenSpaceCameraController.enableInputs = true;
            }, ScreenSpaceEventType.LEFT_UP);
           
           //click two times animation handler
            handler.setInputAction( click => 
            {
                if(!dragging)
                {
                    if (isFirstClick) // if first click on object
                    {
                        const pickedObject = viewer.scene.pick(click.position);

                        if (this.defined(pickedObject)) 
                        {
                            selectedEntity = {
                                id: pickedObject.id._id,
                                entity: pickedObject.id, 
                                x: click.position.x, 
                                y: click.position.y 
                            };

                            this.clickType = false;
                        }
                    }
                    else // if second click on object
                    {
                        const isRemoveWasSucceded = viewer.entities.removeById(selectedEntity.id);
                        isFirstClick = true;
                    }
                }   // end if !dragging

            }, ScreenSpaceEventType.LEFT_CLICK);

            // left click on map
            handler.setInputAction( click => {
                const pickedObject = viewer.scene.pick(click.position);

                if (this.zoomedEntity || pickedObject) {
                    this.props.actions[resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE](resources.AGENTS.USER, {entity: pickedObject?pickedObject.id:null});
                    
                    if(pickedObject) {
                        const entityTypeStr = pickedObject.id.entityCollection.owner.name;
                        const entityOwnerIdx = Object.keys(resources.ENTITY_TYPES).indexOf(entityTypeStr);
                        const entityOwnerArray = this.props.entityTypes[entityOwnerIdx].entities;

                        this.selectedEntity = entityOwnerArray.filter( (entity) => {
                            return entity.cesiumId === pickedObject.id.id;
                        });

                        switch (entityTypeStr) {
                            case resources.DMA:
                            case resources.UAV:
                            case resources.HELICOPTERS:
                            {
                                break;
                            }
                            case resources.FLIGHT_CIRCLE:
                            {
                                this.currentDisplayForm = resources.FLIGHT_CIRCLE;
                                break;
                            }
                        }
                    }
                } 
                else {
                    const cartesian = this.viewer.camera.pickEllipsoid( click.position, this.viewer.scene.globe.ellipsoid);
                    this.viewer.camera.lookAt(cartesian, new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                }
            }, ScreenSpaceEventType.RIGHT_UP);         
    }

    defined(object) {
        return (object !== undefined && object !== null);
    }

    /** the function handle droping entities from this combobox to the map */
    onDrop(event)    {
        // calculate new object drop area
        // const t = this.viewer.entities;
        const dim = this.refs.map.getClientRects()[0];
        const x = (event.clientX - dim.left);
        const y = (event.clientY - dim.top);

        // add the new object to the map
        const mousePosition = new Cartesian2(x, y);
        let cartesian = mousePosition;
        if (this.viewer.scene.mode === 3) {
            //Cesium.SceneMode.SCENE3D 
            cartesian = this.viewer.camera.pickEllipsoid(mousePosition, this.viewer.scene.globe.ellipsoid); // maybe the problem here!!
        }
     
        const entityTypeName = event.dataTransfer.getData('text');
        const entityType = this.props.entityTypes.find(l => l.name === entityTypeName);
        //console.log(entityTypeName);

        if (cartesian && entityTypeName && entityType) {
            const cartographic =  this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            const longitudeString = Math.toDegrees(cartographic.longitude);
            const latitudeString = Math.toDegrees(cartographic.latitude);

            this.props.actions[resources.ACTIONS.ADD.TYPE](
                resources.AGENTS.USER,
                 {
                    id: Guid.create(),
                    entityTypeName: entityTypeName,
                    label: `${entityTypeName}-New-Added`,
                    position: { 
                        height : 1000.0,            // TODO: change it 
                        latitude : latitudeString,
                        longitude : longitudeString,
                    },
                    billboard: {
                        image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.IMG}`,
                        scale: resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.SCALE || 1
                    }                    
                });
        } else {
            console.log('CesiumView::onDrop(event) : something went wrong.');
        }
    }

    onFlightCircleFormClosed() {
        this.currentDisplayForm = '';
    }

    render() {

        return (
            <div style = {componentStyle.general}>
                <div id="general" ref="general" style = {componentStyle.fullSizeDimentions}>
                    <div style = {componentStyle.map} id="map"className="map" ref="map" onDragOver= { (e) => e.preventDefault() } onDrop={this.onDrop}>
                    </div>
                </div>
                <img style = {componentStyle.altimeter} src="https://s27.postimg.org/op4ssy0ur/altimeter.png" alt="altimeter" />
                <div style = {componentStyle.tooltip} ref="movementToolTip" id="movementToolTip" />
                <FlightCircleForm onFormClosed={this.onFlightCircleFormClosed} ref="flightCircleForm" entity={this.selectedEntity} layerName={this.selectedLayerName} toDisplay={this.currentDisplayForm == resources.FLIGHT_CIRCLE}/>
            </div>
        );
    }
}

CesiumView.propTypes = {
    entityTypes : React.PropTypes.array,
    activeEntityType : React.PropTypes.object,
    onAddEntity : React.PropTypes.func,
    onRemovEntity : React.PropTypes.func,
    onUpdateEntityPosition : React.PropTypes.func
};
