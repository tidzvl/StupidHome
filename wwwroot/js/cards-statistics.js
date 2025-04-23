/**
 * Statistics Cards
 */

'use strict';
$('.content-wrapper').block({
  message:
    '<div class="d-flex justify-content-center"><p class="me-2 mb-0">Please wait...</p> <div class="sk-wave sk-primary m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
  css: {
    backgroundColor: 'transparent',
    border: '0'
  },
  overlayCSS: {
    backgroundColor: '#fff',
    opacity: 0.8
  }
});

(function () {
  let cardColor, borderColor, shadeColor, labelColor, headingColor;
  var light = document.querySelector('.light'),
    temp_in = document.querySelector('.temp-in'),
    temp_out = document.querySelector('.temp-out'),
    humidity = document.querySelector('.humidity');
  setInterval(() => {
    var dd = localStorage.getItem('d');
    temp_out.textContent = Base64.decode(localStorage.getItem('t_o'));
    if (dd) {
      if ($('.content-wrapper').data('blockUI.isBlocked')) $('.content-wrapper').unblock();
      dd = JSON.parse(Base64.decode(dd));
      temp_in.textContent = dd.find(sensor => sensor.name === 'Temperature Sensor').average_value;
      light.textContent = dd.find(sensor => sensor.name === 'Light Sensor').average_value + '%';
      humidity.textContent = dd.find(sensor => sensor.name === 'Humidity Sensor').average_value + '%';
    }
  }, 500);
  if (isDarkStyle) {
    cardColor = config.colors_dark.cardColor;
    labelColor = config.colors_dark.textMuted;
    borderColor = config.colors_dark.borderColor;
    headingColor = config.colors_dark.headingColor;
    shadeColor = 'dark';
  } else {
    cardColor = config.colors.cardColor;
    labelColor = config.colors.textMuted;
    borderColor = config.colors.borderColor;
    headingColor = config.colors.headingColor;
    shadeColor = '';
  }

  // Color Variables
  const yellowColor = '#ffe800';
  const yellowGreen = '#b2ff59';
  const kWLabel = '#836AF9';
  let gridColor, tickColor;
  if (isDarkStyle) {
    borderColor = 'rgba(100, 100, 100, 1)';
    gridColor = 'rgba(100, 100, 100, 1)';
    tickColor = 'rgba(255, 255, 255, 0.75)';
  } else {
    borderColor = '#f0f0f0';
    gridColor = '#f0f0f0';
    tickColor = 'rgba(0, 0, 0, 0.75)';
  }
  const lineChartJS = document.getElementById('lineChartJS');
  if (lineChartJS) {
    const lineChartVar = new Chart(lineChartJS, {
      type: 'line',
      data: {
        labels: [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun'
        ],
        datasets: [
          {
            data: [30, 31, 33, 29, 19, 30, 35, 16, 6, 18, 20, 30, 29, 36, 37],
            label: 'Nhiệt độ',
            borderColor: config.colors.danger,
            tension: 0.5,
            pointStyle: 'circle',
            backgroundColor: config.colors.danger,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 5,
            pointBorderColor: 'transparent',
            pointHoverBorderColor: cardColor,
            pointHoverBackgroundColor: config.colors.danger
          },
          {
            data: [80, 100, 10, 13, 21, 19, 40, 60, 30, 30, 20, 70, 10, 20, 28],
            label: 'Độ ẩm',
            borderColor: config.colors.primary,
            tension: 0.5,
            pointStyle: 'circle',
            backgroundColor: config.colors.primary,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 5,
            pointBorderColor: 'transparent',
            pointHoverBorderColor: cardColor,
            pointHoverBackgroundColor: config.colors.primary
          },
          {
            data: [80, 99, 82, 90, 15, 15, 74, 75, 30, 55, 25, 90, 40, 30, 80],
            label: 'Độ sáng',
            borderColor: yellowColor,
            tension: 0.5,
            pointStyle: 'circle',
            backgroundColor: yellowColor,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 5,
            pointBorderColor: 'transparent',
            pointHoverBorderColor: cardColor,
            pointHoverBackgroundColor: yellowColor
          },
          {
            data: [5, 9, 4, 1, 5, 36, 4, 6, 7, 1, 3, 4, 52, 63, 1],
            label: 'Chuyển động',
            borderColor: yellowGreen,
            tension: 0.5,
            pointStyle: 'circle',
            backgroundColor: yellowGreen,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 5,
            pointBorderColor: 'transparent',
            pointHoverBorderColor: cardColor,
            pointHoverBackgroundColor: yellowGreen
          },
          {
            data: [
              //that be data max(device in day in room)
              { x: 3, y: 15, r: 10, name: 'Quạt' },
              { x: 7, y: 35, r: 8, name: 'Máy bơm' },
              { x: 10, y: 20, r: 12, name: 'Quạt' }
            ],
            type: 'bubble',
            label: 'Tiêu thụ',
            backgroundColor: kWLabel,
            borderColor: kWLabel,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: borderColor,
              drawBorder: false,
              borderColor: borderColor
            },
            ticks: {
              color: labelColor
            }
          },
          y: {
            scaleLabel: {
              display: true
            },
            min: 0,
            max: 100,
            ticks: {
              color: labelColor,
              stepSize: 25
            },
            grid: {
              color: borderColor,
              drawBorder: false,
              borderColor: borderColor
            }
          }
        },
        plugins: {
          tooltip: {
            rtl: isRtl,
            backgroundColor: cardColor,
            titleColor: headingColor,
            bodyColor: headingColor,
            borderWidth: 1,
            borderColor: borderColor,
            callbacks: {
              label: function (context) {
                const name = context.raw.name;
                return name + ': ' + context.raw.y + 'kW' || '';
              }
            }
          },
          legend: {
            position: 'top',
            align: 'start',
            rtl: isRtl,
            labels: {
              usePointStyle: true,
              padding: 35,
              boxWidth: 6,
              boxHeight: 6,
              color: labelColor
            }
          }
        }
      }
    });
  }

  //
  const lineChartEl = document.querySelector('#lineChart'),
    lineChartConfig = {
      chart: {
        height: 400,
        type: 'line',
        parentHeightOffset: 0,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      series: [
        {
          data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50]
        }
      ],
      markers: {
        strokeWidth: 7,
        strokeOpacity: 1,
        strokeColors: [config.colors.white],
        colors: [config.colors.warning]
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      colors: [config.colors.warning],
      grid: {
        borderColor: borderColor,
        xaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: -20
        }
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return '<div class="px-3 py-2">' + '<span>' + series[seriesIndex][dataPointIndex] + 'kW</span>' + '</div>';
        }
      },
      xaxis: {
        categories: [
          '7/3',
          '8/3',
          '9/3',
          '10/3',
          '11/3',
          '12/3',
          '13/3',
          '14/3',
          '15/3',
          '16/3',
          '17/3',
          '18/3',
          '19/3',
          '20/3',
          '21/3'
        ],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        }
      }
    };
  if (typeof lineChartEl !== undefined && lineChartEl !== null) {
    const lineChart = new ApexCharts(lineChartEl, lineChartConfig);
    lineChart.render();
  }

  // Donut Chart Colors
  const chartColors = {
    donut: {
      series1: config.colors.success,
      series2: '#4fddaa',
      series3: '#8ae8c7',
      series4: '#c4f4e3'
    }
  };

  // Conversion - Gradient Line Chart
  // --------------------------------------------------------------------
  const conversationChartEl = document.querySelector('#conversationChart'),
    conversationChartConfig = {
      series: [
        {
          data: [50, 100, 0, 60, 20, 30]
        }
      ],
      chart: {
        height: 40,
        type: 'line',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        show: false,
        padding: {
          top: 5,
          left: 10,
          right: 10,
          bottom: 5
        }
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          type: 'horizontal',
          gradientToColors: undefined,
          opacityFrom: 0,
          opacityTo: 0.9,
          stops: [0, 30, 70, 100]
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof conversationChartEl !== undefined && conversationChartEl !== null) {
    const conversationChart = new ApexCharts(conversationChartEl, conversationChartConfig);
    conversationChart.render();
  }

  // Income - Gradient Line Chart
  // --------------------------------------------------------------------
  const incomeChartEl = document.querySelector('#incomeChart'),
    incomeChartConfig = {
      series: [
        {
          data: [40, 70, 38, 90, 40, 65]
        }
      ],
      chart: {
        height: 40,
        type: 'line',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        show: false,
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 0
        }
      },
      colors: [config.colors.warning],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          type: 'horizontal',
          gradientToColors: undefined,
          opacityFrom: 0,
          opacityTo: 0.9,
          stops: [0, 30, 70, 100]
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof incomeChartEl !== undefined && incomeChartEl !== null) {
    const incomeChart = new ApexCharts(incomeChartEl, incomeChartConfig);
    incomeChart.render();
  }

  // Profit - Gradient Line Chart
  // --------------------------------------------------------------------
  const profitChartEl = document.querySelector('#profitChart'),
    profitChartConfig = {
      series: [
        {
          data: [50, 80, 10, 82, 52, 95]
        }
      ],
      chart: {
        height: 40,
        type: 'line',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        show: false,
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 0
        }
      },
      colors: [config.colors.success],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          type: 'horizontal',
          gradientToColors: undefined,
          opacityFrom: 0,
          opacityTo: 0.9,
          stops: [0, 30, 70, 100]
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof profitChartEl !== undefined && profitChartEl !== null) {
    const profitChart = new ApexCharts(profitChartEl, profitChartConfig);
    profitChart.render();
  }

  // Expenses - Gradient Line Chart
  // --------------------------------------------------------------------
  const expensesLineChartEl = document.querySelector('#expensesLineChart'),
    expensesLineChartConfig = {
      series: [
        {
          data: [80, 40, 85, 5, 80, 35]
        }
      ],
      chart: {
        height: 40,
        type: 'line',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        show: false,
        padding: {
          top: 5,
          left: 10,
          right: 10,
          bottom: 5
        }
      },
      colors: [config.colors.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          type: 'horizontal',
          gradientToColors: undefined,
          opacityFrom: 0,
          opacityTo: 0.9,
          stops: [0, 30, 70, 100]
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof expensesLineChartEl !== undefined && expensesLineChartEl !== null) {
    const expensesLineChart = new ApexCharts(expensesLineChartEl, expensesLineChartConfig);
    expensesLineChart.render();
  }

  // Report Chart
  // --------------------------------------------------------------------

  // Radial bar chart functions
  function radialBarChart(color, value) {
    const radialBarChartOpt = {
      chart: {
        height: 55,
        width: 40,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '32%'
          },
          dataLabels: {
            show: false
          },
          track: {
            background: borderColor
          }
        }
      },
      colors: [color],
      grid: {
        padding: {
          top: -10,
          bottom: -10,
          left: -5,
          right: 0
        }
      },
      series: [value],
      labels: ['Progress']
    };
    return radialBarChartOpt;
  }

  const ReportchartList = document.querySelectorAll('.chart-report');
  if (ReportchartList) {
    ReportchartList.forEach(function (ReportchartEl) {
      const color = config.colors[ReportchartEl.dataset.color],
        series = ReportchartEl.dataset.series;
      const optionsBundle = radialBarChart(color, series);
      const reportChart = new ApexCharts(ReportchartEl, optionsBundle);
      reportChart.render();
    });
  }

  // Registrations Bar Chart
  // --------------------------------------------------------------------
  const registrationsBarChartEl = document.querySelector('#registrationsBarChart'),
    registrationsBarChartConfig = {
      chart: {
        height: 70,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: '80%',
          columnWidth: '50%',
          startingShape: 'rounded',
          endingShape: 'rounded',
          borderRadius: 2,
          distributed: true
        }
      },
      tooltip: {
        enabled: false
      },
      grid: {
        show: false,
        padding: {
          top: -20,
          bottom: -12,
          left: 0,
          right: 0
        }
      },
      colors: [
        config.colors_label.warning,
        config.colors_label.warning,
        config.colors_label.warning,
        config.colors_label.warning,
        config.colors_label.warning,
        config.colors_label.warning,
        config.colors_label.warning
      ],
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [30, 55, 45, 95, 70, 50, 65]
        }
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof registrationsBarChartEl !== undefined && registrationsBarChartEl !== null) {
    const registrationsBarChart = new ApexCharts(registrationsBarChartEl, registrationsBarChartConfig);
    registrationsBarChart.render();
  }

  // Visits Bar Chart
  // --------------------------------------------------------------------
  const visitsBarChartEl = document.querySelector('#visitsBarChart'),
    visitsBarChartConfig = {
      chart: {
        height: 70,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: '80%',
          columnWidth: '50%',
          startingShape: 'rounded',
          endingShape: 'rounded',
          borderRadius: 2,
          distributed: true
        }
      },
      tooltip: {
        enabled: false
      },
      grid: {
        show: false,
        padding: {
          top: -20,
          bottom: -12,
          left: 0,
          right: 0
        }
      },
      colors: [
        config.colors_label.success,
        config.colors_label.success,
        config.colors_label.success,
        config.colors_label.success,
        config.colors_label.success,
        config.colors_label.success,
        config.colors_label.success
      ],
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [15, 42, 33, 54, 98, 48, 37]
        }
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof visitsBarChartEl !== undefined && visitsBarChartEl !== null) {
    const visitsBarChart = new ApexCharts(visitsBarChartEl, visitsBarChartConfig);
    visitsBarChart.render();
  }

  // Registrations - Line Chart
  // --------------------------------------------------------------------
  const registrationChartEl = document.querySelector('#registrationsChart'),
    registrationChartConfig = {
      series: [
        {
          data: [17, 15, 24, 22, 18, 22, 22]
        }
      ],
      chart: {
        height: 120,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'straight'
      },
      grid: {
        show: false,
        padding: {
          top: -30,
          left: 2,
          right: 0,
          bottom: -10
        }
      },
      colors: [config.colors.success],
      xaxis: {
        show: false,
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
          show: true,
          color: borderColor
        },
        axisTicks: {
          show: true,
          color: borderColor
        },
        labels: {
          show: true,
          style: {
            fontSize: '0.813rem',
            fontFamily: 'IBM Plex Sans',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof registrationChartEl !== undefined && registrationChartEl !== null) {
    const registrationChart = new ApexCharts(registrationChartEl, registrationChartConfig);
    registrationChart.render();
  }

  // Expenses - Line Chart
  // --------------------------------------------------------------------
  const expensesChartEl = document.querySelector('#expensesChart'),
    expensesChartConfig = {
      series: [
        {
          data: [100, 70, 90, 34, 80, 21, 62]
        }
      ],
      chart: {
        height: 120,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'straight'
      },
      grid: {
        show: false,
        padding: {
          top: -30,
          left: 2,
          right: 0,
          bottom: -10
        }
      },
      colors: [config.colors.danger],
      xaxis: {
        show: false,
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
          show: true,
          color: borderColor
        },
        axisTicks: {
          show: true,
          color: borderColor
        },
        labels: {
          show: true,
          style: {
            fontSize: '0.813rem',
            fontFamily: 'IBM Plex Sans',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof expensesChartEl !== undefined && expensesChartEl !== null) {
    const expensesChart = new ApexCharts(expensesChartEl, expensesChartConfig);
    expensesChart.render();
  }

  // Users - Line Chart
  // --------------------------------------------------------------------
  const usersChartEl = document.querySelector('#usersChart'),
    usersChartConfig = {
      series: [
        {
          data: [58, 27, 141, 60, 98, 31, 165]
        }
      ],
      chart: {
        height: 120,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'straight'
      },
      grid: {
        show: false,
        padding: {
          top: -30,
          left: 2,
          right: 0,
          bottom: -10
        }
      },
      colors: [config.colors.primary],
      xaxis: {
        show: false,
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
          show: true,
          color: borderColor
        },
        axisTicks: {
          show: true,
          color: borderColor
        },
        labels: {
          show: true,
          style: {
            fontSize: '0.813rem',
            fontFamily: 'IBM Plex Sans',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof usersChartEl !== undefined && usersChartEl !== null) {
    const usersChart = new ApexCharts(usersChartEl, usersChartConfig);
    usersChart.render();
  }

  // Order Area Chart
  // --------------------------------------------------------------------
  const orderAreaChartEl = document.querySelector('#orderChart'),
    orderAreaChartConfig = {
      chart: {
        height: 80,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 4,
        discrete: [
          {
            fillColor: cardColor,
            seriesIndex: 0,
            dataPointIndex: 6,
            strokeColor: config.colors.success,
            strokeWidth: 2,
            size: 6,
            radius: 8
          }
        ],
        hover: {
          size: 7
        }
      },
      grid: {
        show: false,
        padding: {
          right: 8
        }
      },
      colors: [config.colors.success],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.8,
          opacityFrom: 0.8,
          opacityTo: 0.25,
          stops: [0, 85, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          data: [180, 175, 275, 140, 205, 190, 295]
        }
      ],
      xaxis: {
        show: false,
        lines: {
          show: false
        },
        labels: {
          show: false
        },
        stroke: {
          width: 0
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        stroke: {
          width: 0
        },
        show: false
      }
    };
  if (typeof orderAreaChartEl !== undefined && orderAreaChartEl !== null) {
    const orderAreaChart = new ApexCharts(orderAreaChartEl, orderAreaChartConfig);
    orderAreaChart.render();
  }

  // Revenue Bar Chart
  // --------------------------------------------------------------------
  const revenueBarChartEl = document.querySelector('#revenueChart'),
    revenueBarChartConfig = {
      chart: {
        height: 80,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: '80%',
          columnWidth: '75%',
          startingShape: 'rounded',
          endingShape: 'rounded',
          borderRadius: 2,
          distributed: true
        }
      },
      grid: {
        show: false,
        padding: {
          top: -20,
          bottom: -12,
          left: -10,
          right: 0
        }
      },
      colors: [
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary
      ],
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [40, 95, 60, 45, 90, 50, 75]
        }
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof revenueBarChartEl !== undefined && revenueBarChartEl !== null) {
    const revenueBarChart = new ApexCharts(revenueBarChartEl, revenueBarChartConfig);
    revenueBarChart.render();
  }

  // Session Area Chart
  // --------------------------------------------------------------------
  const sessionAreaChartEl = document.querySelector('#sessionsChart'),
    sessionAreaChartConfig = {
      chart: {
        height: 90,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 4,
        discrete: [
          {
            fillColor: cardColor,
            seriesIndex: 0,
            dataPointIndex: 8,
            strokeColor: config.colors.warning,
            strokeWidth: 2,
            size: 6,
            radius: 8
          }
        ],
        hover: {
          size: 7
        }
      },
      grid: {
        show: false,
        padding: {
          right: 8
        }
      },
      colors: [config.colors.warning],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.8,
          opacityFrom: 0.8,
          opacityTo: 0.25,
          stops: [0, 95, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'straight'
      },
      series: [
        {
          data: [280, 280, 240, 240, 200, 200, 260, 260, 310]
        }
      ],
      xaxis: {
        show: false,
        lines: {
          show: false
        },
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    };
  if (typeof sessionAreaChartEl !== undefined && sessionAreaChartEl !== null) {
    const sessionAreaChart = new ApexCharts(sessionAreaChartEl, sessionAreaChartConfig);
    sessionAreaChart.render();
  }

  // Total Sales Radial Bar Chart
  // --------------------------------------------------------------------
  const expensesRadialChartEl = document.querySelector('#expensesChartMonth'),
    expensesRadialChartConfig = {
      chart: {
        sparkline: {
          enabled: true
        },
        parentHeightOffset: 0,
        type: 'radialBar'
      },
      colors: [config.colors.primary],
      series: [78],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            size: '65%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              fontSize: '22px',
              color: headingColor,
              fontWeight: 500,
              offsetY: 0
            }
          }
        }
      },
      grid: {
        show: false,
        padding: {
          left: -10,
          right: -10
        }
      },
      stroke: {
        lineCap: 'round'
      },
      labels: ['Progress']
    };
  if (typeof expensesRadialChartEl !== undefined && expensesRadialChartEl !== null) {
    const expensesRadialChart = new ApexCharts(expensesRadialChartEl, expensesRadialChartConfig);
    expensesRadialChart.render();
  }

  // Visitor Bar Chart
  // --------------------------------------------------------------------
  const visitorBarChartEl = document.querySelector('#visitorsChart'),
    visitorBarChartConfig = {
      chart: {
        height: 120,
        width: 170,
        parentHeightOffset: 0,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          barHeight: '75%',
          columnWidth: '40px',
          startingShape: 'rounded',
          endingShape: 'rounded',
          borderRadius: 5,
          distributed: true
        }
      },
      grid: {
        show: false,
        padding: {
          top: -25,
          bottom: -12
        }
      },
      colors: [
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors_label.primary,
        config.colors.primary,
        config.colors_label.primary
      ],
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [40, 95, 60, 45, 90, 50, 75]
        }
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      responsive: [
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 9,
                columnWidth: '60%'
              }
            }
          }
        },
        {
          breakpoint: 1300,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 9,
                columnWidth: '60%'
              }
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 1040,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: '50%'
              }
            }
          }
        },
        {
          breakpoint: 420,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: '50%'
              }
            }
          }
        }
      ]
    };
  if (typeof visitorBarChartEl !== undefined && visitorBarChartEl !== null) {
    const visitorBarChart = new ApexCharts(visitorBarChartEl, visitorBarChartConfig);
    visitorBarChart.render();
  }

  // Activity Area Chart
  // --------------------------------------------------------------------
  const activityAreaChartEl = document.querySelector('#activityChart'),
    activityAreaChartConfig = {
      chart: {
        height: 120,
        width: 160,
        parentHeightOffset: 0,
        toolbar: {
          show: false
        },
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          data: [15, 20, 14, 22, 17, 40, 12]
        }
      ],
      colors: [config.colors.success],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.8,
          opacityFrom: 0.8,
          opacityTo: 0.25,
          stops: [0, 85, 100]
        }
      },
      grid: {
        show: false,
        padding: {
          top: -20,
          bottom: -8
        }
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      }
    };
  if (typeof activityAreaChartEl !== undefined && activityAreaChartEl !== null) {
    const activityAreaChart = new ApexCharts(activityAreaChartEl, activityAreaChartConfig);
    activityAreaChart.render();
  }
  // Order Statistics Chart
  // --------------------------------------------------------------------
  const leadsReportChartEl = document.querySelector('#leadsReportChart'),
    leadsReportChartConfig = {
      chart: {
        height: 157,
        width: 130,
        parentHeightOffset: 0,
        type: 'donut'
      },
      labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
      series: [45, 58, 30, 50],
      colors: [
        chartColors.donut.series1,
        chartColors.donut.series2,
        chartColors.donut.series3,
        chartColors.donut.series4
      ],
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opt) {
          return parseInt(val) + '%';
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: false
      },
      grid: {
        padding: {
          top: 15
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              value: {
                fontSize: '1.5rem',
                fontFamily: 'IBM Plex Sans',
                color: headingColor,
                fontWeight: 500,
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              name: {
                offsetY: 20,
                fontFamily: 'IBM Plex Sans'
              },
              total: {
                show: true,
                fontSize: '.7rem',
                label: '1 Week',
                color: labelColor,
                formatter: function (w) {
                  return '32%';
                }
              }
            }
          }
        }
      }
    };
  if (typeof leadsReportChartEl !== undefined && leadsReportChartEl !== null) {
    const leadsReportChart = new ApexCharts(leadsReportChartEl, leadsReportChartConfig);
    leadsReportChart.render();
  }
})();
