/*
/* File: rules.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Thu Mar 06 2025
 * Description:
 * Useage:
 */

let userId = $('#user-id').val();
let houseId = $('.user-address').attr('value');
function findPlanById(planId, data) {
  // console.log(data);
  // console.log(planId);
  for (const room of data) {
    // console.log(room.plans);
    const plan = room.plans.find(p => p.plan_id === planId);
    if (plan) {
      return plan;
    }
  }
  return null;
}
(async function () {
  // const handleList1 = document.getElementById('handle-list-1'),
  //   handleList2 = document.getElementById('handle-list-2');
  // if (handleList1) {
  //   Sortable.create(handleList1, {
  //     animation: 150,
  //     group: 'handleList1',
  //     handle: '.drag-handle'
  //   });
  // }
  // if (handleList2) {
  //   Sortable.create(handleList2, {
  //     animation: 150,
  //     group: 'handleList2',
  //     handle: '.drag-handle'
  //   });
  // }
  console.log(houseId);
  $('.content-wrapper').block({
    message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
    css: {
      backgroundColor: 'transparent',
      border: '0'
    },
    overlayCSS: {
      backgroundColor: '#fff',
      opacity: 0.8
    }
  });
  try {
    const response = await customFetch(API + `/plan/get-room-plans/${houseId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi throw!');
    }

    const data = await response.json();
    localStorage.setItem('ap', Base64.encode(JSON.stringify(data)));
    console.log(data);
    data.forEach(plan => {
      if (plan['plans'].length <= 0) return;
      plan['plans'].forEach(plan => {
        var html = `
          <div class="col-xl-4 col-lg-6 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <h6 class="fw-normal">Tương tác với <span class="devices-count-act">${plan['devices'].length}</span> thiết bị</h6>
                </div>
                <div class="d-flex justify-content-between align-items-end">
                  <div class="role-heading">
                    <h4 class="mb-1">${plan['name']}</h4>
                    <a id="edit-plan-${plan['plan_id']}" href="javascript:;" data-bs-toggle="modal" data-bs-target="#EditApp" class="role-edit-modal"><small>Chỉnh sửa</small></a>
                  </div>
                  <a id="delete-plan-${plan['plan_id']}" href="javascript:void(0);" class="text-muted delete-button"><i class="bx bx-trash"></i></a>
                </div>
              </div>
            </div>
          </div>
        `;
        $('.rules-list').append(html);
      });
    });
    $('.content-wrapper').unblock();
    // localStorage.setItem('ad', Base64.encode(JSON.stringify(data)));
  } catch (error) {
    console.error('Lỗi houseid:', error);
  }
  try {
    const response = await customFetch(API + `/getAllDevices/${houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Lỗi throw!');
    }

    const data = await response.json();
    localStorage.setItem('ad', Base64.encode(JSON.stringify(data)));
  } catch (error) {
    console.error('Lỗi houseid:', error);
  }
})();

$(function () {
  const makeColor = {
    1: 'primary',
    2: 'success',
    3: 'warning',
    4: 'danger',
    5: 'info'
  };
  const makeIcon = {
    1: 'bx-paint-roll',
    2: 'bx-bowling-ball',
    3: 'bxs-component',
    4: 'bx-certification',
    5: 'bx-mask'
  };
  const categoryIcon = {
    '-tv': 'bx-tv',
    '-book-content': 'bx-book-content',
    '-door-open': 'bx-door-open',
    pir: 'bx-child',
    humidity: 'bx-droplet',
    ac: 'bx-cloud-snow',
    fan: 'bx-wind',
    light: 'bx-bulb',
    default: 'bx-cog',
    temperature: 'bx-log-in-circle',
    '-speed': 'bx-tachometer'
  };
  const appModal = document.getElementById('createApp');
  appModal.addEventListener('show.bs.modal', function (event) {
    const wizardCreateApp = document.querySelector('#wizard-create-app');
    var where = 0;

    if (typeof wizardCreateApp !== undefined && wizardCreateApp !== null) {
      // Wizard next prev button
      const wizardCreateAppNextList = [].slice.call(wizardCreateApp.querySelectorAll('.btn-next'));
      const wizardCreateAppPrevList = [].slice.call(wizardCreateApp.querySelectorAll('.btn-prev'));
      const wizardCreateAppBtnSubmit = wizardCreateApp.querySelector('.btn-submit');
      //loading room

      const dd = JSON.parse(Base64.decode(localStorage.getItem('ad')));
      console.log(dd);
      $('.room-loading').block({
        message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
        css: {
          backgroundColor: 'transparent',
          border: '0'
        },
        overlayCSS: {
          backgroundColor: '#fff',
          opacity: 0.8
        }
      });
      new PerfectScrollbar(document.querySelector('.room-loading'), {
        wheelPropagation: false
      });
      $('.selectpicker').selectpicker();
      $('.selectpickerSensor').selectpicker();
      // $('.selectpickerBasic').selectpicker();
      $('.selectpickerOrAnd').selectpicker();
      $('.selectpickerDevice').selectpicker();

      dd.forEach(room => {
        var html = `
          <li class="d-flex align-items-start mb-3">
            <div class="badge bg-label-${makeColor[Math.floor(Math.random() * 5) + 1]} p-2 me-3 rounded"><i class="bx ${
          makeIcon[Math.floor(Math.random() * 5) + 1]
        }
        } bx-sm"></i></div>
            <div class="d-flex justify-content-between w-100 flex-wrap gap-2">
              <div class="me-2">
                <h6 class="mb-0">${room.room_title}</h6>
              </div>
              <div class="d-flex align-items-center">
                <div class="form-check form-check-inline">
                  <input name="details-radio" class="form-check-input" type="radio" value="${room.room_id}" />
                </div>
              </div>
            </div>
          </li>
        `;
        $('.room-loading').append(html);
      });
      $('.room-loading').unblock();
      $(document).on('change', '.room-loading input[name="details-radio"]', async function () {
        const selectedRoomId = $(this).val();
        const list_device = dd.find(room => room.room_id === parseInt(selectedRoomId)).devices;
        var html = ``;
        list_device.forEach(device => {
          html += `
            <option data-type="${device.type}" data-icon="bx ${categoryIcon[device.type]}" value="${
            device.device_id
          }">${device.name}</option>
          `;
        });
        $('.selectpicker').html(html);
        $('.selectpicker').selectpicker('refresh');

        //fetch sensor
        try {
          const response = await customFetch(API + `/getRoomSensorData/${selectedRoomId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Lỗi throw!');
          }

          const data = await response.json();
          localStorage.setItem('as', Base64.encode(JSON.stringify(data)));
          console.log(data);
          var html = ``;
          data.forEach(sensor => {
            html += `
              <option data-type="${sensor.type}" data-icon="bx ${categoryIcon[sensor.type]}" value="${
              sensor.sensor_id
            }">${sensor.name}</option>
            `;
          });
          $('.selectpickerSensor').html(html);
          $('.selectpickerSensor').selectpicker('refresh');
        } catch (error) {
          console.error('Lỗi room:', error);
        }
      });
      const createAppStepper = new Stepper(wizardCreateApp, {
        linear: true
      });

      var device_choose, sensor_choose;

      if (wizardCreateAppNextList) {
        wizardCreateAppNextList.forEach(wizardCreateAppNext => {
          wizardCreateAppNext.addEventListener('click', event => {
            console.log(event);
            if (where < 3) {
              device_choose = $('.selectpicker').val();
              sensor_choose = $('.selectpickerSensor').val();
              console.log(device_choose, sensor_choose);
              var html_sensor = ``;
              var html_device = ``;
              sensor_choose.forEach(sensor => {
                html_sensor += `
                  <li class="d-flex align-items-start mb-3">
                    <div class="badge bg-label-${
                      makeColor[Math.floor(Math.random() * 5) + 1]
                    } p-2 me-3 rounded"><i class="bx ${
                  categoryIcon[
                    $('.selectpickerSensor')
                      .find('option[value="' + sensor + '"]')
                      .data('type')
                  ]
                } bx-sm"></i></div>
                      <div>
                        <h6 class="mb-0">${$('.selectpickerSensor')
                          .find('option[value="' + sensor + '"]')
                          .text()}</h6>
                        <small class="text-muted">Khoảng hoạt động: 1 đến 100</small>
                      </div>
                      <select id="selectpickerBasic-${sensor}" class="selectpickerBasic w-25 me-1" data-style="btn-default" data-show-subtext="true">
                        <option data-subtext="Thấp hơn" value="<"><</option>
                        <option data-subtext="Cao hơn" value=">">></option>
                        <option data-subtext="Bằng" value="=">=</option>
                      </select>
                      <input type="number" min="1" max="100" value="1" class="form-control w-25 form-control-input" id="valueSensor-${sensor}" placeholder="Giá trị" aria-describedby="defaultFormControlHelp" />
                  </li>
                `;
              });
              $('.loading-sensor-and-or').html(html_sensor);
              $('.selectpickerBasic').selectpicker();
              device_choose.forEach(device => {
                html_device += `
                  <li class="d-flex align-items-start mb-3">
                    <div class="badge bg-label-${
                      makeColor[Math.floor(Math.random() * 5) + 1]
                    } p-2 me-3 rounded"><i class="bx ${
                  categoryIcon[
                    $('.selectpicker')
                      .find('option[value="' + device + '"]')
                      .data('type')
                  ]
                } bx-sm"></i></div>
                      <div>
                        <h6 class="mb-0">${$('.selectpicker')
                          .find('option[value="' + device + '"]')
                          .text()}</h6>
                        <small class="text-muted">Khoảng hoạt động: ${
                          $('.selectpicker')
                            .find('option[value="' + device + '"]')
                            .data('type') === 'ac'
                            ? '16 đến 30'
                            : '1 đến 100'
                        }</small>
                      </div>
                      <select id="selectpickerDevice-${device}" class="selectpickerDevice w-25 me-1" data-style="btn-default">
                        <option value="true">Bật</option>
                        <option value="false">Tắt</option>
                      </select>
                      <input type="number" ${
                        $('.selectpicker')
                          .find('option[value="' + device + '"]')
                          .data('type') === 'ac'
                          ? 'min="16" max="30" value="16"'
                          : 'min="1" max="100" value="1"'
                      } class="form-control w-25 form-control-input" id="ValueDevice-${device}" placeholder="Giá trị" aria-describedby="defaultFormControlHelp" />
                  </li>
                `;
              });
              $('.loading-device-and-or').html(html_device);
              $('.selectpickerDevice').selectpicker();

              document.querySelectorAll('.form-control-input').forEach(input => {
                input.addEventListener('blur', function (e) {
                  const value = parseFloat(e.target.value);
                  const min = parseFloat(e.target.getAttribute('min')) || -Infinity;
                  const max = parseFloat(e.target.getAttribute('max')) || Infinity;

                  if (value < min || value > max) {
                    // alert(`Giá trị phải nằm trong khoảng từ ${min} đến ${max}`);
                    e.target.value = min;
                  }
                });
              });
            }
            console.log(where);
            where++;
            createAppStepper.next();
          });
        });
      }
      if (wizardCreateAppPrevList) {
        wizardCreateAppPrevList.forEach(wizardCreateAppPrev => {
          wizardCreateAppPrev.addEventListener('click', event => {
            where--;
            createAppStepper.previous();
          });
        });
      }

      if (wizardCreateAppBtnSubmit) {
        wizardCreateAppBtnSubmit.addEventListener('click', event => {
          $('.modal-body').block({
            message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
            css: {
              backgroundColor: 'transparent',
              border: '0'
            },
            overlayCSS: {
              backgroundColor: '#fff',
              opacity: 0.8
            }
          });
          const planName = document.querySelector('#rules-name').value;
          const and_or = $('.selectpickerOrAnd').val();
          const sensorDataPost = [];
          const deviceDataPost = [];
          device_choose = $('.selectpicker').val();
          sensor_choose = $('.selectpickerSensor').val();
          sensor_choose.forEach(sensor => {
            console.log(sensor);
            const thr = document.querySelector('#valueSensor-' + sensor).value;
            console.log(thr);
            const sig = $('#selectpickerBasic-' + sensor).val();
            sensorDataPost.push({
              sensor_id: sensor,
              threshold: thr,
              sign: sig
            });
          });
          device_choose.forEach(device => {
            const value = document.querySelector('#ValueDevice-' + device).value;
            const on_off = $('#selectpickerDevice-' + device).val();
            deviceDataPost.push({
              device_id: device,
              value: value,
              on_off: on_off
            });
          });
          console.log(
            JSON.stringify({
              name: planName,
              and_or: and_or,
              devices: deviceDataPost,
              sensors: sensorDataPost
            })
          );
          try {
            const response = customFetch(API + `/plan/create-plan/${houseId}/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: planName,
                and_or: and_or,
                devices: deviceDataPost,
                sensors: sensorDataPost
              })
            });

            // if (!response.ok) {
            //   throw new Error('Lỗi throw!');
            // }
            $('.modal-body').unblock();
            Swal.fire({
              title: 'Chúc mừng!',
              text: 'Kịch bản ' + planName + ' đã được tạo thành công!',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            }).then(function (result) {
              window.location.reload();
            });
            // const data = await response.json();
            // localStorage.setItem('ad', Base64.encode(JSON.stringify(data)));
          } catch (error) {
            Swal.fire({
              title: 'Error!',
              text: 'Vui lòng kiểm tra lại!',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            });
            console.error('Lỗi houseid:', error);
          }
        });
      }
    }
  });
  // $('.btn-submit').on('click', function () {

  // })
  // document.querySelectorAll('.form-control-input').forEach(input => {
  //   input.addEventListener('blur', function (e) {
  //     const value = parseFloat(e.target.value);
  //     const min = parseFloat(e.target.getAttribute('min')) || -Infinity;
  //     const max = parseFloat(e.target.getAttribute('max')) || Infinity;

  //     if (value < min || value > max) {
  //       alert(`Giá trị phải nằm trong khoảng từ ${min} đến ${max}`);
  //       e.target.value = '';
  //     }
  //   });
  // });
  const EditModal = document.getElementById('EditApp');
  EditModal.addEventListener('show.bs.modal', function (event) {
    // $('.selectpickerOrAndEdit').selectpicker();
    console.log(event.relatedTarget.id);
    const element = event.relatedTarget;
    const id = element.id.replace('edit-plan-', '');
    const data = JSON.parse(Base64.decode(localStorage.getItem('ap')));
    const plan = findPlanById(parseInt(id), data);
    console.log(plan);
    var devices = plan.devices;
    var sensors = plan.sensors;
    var html_sensor = ``,
      html_device = ``;
    sensors.forEach(sensor => {
      html_sensor += `
        <li class="d-flex align-items-start mb-3">
          <div class="badge bg-label-${makeColor[Math.floor(Math.random() * 5) + 1]} p-2 me-3 rounded"><i class="bx ${
        categoryIcon[sensor.type]
      } bx-sm"></i></div>
            <div>
              <h6 class="mb-0">${sensor.name}</h6>
              <small class="text-muted">Khoảng hoạt động: 1 đến 100</small>
            </div>
            <select id="selectpickerBasic-edit-${
              sensor.sensor_id
            }" class="selectpickerBasic form-select w-25 me-5 ms-5" data-style="btn-default" data-show-subtext="true">
              <option data-subtext="Thấp hơn" value="<" ${sensor.sign === '<' ? 'selected' : ''} ><</option>
              <option data-subtext="Cao hơn" value=">" ${sensor.sign === '>' ? 'selected' : ''}>></option>
              <option data-subtext="Bằng" value="=" ${sensor.sign === '=' ? 'selected' : ''}>=</option>
            </select>
            <input type="number" min="1" max="100" class="form-control w-25 form-control-input ms-3" id="valueSensor-edit-${
              sensor.sensor_id
            }" placeholder="Giá trị" aria-describedby="defaultFormControlHelp" value="${sensor.threshold}"/>
        </li>
      `;
    });
    $('.loading-sensor-and-or-edit').html(html_sensor);
    // $('.selectpickerBasic').selectpicker();
    devices.forEach(device => {
      html_device += `
        <li class="d-flex align-items-start mb-3">
          <div class="badge bg-label-${makeColor[Math.floor(Math.random() * 5) + 1]} p-2 me-3 rounded"><i class="bx ${
        categoryIcon[device.type]
      } bx-sm"></i></div>
            <div>
              <h6 class="mb-0">${device.name}</h6>
              <small class="text-muted">Khoảng hoạt động: ${device.type === 'ac' ? '16 đến 30' : '1 đến 100'}</small>
            </div>
            <select id="selectpickerDevice-edit-${
              device.device_id
            }" class="selectpickerDevice form-select w-25 me-5 ms-5" data-style="btn-default">
              <option value="true" ${device.on_off ? 'selected' : ''}>Bật</option>
              <option value="false" ${!device.on_off ? 'selected' : ''}>Tắt</option>
            </select>
            <input type="number" ${
              device.type === 'ac' ? 'min="16" max="30"' : 'min="1" max="100"'
            } class="form-control w-25 form-control-input ms-3" id="ValueDevice-edit-${
        device.device_id
      }" placeholder="Giá trị" aria-describedby="defaultFormControlHelp" value="${device.value}" />
        </li>
      `;
    });
    $('.name-edit').val(plan.name);
    $('.name-edit').attr('id', plan.plan_id);
    $('.loading-device-and-or-edit').html(html_device);
    // $('.selectpickerDevice').selectpicker();
    $('.selectpickerOrAndEdit').val(plan.and_or);
    document.querySelectorAll('.form-control-input').forEach(input => {
      input.addEventListener('blur', function (e) {
        const value = parseFloat(e.target.value);
        const min = parseFloat(e.target.getAttribute('min')) || -Infinity;
        const max = parseFloat(e.target.getAttribute('max')) || Infinity;

        if (value < min || value > max) {
          alert(`Giá trị phải nằm trong khoảng từ ${min} đến ${max}`);
          e.target.value = min;
        }
      });
    });
  });
  $('.submit-edit').on('click', async function () {
    $('.modal-body').block({
      message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
      css: {
        backgroundColor: 'transparent',
        border: '0'
      },
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.8
      }
    });
    try {
      const data = JSON.parse(Base64.decode(localStorage.getItem('ap')));
      console.log(this.parentElement.parentElement);
      const id = this.parentElement.parentElement.querySelector('.name-edit').id;
      console.log(id);
      const sensorElements = document.querySelectorAll('.loading-sensor-and-or-edit li');
      const deviceElements = document.querySelectorAll('.loading-device-and-or-edit li');
      const sensors = [];
      const devices = [];
      sensorElements.forEach(li => {
        const inputElement = li.querySelector('input[id^="valueSensor-edit-"]');
        const sensorId = inputElement.id.replace('valueSensor-edit-', '');
        const sensorValue = inputElement.value;

        const selectElement = li.querySelector('select[id^="selectpickerBasic-edit-"]');
        const sensorSign = selectElement.value;

        sensors.push({
          sensor_id: sensorId,
          threshold: sensorValue,
          sign: sensorSign
        });
      });
      console.log(deviceElements);
      deviceElements.forEach(li => {
        const inputElement = li.querySelector('input[id^="ValueDevice-edit-"]');
        console.log(inputElement);
        const deviceId = inputElement.id.replace('ValueDevice-edit-', '');
        const deviceValue = inputElement.value;

        const selectElement = li.querySelector('select[id^="selectpickerDevice-edit-"]');
        const deviceOnOff = selectElement.value;

        devices.push({
          device_id: deviceId,
          value: deviceValue,
          on_off: deviceOnOff
        });
      });
      console.log(sensors);
      console.log(devices);
      console.log(
        JSON.stringify({
          name: this.parentElement.parentElement.querySelector('.name-edit').value,
          and_or: this.parentElement.parentElement.querySelector('.selectpickerOrAndEdit').value,
          sensors: sensors,
          devices: devices
        })
      );
      try {
        const response = await customFetch(API + `/plan/edit-plan/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.parentElement.parentElement.querySelector('.name-edit').value,
            and_or: this.parentElement.parentElement.querySelector('.selectpickerOrAndEdit').value,
            sensors: sensors,
            devices: devices
          })
        });
        if (!response.ok) {
          throw new Error('Lỗi throw!');
        }
        Swal.fire({
          title: 'Chúc mừng!',
          text:
            'Kịch bản ' +
            this.parentElement.parentElement.querySelector('.name-edit').value +
            ' đã được sửa thành công!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        }).then(function (result) {
          window.location.reload();
        });
      } catch (e) {
        console.log(e);
        Swal.fire({
          title: 'Ẩu!',
          text: 'Spam là ăn đòn!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (e) {
      console.log(e);
      // Swal.fire({
      //   title: 'Ẩu!',
      //   text: 'Spam là ăn đòn!',
      //   icon: 'error',
      //   customClass: {
      //     confirmButton: 'btn btn-primary'
      //   },
      //   buttonsStyling: false
      // }).then(() => {
      //   window.location.reload();
      // });
    }
    // localStorage.setItem('ap', Base64.encode(JSON.stringify(data)));
  });
});
