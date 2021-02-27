var myChartObject = document.getElementById("myChart");
console.log(chart.labels);
var chart = new Chart(myChartObject, {
    type: "horizontalBar",
    data: {
        labels:["Benzin","Benzin HEV", "Benzin PHEV (Aut-Mix)", "Diesel","Diesel HEV","CNG","Biogas","BEV (Aut-Mix)","BEV (UZ-46-Mix)", "FC-BEV (Reforming)","FC-BEV (UZ-46-Mix)"],
        datasets: [{
            label: "Fahrbetrieb",
            backgroundColor: "rgba(102, 214, 203, 1)",
            data: [164.9, 132.0, 92.4, 130.3, 104.3, 121.2,0.6,0,0,0,0],
        },
    {
            label: "Fahrzeugherstellung",
            backgroundColor: "rgba(66, 156, 147, 1)",
            data: [13.7,13.7,13.7,13.7,13.7,13.2,13.2,13.1,13.1,14.1,14.1],
    },
    {
            label: "Akkuherstellung",
            backgroundColor: "rgba(126, 117, 117, 1)",
            data: [0,1.0,3.1,0,1,0,0,12.4,12.4,2.5,2.5]
    },
    {
        label: "Energiebereitstellung",
        backgroundColor: "rgba(204, 195, 195, 1)",
        data: [46.4,37.1,55.8,33.9,27.1,25.4,79.3,75.4,4.5,88.8,12.5]
},
]
        
    },
    options: {
        scales: {
            xAxes: [{
                stacked: true,
                ticks:{
                    suggestedMin:0,
                    suggestedMax:250,
                    stepSize:50,
                },
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

console.log(chart.labels);