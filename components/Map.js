import React, { useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Icon, map } from 'leaflet';
import L from "leaflet";
import Head from 'next/head';
import { ContextMenu, Theme } from '@radix-ui/themes';
import { generarSVGConCirculoEnCentro } from '@/lib/functions/svg';

const MapWithClickEvent = ({
    waitingForPoint,
    onStop,
    onMapRef,
    onMarkerClick,
    currentMarkers,
    id,
    setId,
    setSelectedMarker
}) => {
    const mapRef = useRef();
    const mapa = mapRef.current
    onMapRef(mapa);
    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        //console.log(lat, lng);
        onStop({
            position: [lat, lng],
            character: String.fromCharCode(65 + id)
        });
        setId(id + 1);
        setSelectedMarker({lat,lng})
    };
    const flyTo = markerInfo => {
        const { lat, lng } = markerInfo.latlng;
        mapa.flyTo([lat, lng], 18, {
            duration: 1.5
        });
        onMarkerClick({ lat, lng });
        setSelectedMarker({ lat, lng })
    }

    const ClickEvent = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return null;
    };
    const DesactivarResaltado = () => {
        useMapEvents({
            click: ()=>{
                setSelectedMarker(null)
            },
        });
        return null;
    };
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                    crossOrigin=""
                />
            </Head>
            <MapContainer ref={mapRef} style={{ height: '100vh', width: '100%' }} center={[19.472819274952897, -99.14333273147834]} zoom={13}>
                <DesactivarResaltado/>
                {waitingForPoint && (
                    <ClickEvent />
                )}
                {currentMarkers.map((marker, id) => (
                    <Marker key={id} position={marker.position} icon={new L.DivIcon({
                        className: "custom-icon",
                        html: `<div><img src="data:image/svg+xml;utf8,${encodeURIComponent(
                            // Reemplaza el contenido con el SVG generado
                            generarSVGConCirculoEnCentro(marker.character)
                        )}" width="45" height="45" /></div>`,
                    })}
                        eventHandlers={{ click: flyTo }}
                    />
                ))}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </>
    );
};

export default MapWithClickEvent;
