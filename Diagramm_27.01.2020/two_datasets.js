
var chart_labels = ["Benzin","Benzin HEV", "Benzin PHEV (Aut-Mix)", "Diesel","Diesel HEV","CNG","Biogas","BEV (Aut-Mix)","BEV (UZ-46-Mix)", "FC-BEV (Reforming)","FC-BEV (UZ-46-Mix)"];
var fahrbetrieb_dataset = [164.9, 132.0, 92.4, 130.3, 104.3, 121.2,0.6,0,0,0,0];
var fahrzeugherstellung_dataset =  [13.7,13.7,13.7,13.7,13.7,13.2,13.2,13.1,13.1,14.1,14.1];
var akkuherstellung_dataset =  [0,1.0,3.1,0,1,0,0,12.4,12.4,2.5,2.5];
var energiebedarf_dataset = [46.4,37.1,55.8,33.9,27.1,25.4,79.3,75.4,4.5,88.8,12.5];
var myChartObject = document.getElementById("exhaust_chart");
var g_label = "g/Fahrzeugkilometer";
var kWh_label = "kWh/Fahrzeugkilometer";


function getBoxWidth(labelOpts, fontSize) {
    return labelOpts.usePointStyle ?
      fontSize * Math.SQRT2 :
    labelOpts.boxWidth;
  };
  
  Chart.NewLegend = Chart.Legend.extend({
    draw: function() {
      var me = this;
      var opts = me.options;
      var labelOpts = opts.labels;
      var globalDefault = Chart.defaults.global,
          lineDefault = globalDefault.elements.line,
          legendWidth = me.width,
          lineWidths = me.lineWidths;
  
      if (opts.display) {
        var ctx = me.ctx,
            cursor,
            itemOrDefault = Chart.helpers.getValueOrDefault,
            fontColor = itemOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor),
            fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize),
            fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle),
            fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily),
            labelFont = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
  
        // Canvas setup
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = fontColor; // for strikethrough effect
        ctx.fillStyle = fontColor; // render in correct colour
        ctx.font = labelFont;
  
        var boxWidth = getBoxWidth(labelOpts, fontSize),
            hitboxes = me.legendHitBoxes;
  
        // current position
        var drawLegendBox = function(x, y, legendItem) {
          if (isNaN(boxWidth) || boxWidth <= 0) {
            return;
          }
  
          // Set the ctx for the box
          ctx.save();
  
          ctx.fillStyle = itemOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
          ctx.lineCap = itemOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
          ctx.lineDashOffset = itemOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
          ctx.lineJoin = itemOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
          ctx.lineWidth = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
          ctx.strokeStyle = itemOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);
          var isLineWidthZero = (itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth) === 0);
  
          if (ctx.setLineDash) {
            // IE 9 and 10 do not support line dash
            ctx.setLineDash(itemOrDefault(legendItem.lineDash, lineDefault.borderDash));
          }
  
          if (opts.labels && opts.labels.usePointStyle) {
            // Recalculate x and y for drawPoint() because its expecting
            // x and y to be center of figure (instead of top left)
            var radius = fontSize * Math.SQRT2 / 2;
            var offSet = radius / Math.SQRT2;
            var centerX = x + offSet;
            var centerY = y + offSet;
  
            // Draw pointStyle as legend symbol
            Chart.canvasHelpers.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
          } else {
            // Draw box as legend symbol
            if (!isLineWidthZero) {
              ctx.strokeRect(x, y, boxWidth, fontSize);
            }
            ctx.fillRect(x, y, boxWidth, fontSize);
          }
  
          ctx.restore();
        };
        var fillText = function(x, y, legendItem, textWidth) {
          if (legendItem.hidden) {
            // lighten the hidden text
            ctx.fillStyle = Chart.helpers.color(fontColor).lighten(0.75).rgbString();
          }
          
          ctx.fillText(legendItem.text, boxWidth + (fontSize / 2) + x, y); 
          
          // restore the original fillStyle so we dont impact the rest of the labels
          ctx.fillStyle = fontColor;
        };
  
        // Horizontal
        var isHorizontal = me.isHorizontal();
        if (isHorizontal) {
          cursor = {
            x: me.left + ((legendWidth - lineWidths[0]) / 2),
            y: me.top + labelOpts.padding,
            line: 0
          };
        } else {
          cursor = {
            x: me.left + labelOpts.padding,
            y: me.top + labelOpts.padding,
            line: 0
          };
        }
  
        var itemHeight = fontSize + labelOpts.padding;
        Chart.helpers.each(me.legendItems, function(legendItem, i) {
          var textWidth = ctx.measureText(legendItem.text).width,
              width = boxWidth + (fontSize / 2) + textWidth,
              x = cursor.x,
              y = cursor.y;
  
          if (isHorizontal) {
            if (x + width >= legendWidth) {
              y = cursor.y += itemHeight;
              cursor.line++;
              x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
            }
          } else if (y + itemHeight > me.bottom) {
            x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
            y = cursor.y = me.top + labelOpts.padding;
            cursor.line++;
          }
  
          drawLegendBox(x, y, legendItem);
  
          hitboxes[i].left = x;
          hitboxes[i].top = y;
  
          // Fill the actual label
          fillText(x, y, legendItem, textWidth);
  
          if (isHorizontal) {
            cursor.x += width + (labelOpts.padding);
          } else {
            cursor.y += itemHeight;
          }
  
        });
      }
    },
  });
  
  function createNewLegendAndAttach(chartInstance, legendOpts) {
    var legend = new Chart.NewLegend({
      ctx: chartInstance.chart.ctx,
      options: legendOpts,
      chart: chartInstance
    });
    
    if (chartInstance.legend) {
      Chart.layoutService.removeBox(chartInstance, chartInstance.legend);
      delete chartInstance.newLegend;
    }
    
    chartInstance.newLegend = legend;
    Chart.layoutService.addBox(chartInstance, legend);
  }
  
  // Register the legend plugin
  Chart.plugins.register({
    beforeInit: function(chartInstance) {
      var legendOpts = chartInstance.options.legend;
  
      if (legendOpts) {
        createNewLegendAndAttach(chartInstance, legendOpts);
      }
    },
    beforeUpdate: function(chartInstance) {
      var legendOpts = chartInstance.options.legend;
  
      if (legendOpts) {
        legendOpts = Chart.helpers.configMerge(Chart.defaults.global.legend, legendOpts);
  
        if (chartInstance.newLegend) {
          chartInstance.newLegend.options = legendOpts;
        } else {
          createNewLegendAndAttach(chartInstance, legendOpts);
        }
      } else {
        Chart.layoutService.removeBox(chartInstance, chartInstance.newLegend);
        delete chartInstance.newLegend;
      }
    },
    afterEvent: function(chartInstance, e) {
      var legend = chartInstance.newLegend;
      if (legend) {
        legend.handleEvent(e);
      }
    }
  });



