var margin = {top: 5, right: 100, bottom: 30, left: 30},
    width = 650 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("JoinedData.csv", function(data) {

    // List of groups 
    var allGroup = ["2018", "2017", "2016", "2015", "2014","2013","2012","2011","2010","2009","2008","2007","2006","2005","2004","2003","2002","2001","2000"]

        // Initialize dots with 2018
    var renderDots = function(data,year) {
        return svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr("cx", function(d) { return x(+d[year]) })
        .attr("cy", function(d) { return y(+d[`Rate${year}`] )})
        .attr("r", 5)
        .style("fill", "blue");
    }
    
    var renderLabels = function(data,year) {
        return svg.selectAll("div.label")
        .data(data)
        .enter()
        .append("text")
          .text("")
          .text(function(d){ return d.State})
          .attr("x", function(d) {
            return x(d[year]);})//location X
          .attr("y", function(d) {
            return y(d[`Rate${year}`]);})//location Y
          .attr("font_family", "sans-serif")
          .attr("font_size","10px")
          .attr("fill","black");
    }
  
    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      //.text("Divorce Rate");
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,8])
      .range([ height, 0 ]);
    var yaxis = svg.append("g")
      .call(d3.axisLeft(y));
     // .text("Unemployment Rate");

    //render dots
    var dot = renderDots(data,2018);
    // Add labels
    var labels = renderLabels(data,2018);
    var granimInstance = new Granim({
      element: '#canvas-image-blending',
      direction: 'top-bottom',
      isPausedWhenNotInView: true,
      defaultStateName: "low-unemploy",
      // image : {
      //     source: './floortraders.jpg',
      //     blendingMode: 'multiply'
      // },
      states : {
        //Greens for Low
        "low-unemploy": {
            gradients: [
                ['#B3FFAB', '#26D0CE'],
                ['#198C19', '#ADFF00']
            ],
            transitionSpeed: 10000
        },
        //Blues for Med
        "med-unemploy": {
            gradients: [
                ['#9D50BB', '#6E48AA'],
                ['#4776E6', '#8E54E9']
            ],
            transitionSpeed: 2000
        },
        //Reds and yellows for High
        "high-unemploy": {
            gradients: [ 
              ['#FF4E50', '#F9D423'],
              ['#FF0000', '#FF8000']
             ],
            transitionSpeed: 2000,
            loop: false
        }
      }
  });    
  
  d3.select("#selectButton").on("change", function(d) {
                        // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                        // run the updateChart function with this selected option
                    update(selectedOption)
                    })
    // A function that update the chart
    function update(selectedOption) {
       
        //renderDots(data,selectedOption)
        //renderLabels(data,selectedOption)

      // Give these new data to update line



      var adjustedY = Math.max(...data.map(x => parseFloat(x[`Rate${selectedOption}`])))
      y
        .domain([0,adjustedY+1])
      yaxis.transition()
        .duration(1000)
        .call(d3.axisLeft(y));

      labels
        .data(data)
        .transition()
        .duration(1000)
          .attr("x", function(d) { return x(+d[selectedOption]) })
          .attr("y", function(d) { return y(+d[`Rate${selectedOption}`]) });

      dot
        .data(data)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d[selectedOption]) })
          .attr("cy", function(d) { return y(+d[`Rate${selectedOption}`]) });

      if (adjustedY <=7) {
        var changedGradient = "low-unemploy";
      }
      else if (adjustedY >= 7.1 && adjustedY <= 8.9) {
        var changedGradient = "med-unemploy";
      }
      else if (adjustedY >9) { 
        var changedGradient = "high-unemploy";
      }
    

      granimInstance.changeState(changedGradient)  
      console.log(selectedOption)
      console.log(changedGradient)   
      console.log(adjustedY)
    }

    // When the button is changed, run the updateChart function
   
  });
