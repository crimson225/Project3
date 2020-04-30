function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
  var CSV = '';    
  //Set Report title in first row or line
  //CSV += ReportTitle + '\r\n\n';
  //This condition will generate the Label/Header
  if (ShowLabel) {
      var row = "";
      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ',';
      }
      row = row.slice(0, -1);
      //append Label row with line break
      CSV += row + '\r\n';
  }
  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
      var row = "";
      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
      }
      row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + '\r\n';
  }
  if (CSV == '') {        
      alert("Invalid data");
      return;
  }   
  //Generate a file name
  var fileName = "MyReport_";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g,"_");   
  //Initialize file format you want csv or xls
  var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    
  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");    
  link.href = uri;
  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
fetch('http://home.unheard.org/api/v1.0/getData')
.then((response) => {
  return response.json();
})
.then((data) => {
  ReportTitle = 'Blah';
  ShowLabel = true
  JSONToCSVConvertor(data, ReportTitle, ShowLabel)
});


//START of d3 Viz 


var margin = {top: 5, right: 100, bottom: 30, left: 30},
    width = 1550 - margin.left - margin.right,
    height = 675 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


//Read the data

//Year state unemploy divorve unemplRANK
var unemploymentKey = function(year){
  return `Rate${year}`
}
d3.csv("MyReport_Blah.csv", function(data) {
// d3.csv("JoinedData.csv", function(data) {
    
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
        .attr("r", 16)
        .attr("opacity",".5")
        .style("fill", "blue");
    }
    
    var renderLabels = function(data,year) {
        return svg.selectAll("div.label")
        .data(data)
        .enter()
        .append("text")
        .classed("text-circles", true)
          .text("")
          .attr("text-anchor", "middle")
          .text(function(d){ return d.abbr})
          .attr("x", function(d) {
            return x(d[year]);})//location X
          .attr("y", function(d) {
            return y(d[`Rate${year}`]);})//location Y
          .attr("font_family", "sans-serif")
          .attr("font_size","10px")
          .attr("fill","black");
    }
    
 svg.append("text")
    .attr("x", (width/2))
    .attr("y", 595)
    .attr("font-size","16px")
    .classed("axis-text", true)
    .text("Divorce Rate");

  // append y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -4 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size","16px")
    .classed("axis-text", true)
    .text("Unemployment Rate");
    
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
      .domain([0,5])
      .range([ 0, width ]);
      
    var xaxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      //.text("Divorce Rate");
    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,8])
      .range([ height, 0 ]);
    var yaxis = svg.append("g")
      .call(d3.axisLeft(y));

    var unemployChart = d3.select("#Unemployment")
      .append("svg")
        .attr("width", 1200)
        .attr("height",300)
      .append("g")
       .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    svg.append("g")
      .attr("transform","translate(100,0)")
      .attr("x", 600)
      .attr("y", 10)
      .style("font-size", "16px")
      .text("Unemployment per State in Selected Year")
    //start unemlpoyChart
    var unemployX = d3.scaleBand()
    .domain(data.map(d => d.abbr))
    .rangeRound([0, 1135] )
    .padding(0.1)
    var unemployY = d3.scaleLinear()
      .domain([0,15])
      .range([200,0])
    var unemployXaxis = unemployChart.append("g")
      .attr("transform", "translate(0, 200)")
      .call(d3.axisBottom(unemployX));
    var unemployYaxis = unemployChart.append("g")
      .call(d3.axisLeft(unemployY));
    
    var unempChart = function(data,year) {
      return unemployChart.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("class","bar")
      .attr("x", d => unemployX(d.abbr))
      .attr("width", 10)
      .attr("y", d => unemployY(d[unemploymentKey(year)]))
      .attr("height", 10)
    }
    //End unemployChart

  var DivorChart = d3.select("#Divorce")
    .append("svg")
      .attr("width", 1200)
      .attr("height",300)
    .append("g")
     .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
  //start DivorChart
  var DivX = d3.scaleBand()
  .domain(data.map(d => d.abbr))
  .rangeRound([0, 1135] )
  .padding(0.1)
  var DivY = d3.scaleLinear()
    .domain([0,15])
    .range([200,0])
  var DivXaxis = DivorChart.append("g")
    .attr("transform", "translate(0, 200)")
    .call(d3.axisBottom(DivX));
  var DivYaxis = DivorChart.append("g")
    .call(d3.axisLeft(DivY));
  
  var DivoChart = function(data,year) {
    return DivorChart.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class","bar")
    .attr("x", d => DivX(d.abbr))
    .attr("width", 10)
    .attr("y", d => DivY(d[year]))
    .attr("height", 10);

  }

//RENDERS  

    var dot = renderDots(data,2018);
    var labels = renderLabels(data,2018);
    var renderChart = unempChart(data,2018);
    var renderDivo = DivoChart(data,2018);

    //Granim background
    var granimInstance = new Granim({
      element: '#canvas-image-blending',
      direction: 'top-bottom',
      isPausedWhenNotInView: true,
      defaultStateName: "low-unemploy",
   
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

      // Variables to Update

      var adjustedX = Math.max(...data.map(x => parseFloat(x[`${selectedOption}`])))
      var adjustedY = Math.max(...data.map(x => parseFloat(x[`Rate${selectedOption}`])))
      console.log("Highest Divorce Rate in US " + adjustedX)
      x
        .domain([0,adjustedX+0.5])
      xaxis.transition()
        .duration(1000)
        .call(d3.axisBottom(x));
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
      console.log("Chosen Year is " + selectedOption)
      console.log("Gradient Group appart of " + changedGradient)   
      console.log("Highest Unemployment Rate in the US is" + adjustedY)

      renderChart
        .data(data)
        .transition()
        .duration(1000)
          .attr("y", d => unemployY(d[unemploymentKey(selectedOption)]));

      renderDivo
        .data(data)
        .transition()
        .duration(1000)
          .attr("y", d => unemployY(d[selectedOption]));
    }

   
  });
