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
let lineChart, registrationChart, expensesChart, usersChart, activityAreaChart;
let isLoading = false;
// let render = false;
function GenTime() {
  var today = new Date();
}

function toUTC(date) {
  // return new Date(
  //   Date.UTC(
  //     date.getUTCFullYear(),
  //     date.getUTCMonth(),
  //     date.getUTCDate(),
  //     date.getUTCHours(),
  //     date.getUTCMinutes(),
  //     date.getUTCSeconds(),
  //     date.getUTCMilliseconds()
  //   )
  // );
  return new Date(date);
}

function calculateAverage(data) {
  if (!data || data.length === 0) {
    return 0;
  }
  const total = data.reduce((sum, item) => sum + item.average, 0);
  const average = total / data.length;
  return parseFloat(average.toFixed(2));
}

function calculateTotal(data) {
  if (!data || data.length === 0) {
    return 0;
  }
  const total = data.reduce((sum, item) => sum + item.average, 0);
  return parseFloat(total.toFixed(0));
}

function processData(jsonData, option) {
  const a = new Date();
  const now = toUTC(a);
  // now.setDate(now.getDate() + 1);
  // console.log(now);
  if (option === 'day') {
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const filteredData = jsonData.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });

    const groupedByHour = filteredData.reduce((acc, item) => {
      const hour = new Date(item.time).getUTCHours();
      if (!acc[hour]) acc[hour] = [];
      acc[hour].push(item.value);
      return acc;
    }, {});

    const cleanedData = Object.entries(groupedByHour).map(([hour, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      return { hour: parseInt(hour), average: parseFloat(average.toFixed(2)) };
    });

    return cleanedData;
  } else if (option === 'week') {
    const now = new Date();
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7));
    // const startOfWeek = new Date(now - 7);
    const filteredData = jsonData.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= startOfWeek && itemDate <= now;
    });
    const groupedByDate = filteredData.reduce((acc, item) => {
      const date = new Date(item.time).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item.value);
      return acc;
    }, {});
    console.log(groupedByDate);
    const cleanedData = Object.entries(groupedByDate).map(([date, values]) => {
      console.log(date, values);
      // const value2 = parseFloat(values[0]);
      const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
      return { date, average: parseFloat(average.toFixed(2)) };
    });
    console.log('cleanedData', cleanedData);
    return cleanedData;
  } else if (option === 'weeks') {
    const a = new Date();
    const now = toUTC(a);
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14));
    const filteredData = jsonData.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= startOfWeek && itemDate <= now;
    });
    const groupedByDate = filteredData.reduce((acc, item) => {
      const date = new Date(item.time).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item.value);
      return acc;
    }, {});
    // console.log(groupedByDate);
    const cleanedData = Object.entries(groupedByDate).map(([date, values]) => {
      const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
      return { date, average: parseFloat(average.toFixed(2)) };
    });

    return cleanedData;
  } else if (option === 'month') {
    const startOfMonth = new Date(now);
    startOfMonth.setDate(now.getDate() - 30);

    const filteredData = jsonData.filter(item => {
      const itemDate = new Date(item.time);
      return itemDate >= startOfMonth && itemDate <= now;
    });

    const groupedByDate = filteredData.reduce((acc, item) => {
      const date = new Date(item.time).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item.value);
      return acc;
    }, {});

    const cleanedData = Object.entries(groupedByDate).map(([date, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      return { date, average: parseFloat(average.toFixed(2)) };
    });

    return cleanedData;
  } else {
    throw new Error("Invalid option. Use 'day', 'week', or 'month'.");
  }
}

