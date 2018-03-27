import React, { Component } from 'react';
import './App.css';
import { max } from 'd3-array';
import { legendColor } from 'd3-svg-legend';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';

class BarChart extends Component {
    yScale;
    barWidth;
    
    constructor(props){
	super(props);
	this.createBarChart = this.createBarChart.bind(this);
	this.state = { hoverElement: props.hoverElement };
    };
    
    componentDidMount() {
	const node = this.node;
	const dataMax = max(this.props.data.map(d => d.data));
	this.barWidth = 10;
	const legend = legendColor()
              .scale(this.props.colorScale)
              .labels(["< 15000 abitanti", "tra 15000 e 50000", "tra 50000 e 150000", "> 150000 abitanti"]);

        select(node)
            .selectAll("g.legend")
            .data([0])
            .enter()
            .append("g")
            .attr("class", "legend")
            .call(legend);

        select(node)
            .select("g.legend")
            .attr("transform", "translate(15, 330)");

	this.yScale = scaleLinear()
              .domain([0, dataMax])
              .range([0, 150]);

	select(node)
            .append("text")
            .attr("class", "bartitle")
            .attr("text-anchor", "left")
            .attr("x", 20)
            .attr("y", 20)
            .text("Disponibilità dei dati relativi agli stipendi");

	select(node)
            .append("text")
            .attr("class", "bartitle")
            .attr("text-anchor", "left")
            .attr("x", 20)
            .attr("y", 40)
            .text("dei Segretari Generali e dei dirigenti dei Comuni");

	
	 select(node)
            .append("text")
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .attr("x", 270 - this.yScale(this.props.data[0].data))
            .attr("y", 110)
            .text(Math.round(100 * this.props.data[0].data) + "%");

	select(node)
            .append("text")
            .attr("id", "COMUNE")
            .attr("x", 20)
            .attr("y", 200)

	select(node)
            .append("text")
            .attr("id", "num_di_residenti")
            .attr("x", 20)
            .attr("y", 200 + this.barWidth *2)

	select(node)
	    .append("text")
	    .attr("id", "punteggio_uniformita_formato_dati")
	    .attr("x", 20)
	    .attr("y", 200 + this.barWidth *4)

	select(node)
	    .append("text")
	    .attr("id", "punteggio_facilita_estrazione_dati")
	    .attr("x", 20)
	    .attr("y", 200 + this.barWidth *6)

	select(node)
	    .append("text")
	    .attr("id", "punteggio_completezza_dati")
	    .attr("x", 20)
	    .attr("y", 200 + this.barWidth *8)

	select(node)
	    .append("text")
	    .attr("id", "punteggio_medio")
	    .attr("x", 20)
	    .attr("y", 200 + this.barWidth *10)    
	
	this.createBarChart();
    };
    
    componentDidUpdate() {
	this.createBarChart();
    };
    
    createBarChart() {
	var node = this.node;
	select(node)
	    .selectAll("rect.bar")
	    .data(this.props.data)
	    .enter()
	    .append("rect")
            .attr("class", "bar")
            .on("mouseover", d => {
		this.props.onHover(d);
	    })
	//.on("mouseleave", this.setState({ hoverElement: "none" }));
	
		
	select(node)
	    .selectAll("rect.bar")
	    .data(this.props.data)
	    .exit()
            .remove();
	select(node)
	    .selectAll("rect.bar")
	    .data(this.props.data)
            .attr("y", (d,i) => 100 + i * this.barWidth)
            .attr("x", d => 300 - this.yScale(d.data))
            .attr("width", d => this.yScale(d.data))
            .attr("height", this.barWidth)
            .style("fill", d => {
		return this.props.hoverElement === d.properties["COMUNE"] ? this.props.highlightColor : this.props.colorScale(d.properties[this.props.property])
	    })
            .style("stroke", "black")
            .style("stroke-opacity", 0.25);

	var index = this.props.data.map(d => d.properties.COMUNE).indexOf(this.props.hoverElement);
	if (index > -1) {
	    select("#COMUNE")
		.text("Comune di " + this.props.data[index].properties.COMUNE)
	    select("#num_di_residenti")
		.text("num di residenti: " + this.props.data[index].properties.numero_di_residenti)

	    select("#punteggio_uniformita_formato_dati")
		.text(Math.round(100*this.props.data[index]["punteggio_uniformita_formato_dati"]) + "% uniformità formato dati")

	    select("#punteggio_facilita_estrazione_dati")
		.text(Math.round(100*this.props.data[index]["punteggio_facilita_estrazione_dati"]) + "% facilità estrazione dati")

	    select("#punteggio_completezza_dati")
		.text(Math.round(100*this.props.data[index]["punteggio_completezza_dati"])  + "%" + " completezza dati")

	    select("#punteggio_medio")
		.text(Math.round(100*this.props.data[index]["data"]) + "% totale")
		   

		   
	}
    };
    
    render() {
	return <svg
                   ref={node => this.node = node}
                   width={900}
                   height={900}
	       />
    };
}

export default BarChart;
