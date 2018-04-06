import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import BarChart from './BarChart';
import geojson from './Limiti_2016_WGS84.Com2016_WGS84.grep.ProvinciaBari.EPSG4326.geojson.js';
import data from './data.js';
import { range } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
//http://www.segretaricomunalivighenzi.it/28-03-2017-obbligo-di-pubblicazione-dei-redditi-dei-dirigenti-lanac-prende-le-distanze-ma-si-adegua
//http://www.anticorruzione.it/portal/public/classic/AttivitaAutorita/AttiDellAutorita/_Atto?ca=6708
var options = {
    city: "Bari",
    center: [16.8719, 41.1171],
    zoom: 8,
    dataIntervals: [10000,50000,150000,300000000],
    colorIntervals: ["#FFFFDD", "#3E9583", "#3f6d82", "#013f5b"],
    highlightColor: '#FCBC34',
    id: 'COMUNE',
    property: 'numero_di_residenti'
};

var stops = options.dataIntervals.map((d, i) => i>0 ? [options.dataIntervals[i-1], options.colorIntervals[i]] : [0, options.colorIntervals[i]]);
//color scale for d3
var colorScale = scaleThreshold().domain(options.dataIntervals).range(options.colorIntervals);

//extract features from geojson
var features = geojson.features;

//attach data
var comuni = data.map((d) => d[options.id]);

features.forEach((d,i) => {
    var index = comuni.indexOf(d.properties[options.id]);
    d.properties["numero_di_residenti"] = data[index]["numero_di_residenti"];
    d.punteggio_medio = data[index]["punteggio_medio"] + 0.001;
    d.punteggio_completezza_dati = data[index]["punteggio_completezza_dati"];
    d.punteggio_facilita_estrazione_dati = data[index]["punteggio_facilita_estrazione_dati"];
    d.punteggio_uniformita_formato_dati = data[index]["punteggio_uniformita_formato_dati"];
})
features = features.sort((a,b) => b["punteggio_medio"]-a["punteggio_medio"]);


class App extends Component {

    constructor(props){
	super(props)
	this.onHover = this.onHover.bind(this)
	this.state = { hover: "none" }
    };
        
    onHover(d) {
	this.setState({ hover: d.properties[options.id] })
    };

    render() {
	return (
		<div className="App">
		    <div className="App-header">
	  	        <h2>Amministrazione Trasparente</h2>
	            </div>
		    <br/>
		    <h2>Provincia di {options.city}</h2>
		    <h3>Disponibilità dei dati relativi agli stipendi dei Segretari Generali e dei dirigenti dei Comuni</h3>
		    <br/>
		    <div style={{ display: "flex" }}>
		        <Map
	                    hoverElement={this.state.hover}
	                    onHover={this.onHover}
	                    stops={stops}
	                    highlightColor={options.highlightColor}
	                    data={{type: "FeatureCollection", features: features}}
	                    property={options.property}
	                    quartieri={{center: options.center, zoom: options.zoom}}
		        />
	                <div style={{ width: "25vw" }}>
	                    <BarChart
	                        hoverElement={this.state.hover}
	                        onHover={this.onHover}
	                        colorScale={colorScale}
	                        highlightColor={options.highlightColor}
	                        data={features}
	                        property={options.property}
		            />   
	                </div>        	    
		    </div>
		</div>
	)
    };
}

export default App;
