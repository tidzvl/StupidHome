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
  const appModal = document.getElementById('createApp');
  appModal.addEventListener('show.bs.modal', function (event) {
    const wizardCreateApp = document.querySelector('#wizard-create-app');
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
      tempature: 'bx-log-in-circle',
      '-speed': 'bx-tachometer'
    };
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
        console.log(html);
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
          // localStorage.setItem('as', Base64.encode(JSON.stringify(data)));
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

      if (wizardCreateAppNextList) {
        wizardCreateAppNextList.forEach(wizardCreateAppNext => {
          wizardCreateAppNext.addEventListener('click', event => {
            console.log(event);
            createAppStepper.next();
          });
        });
      }
      if (wizardCreateAppPrevList) {
        wizardCreateAppPrevList.forEach(wizardCreateAppPrev => {
          wizardCreateAppPrev.addEventListener('click', event => {
            createAppStepper.previous();
          });
        });
      }

      if (wizardCreateAppBtnSubmit) {
        wizardCreateAppBtnSubmit.addEventListener('click', event => {
          alert('Submitted..!!');
        });
      }
    }
  });
});
