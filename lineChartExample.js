const fs = require('fs');
const { convertFile}  = require('convert-svg-to-jpeg');
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fakeDom = new JSDOM('<!DOCTYPE html><html><body><canvas id="canvas" width="800px" height="600px"></canvas></body></html>');
let  body= d3.select(fakeDom.window.document).select('body');
const outputLocation = './lineChart.html';
const csv=require('csvtojson');
var read=async ()=>{
    var data=[];
    console.log("hello");
  var y= await csv().fromFile("./lineChart.csv").then((data)=>{
    return data;
   });

   data.push({values:y});
   var width = 450;
   var height = 400;
   var margin = 10;
   var duration = 25;
   
   var lineOpacity = "0.25";
   var lineOpacityHover = "0.85";
   var otherLinesOpacityHover = "0.1";
   var lineStroke = "1.5px";
   var lineStrokeHover = "2.5px";
   
   var circleOpacity = '0.85';
   var circleOpacityOnLineHover = "0.25"
   var circleRadius = 3;
   var circleRadiusHover = 6;
   
   
   /* Format Data */
   var parseDate = d3.timeParse("%Y");
   data.forEach(function(d) { 
     d.values.forEach(function(d){
       d.date = parseDate(d.date);
       d.price = +d.price;    
     });
   });
   
   
   /* Scale */
   var xScale = d3.scaleTime()
     .domain(d3.extent(data[0].values, d => d.date))
     .range([0, width-margin]);
   
   var yScale = d3.scaleLinear()
     .domain([0, d3.max(data[0].values, d => d.price)])
     .range([height-margin, 0]);
   
   var color = d3.scaleOrdinal(d3.schemeCategory10);
   
   /* Add SVG */
  let svgContainer = body.append('div').attr('class', 'container').append("svg")
     .attr("style","padding-left:50px;padding-top:30px ")
     .attr("xmlns","http://www.w3.org/2000/svg")
     .attr("width","1000px")
     .attr("height", (height+margin)+"px")
     .append('g')
     
     var svg = body.select(".container").select("svg");
   
   /* Add line into SVG */
   var line = d3.line()
     .x(d => xScale(d.date))
     .y(d => yScale(d.price));
   
   let lines = svg.append('g')
     .attr('class', 'lines')
     .attr("fill","none")
     .attr("stroke-width",3)

   
   lines.selectAll('.line-group')
     .data(data).enter()
     .append('g')
     .attr('class','line-group')
     .on("mouseover", function(d, i){
         svg.append("text")
           .attr("class", "title-text")
           .style("fill", color(i))        
           .text(d.name)
           .attr("text-anchor", "middle")
           .attr("x", (width-margin)/2)
           .attr("y", 5);
       })
     .on("mouseout", function(d) {
         svg.select(".title-text").remove();
       })
     .append('path')
     .attr('class', 'line')  
     .attr('d', d => line(d.values))
     .style('stroke', (d, i) => color(i))
     .style('opacity', lineOpacity)
     .on("mouseover", function(d){
         d3.selectAll('.line')
                       .style('opacity', otherLinesOpacityHover);
         d3.selectAll('.circle')
                       .style('opacity', circleOpacityOnLineHover);
         d3.select(this)
           .style('opacity', lineOpacityHover)
           .style("stroke-width", lineStrokeHover)
           .style("cursor", "pointer");
       })
     .on("mouseout", function(d){
         d3.selectAll(".line")
                       .style('opacity', lineOpacity);
         d3.selectAll('.circle')
                       .style('opacity', circleOpacity);
         d3.select(this)
           .style("stroke-width", lineStroke)
           .style("cursor", "none");
       });
   
   
   /* Add circles in the line */
   lines.selectAll("circle-group")
     .data(data).enter()
     .append("g")
     .style("fill", (d, i) => color(i))
     .selectAll("circle")
     .data(d => d.values).enter()
     .append("g")
     .attr("class", "circle")  
     .on("mouseover", function(d){
         d3.select(this)     
           .style("cursor", "pointer")
           .append("text")
           .attr("class", "text")
           .text(`${d.price}`)
           .attr("x", d => xScale(d.date) + 5)
           .attr("y", d => yScale(d.price) - 10);
       })
     .on("mouseout", function(d) {
         d3.select(this)
           .style("cursor", "none")  
           .transition()
           .duration(duration)
           .selectAll(".text").remove();
       })
     .append("circle")
     .attr("cx", d => xScale(d.date))
     .attr("cy", d => yScale(d.price))
     .attr("r", circleRadius)
     .style('opacity', circleOpacity)
     .on("mouseover", function(d) {
           d3.select(this)
             .transition()
             .duration(duration)
             .attr("r", circleRadiusHover);
         })
       .on("mouseout", function(d) {
           d3.select(this) 
             .transition()
             .duration(duration)
             .attr("r", circleRadius);  
         });
   
   
   /* Add Axis into SVG */
   var xAxis = d3.axisBottom(xScale).ticks(5);
   var yAxis = d3.axisLeft(yScale).ticks(5);
   
   svg.append("g")
   .attr("class", "x axis")
   .attr("transform", `translate(0, ${height-margin})`)
   .call(xAxis);
   
     svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
     .append('text')
     .attr("y", 15)
     .attr("transform", "rotate(-90)")
     .attr("fill", "#000")
     .text("Total values");
    //  

       fs.writeFileSync(outputLocation,body.select(".container").html());  

      fs.writeFileSync(outputLocation, body.select('.container').html());
            console.log(body.select('.container').html());
              (async() =>{
                const inputFilePath = './lineChart.svg';
                const outputFilePath = await convertFile(inputFilePath);
                console.log(outputFilePath);
              })(); 

};
read();
 

