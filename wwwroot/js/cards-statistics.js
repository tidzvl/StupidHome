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
let lineChart, registrationChart, expensesChart, usersChart;
let isLoading = false;
function GenTime() {
  var today = new Date();
}

(function () {
  let cardColor, borderColor, shadeColor, labelColor, headingColor;
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

  // all user have
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
  //end all user have

  //Chart so sanh 2 week
  const lineChartEl = document.querySelector('#lineChart-main'),
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
    lineChart = new ApexCharts(lineChartEl, lineChartConfig);
    lineChart.render();
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

  // Registrations - Line Chart - Need to second page
  // --------------------------------------------------------------------
  const registrationChartEl = document.querySelector('#temp-analysis-main'),
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
    registrationChart = new ApexCharts(registrationChartEl, registrationChartConfig);
    registrationChart.render();
  }

  // Expenses - Line Chart - Need to second page
  // --------------------------------------------------------------------
  const expensesChartEl = document.querySelector('#humi-main'),
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
    expensesChart = new ApexCharts(expensesChartEl, expensesChartConfig);
    expensesChart.render();
  }

  // Users - Line Chart - Need to second page
  // --------------------------------------------------------------------
  const usersChartEl = document.querySelector('#action-main'),
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
    usersChart = new ApexCharts(usersChartEl, usersChartConfig);
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
})();

$(function () {
  var nav_tabs = document.querySelector('.nav.nav-tabs');
  var light = document.querySelector('.light'),
    temp_in = document.querySelector('.temp-in'),
    temp_out = document.querySelector('.temp-out'),
    humidity = document.querySelector('.humidity');
  setInterval(() => {
    var dd = localStorage.getItem('d');
    var dd2 = localStorage.getItem('d2');
    temp_out.textContent = Base64.decode(localStorage.getItem('t_o'));
    if (dd && dd2) {
      if ($('.content-wrapper').data('blockUI.isBlocked')) $('.content-wrapper').unblock();
      dd = JSON.parse(Base64.decode(dd));
      dd2 = JSON.parse(Base64.decode(dd2));
      temp_in.textContent = dd.find(sensor => sensor.type === 'temperature').average_value;
      light.textContent = dd.find(sensor => sensor.type === 'light').average_value + '%';
      humidity.textContent = dd.find(sensor => sensor.type === 'humidity').average_value + '%';
      var rooms = dd2;
      if (!isLoading) {
        rooms.forEach(element => {
          // console.log(element.room_title);
          var room_title = element.room_title.replace(/\s+/g, '-');
          $('.nav.nav-tabs').append(`
            <li class="nav-item">
              <button type="button" class="nav-link" role="tab" data-bs-toggle="tab" data-bs-target="#navs-top-${room_title}" aria-controls="navs-top-${room_title}" aria-selected="false">${element.room_title}</button>
            </li>
            `);
        });
        isLoading = true;
      }
      // console.log(rooms);
    }
  }, 500);
});
