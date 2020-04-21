function init_report_chart(){

    if( typeof (Chart) === 'undefined'){ return; }

    console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length){

        $('.canvasDoughnut').each(function(){

            let chart_element = $(this);
            let chart_doughnut = new Chart( chart_element, chart_doughnut_settings);

        });
    }
}

function filter_case(){
    $(".run_init").click(function () {
        $("#case_result").children().hide();
        $("tr.res_init").show();
    });
    $(".run_pass").click(function () {
        $("#case_result").children().hide();
        $("tr.res_pass").show();
    });
    $(".run_abort").click(function () {
        $("#case_result").children().hide();
        $("tr.res_abort").show();
    });
    $(".run_fail").click(function () {
        $("#case_result").children().hide();
        $("tr.res_fail").show();
    });
    $(".run_stop").click(function () {
        $("#case_result").children().hide();
        $("tr.res_stop").show();
    });
}

$(document).ready(function() {
    init_report_chart();
    filter_case();
});