function processRoomData(dd2) {
  //data to now week
  const aggregatedData = {};

  dd2.forEach(room => {
    const roomId = room.room_id;
    const timeData = room.time_data;

    timeData.forEach(sensor => {
      const type = sensor.type;
      const data = sensor.data;

      const groupedByDate = data.reduce((acc, item) => {
        // const date = new Date(item.time);
        // date.setHours(23, 59, 59, 999);
        const formattedDate = item.time.split('T')[0];

        // if (formattedDate === '2025-05-06') console.log(formattedDate, item.time);
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(item.value);
        return acc;
      }, {});

      const dailyAverages = Object.entries(groupedByDate).map(([date, values]) => {
        const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
        return { date, average: parseFloat(average.toFixed(2)) };
      });

      if (!aggregatedData[type]) aggregatedData[type] = {};
      dailyAverages.forEach(({ date, average }) => {
        if (!aggregatedData[type][date]) aggregatedData[type][date] = [];
        aggregatedData[type][date].push(average);
      });
    });
  });

  const finalData = Object.entries(aggregatedData).map(([type, dates]) => {
    const aggregatedByDate = Object.entries(dates).map(([date, averages]) => {
      const overallAverage = averages.reduce((sum, val) => sum + val, 0) / averages.length;
      return { date, average: parseFloat(overallAverage.toFixed(2)) };
    });

    return { type, data: aggregatedByDate };
  });
  return finalData;
}

function processRoomDataForLastWeek(dd2) {
  const aggregatedData = {};

  const today = new Date();

  const startOfLastWeek = new Date(today);
  startOfLastWeek.setDate(today.getDate() - 14);

  const endOfLastWeek = new Date(today);
  endOfLastWeek.setDate(today.getDate() - 6);

  // console.log('startOfLastWeek:', toUTC(startOfLastWeek));
  // console.log('endOfLastWeek:', toUTC(endOfLastWeek));

  dd2.forEach(room => {
    const timeData = room.time_data;

    timeData.forEach(sensor => {
      const type = sensor.type;
      const data = sensor.data;

      const filteredData = data.filter(item => {
        // const itemDate = new Date(item.time.split('T')[0]);
        // return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
        const itemDate = new Date(item.time);
        const startDate = toUTC(startOfLastWeek);
        const endDate = toUTC(endOfLastWeek);
        return itemDate >= startDate && itemDate <= endDate;
      });
      // console.log('here', filteredData);
      const groupedByDate = filteredData.reduce((acc, item) => {
        const date = item.time.split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item.value);
        return acc;
      }, {});

      const dailyAverages = Object.entries(groupedByDate).map(([date, values]) => {
        const average = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
        return { date, average: parseFloat(average.toFixed(2)) };
      });

      if (!aggregatedData[type]) aggregatedData[type] = {};
      dailyAverages.forEach(({ date, average }) => {
        if (!aggregatedData[type][date]) aggregatedData[type][date] = [];
        aggregatedData[type][date].push(average);
      });
    });
  });

  const finalData = Object.entries(aggregatedData).map(([type, dates]) => {
    const aggregatedByDate = Object.entries(dates).map(([date, averages]) => {
      const overallAverage = averages.reduce((sum, val) => sum + val, 0) / averages.length;
      return { date, average: parseFloat(overallAverage.toFixed(2)) };
    });

    return { type, data: aggregatedByDate };
  });

  // console.log('finalData:', finalData);
  return finalData;
}

function updateApexChartData(jsonData, chartInstance) {
  const a = new Date();
  const today = toUTC(a);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = today.getUTCDay();

  const categories = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = (todayIndex - i + 7) % 7;
    categories.unshift(weekdays[dayIndex]);
  }

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(today.getDate());
  endDate.setHours(23, 59, 59, 999);
  // console.log('-7', today.getUTCDate());
  // console.log('startDate', startDate);
  // console.log('endDate', endDate);
  const filteredData = jsonData
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log('filteredData', filteredData);

  const seriesData = categories.map((category, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - (6 - index));

    const targetDateString = toUTC(targetDate).toISOString().split('T')[0];

    const date = filteredData.find(item => {
      return item.date === targetDateString;
    });
    return date ? parseFloat(date.average.toFixed(2)) : 0;
  });
  // console.log([seriesData, categories]);
  if (chartInstance == null) return [seriesData, categories];
  chartInstance.updateOptions({
    xaxis: {
      categories: categories
    },
    series: [
      {
        name: 'Average',
        data: seriesData
      }
    ]
  });
}