var config = {
    type: "horizontalBar",
    data: {
        labels:["Benzin","Benzin HEV", "Benzin PHEV (Aut-Mix)", "Diesel","Diesel HEV","CNG","Biogas","BEV (Aut-Mix)","BEV (UZ-46-Mix)", "FC-BEV (Reforming)","FC-BEV (UZ-46-Mix)"],
        datasets: [{
            label: "Fahrbetrieb",
            backgroundColor: "rgba(204, 195, 195, 1)",
            data: fahrbetrieb_dataset,
        },
        {
            label: "Fahrzeugherstellung",
            backgroundColor: "rgba(126, 117, 117, 1)",
            data: fahrzeugherstellung_dataset,
        },
        {
            label: "Akkuherstellung",
            backgroundColor: "rgba(66, 156, 147, 1)",
            data: akkuherstellung_dataset,
        },
        {
            label: "Energiebereitstellung",
            backgroundColor: "rgba(187, 209, 57, 1)",
            data: energiebedarf_dataset,
        }]
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
            },
        },
        scales: {
            xAxes: [{
                stacked: true,
                scaleLabel:{
                    display: true,
                    labelString: "g/Fahrzeugkilometer"
                },
            }],
            yAxes: [{
                stacked: true,
            }]
        }
    } 
};

$('#0').addClass('btn_checked');

