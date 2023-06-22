var projectName = 'scatter-plot';

var width=800,
    height=400,
    padding=100;
    var dataset=[];
var time=[];

async function loadData(){
try {
    dataset = await d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
       console.log(dataset);

    for (let i in dataset) {
      var parsedTime = dataset[i].Time.split(':');
      var t = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      time.push(t);
   
    }
     console.log(time);
    

    // console.log(dataset);
    // Call the function that creates the visualization here
      createChart();
  } catch (error) {
    console.log('Error loading data:'+ error);
  }
}
loadData();

function createChart(){
  
  var svg= d3.select('.visHolder')
.append('svg')
.attr('width',width+200)
.attr('height',height+300);
  
  var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);
  
var timeFormat = d3.timeFormat('%M:%S');
  
  var xScale = d3
      .scaleTime()
      .domain([d3.min(dataset,(d)=>(d.Year-1)),d3.max(dataset,(d)=>(d.Year+1))])
      .range([padding,width+padding]);
  
  
  console.log(d3.extent(time, function (d){
    return d;
  }));
   const yScale = d3.scaleLinear()
                     .domain( d3.extent(time, function (d) {
        return d;
      }))
                     .range([height+padding,padding]);
  
  const xAxis =d3.axisBottom(xScale).tickFormat(d3.format('d'));
const yAxis =d3.axisLeft(yScale).tickFormat(timeFormat);
  
  
var color = d3.scaleOrdinal(d3.schemeCategory10);
  
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -350)
      .attr('y', 40)
      .style('font-size', 18)
      .text('Time in Minutes');
   svg
      .append('text')
      .attr('x', 500)
      .attr('y', 540)
      .style('font-size', 18)
      .text('Year');

  svg.append("g")
    .attr("transform","translate(0,"+(height+padding)+")"
     ).call(xAxis)
.attr("id","x-axis")
 .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width/2)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');
  
svg.append("g")
.attr("transform","translate("+padding+",0)"
     ).call(yAxis)
.attr("id","y-axis")
.attr("class","tick")
  .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Best Time (minutes)');

  
   svg
      .selectAll('.dot')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', function(d) {
        return xScale(d.Year);
      })
      .attr('cy', function (d,i) {
        return yScale(time[i]);
      })
      .attr('data-xvalue', function (d) {
        return d.Year;
      })
      .attr('data-yvalue', function (d,i) {
        return time[i].toISOString();
      })
      .style('fill', function (d) {
        return color(d.Doping !== '');
      })
        .attr('index', (d, i) => i)
  .on('mouseover', function (event, d) {
         var i = this.getAttribute('index');
console.log("i  "+i)
        div.style('opacity', .9);
        div.attr('data-year', d.Year);
        div
          .html(
            d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              timeFormat(time[i]) +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', event.pageX + 'px')
          .style('top', event.pageY +25 + 'px');
      })
      .on('mouseout', function () {
        div.style('opacity', 0);
      });
  
      var legendContainer = svg.append('g').attr('id', 'legend');
   var legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(80 ,' + ((height / 2 - i * 20)+100) + ')';
      });
  legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });
}