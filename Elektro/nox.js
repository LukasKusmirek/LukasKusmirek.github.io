var myChartObject = document.getElementById("nox");



var chart = new Chart(myChartObject, {
    type: "horizontalBar",
    data: {
        labels:["Benzin","Benzin HEV", "Benzin PHEV (Aut-Mix)", "Diesel","Diesel HEV","CNG","Biogas","BEV (Aut-Mix)","BEV (UZ-46-Mix)", "FC-BEV (Reforming)","FC-BEV (UZ-46-Mix)"],
        datasets: [{
            label: "Fahrbetrieb",
            backgroundColor: "rgba(102, 214, 203, 1)",
            data: [0.021,0.017,0.012,0.171,0.136,0.021,0.021,0,0,0,0],
            
        },
    {
            label: "Fahrzeugherstellung",
            backgroundColor: "rgba(66, 156, 147, 1)",
            data: [0.031,0.031,0.031,0.031,0.031,0.030,0.030,0.030,0.030,0.033,0.033],
            
    },
    {
            label: "Akkuherstellung",
            backgroundColor: "rgba(126, 117, 117, 1)",
            data: [0,0.0003,0.009,0,0.003,0,0,0.037,0.037,0.007,0.007],
            
    },
    {
        label: "Energiebereitstellung",
        backgroundColor: "rgba(204, 195, 195, 1)",
        data: [0.095,0.076,0.100,0.070,0.056,0.073,0.122,0.117,0.025,0.065,0.052],
        
},
]
        
    },
    options: {
      tooltips: {
        enabled: true,
        mode: 'label',
        callbacks: {
            label: function(tooltipItem, data) {
                var corporation = data.datasets[tooltipItem.datasetIndex].label;
                var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                var total = 0;
                for (var i = 0; i < data.datasets.length; i++)
                    total += data.datasets[i].data[tooltipItem.index];
                if (tooltipItem.datasetIndex != data.datasets.length - 1) {
                    return corporation + ": " + valor.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                } else {
                    return [corporation + ": " + valor.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), "Gesamt: " + total];
                }
            },
            title: function(tooltipItems, data){
              var toolTipItem = tooltipItems[0];
              var myTitle = ["Benzin","Benzin Hybrid Electric Vehicle", "Benzin Plug-in Hybrid Electric Vehicle (Aut-Mix)", "Diesel","Diesel Hybrid Electric Vehicle","Compressed Natural Gas","Biogas","Battery Electric Vehicle (Aut-Mix)","Battery Electric Vehicle (UZ-46-Mix)", "Fuel Cell Battery Electric Vehicle (Reforming)","Fuel Cell Battery Electric Vehicle (UZ-46-Mix)"];
              return myTitle[toolTipItem.index];
            }
        }
    },
        legend:{
            display: true,
            labels:{
                boxWidth: 13,
                padding: 20,
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
            
                scaleLabel:{
                    display: true,
                    labelString: "g/Fahrzeugkilometer",
                }
            }],
            yAxes: [{
                stacked: true,
            }]
        }
    }
    
});
