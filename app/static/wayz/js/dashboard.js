function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
}

function init_dashboard_case(data){
    let dt = new Date();
    let year = dt.getFullYear();
    let month = dt.getMonth();
    let day = dt.getDay();
    if(data !== 'init'){
        chart_plot_02_data = data
    }
    if( typeof ($.plot) === 'undefined'){ return; }
    console.log('init_flot_chart');

    let arr_data1 = [
        [gd(year, 1, 1), 17],
        [gd(year, 1, 2), 74],
        [gd(year, 1, 3), 6],
        [gd(year, 1, 4), 39],
        [gd(year, 1, 5), 20],
        [gd(year, 1, 6), 85],
        [gd(year, 1, 7), 7]
    ];

    let arr_data2 = [
      [gd(year, 1, 1), 82],
      [gd(year, 1, 2), 23],
      [gd(year, 1, 3), 66],
      [gd(year, 1, 4), 9],
      [gd(year, 1, 5), 119],
      [gd(year, 1, 6), 6],
      [gd(year, 1, 7), 9]
    ];

    let arr_data3 = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];

    // let chart_plot_02_data = [];
    //
    //
    // for (let i = 0; i < 30; i++) {
    //   chart_plot_02_data.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
    // }

    let chart_plot_02_settings = {
        grid: {
            show: true,
            aboveData: true,
            color: "#3f3f3f",
            labelMargin: 10,
            axisMargin: 0,
            borderWidth: 0,
            borderColor: null,
            minBorderMargin: 5,
            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 100
        },
        series: {
            lines: {
                show: true,
                fill: true,
                lineWidth: 2,
                steps: false
            },
            points: {
                show: true,
                radius: 4.5,
                symbol: "circle",
                lineWidth: 3.0
            }
        },
        legend: {
            position: "ne",
            margin: [0, -25],
            noColumns: 0,
            labelBoxBorderColor: null,
            labelFormatter: function(label, series) {
                return label + '&nbsp;&nbsp;';
            },
            width: 40,
            height: 1
        },
        colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
        shadowSize: 0,
        tooltip: true,
        tooltipOpts: {
            content: "%s: %y.0",
            xDateFormat: "%m/%d",
        shifts: {
            x: -30,
            y: -50
        },
        defaultTheme: false
        },
        yaxis: {
            min: 0
        },
        xaxis: {
            mode: "time",
            minTickSize: [1, "day"],
            timeformat: "%Y/%m/%d",
            min: chart_plot_02_data[0][0],
            max: chart_plot_02_data[20][0]
        }
    };


    if ($("#chart_plot_02").length){
        console.log('Plot2');

        $.plot( $("#chart_plot_02"),
        [{
            label: "新增用例",
            data: chart_plot_02_data,
            lines: {
                fillColor: "rgba(150, 202, 89, 0.12)"
            },
            points: {
                fillColor: "#fff" }
        }], chart_plot_02_settings);

    }

}

function query_case_by_date(){
    $('.applyBtn').click(function () {
        let p = $(this).parents("div.daterangepicker");
        let d1 = $(p).find("input[name='daterangepicker_start']").val();
        let d2 = $(p).find("input[name='daterangepicker_end']").val();
        console.log("开始日期:" + d1);
        console.log("结束日期:" + d2);
    });
}

$(document).ready(function() {
    init_dashboard_case('init');
    query_case_by_date();
})
