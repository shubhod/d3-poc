const fs = require('fs');
const csv=require('csvtojson');
const { convertFile}  = require('convert-svg-to-jpeg');
const svg2png = require("svg2png");
var {Image}=require('canvas');
var canvg =require('canvg')
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fakeDom = new JSDOM('<!DOCTYPE html><html><body style="background-color:red;"><canvas id="canvas" width="800px" height="600px"></canvas></body></html>');
let  body= d3.select(fakeDom.window.document).select('body');
const outputLocation = './population.html';
var read=async ()=>{ 
    console.log("hello");
  var temperatures= await csv().fromFile("./population.csv").then((data)=>{
              return data;          
   });
   var months = temperatures.map(function(t){
    return t.month
  });
  
  
  var margin = {top: 5, right: 5, bottom: 50, left: 50};
  // here, we want the full chart to be 700x200, so we determine
  // the width and height by subtracting the margins from those values
  
  var fullWidth = 600;
  var fullHeight = 300;
  // the width and height values will be used in the ranges of our scales
  var width = fullWidth - margin.right - margin.left;
  var height = fullHeight - margin.top - margin.bottom;
  

    let svgContainer = body.append('div').attr('class', 'container')
    .append('svg')
    .attr("style","margin:20 auto; border:4px solid red; padding-left:50px;padding-top:30px;background-color:red")
    .attr('width', fullWidth)
    .attr('xmlns',"http://www.w3.org/2000/svg")
    .attr('height', fullHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  
    var svg=body.select(".container").select("svg");
    var canvas=body.select(".container").append("canvas").attr("height",300).attr("width",400);
  // x value determined by month
  var monthScale = d3.scaleBand()
    .domain(months)
    .range([0, width])
    .paddingInner(0.1);
  
  // the width of the bars is determined by the scale
  var bandwidth = monthScale.bandwidth();
  
  // y value determined by temp
  var maxTemp = d3.max(temperatures, function(d) { return d.temp; });
  var tempScale = d3.scaleLinear()
    .domain([0, maxTemp])
    .range([height, 0])
    .nice();
  
  var xAxis = d3.axisBottom(monthScale);
  var yAxis = d3.axisLeft(tempScale);
  
  // draw the axes
  svg.append('g')
    .classed('x axis', true)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
  
  var yAxisEle = svg.append('g')
    .classed('y axis', true)
    .call(yAxis);
  
  // add a label to the yAxis
  var yText = yAxisEle.append('text')
    .attr('transform', 'rotate(-90)translate(-' + height/2 + ',0)')
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    .attr('dy', '-2.5em')
    .style('font-size', 14)
    .text('Fahrenheit');
  
  var barHolder = svg.append('g')
    .classed('bar-holder', true);
  
  // draw the bars
  var bars = barHolder.selectAll('rect.bar')
    .data(temperatures)
    .enter().append('rect')
      .classed('bar', true)
      .attr('x', function(d, i){
        // the x value is determined using the
        // month of the datum
        return monthScale(d.month)
      })
      .attr('width', bandwidth)
      .attr('y', function(d){
        // the y position is determined by the datum's temp
        // this value is the top edge of the rectangle
        return tempScale(d.temp);
      })
      .attr('height', function(d){
        // the bar's height should align it with the base of the chart (y=0)
        return height - tempScale(d.temp);
      });
      fs.writeFileSync(outputLocation,body.select(".container").html());

        (async() =>{
          const inputFilePath =  './population.svg';
          const outputFilePath =  await convertFile(inputFilePath);
          console.log(outputFilePath);
        })();    
};
read();
