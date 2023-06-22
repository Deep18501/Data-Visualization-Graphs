var width=800,
    height=400,
    padding=50;
    var dataset=[];

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

async function loadData(){
try {
    const data = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
    for (let i in data.data) {
      var arr = [];
      arr.push(data.data[i][0]);
      arr.push(data.data[i][1]);
      dataset.push(arr);
   
    }
    

    console.log(dataset);
    // Call the function that creates the visualization here
      createChart();
  } catch (error) {
    console.log('Error loading data:', error);
  }
}
loadData();

function createChart(){
var svg= d3.select('.visHolder')
.append('svg')
.attr('width',width+250)
.attr('height',height+160);
         // console.log("22222");4
  var yearsDate = dataset.map(function (item) {
      return new Date(item[0]);
    });
  
    var gdp = dataset.map(function (item) {
      return (item[1]);
    });
  console.log(gdp);
    var xMax = new Date(d3.max(yearsDate));
var xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate),xMax])
      .range([padding,width+padding]);
                    
    var linearScale = d3.scaleLinear().domain([0, d3.max(gdp)]).range([0, height]);

    const yScale = d3.scaleLinear()
                     .domain([0,d3.max(dataset,(d)=>d[1])])
                     .range([height+padding,padding]);
  
   scaledGDP = gdp.map(function (item) {
      return linearScale(item);
    });

const xAxis =d3.axisBottom(xScale);
const yAxis =d3.axisLeft(yScale);

svg.append("g")
.attr("transform","translate(0,"+(height+padding)+")"
     ).call(xAxis)
.attr("id","x-axis")
.attr("class","tick");
svg.append("g")
.attr("transform","translate("+padding+",0)"
     ).call(yAxis)
.attr("id","y-axis")
.attr("class","tick");

svg.selectAll("rect")
  .data(dataset)
       .enter()
       .append("rect")
      .attr("data-date",(d,i)=>d[0])
      .attr("data-gdp",(d,i)=>d[1])
              .attr('class', 'bar')
      .attr('x', function (d, i) {
        return xScale(yearsDate[i]);
      })
      .attr('y', function (d,i) {
        return height - scaledGDP[i]+padding;
      })
      .attr('width', width/275)
      .attr('height', function (d,i) {
        return scaledGDP[i];
      })
      .attr('index', (d, i) => i)
       .style('fill', '#33adff')
        .on('mouseover', function (event, d) {
        // current rect
        var i = this.getAttribute('index');

        overlay
          .transition()
          .duration(0)
          .style('height', d + 'px')
          .style('width', width/275 + 'px')
          .style('opacity', 0.9)
          .style('left', i * width/275 + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translateX(60px)');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            dataset[i][0] +
              '<br>' +
              '$' +
              gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', dataset[i][0])
          .style('left', i *width/275 + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })      
  .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  
}