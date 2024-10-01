// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    
    let samp = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in samp){
      panel.append("h6").text(`${key.toUpperCase()}: ${samp[key]}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    let samp = samples.filter(x => x.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values

    let ids = samp.otu_ids;
    let labels = samp.otu_labels;
    let values = samp.sample_values;

    // Build a Bubble Chart

    bubble_trace = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values.map(s => s * .6),
        color: ids
      }

    };

    bubble_layout = {
      title: 'OTU Bacteria In Selected Sample',
      showlegend: false,
      xaxis: {
        title: 'OTU ID' },
      yaxis: {
        title: 'Number of Bacteria Found'
      }
    };

    // Render the Bubble Chart

    Plotly.newPlot("bubble", [bubble_trace], bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let yticks = ids.map(x => `OTU ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let bar_trace = {
      x: values.slice(0,10).reverse(),
      y: yticks.slice(0,10).reverse(),
      text: labels,
      name: "OTUs",
      type: "bar",
      orientation: 'h'
    };
    
    let bar_layout = {
      title: "Top OTUs Found In Selected Sample",
      xaxis: {
        title: 'Number of Bacteria Found' },
      yaxis: {
        title: 'OTU ID'
      }

    };

    // Render the Bar Chart
    
    Plotly.newPlot("bar", [bar_trace], bar_layout);
  
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

    let drop = d3.select(`#selDataset`);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    for (let i = 0; i < names.length; i++ ) {
      drop.append('option')
        .text(names[i])
        .attr('value',names[i]);
    }

    // Get the first sample from the list

    let first = names[0];

    // Build charts and metadata panel with the first sample

    buildCharts(first);
    buildMetadata(first);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
