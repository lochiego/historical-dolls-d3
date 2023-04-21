import * as d3 from "d3";

const CURRENT_YEAR = new Date().getFullYear();

type DollData = {
  name: string;
  released: Number;
  retired?: Number;
  era: [number, number];
  location: string;
  people: string;
  backdrop?: string;
}

function parseDollData(d: d3.DSVRowString<string>): DollData {
  const released = +d["Released"]!;
  return {
    name: d["Full name"]!,
    released,
    retired: d["Retired"]!.length ? +d["Retired"]! : undefined,
    era: [+d["Era Start"]!, +d["Era End"]!],
    location: d["Location"]!,
    people: d["Group"]!,
  };
}


// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3.select("#historical-chart")
  .append('svg')
  .attr("width", width)
  .attr("height", height);

  d3.csv("../doll-dataset.csv", parseDollData).then(csvData => {
    const trimmedData = csvData.slice(0, -1);

    // Add X axis
    let eraMin = Number.MAX_SAFE_INTEGER;
    let eraMax = Number.MIN_SAFE_INTEGER;

    // Establish boundings
    trimmedData.forEach((d) => {
      const [eraStart, eraEnd] = d.era;
      
      if (eraStart < eraMin) {
        eraMin = eraStart;
      }
      if (eraMax < eraEnd) {
        eraMax = eraEnd;
      }
    });

    console.table({eraMin, eraMax});

    const x = d3.scaleLinear().domain([eraMin, eraMax]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

      
    const y = d3.scaleLinear().domain([0, trimmedData.length]).range([0, height]);
    svg
      .append("g")
      .call(d3.axisLeft(y));

    svg.append("g")
      .selectAll("rect")
      .data(trimmedData)
      .join("rect")
        .attr("x", d => x(d.era[0]))
        .attr("width", d => Math.max(1, x(d.era[1])))
        .attr("y", (d, i) => y(i + 1))
        .attr("height", Math.round(height / trimmedData.length) - 2)
  });


// Read the data
// d3.csv(
//   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
//   ).then(function (csvdata) {
//     // Add X axis
//     const x = d3.scaleLinear().domain([3, 9]).range([0, width]);
//     const xAxis = svg
//       .append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x));
  
//     // Add Y axis
//     const y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
//     svg.append("g").call(d3.axisLeft(y));
  
//     // Add dots
//     svg.append("g")
//        .selectAll("circle")
//        .data(csvdata)
//        .join("circle")
//        .attr("cx", function (d: any) {
//          return x(d.Sepal_Length);
//       })
//       .attr("cy", function (d: any) {
//          return y(d.Petal_Length);
//       })
//       .attr("r", 5);
//   });