function updateApexChartDataForLastWeek(jsonData, chartInstance) {
  const a = new Date();
  const today = toUTC(a);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = today.getUTCDay();

  const categories = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = (todayIndex - i + 7) % 7;
    categories.unshift(weekdays[dayIndex]);
  }

  const startDate = new Date(today);
  startDate.setDate(today.getUTCDate() - 14);
  const endDate = new Date(today);
  endDate.setDate(today.getUTCDate() - 6);
  // console.log('-7', today.getUTCDate());
  // console.log('startDate', startDate);
  // console.log('today', today);
  const filteredData = jsonData
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log('filteredData', filteredData);

  const seriesData = categories.map((category, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - (13 - index));

    const targetDateString = toUTC(targetDate).toISOString().split('T')[0];

    const date = filteredData.find(item => {
      return item.date === targetDateString;
    });
    return date ? parseFloat(date.average.toFixed(2)) : 0;
  });
  // console.log([seriesData, categories]);
  if (chartInstance == null) return [seriesData, categories];
  // console.log('startOfLastWeek:', startOfLastWeek.toISOString());
  // console.log('endOfLastWeek:', endOfLastWeek.toISOString());
  // console.log('filteredData:', filteredData);
  // console.log('categories:', categories);
  // console.log('seriesData:', seriesData);
  chartInstance.updateOptions({
    xaxis: {
      categories: categories
    },
    series: [
      {
        name: 'Average (Last Week)',
        data: seriesData
      }
    ]
  });
}

