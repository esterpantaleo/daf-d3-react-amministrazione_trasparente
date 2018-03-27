import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import './App.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5qYWxvdCIsImEiOiJjaWhtdmxhNTIwb25zdHBsejk0NGdhODJhIn0.2-F2hS_oTZenAWc0BMf_uw';

class Map extends Component {
    map;
    
    constructor(props: Props) {
	super(props);
	this.state = { hoverElement: props.hoverElement };
    }
    
    componentDidMount() {	
	this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v9',
            center: this.props.quartieri.center,
            zoom: this.props.quartieri.zoom
        });
	
	this.map.on('load', () => {
	    var map = this.map;
	    var props = this.props;
	    map.addSource('Quartieri', {type: 'geojson', data: props.data});
	    var layers = map.getStyle().layers;
	    // Find the index of the first symbol layer in the map style
	    var firstSymbolId;
	    for (var i = 0; i < layers.length; i++) {
		if (layers[i].type === 'symbol') {
		    firstSymbolId = layers[i].id;
		    break;
		}
	    }
	    
	    map.addLayer({
		id: 'Quartieri',
		type: 'fill',
		paint: {'fill-opacity': 1},
		layout: {},
		source: 'Quartieri'
	    }, firstSymbolId);
	    map.setPaintProperty('Quartieri', 'fill-color', {
		property: props.property,
		stops: props.stops
	    });
	    map.addLayer({
		id: 'Quartieri-hover',
		type: "fill",
		source: 'Quartieri',
		layout: {},
		paint: {"fill-color": props.highlightColor, "fill-opacity": 1},
		filter: ["==", 'COMUNE', props.hoverElement]
	    }, firstSymbolId);
	    map.addLayer({
		id: 'Quartieri-line',
		type: 'line',
		paint: {'line-opacity': 0.25},
		source: 'Quartieri'
	    }, firstSymbolId);
	    
	    map.on('mousemove', 'Quartieri', function(e) {	
		map.setFilter('Quartieri-hover', ['==', 'COMUNE', e.features[0].properties['COMUNE']]);
		const features = map.queryRenderedFeatures(e.point);
		
		props.onHover(e.features[0]);
	    });
	    map.on('mouseout', 'Quartieri', function(e) {
		map.setFilter('Quartieri-hover', ['==', 'COMUNE', props.hoverElement]);
		
		
	    });
	});
    }

    componentDidUpdate() {
	const hoverElement = this.props.hoverElement;
	if (hoverElement !== 'none') {
	    this.map.setFilter('Quartieri-hover', ['==', 'COMUNE', hoverElement]);
	}	    
    }
    
    render() {
	return (
            <div	    
	        ref={el => this.mapContainer = el}
	        style={{ height: "60vh", width: "70vw" }}
            />
	);
    }
}
    
export default Map;
