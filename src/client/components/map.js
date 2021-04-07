import React, {useRef} from "react";
import {MapContainer, TileLayer, FeatureGroup} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import MapMarker from "./map-marker";
// import "react-leaflet-markercluster/dist/styles.min.css";

const Map = ({trees}) => {
    const groupRef = useRef();
    const clusterRef = useRef();
    return (
        <>
            <MapContainer
                center={[50.62571, 5.56878]}
                zoom={15}
                minZoom={12}
                maxZoom={18}>
                <TileLayer
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <FeatureGroup ref={groupRef} name={"Homes"}>
                    <MarkerClusterGroup ref={clusterRef}>
                        {trees.map(tree => (
                            <MapMarker
                                position={tree.geometry.coordinates}
                                tree={tree.id}
                                key={tree.id}
                            />
                        ))}
                    </MarkerClusterGroup>
                </FeatureGroup>
            </MapContainer>
        </>
    );
};

export default Map;