let cardColor, borderColor, shadeColor, labelColor, headingColor;
const yellowColor = '#ffe800';
const yellowGreen = '#b2ff59';
const kWLabel = '#836AF9';
(function () {
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
          data: [0, 0, 0, 0, 0, 0, 0]
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
          data: [0, 0, 0, 0, 0, 0, 0]
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
          data: [0, 0, 0, 0, 0, 0, 0]
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
    activityAreaChart = new ApexCharts(activityAreaChartEl, activityAreaChartConfig);
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
      $('.device-on').text(dd[dd.length - 1]['devices_on']);
      // var rooms = dd2;
      // console.log(dd2);
      // console.log(dd);
      var room_data = dd[dd.length - 1]['rooms'];
      // console.log(room_data);
      if (!isLoading) {
        dd2.forEach(element => {
          // console.log(element);
          var room_title = element.room_title.replace(/\s+/g, '-');
          var r_d = room_data.find(r => r.room_id === element.room_id)['now'];
          $('.nav.nav-tabs').append(`
            <li class="nav-item">
              <button type="button" room-id="${element.room_id}" class="nav-link" role="tab" data-bs-toggle="tab" data-bs-target="#navs-top-${room_title}" aria-controls="navs-top-${room_title}" aria-selected="false">${element.room_title}</button>
            </li>
            `);
          var html_postfix = `<div class="alert alert-info" role="alert">
            <h3 class="mb-4">Chi tiết</h3>
            <div class="row">`;
          var html = `
            <div class="tab-pane fade show" id="navs-top-${room_title}" role="tabpanel">
              <div class="alert alert-primary" role="alert">
                <h3 class="mb-4">Hiện tại </h3>
                <div class="row">
                  <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 mb-4">
                    <div class="card">
                      <div class="card-body text-center">
                        <div class="avatar avatar-md mx-auto mb-3">
                          <span class="avatar-initial rounded-circle bg-label-primary"><i class='bx bx-happy-beaming fs-3'></i></span>
                        </div>
                        <span class="d-block mb-1 text-nowrap">Độ Thoải Mái</span>
                        <h2 class="mb-0 feeling-${room_title}">72</h2>
                        <span class="d-block mb-1 text-nowrap"><strong>%</strong></span>
                      </div>
                    </div>
                  </div>
          `;
          // console.log('here', r_d['now']);
          if (r_d.find(r => r.type === 'temperature')) {
            // console.log(r_d.find(r => r.type === 'humidity')['average_value']);
            html += `
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 mb-4">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="avatar avatar-md mx-auto mb-3">
                      <span class="avatar-initial rounded-circle bg-label-info"><i class='bx bx bxl-c-plus-plus fs-3'></i></span>
                    </div>
                    <span class="d-block mb-1 text-nowrap">Nhiệt Độ</span>
                    <h2 class="mb-0 temp-${room_title}">${r_d.find(r => r.type === 'temperature')['average_value']}</h2>
                    <span class="d-block mb-1 text-nowrap"><strong>°C</strong></span>
                  </div>
                </div>
              </div>
            `;
            html_postfix += `
              <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
                <div class="card">
                  <div class="card-header d-flex align-items-start justify-content-between">
                    <div class="m-0 me-2">
                      <h5 class="card-title mb-0">Nhiệt Độ Trung Bình</h5>
                      <small class="text-muted">Nhiệt độ nhà trong tuần qua</small>
                    </div>
                    <div class="d-flex flex-row gap-2">
                      <h5 class="mb-0"><span class="temp-avg-${room_title}">-</span>°C</h5>
                      <span class="badge bg-label-success temp-percent-${room_title}">+2%</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <div id="registrationsChart-${room_title}"></div>
                  </div>
                </div>
              </div>
            `;
          }
          if (r_d.find(r => r.type === 'humidity')) {
            html += `
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 mb-4">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="avatar avatar-md mx-auto mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger"><i class='bx bx-water fs-3'></i></span>
                    </div>
                    <span class="d-block mb-1 text-nowrap">Độ Ẩm Không Khí</span>
                    <h2 class="mb-0 humidity-${room_title}">${
              r_d.find(r => r.type === 'humidity')['average_value']
            }</h2>
                    <span class="d-block mb-1 text-nowrap"><strong>%</strong></span>
                  </div>
                </div>
              </div>
            `;
            html_postfix += `
              <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
                <div class="card">
                  <div class="card-header d-flex align-items-start justify-content-between">
                    <div class="m-0 me-2">
                      <h5 class="card-title mb-0">Độ Ẩm Trung Bình</h5>
                      <small class="text-muted">Độ ẩm nhà trong tuần qua</small>
                    </div>
                    <div class="d-flex flex-row gap-2">
                      <h5 class="mb-0"><span class="humidity-avg-${room_title}">-</span>%</h5>
                      <span class="badge bg-label-danger humidity-percent-${room_title}">-18%</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <div id="expensesChart-${room_title}"></div>
                  </div>
                </div>
              </div>
            `;
          }
          if (r_d.find(r => r.type === 'light')) {
            html += `
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 mb-4">
                <div class="card">
                  <div class="card-body text-center">
                    <div class="avatar avatar-md mx-auto mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger"><i class='bx bx-bulb bx-sm fs-3'></i></span>
                    </div>
                    <span class="d-block mb-1 text-nowrap">Độ sáng</span>
                    <h2 class="mb-0 light-${room_title}">${r_d.find(r => r.type === 'light')['average_value']}</h2>
                    <span class="d-block mb-1 text-nowrap"><strong>%</strong></span>
                  </div>
                </div>
              </div>
            `;
          }
          if (r_d.find(r => r.type === 'pir')) {
            // console.log(
            //   room_title,
            //   r_d.find(r => r.type === 'pir')
            // );
            html_postfix += `
              <div class="col-lg-4 col-md-6 col-sm-6 mb-0">
                <div class="card">
                  <div class="card-header d-flex align-items-start justify-content-between">
                    <div class="m-0 me-2">
                      <h5 class="card-title mb-0">Hoạt Động</h5>
                      <small class="text-muted">Tương tác của người dùng</small>
                    </div>
                    <div class="d-flex flex-row gap-2">
                      <h5 class="mb-0"><span class="pir-${room_title}">-</span>/d</h5>
                      <span class="badge bg-label-success">+67%</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <div id="action-${room_title}"></div>
                  </div>
                </div>
              </div>
            `;
          }
          html_postfix += `
          </div>
            </div>
              <div class="alert alert-success" role="alert">
                <h3 class="mb-4">Tóm tắt</h3>
                <div class="row ">
                  <div class="col-xl-12 col-12 mb-4">
                    <div class="card mb-4">
                      <div class="row row-bordered m-0">
                        <div class="col-md-4 col-12 px-0">
                          <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Tuần Này</h5>
                          </div>
                          <div class="card-body">
                            <p class="mb-4">Hãy xem thử báo cáo về mức độ tiêu thụ năng lượng của bạn xem phung phí thế nào nhé!</p>
                            <ul class="list-unstyled m-0 pt-0">
                              <li class="mb-4">
                                <div class="d-flex align-items-center mb-2">
                                  <div class="avatar avatar-sm flex-shrink-0 me-2">
                                    <span class="avatar-initial rounded bg-label-primary"><i class="bx bx-trending-up"></i></span>
                                  </div>
                                  <div>
                                    <p class="mb-0 lh-1 text-muted text-nowrap">So Với Tuần Trước</p>
                                    <small class="fw-medium text-nowrap">84,789%</small>
                                  </div>
                                </div>
                                <div class="progress" style="height:6px;">
                                  <div class="progress-bar bg-primary" style="width: 75%" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                              </li>
                              <li>
                                <div class="d-flex align-items-center mb-2">
                                  <div class="avatar avatar-sm flex-shrink-0 me-2">
                                    <span class="avatar-initial rounded bg-label-success"><i class="bx bx-dollar"></i></span>
                                  </div>
                                  <div>
                                    <p class="mb-0 lh-1 text-muted text-nowrap">Chi Phí Dự Đoán</p>
                                    <small class="fw-medium text-nowrap">227,398 VNĐ</small>
                                  </div>
                                </div>
                                <div class="progress" style="height:6px;">
                                  <div class="progress-bar bg-success" style="width: 75%" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div class="col-md-8 col-12 px-0">
                          <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Báo Cáo Tổng Quan So Với Tuần Trước</h5>
                            <div class="dropdown">
                              <button class="btn p-0" type="button" id="orderSummaryOptions" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bx bx-dots-vertical-rounded"></i>
                              </button>
                              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="orderSummaryOptions">
                                <a class="dropdown-item" href="javascript:void(0);">Theo ngày</a>
                                <a class="dropdown-item" href="javascript:void(0);">Theo tuần</a>
                                <a class="dropdown-item" href="javascript:void(0);">Theo tháng</a>
                              </div>
                            </div>
                          </div>
                          <div class="card-body p-0">
                            <h5 class="card-title mb-0">Đang nghiên cứu cách tính tiền điện. Sẽ update sau</h5>
                            <div id="lineChart-${room_title}"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card">
                      <div class="card-header header-elements">
                        <div>
                          <h5 class="card-title mb-0">Tóm tắt</h5>
                          <small class="text-muted">Bao gồm tất cả những thứ người dùng cần</small>
                        </div>
                      </div>
                      <div class="card-body">
                        <canvas id="lineChartJS-${room_title}" class="chartjs" data-height="500"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
          html += `</div></div>`;
          html_postfix += `</div>
          </div>`;
          html += html_postfix;
          $('.tab-content').append(html);
          // const registrationChartEl = document.querySelector('#registrationsChart-' + room_title);
          // console.log(registrationChartEl);
          var temp, humi, light, pir;
          element['time_data'].forEach(e => {
            console.log(e);
            var c = processData(e['data'], 'week');
            // console.log(room_title);
            var series = updateApexChartData(c)[0],
              categories = updateApexChartData(c)[1];
            c = c.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
            console.log(c);
            // console.log(series, categories);
            if (e['type'] === 'temperature') {
              temp = processData(e['data'], 'weeks');
              $('.temp-avg-' + room_title).text(calculateAverage(c));
              const registrationChartEl = document.querySelector('#registrationsChart-' + room_title),
                registrationChartConfig = {
                  series: [
                    {
                      data: series
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
                    categories: categories,
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
                const registrationChartRoom = new ApexCharts(registrationChartEl, registrationChartConfig);
                registrationChartRoom.render();
              }
            } else if (e['type'] === 'humidity') {
              humi = processData(e['data'], 'weeks');
              $('.humidity-avg-' + room_title).text(calculateAverage(c));
              const expensesChartEl = document.querySelector('#expensesChart-' + room_title),
                expensesChartConfig = {
                  series: [
                    {
                      data: series
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
                    categories: categories,
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
                const expensesChartRoom = new ApexCharts(expensesChartEl, expensesChartConfig);
                expensesChartRoom.render();
              }
            } else if (e['type'] === 'pir') {
              pir = processData(e['data'], 'weeks');
              // console.log('categories', categories);
              // console.log('series', series);
              $('.pir-' + room_title).text(calculateAverage(c));
              const usersChartEl = document.querySelector('#action-' + room_title),
                usersChartConfig = {
                  series: [
                    {
                      data: series
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
                    categories: categories,
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
                const usersChartRoom = new ApexCharts(usersChartEl, usersChartConfig);
                usersChartRoom.render();
              }
            } else if (e['type'] === 'light') {
              light = processData(e['data'], 'weeks');
            }
          });
          // console.log(temp, humi, light, pir);
          var lineChartJSRoom = document.querySelector('#lineChartJS-' + room_title);
          // console.log(lineChartJSRoom);
          if (lineChartJSRoom) {
            if (lineChartJSRoom.chartInstance) {
              lineChartJSRoom.chartInstance.destroy();
            }
            // console.log(pir);
            var lineChartVarRoom = new Chart(lineChartJSRoom, {
              type: 'line',
              data: {
                labels: temp
                  ? temp
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(item => {
                        const [year, month, day] = item.date.split('-');
                        return `${day}/${month}`;
                      })
                  : [],
                datasets: [
                  {
                    data: temp
                      ? temp.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => item.average)
                      : [],
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
                    data: humi
                      ? humi.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => item.average)
                      : [],
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
                    data: light
                      ? light.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => item.average)
                      : [],
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
                    data: pir ? pir.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => item.average) : [],
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
                    // },
                    // {
                    //   data: [
                    //     //that be data max(device in day in room)
                    //     { x: 3, y: 15, r: 10, name: 'Quạt' },
                    //     { x: 7, y: 35, r: 8, name: 'Máy bơm' },
                    //     { x: 10, y: 20, r: 12, name: 'Quạt' }
                    //   ],
                    //   type: 'bubble',
                    //   label: 'Tiêu thụ',
                    //   backgroundColor: kWLabel,
                    //   borderColor: kWLabel,
                    //   borderWidth: 1
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
                  // tooltip: {
                  //   rtl: isRtl,
                  //   backgroundColor: cardColor,
                  //   titleColor: headingColor,
                  //   bodyColor: headingColor,
                  //   borderWidth: 1,
                  //   borderColor: borderColor,
                  //   callbacks: {
                  //     label: function (context) {
                  //       const name = context.raw.name;
                  //       return name + ': ' + context.raw.y + 'kW' || '';
                  //     }
                  //   }
                  tooltip: {
                    enabled: true,
                    backgroundColor: cardColor,
                    titleColor: headingColor,
                    bodyColor: headingColor,
                    borderWidth: 1,
                    borderColor: borderColor,
                    callbacks: {
                      label: function (context) {
                        const value = context.raw;
                        return `${context.dataset.label}: ${value}`;
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
            lineChartJSRoom.chartInstance = lineChartVarRoom;
          }
        });

        isLoading = true;
        // console.log(dd2);
        const result = processRoomData(dd2);
        console.log(result);
        result.forEach(element => {
          if (element['type'] === 'temperature') {
            $('.temp-main-avg').text(calculateAverage(element['data']));
            updateApexChartData(element['data'], registrationChart);
          } else if (element['type'] === 'humidity') {
            $('.humi-main-avg').text(calculateAverage(element['data']));
            updateApexChartData(element['data'], expensesChart);
          } else if (element['type'] === 'pir') {
            $('.pir-main').text(calculateAverage(element['data']));
            updateApexChartData(element['data'], usersChart);
          }
        });
        const result_weeked = processRoomDataForLastWeek(dd2);
        result_weeked.forEach(element => {
          if (element['type'] === 'pir') {
            $('.sum-pir-main').text(calculateTotal(element['data']));
            console.log(element['data']);
            updateApexChartDataForLastWeek(element['data'], activityAreaChart);
          }
        });
      }
      room_data.forEach(room => {
        //update data
        // console.log(room);
        var r = $('[room-id="' + room.room_id + '"]');
      });
    }
  }, 500);
  setInterval(() => {
    var dd2 = JSON.parse(Base64.decode(localStorage.getItem('d2')));
    // console.log(dd2);
    const result = processRoomData(dd2);
    // console.log(result);
    result.forEach(element => {
      if (element['type'] === 'temperature') {
        $('.temp-main-avg').text(calculateAverage(element['data']));
        updateApexChartData(element['data'], registrationChart);
      } else if (element['type'] === 'humidity') {
        $('.humi-main-avg').text(calculateAverage(element['data']));
        updateApexChartData(element['data'], expensesChart);
      } else if (element['type'] === 'pir') {
        $('.pir-main').text(calculateAverage(element['data']));
        updateApexChartData(element['data'], usersChart);
      }
    });
  }, 5000);
});
