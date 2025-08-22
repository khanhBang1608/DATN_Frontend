$(function () {

    'use strict';

    var aside = $('.side-nav'),
        showAsideBtn = $('.show-side-btn'),
        contents = $('#contents'),
        _window = $(window)

    showAsideBtn.on("click", function () {
    $("#" + $(this).data('show')).toggleClass('show-side-nav');
    contents.toggleClass('margin');
    });

    if (_window.width() <= 767) {
    aside.addClass('show-side-nav');
    }

    _window.on('resize', function () {
    if ($(window).width() > 767) {
        aside.removeClass('show-side-nav');
    }
    });

    // dropdown menu in the side nav
    var slideNavDropdown = $('.side-nav-dropdown');

    $('.side-nav .categories li').on('click', function () {

    var $this = $(this)

    $this.toggleClass('opend').siblings().removeClass('opend');

    if ($this.hasClass('opend')) {
        $this.find('.side-nav-dropdown').slideToggle('fast');
        $this.siblings().find('.side-nav-dropdown').slideUp('fast');
    } else {
        $this.find('.side-nav-dropdown').slideUp('fast');
    }
    });

    $('.side-nav .close-aside').on('click', function () {
    $('#' + $(this).data('close')).addClass('show-side-nav');
    contents.removeClass('margin');
    });


    // Start chart
    var chart = document.getElementById('myChart');
    Chart.defaults.global.animation.duration = 2000; // Animation duration
    Chart.defaults.global.title.display = false; // Remove title
    Chart.defaults.global.title.text = "Chart"; // Title
    Chart.defaults.global.title.position = 'bottom'; // Title position
    Chart.defaults.global.defaultFontColor = '#999'; // Font color
    Chart.defaults.global.defaultFontSize = 10; // Font size for every label

    // Chart.defaults.global.tooltips.backgroundColor = '#FFF'; // Tooltips background color
    Chart.defaults.global.tooltips.borderColor = 'white'; // Tooltips border color
    Chart.defaults.global.legend.labels.padding = 0;
    Chart.defaults.scale.ticks.beginAtZero = true;
    Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.scale.gridLines.color = 'rgba(255, 255, 255, 0.02)';
    Chart.defaults.global.legend.display = false;

    // var myChart = new Chart(chart, {
    // type: 'bar',
    // data: {
    //     labels: ["January", "February", "March", "April", "May", 'Jul'],
    //     datasets: [{
    //     label: "Lost",
    //     fill: false,
    //     lineTension: 0,
    //     data: [45, 25, 40, 20, 45, 20],
    //     pointBorderColor: "#4bc0c0",
    //     borderColor: '#4bc0c0',
    //     borderWidth: 2,
    //     showLine: true,
    //     }, {
    //     label: "Succes",
    //     fill: false,
    //     lineTension: 0,
    //     startAngle: 2,
    //     data: [20, 40, 20, 45, 25, 60],
    //     // , '#ff6384', '#4bc0c0', '#ffcd56', '#457ba1'
    //     backgroundColor: "transparent",
    //     pointBorderColor: "#ff6384",
    //     borderColor: '#ff6384',
    //     borderWidth: 2,
    //     showLine: true,
    //     }]
    // },
    // });

    //  Chart ( 2 )
    var Chart2 = document.getElementById('myChart2').getContext('2d');
//     // Assume monthlyRevenueData is populated from backend

    });
