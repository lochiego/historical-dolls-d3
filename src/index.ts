import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import * as csv from 'jquery-csv';

type DollData = {
  name: string;
  released: number;
  retired?: number;
  era: [number, number];
  location: string;
  people: string;
  backdrop?: string;
}

function parseDollData(d: {[column: string]: string}): DollData {
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

const csvData = await fetch("https://raw.githubusercontent.com/lochiego/historical-dolls-d3/master/doll-dataset.csv?token=GHSAT0AAAAAACBWBOCVZNCIH3TRQO6MXL7WZCDKNQQ").then(r => {
console.log('response', r);
return r.text()
});

const dolls = csv.toObjects(csvData).slice(0, -1).map(parseDollData) as DollData[];

// Add X axis
let eraMin = Number.MAX_SAFE_INTEGER;
let eraMax = Number.MIN_SAFE_INTEGER;

// Establish boundings
dolls.forEach((d) => {
  const [eraStart, eraEnd] = d.era;
  
  if (eraStart < eraMin) {
    eraMin = eraStart;
  }
  if (eraMax < eraEnd) {
    eraMax = eraEnd;
  }
});

new Chart(
  document.getElementById('release-chart') as HTMLCanvasElement,
  {
    type: 'scatter',
    data: {
      labels: dolls.map(d => d.name),
      datasets: [
        {
          label: 'Historical',
          data: dolls.map(d => ({
            x: new Date(d.era[0], 1, 1),
            y: new Date(d.released, 1, 1),
          })),
        }
      ]
    },
    options: {
      plugins: {
        title: {
          text: 'American Girl Dolls',
          display: true,
        },
        tooltip: {
          callbacks: {
            title(tooltipItems) {
              return tooltipItems.map(i => dolls[i.dataIndex].name).join(', ')
            },
            label({dataIndex}) {
              const {era, released, retired} = dolls[dataIndex];
              return `Era: ${
                era.join('-')
              }. Released in ${released}.${retired ? ` Retired in ${retired}` : ''}`;
            },
          }
        }
      },
      indexAxis: 'y',
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'year',
            tooltipFormat: 'y',
          },
          title: {
            text: 'Historical Year',
            display: true,
          },
        },
        y: {
          type: 'time',
          time: {
            unit: 'year',
            tooltipFormat: 'y',
          },
          position: 'right',
          title: {
            text: 'Year Introduced',
            display: true,
          },
        }
      }
    },
  }
)