var abgas_chart = new Chart(myChartObject, config);
$("#0").click(function() {
    var data = abgas_chart.config.data;
    data.datasets[0].data = fahrbetrieb_dataset;
    data.datasets[1].data = fahrzeugherstellung_dataset;
    data.datasets[2].data = akkuherstellung_dataset;
    data.datasets[3].data = energiebedarf_dataset;
    data.labels = chart_labels;
    abgas_chart.config.options.scales.xAxes[0].scaleLabel.labelString = "g/Fahrzeugkilometer";
    abgas_chart.update();
    console.log("1 geklickt");
    console.log(g_label);
    $('#1').removeClass('btn_checked');
    $('#2').removeClass('btn_checked');
    $('#3').removeClass('btn_checked');
    $('#0').addClass('btn_checked');
});
$("#1").click(function(){
    var fahrbetrieb_dataset = [0.021,0.017,0.012,0.171,0.136,0.021,0.021,0,0,0,0];
    var fahrzeugherstellung_dataset =  [0.031,0.031,0.031,0.031,0.031,0.030,0.030,0.030,0.030,0.033,0.033];
    var akkuherstellung_dataset =  [0,0.0003,0.009,0,0.003,0,0,0.037,0.037,0.007,0.007];
    var energiebedarf_dataset = [0.095,0.076,0.100,0.070,0.056,0.073,0.122,0.117,0.025,0.065,0.052];
    
    var data = abgas_chart.config.data;
    data.datasets[0].data = fahrbetrieb_dataset;
    data.datasets[1].data = fahrzeugherstellung_dataset;
    data.datasets[2].data = akkuherstellung_dataset;
    data.datasets[3].data = energiebedarf_dataset;
    data.labels = chart_labels;
    abgas_chart.config.options.scales.xAxes[0].scaleLabel.labelString = "g/Fahrzeugkilometer";
    abgas_chart.update();
    console.log("1 geklickt")
    $('#0').removeClass('btn_checked');
    $('#2').removeClass('btn_checked');
    $('#3').removeClass('btn_checked');
    $('#1').addClass('btn_checked');
});
$("#2").click(function(){
    var fahrbetrieb_dataset = [0.002,0.002,0.001,0.002,0.002,0.002,0.002,0,0,0,0];
    var fahrzeugherstellung_dataset =  [0.012,0.012,0.012,0.012,0.012,0.012,0.012,0.014,0.014,0.013,0.013];
    var akkuherstellung_dataset =  [0,0.001,0.002,0,0.001,0,0,0.007,0.007,0.001,0.001];
    var energiebedarf_dataset = [0.010,0.008,0.009,0.007,0.006,0.003,0.019,0.008,0.004,0.003,0.007];
    
    var data = abgas_chart.config.data;
    data.datasets[0].data = fahrbetrieb_dataset;
    data.datasets[1].data = fahrzeugherstellung_dataset;
    data.datasets[2].data = akkuherstellung_dataset;
    data.datasets[3].data = energiebedarf_dataset;
    data.labels = chart_labels;
    abgas_chart.config.options.scales.xAxes[0].scaleLabel.labelString = "g/Fahrzeugkilometer";
    abgas_chart.update();
    console.log("1 geklickt");
    $('#0').removeClass('btn_checked');
    $('#1').removeClass('btn_checked');
    $('#3').removeClass('btn_checked');
    $('#2').addClass('btn_checked');
});
$("#3").click(function(){
    var fahrbetrieb_dataset = [0.66,0.52,0.47,0.52,0.42,0.61,0.61,0.25,0.25,0.25,0.32,0.32];
    var fahrzeugherstellung_dataset =  [0.054, 0.054,0.054,0.054,0.054,0.053,0.053,0.052,0.052,0.055,0.055];
    var akkuherstellung_dataset =  [0,0.004,0.011,0,0.004,0,0,0.047,0.047,0.009,0.009];
    var energiebedarf_dataset = [0.097,0.078,0.143,0.076,0.061,0.111,0.201,0.0225,0.043,0.261,0.240];

    var data = abgas_chart.config.data;
    data.datasets[0].data = fahrbetrieb_dataset;
    data.datasets[1].data = fahrzeugherstellung_dataset;
    data.datasets[2].data = akkuherstellung_dataset;
    data.datasets[3].data = energiebedarf_dataset;
    data.labels = chart_labels;
    abgas_chart.config.options.scales.xAxes[0].scaleLabel.labelString = "kWh/Fahrzeugkilometer";
    abgas_chart.update();
    $('#0').removeClass('btn_checked');
    $('#2').removeClass('btn_checked');
    $('#1').removeClass('btn_checked');
    $('#3').addClass('btn_checked');
});

function showContent(content) {
  var contentIds = ['d1', 'd2', 'd3','d4'];
  for (i = 0; i < contentIds.length; i++) {
      if (contentIds[i] == content) {
          document.getElementById(contentIds[i]).style.display = 'block';
      }
      else {
          document.getElementById(contentIds[i]).style.display = 'none';
      }
  }
}

