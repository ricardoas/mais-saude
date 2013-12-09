var city = [];
var maxY = 0;

function plot_cidade_indicador(cidade, indicador_nome) {
   //console.log(cidade);
  
  if(dataset!='null'){
    plot(dataset, cidade, indicador_nome);
  }
  else{
    d3.csv("data/tabela_com_todos_os_indicadores_selecionados_e_desvios.csv" , function (data){   
      plot(data, cidade, indicador_nome);

    });
  }
}

function plot(data, cidade, indicador){

  nv.addGraph(function() {

    var chart = nv.models.lineChart();
    var fitScreen = false;
    var width = 600;
    var height = 300;
    var zoom = 1;

    chart.useInteractiveGuideline(true);
    

    chart.xAxis
        .tickFormat(d3.format('d'));

    chart.yAxis
        .axisLabel('anos')
        .tickFormat(d3.format(',.2f'));

    d3.select('#div_series')
      .append("svg")
      .attr('class','nvd3svg')
      .attr('perserveAspectRatio', 'xMinYMid')
      .attr('width', width)
      .attr('height', height)
      .datum(getLineValues(data, cidade, indicador));

    chart.forceY([0,maxY]);

    setChartViewBox();


    function setChartViewBox() {
      var w = width * zoom,
          h = height * zoom;

      chart
          .width(w)
          .height(h);

      d3.select('#div_series svg')
          .attr('viewBox', '0 0 ' + w + ' ' + h)
          .transition().duration(500)
          .call(chart);
    }


    function resizeChart() {
      var container = d3.select('#div_series');
      var svg = container.select('svg');

      if (fitScreen) {
        // resize based on container's width AND HEIGHT
        var windowSize = nv.utils.windowSize();
        svg.attr("width", windowSize.width);
        svg.attr("height", windowSize.height);
      } else {
        // resize based on container's width
        var aspect = chart.width() / chart.height();
        var targetWidth = parseInt(container.style('width'));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
      }
    };
    
    var nome_indicador = dicionario.filter(function(d){if (d.id == indicador) return d.name;});
    nome_indicador = nome_indicador.map(function(d){return d.name;});

    d3.select("#div_series_titulo").selectAll("h1").remove();

    $("#map_title").text(nome_indicador);
    d3.select("#div_series_titulo")
      .append("h1")
      .attr("class", "titulo_grafico")
      .text(nome_indicador + " nos últimos anos");

    return chart;

  });

function getLineValues(data, cidade, indicador) {
    

    var city = data.filter(function(d){return d.NOME_MUNICIPIO == cidade;});
    var nome_microregiao = city.map(function(d){return d.NOME_MICRO;})[0];
    var nome_mesoregiao  = city.map(function(d){return d.NOME_MESO;})[0];
    var value = city.map(function(d){return d[indicador];});
    var years = city.map(function(d){return d.ANO;});
    var municipio = [];
    var obj_mesoregiao = [];

    maxY = d3.max(value, function(d) {  if(d!="NA"){  return +d;}} );

    //console.log("MAX:"+maxY);

    for (var i = 0; i < years.length; i++) {
      if( years[i]!="NA" & value[i]!="NA"){
        municipio.push({x: years[i], y: value[i] });
      }  
      
    }

    

    var microregiao = medianas.filter(function(d){return d.REGIAO == nome_microregiao;});
    var mesoregiao = medianas.filter(function(d){return d.REGIAO == nome_mesoregiao;});
    var value_meso = mesoregiao.map(function(d){return d[indicador];});
    var years_meso = mesoregiao.map(function(d){return d.ANO;});

    //console.log(mesoregiao);
    for (var i = 0; i < years_meso.length; i++) {
      if( years_meso[i]!="NA" & value_meso[i]!="NA"){
        obj_mesoregiao.push({x: years_meso[i], y: value_meso[i] });
      }  
      
    }


    return [
      {
        values: municipio,
        key: "Município: "+cidade,
        color: "#ff7f0e"
      },
      {
        values: obj_mesoregiao,
        key: "Mesoregião: "+nome_mesoregiao,
        color: "#33FF00"
      }
      
    ];
}


}

