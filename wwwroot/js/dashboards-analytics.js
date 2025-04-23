/*
/* File: dashboards-analytics.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Wed Mar 05 2025
 * Description:
 * Useage: Analytics Dashboard. s_d is simple data
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
  let cardColor, headingColor, labelColor, legendColor, borderColor, shadeColor;
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
      const deviceData = dd.find(item => item.device_count !== undefined);
      const deviceCount = deviceData ? deviceData.device_count : null;
      growthRadialChart.updateSeries([deviceCount]);
      temp_in.textContent = dd.find(sensor => sensor.name === 'Temperature Sensor').average_value;
      light.textContent = dd.find(sensor => sensor.name === 'Light Sensor').average_value + '%';
      humidity.textContent = dd.find(sensor => sensor.name === 'Humidity Sensor').average_value + '%';
    }
  }, 500);
  let growthRadialChart;
  if (isDarkStyle) {
    cardColor = config.colors_dark.cardColor;
    headingColor = config.colors_dark.headingColor;
    labelColor = config.colors_dark.textMuted;
    legendColor = config.colors_dark.bodyColor;
    borderColor = config.colors_dark.borderColor;
    shadeColor = 'dark';
  } else {
    cardColor = config.colors.cardColor;
    headingColor = config.colors.headingColor;
    labelColor = config.colors.textMuted;
    legendColor = config.colors.bodyColor;
    borderColor = config.colors.borderColor;
    shadeColor = 'light';
  }

  // Analytics - Bar Chart
  // --------------------------------------------------------------------
  const orderSummaryEl = document.querySelector('#orderSummaryChart'),
    orderSummaryConfig = {
      chart: {
        height: 230,
        type: 'area',
        toolbar: false,
        dropShadow: {
          enabled: true,
          top: 18,
          left: 2,
          blur: 3,
          color: config.colors.primary,
          opacity: 0.15
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
            dataPointIndex: 9,
            strokeColor: config.colors.primary,
            strokeWidth: 4,
            size: 6,
            radius: 2
          }
        ],
        hover: {
          size: 7
        }
      },
      series: [
        {
          data: [1500, 1800, 1300, 1900, 1600, 3100, 1800, 2600, 2300, 3900]
        }
      ],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'round'
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.8,
          opacityFrom: 0.7,
          opacityTo: 0.25,
          stops: [0, 95, 100]
        }
      },
      grid: {
        show: true,
        borderColor: borderColor,
        padding: {
          top: -15,
          bottom: -10,
          left: 15,
          right: 10
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        labels: {
          offsetX: 0,
          style: {
            colors: labelColor,
            fontSize: '13px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        lines: {
          show: false
        }
      },
      yaxis: {
        labels: {
          offsetX: 7,
          formatter: function (val) {
            return val;
          },
          style: {
            fontSize: '13px',
            colors: labelColor
          }
        },
        min: 0,
        max: 5000,
        tickAmount: 4
      }
    };
  if (typeof orderSummaryEl !== undefined && orderSummaryEl !== null) {
    const orderSummary = new ApexCharts(orderSummaryEl, orderSummaryConfig);
    orderSummary.render();
  }

  // Impression - Donut Chart
  // --------------------------------------------------------------------
  const impressionDonutChartEl = document.querySelector('#impressionDonutChart'),
    impressionDonutChartConfig = {
      chart: {
        height: 185,
        fontFamily: 'IBM Plex Sans',
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        padding: {
          bottom: -10
        }
      },
      series: [1700, 1000, 2000],
      labels: ['Phòng Khách', 'Phòng Ngủ', 'Nhà Bếp'],
      stroke: {
        width: 0,
        lineCap: 'round'
      },
      colors: [config.colors.primary, config.colors.info, config.colors.warning],
      plotOptions: {
        pie: {
          donut: {
            size: '90%',
            labels: {
              show: true,
              name: {
                fontSize: '0.938rem',
                offsetY: 20
              },
              value: {
                show: true,
                fontSize: '1.225rem',
                fontFamily: 'Mitr',
                fontWeight: '500',
                color: headingColor,
                offsetY: -20,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'KiloWatts',
                color: legendColor,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce(function (a, b) {
                    return a + b;
                  }, 0);
                }
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: legendColor,
          useSeriesColors: false
        },
        markers: {
          width: 10,
          height: 10,
          offsetX: -3
        }
      }
    };

  if (typeof impressionDonutChartEl !== undefined && impressionDonutChartEl !== null) {
    const impressionDonutChart = new ApexCharts(impressionDonutChartEl, impressionDonutChartConfig);
    impressionDonutChart.render();
  }
  // Growth - Radial Bar Chart
  // --------------------------------------------------------------------
  const growthRadialChartEl = document.querySelector('#growthRadialChart'),
    growthRadialChartConfig = {
      chart: {
        height: 230,
        fontFamily: 'IBM Plex Sans',
        type: 'radialBar',
        sparkline: {
          show: true
        }
      },
      grid: {
        show: false,
        padding: {
          top: -25
        }
      },
      plotOptions: {
        radialBar: {
          size: 100,
          startAngle: -135,
          endAngle: 135,
          offsetY: 10,
          hollow: {
            size: '55%'
          },
          track: {
            strokeWidth: '50%',
            background: cardColor
          },
          dataLabels: {
            value: {
              offsetY: -15,
              color: headingColor,
              fontFamily: 'Mitr',
              fontWeight: 500,
              fontSize: '16px',
              formatter: function (val) {
                return `${val}/100`;
              }
            },
            name: {
              fontSize: '15px',
              color: legendColor,
              offsetY: 24
            }
          }
        }
      },
      colors: [config.colors.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [config.colors.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 3
      },
      series: [0],
      labels: ['Thiết Bị']
    };

  if (typeof growthRadialChartEl !== undefined && growthRadialChartEl !== null) {
    growthRadialChart = new ApexCharts(growthRadialChartEl, growthRadialChartConfig);
    growthRadialChart.render();
  }
})();

//jQuery

$(function () {
  //get use date
  function calculateLastUsage(lastUpdate) {
    const diffDays = Math.ceil((new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24));
    return diffDays === 0
      ? 'Lần cuối: Hôm nay'
      : diffDays === 1
      ? 'Lần cuối: 1 ngày trước'
      : `Lần cuối: ${diffDays} ngày trước`;
  }
  async function render_pin_devices() {
    try {
      let response = await $.ajax({
        url: '../json/devices.json', //wait to add api GET
        dataType: 'json',
        method: 'GET'
      });
      let data = await response.data;
      data.forEach(function (item, index) {
        if (item.pinned == false) return;
        let last_used = calculateLastUsage(item.last_update);
        let isChecked = item.on ? 'checked' : '';
        let isOn = item.on ? 'success' : 'dark';
        let html = `
            <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div class="card drag-item cursor-move mb-lg-0 mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <label class="switch switch-success me-0">
                      <input type="checkbox" class="switch-input price-duration-toggler" ${isChecked} />
                      <span class="switch-toggle-slider">
                        <span class="switch-on"></span>
                        <span class="switch-off"></span>
                      </span>
                    </label>
                </div>
                <div class="card-body text-center">
                  <h2>
                    <i class="bx bx${item.category} text-${isOn} display-6"></i>
                  </h2>
                  <h5>${item.name}</h5>
                  <h6>${last_used}</h6>
                </div>
              </div>
            </div>
          `;
        $('#sortable-cards').append(html);
      });
    } catch (error) {
      console.error('Lỗi:', error);
    }
  }
  render_pin_devices();

  const cardEl = document.getElementById('sortable-cards');
  Sortable.create(cardEl);

  $('#sortable-cards').on('change', '.price-duration-toggler', function () {
    var card = $(this).closest('.col-lg-3.col-md-6.col-sm-12.mb-4');
    var iconElement = card.find('i');

    if ($(this).is(':checked')) {
      iconElement.removeClass('text-dark').addClass('text-success');
    } else {
      iconElement.removeClass('text-success').addClass('text-dark');
    }
  });
});
