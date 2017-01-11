  
// Base Imports
import React from 'react';
import path from 'path';
import Guid from 'guid';

// outer components 
import EntityForm from './components/entityFormView';

// //-------------------------Geodesy --------------------------
// //Libraries of geodesy functions implemented in JavaScript
// import geodesy from 'geodesy';
// // https://github.com/chrisveness/geodesy

// ---------------------------------------------Cesium Imports----------------------------------------------------

//---------------- Cesium sources setup -------------------------------
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
import Entity from 'cesium/Source/DataSources/Entity';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import CesiumColor from 'cesium/Source/Core/Color';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import CesiumMath from 'cesium/Source/Core/Math';
import CustomDataSource from 'cesium/Source/DataSources/CustomDataSource';
import Ellipsoid from 'cesium/Source/Core/Ellipsoid';
import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType';

import 'cesium/Source/Widgets/widgets.css';
//-----------------------------------------------------------------------------------------------------------------

//-----------------services ----------------------------------------
import { defined, isPointIsInsideCircle } from '../../utills/services';

//-----------------resources----------------------------------------
import {resources} from '../../shared/data/resources'; 
import {Images} from '../../shared/images/AllImages';

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
    entityForm : {
        top: 20 + 'vh',
        left: 15 + 'vw'        
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
    zoomHeight: 990000,
    center: {
      x: resources.MAP_CENTER.longitude,
      y: resources.MAP_CENTER.latitude,
    },
    options: {
        timeline: false,
        animation: false,
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
        this.defaultHeight = 10;
        this.zoomedEntity = null;
        this.selectedEntity = {
            entityTypeName: null,
            showEntityForm: false,
            position: { 
                height: 0,            
                latitude: 0,
                longitude: 0,
            }            
        };
        this.selectedLayerName = null;

       // class methods
        this.onDrop = this.onDrop.bind(this);
        this.handleContextAwareActions = this.handleContextAwareActions.bind(this);
        this.onEntityFormClose = this.onEntityFormClose.bind(this);
        this.addEntityToDataSourceCollection = this.addEntityToDataSourceCollection.bind(this);
        this.getDataSourceByName = this.getDataSourceByName.bind(this);
        this.attachedAssociatedEntitiesToEntity = this.attachedAssociatedEntitiesToEntity.bind(this);
    }

    componentDidMount() {

        let entity, selectedEntity;
        const dragging = false, isFirstClick = true;

        this.viewer = new CesiumViewer(this.refs.map, this.viewState.options);
        this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);  

        // set map start position
        this.viewer.camera.lookAt(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));

        // add data source for mission id tooltip
        this.viewer.dataSources.add(new CustomDataSource('EntityMissionTooltips'));
        
        // map the data sources from the entityTypes
        this.props.entityTypes.forEach(entityType => this.createEntityTypeDataSource(entityType));

        this.setMapEventHandlers(this.viewer, this.handler, entity, selectedEntity, dragging, isFirstClick);
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
                
                if (defined(pickedObject)) 
                {
                    entity = pickedObject.id;
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
                    if (defined(pickedObject)) {
                        const storeEntityRepresentation = pickedObject.id.storeEntity;
                        
                        tooltipInfo.style.visibility = 'visible';
                        tooltipInfo.style.top = (y - 70) + 'px';
                        tooltipInfo.style.left = (x - 20) + 'px';                          
                        tooltipInfo.innerHTML = storeEntityRepresentation.label ? storeEntityRepresentation.label : '... add a toolptip for this object';

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

            // left click on map
            handler.setInputAction( click => {
                const pickedObject = viewer.scene.pick(click.position) || this.zoomedEntity;

                if (pickedObject) {
                    this.props.actions[resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE](resources.AGENTS.USER, {entity: pickedObject?pickedObject.id:null});
                } 
                else {
                    const cartesian = this.viewer.camera.pickEllipsoid( click.position, this.viewer.scene.globe.ellipsoid);
                    this.viewer.camera.lookAt(cartesian, new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                    this.hideEntityForm();
                }
            }, ScreenSpaceEventType.RIGHT_UP);         
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
                    case resources.ACTIONS.ADD.TYPE: {
                        const entityToAdd = this.generateEntity(eventData.data.entityTypeName, eventData.result);
                        this.addEntityToDataSourceCollection(entityToAdd, entityTypeDataSource, eventData.data.entityTypeName, eventData.result);  
                        break;
                    }
                    case resources.ACTIONS.UPDATE_POSITION.TYPE: {
                        if (entityTypeIsActive) {
                            const entityToUpdate = entityTypeDataSource.entities.getById(eventData.result.cesiumId);
                            // update position
                            entityToUpdate.position = Cartesian3.fromDegrees(eventData.data.position.latitude, eventData.data.position.longitude, 1000);  
                            // update bilboard for new color due to the new height
                            entityToUpdate.billboard = this.getBillboard(eventData.data.entityTypeName, eventData.result);
                        }
                        break;
                    }
                    case resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE: {

                        if(!this.zoomedEntity) {
                            const entity = eventData.data.entity;
                            const range =  entity.billboard.sizeInMeters? entity.billboard.width.getValue() * 2.25: null;
                            this.viewer.zoomTo(entity, {
                                heading : 0,
                                pitch: -CesiumMath.PI/2,
                                range: range
                            });
                            this.zoomedEntity = entity;
                        } else {
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
     * @param {Object} storeEntity the entityType object
     */
    createEntityTypeDataSource(storeEntity) {
        const entityTypeDataSource = new CustomDataSource(storeEntity.name);

        storeEntity.entities.map(e => {
            const entityToAdd = this.generateEntity(storeEntity.name, e);
            const addedEntity = this.addEntityToDataSourceCollection(entityToAdd, entityTypeDataSource, storeEntity.name, e);    
        });

        this.viewer.dataSources.add(entityTypeDataSource);
    }

    /**
     * get specified data source by his name
     * @param {String} dataSourceNameToSearch
     * @returns {Cesium.CustomDataSource} or -1 if not exist
     */
    getDataSourceByName(dataSourceNameToSearch) {
        let result = -1;
        for(let i = 0 ; i < this.viewer.dataSources.length ; i++) {
            const currentDataSource = this.viewer.dataSources.get(i);
            if(currentDataSource.name === dataSourceNameToSearch) {
                result = currentDataSource;
                break;
            }
        }

        return result;
    }

    /**
     * add one entity to the specified data source with addition some logic
     * @param {Object} entityToAdd generated by generateEntity()
     * @param {Cesium.DataSource} dataSource
     * @param {String} entityTypeName
     * @param {Object} storeEntityReference
     * @returns {Cesium.Entity} added entity
     */
    addEntityToDataSourceCollection(entityToAdd, dataSource, entityTypeName, storeEntityReference) {
        const addedEntity = dataSource.entities.add(entityToAdd);
        
        addedEntity.addProperty('storeEntity');
        addedEntity['storeEntity'] = storeEntityReference;
        
        this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
            resources.AGENTS.USER, {
                entityTypeName,
                entityId: storeEntityReference.id,
                cesiumId: addedEntity.id
            }
        ); 

        console.assert(storeEntityReference.cesiumId === addedEntity.id);
        return addedEntity;
    }

    /**
     * add sub entities to entity for describing him. 
     * @param {Cesium.Entity} cesiumEntity
     */
    attachedAssociatedEntitiesToEntity(cesiumEntity) {
        const storeEntity = cesiumEntity.storeEntity;
        
        // if object is related to a mission
        if(storeEntity.hasOwnProperty('missionId') && defined(storeEntity.missionId)) {
            const entityMissionTooltipsDataSource = this.getDataSourceByName('EntityMissionTooltips'),
                positionDistanceToAdd = 0.005,
                missionEntity = this.generateEntity(resources.ENTITY_TYPE_NAMES.MISSION_TOOLTIP, Object.assign({},{
                        position: {
                        longitude: storeEntity.position.longitude + positionDistanceToAdd, 
                        latitude: storeEntity.position.latitude + positionDistanceToAdd, 
                        height: storeEntity.position.height
                        }, ...storeEntity
                }));

            // check if found before doing anything
            if(entityMissionTooltipsDataSource !== -1) {

                const addedMissionEntity = entityMissionTooltipsDataSource.entities.add(missionEntity);
                
                addedMissionEntity.addProperty('storeEntity');
                addedMissionEntity['storeEntity'] = storeEntity;
            }
        }
    }

    /**
     * generate entity by params
     * @param {position} a position object containinf longitude and latitude in degrees (or radians?) and height in meters
     * @returns {Object} an object that can be added to cesium entities collection
     */
    generateEntity(entityTypeName, entity) {
        const { position, label } = entity;
        const cesiumEntity =  {
                position: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                billboard: this.getBillboard(entityTypeName, entity),
                label
        };

        return cesiumEntity;
    }

    getBillboard(entityTypeName, entity) {
        if (entity && entityTypeName) {
            let billboard = {
                image: `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.IMG}`,
                scale: resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.SCALE || 1
            };

            switch (entityTypeName) {
                case resources.ENTITY_TYPE_NAMES.MISSION_TOOLTIP:
                {
                    const imageName = `${resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.IMG}`;  
                    const svgString = Images[imageName].replace('ENTER_NUMBER_HERE', entity.missionId);

                    billboard.image = this.pinColor(svgString, CesiumColor.BLACK);
                    break;
                }
                case resources.ENTITY_TYPE_NAMES.AIRPLANE:
                case resources.ENTITY_TYPE_NAMES.HELICOPTER:
                {
                    const imageName = `${resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.IMG}`.replace('.svg', '');  
                    billboard.image = this.pinColor(Images[imageName], this.mapHeightToColor(entity.position.height));
                    break;          
                }
                case resources.ENTITY_TYPE_NAMES.FLIGHT_AREA:
                case resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_OUT:
                case resources.ENTITY_TYPE_NAMES.FORBIDEN_FLIGHT_AREA:            
                case resources.ENTITY_TYPE_NAMES.FLIGHT_CIRCLE_IN:
                {
                    billboard.image = `${resources.IMG.BASE_URL}${resources.ENTITY_TYPES[entityTypeName].ACTIONS.ADD.IMG}`,
                    billboard.sizeInMeters = true;
                    billboard.height = (entity.radius || 1) + 50;
                    billboard.width = (entity.radius || 1);
                    break;
                }
            }
            
            return billboard;
        }

        return null;
    }

    /**
     * @param {Number} height
     * @returns {Cesium.Color} 
     */
    mapHeightToColor(height) {
        const heightJumpUnit = 500, 
            maxHeightInAltimeterScalla = 5500, 
            minHeightInAltimeterScalla = 3000,
            heightColors = {
                '3000': CesiumColor.BISQUE ,
                '3500': CesiumColor.GOLD ,
                '4000': CesiumColor.DARKSEAGREEN ,
                '4500': CesiumColor.DARKOLIVEGREEN ,
                '5000': CesiumColor.SANDYBROWN,
                '5500': CesiumColor.SANDYBROWN
            },
            alpha = 1;
        let heightRange = height - height % heightJumpUnit;
        
        if (height > maxHeightInAltimeterScalla) {
            heightRange = maxHeightInAltimeterScalla;
        }
        else if (height < minHeightInAltimeterScalla) {
            heightRange = minHeightInAltimeterScalla;
        }        

        return CesiumColor.fromAlpha(heightColors[heightRange], alpha);
    }

    /**
     * generate svg with desired color for cesium billboard
     * @param {String} svg an inline svg
     * @param {Cesium.Color} color
     * @returns {String} that represent the desired svg
     */
    pinColor(svg, color) {
        function cesiumRgb2Hex(rgb) {
            return (Math.round(((1 << 24) + (rgb.red*255 << 16) + (rgb.green*255 << 8) + rgb.blue*255))
                .toString(16)
                    .slice(1));
        }
    
        function exportSVG(svg) {
            return `data:image/svg+xml;base64,${btoa(svg)}` ;   // window.btoa
        }
        
        const hexColor = cesiumRgb2Hex(color); // get the hex color to fill
        
        return exportSVG(svg.replace('ffffff', hexColor));
    }

    /** the function handle droping entities from this combobox to the map */
    onDrop(event)    {
        // calculate new object drop area
        const dim = this.refs.map.getClientRects()[0];
        const x = (event.clientX - dim.left);
        const y = (event.clientY - dim.top);

        // add the new object to the map
        const mousePosition = new Cartesian2(x, y);
        let cartesian = mousePosition;
        if (this.viewer.scene.mode === 3) {
            cartesian = this.viewer.camera.pickEllipsoid(mousePosition, this.viewer.scene.globe.ellipsoid); 
        }
     
        const entityTypeName = event.dataTransfer.getData('text');
        const entityType = this.props.entityTypes.find(l => l.name === entityTypeName);

        if (cartesian && entityTypeName && entityType) {
                      
            const cartographic =  this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            const longitudeString = CesiumMath.toDegrees(cartographic.longitude);
            const latitudeString = CesiumMath.toDegrees(cartographic.latitude);
            

            this.selectedEntity = Object.assign({}, {
                    id: Guid.create(),
                    entityTypeName,
                    label: `${entityTypeName}-New-Added`,
                    position: { 
                        height : this.defaultHeight,
                        latitude : latitudeString,
                        longitude : longitudeString,
                    }
            }); 
            this.showEntityForm(y-90, x+120);
        } 
        else {
            console.log('CesiumView::onDrop(event) : something went wrong.');
        }
    }

    onEntityFormClose(formData) {
        if(formData && formData.entity) {
            this.selectedEntity = Object.assign({}, formData.entity);
            this.props.actions[resources.ACTIONS.ADD.TYPE](
                resources.AGENTS.USER,
                this.selectedEntity);     
        }
        else {
            // EntityForm closed with Cancel
        }

        this.hideEntityForm();
    }

    showEntityForm(top, left) {
        if (top && left) {
            componentStyle.entityForm.top = top + 'px';
            componentStyle.entityForm.left = left + 'px';
        }
        
        this.selectedEntity.showEntityForm = true;
        this.forceUpdate();
    }

    hideEntityForm() {
        this.selectedEntity.showEntityForm = false;
        this.forceUpdate();
    }

    /**
     * check if entity is in flight circle
     * @param {Cesium.Entity} entity
     * @param {Cesium.Entity} flightCircle
     */
    isEntityIsInFlightCircle(entity, flightCircle) {
        const entityCart = Ellipsoid.WGS84.cartesianArrayToCartographicArray(entity.position._value),
            flightCircleCart = Ellipsoid.WGS84.cartesianArrayToCartographicArray(flightCircle.position._value);

        return isPointIsInsideCircle(
            entityCart.longitude,               // pointX
            entityCart.latitude,                // pointY
            flightCircleCart.longitude,         // circleCenterX
            flightCircleCart.latitude,          // circleCenterY
            entityCart.billboard.width / 2      // circleRadius
        );
    }

    render() {
        return (
            <div style = {componentStyle.general}>
                <div id="general" ref="general" style = {componentStyle.fullSizeDimentions}>
                    <div style = {componentStyle.map} id="map"className="map" ref="map" onDragOver= { (e) => e.preventDefault() } onDrop={this.onDrop} onContextMenu={ e => e.preventDefault()} >
                    </div>
                </div>
                <img style = {componentStyle.altimeter} src="https://s27.postimg.org/op4ssy0ur/altimeter.png" alt="altimeter" />
                <div style = {componentStyle.tooltip} ref="movementToolTip" id="movementToolTip">
                </div>
                {this.selectedEntity.showEntityForm &&
                <EntityForm entity={this.selectedEntity} onFormClose={this.onEntityFormClose} position={{top: componentStyle.entityForm.top, left:componentStyle.entityForm.left}} ref="entityForm" id="entityForm" />
                }
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