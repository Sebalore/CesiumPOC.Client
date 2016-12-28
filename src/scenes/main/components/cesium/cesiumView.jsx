// Base Imports
import React from 'react';
import path from 'path';

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
import JulianDate from 'cesium/Source/Core/JulianDate';
import Entity from 'cesium/Source/DataSources/Entity';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import Rectangle from 'cesium/Source/Core/Rectangle';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import 'cesium/Source/Widgets/widgets.css';
import Math from 'cesium/Source/Core/Math';
// --------------------------------------------------------------------------------------------------------------


// Consts
const baseStorageURL = 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391'
const images = {
    // tankURL: baseStorageURL + '/tank_gqfsf8.png',
    // soldierURL: baseStorageURL + '/soldier_f0cxpf.png',
    jetURL: baseStorageURL + '/jet_ppnyns.png'
};
const ScreenSpaceEventType = { 
    LEFT_UP: 1, 
    LEFT_CLICK: 2, 
    MOUSE_MOVE: 15, 
    LEFT_DOWN: 0 
};
const initialViewState = {
    // id: 'af3e91b2-3ff0-4adf-2a29-23649c017542', // Guid.create(),
    activeLayer: null,
    layers: [],
    zoomHeight: 100,
    center: {
        x: -75.166497,
        y: 39.9060534
    },
    options: {
        timeline: false,
        animation: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        shadows: false,
        sceneModePicker: true,
        sceneMode: 3, //Cesium.SceneMode.SCENE3D
        selectionIndicator: false,
        baseLayerPicker: false,
        geocoder: false
    }
};


class CesiumView extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.viewState = initialViewState;
        

    }

    componentDidMount() {

        let entity, 
            selectedEntity,
            dragging = false,
            isFirstClick = true;

        this.viewer = new CesiumViewer(this.refs.map, this.viewState.options);
        this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);     
        this.setMapEventHandlers(this.viewer, this.handler, entity, selectedEntity, dragging, isFirstClick);

        // move to the default map
        this.setNewFocusOnMap(this.viewState.center.x, this.viewState.center.y);
    }

    setMapEventHandlers(viewer, handler, entity, selectedEntity, dragging, isFirstClick) {
            
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
                if (dragging) 
                {
                    entity.position = viewer.camera.pickEllipsoid(movement.endPosition);
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
    }


    defined(object) {
        return (object !== undefined && object !== null);
    }

    /** change the map center view - action like fly to given coordinates */
    setNewFocusOnMap(x, y)    {

        this.viewer.camera.lookAt(Cartesian3.fromDegrees(x, y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
    }

    /** the function handle droping entities from this combobox to the map */
    onDrop(event)    {

        // calculate new object drop area
        const t = this.viewer.entities;
        const dim = this.refs.map.getClientRects()[0];
        const x = (event.clientX - dim.left);
        const y = (event.clientY - dim.top);

        // add the new object to the map
        const mousePosition = new Cartesian2(x, y);
        let cartesian = mousePosition;
        if (this.viewer.scene.mode === 3) {
            //Cesium.SceneMode.SCENE3D 
            cartesian = this.viewer.camera
            .pickEllipsoid(mousePosition, this.viewer.scene.globe.ellipsoid); // maybe the problem here!!
        }

     
        const img = document.getElementById(event.dataTransfer.getData("text"));
        //console.log(img);

        if (cartesian && img) {
            const cartographic =  this.viewer.scene.globe.ellipsoid
                                    .cartesianToCartographic(cartesian);
            const longitudeString = Math.toDegrees(cartographic.longitude);
            const latitudeString = Math.toDegrees(cartographic.latitude);

            const cesiumEntity = {
                position: Cartesian3.fromDegrees(longitudeString, latitudeString, 1.0),
                billboard: {
                    image: img.src,
                    scale: img.clientHeight /100   
                }
            };

            // add the entity to the map
            this.viewer.entities.add(cesiumEntity);

            this.setState({entities: this.viewer.entities.values.map((entity) => {
                return {
                        position: entity.position.getValue(JulianDate.now()),
                        billboard: {
                        image: entity.billboard.image.getValue(),
                        scale: entity.billboard.scale.getValue() 
                    }  
                };
            })});
        } else {
            console.log('CesiumView::onDrop(event) : something went wrong.');
        }
    }

    render() {

        return (
            <div>
                <div id="general" ref="general">
                    <div id="map"className="map" ref="map" onDragOver= { (e) => e.preventDefault() } onDrop={this.onDrop.bind(this)}>
                    </div>
                </div>
            </div>
        );
    }
}

export default CesiumView;

