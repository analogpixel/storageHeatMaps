 // http://misoproject.com/dataset/

/*
 var colorscaleValue = [
        //[0, '#dddddd'],
        //[0, '#5cb85c'],
        [0, '#00a1dd'],
        [.3, '#5bc0de'],
        [.8, '#f0ad4e'],
        [1, '#d9534f'],
    ];
    var data = [{
        x: xValues,
        y: yValues.map((d) => {
            return d.split(".")[0]
        }),
        z: zValues,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false
    }];
    var layout = {
        font: {
            family: 'Arial',
            size: 12,
            color: '#7f7f7f'
        },
        //title: 'Annotated Heatmap',
        annotations: [],
        xaxis: {
            ticks: '',
            side: 'top'
        },
        yaxis: {
            ticks: '',
            ticksuffix: ' ',
            //width: 700,
            //height: 800,
            autosize: true
        }
    };

*/


var ds = new Miso.Dataset({
  data : [{index:  'a', os: 'sdfdsf'}]
});

// return a unique list of all the partitions
function getParts(d) {
 /*
    Plotly.newPlot('myplot', data, layout);
    Plotly.relayout('myplot', {
        height: 800
    });
    return [allParts, allData];
    */
}

var client = new $.es.Client({
    hosts: 'esearch.colo.seagate.com:9200'
});

client.search({
    index: "inventory",
    type: "disk",
    size: 1000,
    from: 0,
    body: {
        query: {
            "range": {
                "data.percent": {
                    "from": 0,
                    "to": 100
                }
            }
        }
    }
}).then(function(body) {
    var hits = body.hits.hits;

    //ds.fetch({success: function() {
    hits.forEach( (d) => { 
        var t = {index: d._source.host, os: d._source.os};
        d._source.data.forEach( (part) => { 
            if (! ds.hasColumn(part['device']) ) { ds.addColumn( {name: part['device'], type: 'number'} ); }
            t[part['device']] = parseFloat(part['percent']); } 
        );
        ds.add(t);
    } );


      console.log("Dataset Ready. Columns: " + this.columnNames());
    console.log("There are " + this.length + " rows");

    //}
    //});

    //console.log(ds);
    //getParts(hits);
}, function(error) {
    console.trace(error.message);
});