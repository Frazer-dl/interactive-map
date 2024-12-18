import React, { useEffect, useState } from "react";
import { YMaps, Map, Polygon } from "react-yandex-maps";
import "./app.css";

const MapComponent = () => {
    const [plots, setPlots] = useState([]);
    const [activePlot, setActivePlot] = useState(null);

    // Инициализируем состояние для центра карты и зума
    const [mapState, setMapState] = useState({
        center: [55.27755706967344, 37.733425530572525], // Начальные координаты
        zoom: 10, // Начальный зум
    });

    useEffect(() => {
        const loadPlots = async () => {
            try {
                let response = await fetch('/interactive-map/data.json');
                if (!response.ok) {
                    response = await fetch('/data.json');
                }
                if (!response.ok) {
                    throw new Error('Error loading data');
                }
                const data = await response.json();
                const transformedData = data.map((plot) => ({
                    ...plot,
                    coordinates: [plot.coordinates.map(([lon, lat]) => [lat, lon])],
                }));

                console.log("Transformed Data:", transformedData);
                setPlots(transformedData);
            } catch (error) {
                console.error("Error loading or transforming data:", error);
            }
        };

        loadPlots();
    }, []);

    const handlePolygonClick = (plot) => {
        console.log("Polygon clicked:", plot);
        setActivePlot(plot);
    };

    const closeSidebar = () => {
        setActivePlot(null);
    };

    return (
        <div className={`container ${activePlot ? "with-sidebar" : ""}`}>
            {activePlot && (
                <div className="sidebar">
                    <h2>Информация</h2>
                    <div className="info">
                        <p><strong>ID:</strong> {activePlot.id}</p>
                        <p><strong>Участок:</strong> {activePlot.building}</p>
                        <p><strong>Площадь:</strong> {activePlot.area_value} м²</p>
                        <button onClick={closeSidebar}>Закрыть</button>
                    </div>
                </div>
            )}

            {/* Карта */}
            <div className="map-container">
                <YMaps>
                    <Map
                        defaultState={{
                            center: mapState.center,  // Центр карты
                            zoom: mapState.zoom,      // Зум карты
                        }}
                        width="100%"
                        height="100%"
                    >
                        {plots.map((plot) => (
                            plot.coordinates &&
                            plot.coordinates[0] &&
                            plot.coordinates[0].length > 0 && (
                                <Polygon
                                    key={plot.id}
                                    geometry={plot.coordinates}
                                    options={{
                                        fillColor: activePlot?.id === plot.id ? "#FF0000" : "#00FF00",
                                        strokeColor: "#0000FF",
                                        opacity: 0.5,
                                        strokeWidth: 2,
                                    }}
                                    onClick={() => handlePolygonClick(plot)}
                                />
                            )
                        ))}
                    </Map>
                </YMaps>
            </div>
        </div>
    );
};

export default MapComponent;
