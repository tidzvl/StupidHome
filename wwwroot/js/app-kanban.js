/**
 * App Kanban
 */

'use strict';

window.Helpers.initCustomOptionCheck();
$('.app-kanban').block({
  message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
  css: {
    backgroundColor: 'transparent',
    border: '0'
  },
  overlayCSS: {
    backgroundColor: '#fff',
    opacity: 0.2
  }
});
let classicPicker;
let loading = false;
let boards;
let userId = $('#user-id').val();
let houseId = $('.user-address').attr('value');
async function checkData() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const dd = JSON.parse(Base64.decode(localStorage.getItem('d3')));
      // console.log(dd);
      if (dd[0].room_id) {
        clearInterval(interval);
        $('.app-kanban').unblock();
        resolve(dd);
      } else {
        console.log('no data');
      }
    }, 500);
  });
}

function transformApiDataToKanban(apiData) {
  return apiData.map(room => ({
    id: `board-${room.room_id}`,
    title: room.room_title,
    item: room.devices.map(device => ({
      id: `device-${device.device_id}`,
      category: `${device.type}`,
      'category-name': device.type.charAt(0).toUpperCase() + device.type.slice(1),
      title: device.name,
      'add-date': new Date(device.date_created).toLocaleDateString('vi-VN'),
      pinned: device.pinned,
      'energy-consumed': device.value,
      on: device.on_off,
      temp: device.type === 'ac' ? device.value : null,
      mood: null,
      light: device.type === 'led' ? device.value : null,
      voilume: null,
      speed: device.type === 'fan' ? device.value : null,
      pump: device.type === 'waterpump' ? device.value : null
    }))
  }));
}

(async function () {
  const kanbanSidebar = document.querySelector('.kanban-update-item-sidebar'),
    kanbanWrapper = document.querySelector('.kanban-wrapper'),
    commentEditor = document.querySelector('.comment-editor'),
    kanbanAddNewBoard = document.querySelector('.kanban-add-new-board'),
    kanbanAddNewInput = [].slice.call(document.querySelectorAll('.kanban-add-board-input')),
    kanbanAddBoardBtn = document.querySelector('.kanban-add-board-btn'),
    datePicker = document.querySelector('#due-date'),
    select2 = $('.select2'), // ! Using jquery vars due to select2 jQuery dependency
    assetsPath = document.querySelector('html').getAttribute('data-assets-path');

  //switch box
  document.querySelector('.kanban-update-item-sidebar').addEventListener('click', function (event) {
    if (event.target.matches('.switch-input')) {
      const kanbanItem = document.querySelector('.kanban-item.active');
      if (kanbanItem) {
        kanbanItem.setAttribute('data-on', event.target.checked ? 'true' : 'false');
      }
    }
  });
  // Init kanban Offcanvas
  const kanbanOffcanvas = new bootstrap.Offcanvas(kanbanSidebar);
  // config slide bar
  document.querySelector('.kanban-update-item-sidebar .btn-primary').addEventListener('click', async function () {
    const sidebar = document.querySelector('.kanban-update-item-sidebar');
    const kanbanItem = document.querySelector('.kanban-item.active');
    // console.log(kanbanItem.getAttribute('data-pinned'));
    if (!kanbanItem.getAttribute('data-pinned')) {
      console.log('Device luồng tạo');
      const title = sidebar.querySelector('#title').value;
      const dueDate = sidebar.querySelector('#due-date').value;
      const label = sidebar.querySelector('#label').value;
      const eid = kanbanItem.getAttribute('data-eid');
      const roomid = eid.replace('board-', '');
      console.log(title, dueDate, label);
      console.log(userId);
      try {
        $('.app-kanban').block({
          message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
          css: {
            backgroundColor: 'transparent',
            border: '0'
          },
          overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.7
          }
        });
        var defaultValue;
        if (label == 'ac') {
          defaultValue = 16;
        } else {
          defaultValue = 1;
        }
        const response = await customFetch(API + '/createDevice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: title,
            type: label,
            brand: 'default',
            value: defaultValue,
            room_id: parseInt(roomid),
            on_off: false,
            pinned: false,
            user_id: userId
          })
        });

        if (!response.ok) {
          Swal.fire({
            title: 'Lỗi!',
            text: 'Óh oh, hãy kiểm tra backend!',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
          });
          throw new Error('Check be pls');
        }
        $('.app-kanban').unblock();
        Swal.fire({
          title: 'Tạo thành công!',
          text: 'Hãy cấu hình cho thiết bị của bạn!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        }).then(result => {
          if (result.isConfirmed) {
            localStorage.removeItem('d3');
            window.location.reload();
          }
        });
      } catch (error) {
        console.error('Error adding item:', error);
        Swal.fire({
          title: 'Error!',
          text: ' Lỗi code!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      }
    } else {
      const title = kanbanItem.querySelector('#title').value;
      // const dueDate = kanbanItem.querySelector('#due-date').value;
      // const label = kanbanItem.querySelector('#label').value;
      const pinned = sidebar.querySelector('#pin').checked;
      const value = document.querySelector('#slider-light');
      const color = $('.pcr-button');
      const eid = kanbanItem.getAttribute('data-eid');
      const id = eid.replace('device-', '');
      // if (kanbanItem.getAttribute('data-on') == 'true') {
      //   $('[data-eid="'+eid+'"]').attr('data-on', false);
      // }
      console.log(pinned);
      if (kanbanItem.getAttribute('data-on') == 'true') {
        const e = $('[data-eid="' + eid + '"]');
        e.attr('data-on', true);
        const s = e.find('.switch-input');
        s.prop('checked', true);
      } else {
        const e = $('[data-eid="' + eid + '"]');
        e.attr('data-on', false);
        const s = e.find('.switch-input');
        s.prop('checked', false);
      }
      if (value) {
        const e = $('[data-eid="' + eid + '"]');
        if (e.find('.footer-value').length < 1) {
          e.find('.d-flex.justify-content-between.align-items-center.flex-wrap.mt-2.pt-1').append(
            `<span class="switch-label"><i class='bx bx-tachometer'></i><span class="footer-value">${parseInt(
              value.noUiSlider.get()
            )}</span></span>`
          );
          // e.append('<span class="footer-value"></span>');
        } else {
          e.find('.footer-value').text(parseInt(value.noUiSlider.get()));
        }
      }
      var color_gen;
      var cate = kanbanItem.getAttribute('data-category');
      if (color) {
        const e = $('[data-eid="' + eid + '"]');
        // e.attr('data-color', color.getColor().toHEXA().toString());
        // console.log(color.getColor().toHEXA().toString());
        // console.log(color);
        // console.log(classicPicker.getColor().toHEXA().toString());
        if (classicPicker) {
          console.log(classicPicker.getColor().toHEXA().toString());
          color_gen = classicPicker.getColor().toHEXA().toString();
        }
        // console.log(color[0].style.cssText);
      }
      var on_off = kanbanItem.getAttribute('data-on') == 'true' ? true : false;

      // value_gen += value ? '0' + String(parseInt(value.noUiSlider.get())) : '000';
      var url;
      if (cate == 'led') {
        console.log('LED');
        url = API + `/postDeviceDataLED`;
        const e = $('[data-eid="' + eid + '"]');
        if (e.find('.footer-color').length < 1) {
          e.find('.d-flex.justify-content-between.align-items-center.flex-wrap.mt-2.pt-1')
            .find('.switch-label')
            .append(
              `<span class="switch-label"><i class='bx bx-palette'></i><span class="footer-color">${color_gen}</span></span>`
            );
        } else {
          e.find('.footer-color').text(color_gen);
        }
      } else {
        console.log('NO LED');
        url = API + `/postDeviceData`;
      }
      var value_gen = String(id).length < 2 ? '0' + String(id) : String(id);
      if (value) {
        var num_value = parseInt(value.noUiSlider.get());
        if (!on_off) {
          if (color_gen) {
            value_gen = '000000000' + value_gen;
          } else {
            value_gen += '000';
          }
        } else {
          if (color_gen) {
            if (num_value < 100) {
              value_gen = '0' + String(parseInt(value.noUiSlider.get())) + color_gen.replace('#', '') + value_gen;
            } else {
              value_gen = String(parseInt(value.noUiSlider.get())) + color_gen.replace('#', '') + value_gen;
            }
          } else {
            value_gen = value_gen + '0' + String(parseInt(value.noUiSlider.get()));
          }
        }
      } else {
        // console.log('vo day');
        if (!on_off) {
          value_gen += '000';
        } else {
          value_gen += '001';
        }
      }
      console.log(
        JSON.stringify({
          device_id: id,
          on_off: kanbanItem.getAttribute('data-on') == 'true' ? true : false,
          value: value_gen,
          pinned: pinned,
          id: userId
        })
      );
      if (cate == 'led') $('[data-eid="' + eid + '"]').attr('data-light', value_gen);
      else if (cate == 'ac') $('[data-eid="' + eid + '"]').attr('data-temp', value_gen);
      else if (cate == 'fan') $('[data-eid="' + eid + '"]').attr('data-speed', value_gen);
      else if (cate == 'waterpump') {
        $('[data-eid="' + eid + '"]').attr('data-pump', value_gen);
        if (on_off) {
          value_gen = '00001';
        } else {
          value_gen = '00000';
        }
      }
      try {
        const response = await customFetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            device_id: id,
            on_off: kanbanItem.getAttribute('data-on') == 'true' ? true : false,
            value: value_gen,
            pinned: pinned,
            id: userId
          })
        });

        if (!response.ok) {
          console.log(response);
          throw new Error('Database đã cập nhật nhưng adafruit thì hên xui!');
        }

        Swal.fire({
          title: 'Thành công!',
          text: 'Thiết bị đã được cập nhật thành công.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });

        // kanbanItem.querySelector('.kanban-text').textContent = title;
        // kanbanItem.setAttribute('data-category', label);
        // kanbanItem.setAttribute('data-pinned', pinned);
      } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Database đã cập nhật nhưng adafruit thì hên xui!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      }
    }
  });

  // Get kanban data
  // var dd;
  // setInterval(() => {
  //   dd = JSON.parse(Base64.decode(localStorage.getItem('d')));
  //   console.log(dd);
  // }, 500);
  // const kanbanResponse = await fetch(assetsPath + 'json/kanban.json');
  // if (!kanbanResponse.ok) {
  //   console.error('error', kanbanResponse);
  // }
  boards = await checkData();
  console.log(boards);
  boards = transformApiDataToKanban(boards);
  console.log(boards);
  // top board
  $('.device-count').html(boards.reduce((count, board) => count + board.item.length, 0));
  $('.room-count').html(boards.length);

  // datepicker init
  if (datePicker) {
    datePicker.flatpickr({
      monthSelectorType: 'static',
      altInput: true,
      altFormat: 'j F, Y',
      dateFormat: 'Y-m-d'
    });
  }

  //! TODO: Update Event label and guest code to JS once select removes jQuery dependency
  // select2
  if (select2.length) {
    function renderLabels(option) {
      if (!option.id) {
        return option.text;
      }
      var $badge = "<div class='badge " + $(option.element).data('color') + " rounded-pill'> " + option.text + '</div>';
      return $badge;
    }

    select2.each(function () {
      var $this = $(this);
      $this.wrap("<div class='position-relative'></div>").select2({
        placeholder: 'Select Label',
        dropdownParent: $this.parent(),
        templateResult: renderLabels,
        templateSelection: renderLabels,
        escapeMarkup: function (es) {
          return es;
        }
      });
    });
  }

  // Comment editor
  // if (commentEditor) {
  //   new Quill(commentEditor, {
  //     modules: {
  //       toolbar: '.comment-toolbar'
  //     },
  //     placeholder: 'Nhập chú thích ... ',
  //     theme: 'snow'
  //   });
  // }

  // Render board dropdown
  function renderBoardDropdown() {
    return (
      "<div class='dropdown'>" +
      "<i class='dropdown-toggle bx bx-dots-vertical-rounded cursor-pointer fs-4' id='board-dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
      "<div class='dropdown-menu dropdown-menu-end' aria-labelledby='board-dropdown'>" +
      "<a class='dropdown-item delete-board' href='javascript:void(0)'> <i class='bx bx-trash bx-xs me-1'></i> <span class='align-middle'>Delete</span></a>" +
      "<a class='dropdown-item' href='javascript:void(0)'><i class='bx bx-rename bx-xs'></i> <span class='align-middle'>Rename</span></a>" +
      "<a class='dropdown-item' href='javascript:void(0)'><i class='bx bx-archive bx-xs'></i> <span class='align-middle'>Archive</span></a>" +
      '</div>' +
      '</div>'
    );
  }
  // Render item dropdown
  function renderDropdown() {
    return (
      "<div class='dropdown kanban-tasks-item-dropdown'>" +
      "<i class='dropdown-toggle bx bx-dots-vertical-rounded' id='kanban-tasks-item-dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
      "<div class='dropdown-menu dropdown-menu-end' aria-labelledby='kanban-tasks-item-dropdown'>" +
      "<a class='dropdown-item delete-task' href='javascript:void(0)'>Delete</a>" +
      '</div>' +
      '</div>'
    );
  }
  // Render header
  function renderHeader(category, categoryName) {
    // console.log(category, ',', categoryName);
    var color = {
      ac: 'info',
      '-book-content': 'primary',
      fan: 'info',
      '-door-open': 'danger',
      led: 'warning',
      waterpump: 'dark',
      default: 'success'
    };
    return (
      "<div class='d-flex justify-content-between flex-wrap align-items-center mb-2 pb-1'>" +
      "<div class='item-badges'> " +
      "<div class='badge rounded-pill bg-label-" +
      color[category] +
      "'> " +
      categoryName +
      '</div>' +
      '</div>' +
      renderDropdown() +
      '</div>'
    );
  }

  // Render footer
  function renderFooter(on, temp, light, speed, pump) {
    let value;
    if (on == 'true') {
      value = 'checked';
    } else if (on == 'false') {
      value = '';
    }
    if (temp > 0) {
      var html = `
      <span class="switch-label"><i class='bx bxs-thermometer'></i><span class="footer-value">${temp}</span></span>
      `;
    } else if (parseInt(light.slice(-3)) > 0) {
      var html = `
        <span class="switch-label"><i class='bx bx-bulb'></i><span class="footer-value">${parseInt(
          light.slice(0, 3)
        )}</span><i class='bx bx-palette'></i><span class="footer-color">${light.slice(3, 9)}</span></span>
      `;
    } else if (parseInt(speed.slice(-3)) > 0) {
      var html = `
        <span class="switch-label"><i class='bx bx-tachometer'></i><span class="footer-value">${parseInt(
          speed.slice(-3)
        )}</span></span>
      `;
    } else if (parseInt(pump.slice(-3)) > 0) {
      var html = `
        <span class="switch-label"><i class='bx bx-volume'></i><span class="footer-value">${parseInt(
          pump.slice(-3)
        )}</span></span>
      `;
    }
    return (
      //<input type="checkbox" style="z-index: 10" class="switch-input " ${value} onclick="event.stopPropagation()"/> dùng nếu cần bật tắt trực tiếp
      "<div class='d-flex justify-content-between align-items-center flex-wrap mt-2 pt-1'>" +
      "<div class='d-flex'>" +
      `<label class="switch switch-sm">
        <input type="checkbox" class="switch-input " ${value} onclick="event.stopPropagation()"/>
        <span class="switch-toggle-slider">
          <span class="switch-on">
            <i class="bx bx-check"></i>
          </span>
          <span class="switch-off">
            <i class="bx bx-x"></i>
          </span>
        </span>
      </label>` +
      `</div> ${html ? html : ''}` +
      '</div>'
    );
  }
  // Init kanban
  const kanban = new jKanban({
    element: '.kanban-wrapper',
    gutter: '15px',
    widthBoard: '500px',
    dragItems: true,
    boards: boards,
    dragBoards: true,
    addItemButton: true,
    buttonContent: '+ Thêm Phòng',
    itemAddOptions: {
      enabled: true, // add a button to board for easy item creation
      content: '+ Thêm Thiết Bị', // text or html content of the board button
      class: 'kanban-title-button btn btn-default', // default class of the button
      footer: false // position the button on footer
    },
    click: async function (el) {
      let element = el;
      console.log(element);
      let title = element.getAttribute('data-eid')
          ? element.querySelector('.kanban-text').textContent
          : element.textContent,
        date = element.getAttribute('data-add-date'),
        dateObj = new Date(),
        year = dateObj.getFullYear(),
        dateToUse = date
          ? date + ', ' + year
          : dateObj.getDate() + ' ' + dateObj.toLocaleString('vie', { month: 'long' }) + ', ' + year,
        label = element.getAttribute('data-category-name'),
        labelValue = element.getAttribute('data-category');
      document.querySelectorAll('.kanban-item').forEach(item => {
        item.classList.remove('active');
      });
      const id = element.getAttribute('data-eid').replace('device-', '');
      console.log(id);
      el.classList.add('active');
      // Show kanban offcanvas
      kanbanOffcanvas.show();

      // To get data on sidebar
      kanbanSidebar.querySelector('#title').value = title;
      kanbanSidebar.querySelector('#due-date').nextSibling.value = date;
      // ! Using jQuery method to get sidebar due to select2 dependency
      $('.kanban-update-item-sidebar').find(select2).val(labelValue).trigger('change');

      // render per category
      let on = element.getAttribute('data-on') == 'true' ? 'checked' : '',
        temp = element.getAttribute('data-temp'),
        mood = element.getAttribute('data-mood'),
        light = element.getAttribute('data-light'),
        pump = element.getAttribute('data-pump'),
        speed = element.getAttribute('data-speed').slice(-3);
      // console.log('speed', speed);
      $('.optional').empty();
      $('.optional').append(`
          <div class="mb-2">
                <label class="switch">
                  <input type="checkbox" class="switch-input" ${on}/>
                  <span class="switch-toggle-slider">
                    <span class="switch-on">
                      <i class="bx bx-check"></i>
                    </span>
                    <span class="switch-off">
                      <i class="bx bx-x"></i>
                    </span>
                  </span>
                  <span class="switch-label">Bật / Tắt</span>
                </label>
              </div>
        `);
      if (temp > 15) {
        $('.optional').append(`
          <div class="mb-2">
            <label class="form-label">Chọn Nhiệt Độ</label>
            <div id="slider-light" class="my-3"></div>
          </div>
        `);
        // Render AC
        noUiSlider.create(document.getElementById('slider-light'), {
          start: [temp],
          behaviour: 'tap-drag',
          step: 1,
          tooltips: true,
          range: {
            min: 16,
            max: 30
          }
        });
      }
      // if (mood > 0) {
      //   let mood0, mood1, mood2;
      //   if (mood == 1) {
      //     mood0 = 'checked';
      //   } else if (mood == 2) {
      //     mood1 = 'checked';
      //   } else if (mood == 3) {
      //     mood2 = 'checked';
      //   }
      //   $('.optional').append(`
      //       <label class="form-label">Chọn Chế Độ</label>
      //       <div class="d-flex flex-row mb-2">
      //         <div class="col-md-4 mb-md-0 mb-2">
      //             <div class="form-check custom-option custom-option-icon">
      //                 <label class="form-check-label custom-option-content" for="customRadioIcon1">
      //                     <span class="custom-option-body">
      //                         <i class="bx bx-cloud-snow"></i>
      //                         <span class="custom-option-title">Cool</span>
      //                     </span>
      //                     <input name="customRadioIcon" class="form-check-input" type="radio" value="" id="customRadioIcon1" ${mood0} />
      //                 </label>
      //             </div>
      //         </div>
      //         <div class="col-md-4 mb-md-0 mb-2">
      //             <div class="form-check custom-option custom-option-icon">
      //                 <label class="form-check-label custom-option-content" for="customRadioIcon2">
      //                     <span class="custom-option-body">
      //                         <i class="bx bx-wind"></i>
      //                         <span class="custom-option-title">Wind</span>
      //                     </span>
      //                     <input name="customRadioIcon" class="form-check-input" type="radio" value="" id="customRadioIcon2" ${mood1}/>
      //                 </label>
      //             </div>
      //         </div>
      //         <div class="col-md-4">
      //             <div class="form-check custom-option custom-option-icon">
      //                 <label class="form-check-label custom-option-content" for="customRadioIcon3">
      //                     <span class="custom-option-body">
      //                         <i class="bx bx-analyse"></i>
      //                         <span class="custom-option-title">Auto</span>
      //                     </span>
      //                     <input name="customRadioIcon" class="form-check-input" type="radio" value="" id="customRadioIcon3" ${mood2}/>
      //                 </label>
      //             </div>
      //         </div>
      //       </div>
      //     `);
      // }
      var result, value;
      if (parseInt(light.slice(0, 3)) > -1) {
        result = 'Độ Sáng';
        value = parseInt(light.slice(0, 3));
      }
      // if (parseInt(pump) > -1) {
      //   result = 'Máy Bơm';
      //   value = pump;
      // }
      if (parseInt(speed) > -1) {
        result = 'Tốc Độ';
        value = speed;
      }
      //render
      if (!result) {
      } else if (result == 'Độ Sáng') {
        $('.optional').append(`
          <div class="mb-2">
                <label class="form-label">${result}</label>
                <div id="slider-light" class="my-3"></div>
              </div>
        `);
        noUiSlider.create(document.getElementById('slider-light'), {
          start: [value],
          connect: [true, false],
          range: {
            min: 0,
            max: 100
          }
        });
        $('.optional').append(`
          <div class="mb-2">
                <label class="form-label">Màu sắc</label>
                <div id="color-light" class="my-3"></div>
              </div>
        `);
        classicPicker = pickr.create({
          el: '#color-light',
          theme: 'classic',
          default: '#' + light.slice(3, 9),
          swatches: [
            'rgba(102, 108, 232, 1)',
            'rgba(40, 208, 148, 1)',
            'rgba(255, 73, 97, 1)',
            'rgba(255, 145, 73, 1)',
            'rgba(30, 159, 242, 1)'
          ],
          components: {
            preview: true,
            opacity: true,
            hue: true,

            interaction: {
              hex: true,
              rgba: true,
              hsla: true,
              hsva: true,
              cmyk: true,
              input: true,
              clear: true,
              save: true
            }
          }
        });
      } else {
        $('.optional').append(`
          <div class="mb-2">
                <label class="form-label">${result}</label>
                <div id="slider-light" class="my-3"></div>
              </div>
        `);
        noUiSlider.create(document.getElementById('slider-light'), {
          start: [value],
          connect: [true, false],
          range: {
            min: 0,
            max: 100
          }
        });
      }
      var check = el.getAttribute('data-pinned');
      if (check === 'true') {
        check = 'checked';
      } else if (check === 'false') {
        check = '';
      }
      $('.optional').append(`
        <div class="mb-3">
          <input class="form-check-input" type="checkbox" value="" id="pin" ${check} />
          <label class="form-check-label" for="pin"><i class='bx bxs-pin'></i>Ghim lên trang chủ</label>
        </div>
      `);
      try {
        await customFetch(API + `/getLogDevice/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            var html = ``;
            data.forEach(function (e) {
              html += `
                <div class="media mb-4 d-flex align-items-start">
                  <div class="avatar me-2 flex-shrink-0 mt-1">
                    <i class='bx bx-user rounded-circle' alt="Avatar"></i>
                  </div>
                  <div class="media-body">
                    <p class="mb-0">
                      ${e.action}<span class="fw-medium"> ${e.on_off ? 'Bật' : 'Tắt'} và ${e.value}</span>
                    </p>
                    <small class="text-muted">${e.time}</small>
                  </div>
                </div>
              `;
            });
            $('#tab-activity').html(html);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    },

    buttonClick: function (el, boardId) {
      const addNew = document.createElement('form');
      addNew.setAttribute('class', 'new-item-form');
      addNew.innerHTML =
        '<div class="mb-3">' +
        '<textarea class="form-control add-new-item" rows="2" placeholder="Tên thiết bị" autofocus required></textarea>' +
        '</div>' +
        '<div class="mb-3">' +
        '<button type="submit" class="btn btn-primary btn-sm me-2">Thêm</button>' +
        '<button type="button" class="btn btn-label-secondary btn-sm cancel-add-item">Hủy</button>' +
        '</div>';
      kanban.addForm(boardId, addNew);

      addNew.addEventListener('submit', async function (e) {
        e.preventDefault();
        const currentBoard = [].slice.call(
          document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .kanban-item')
        );
        kanban.addElement(boardId, {
          title: "<h5 class='kanban-text'>" + e.target[0].value + '</h5>',
          // id: boardId + '-' + currentBoard.length + 1
          id: boardId
        });
        // const newItemTitle = e.target[0].value;
        // const id = boardId.replace('board-', '');
        // console.log(userId);
        // try {
        //   $('.app-kanban').block({
        //     message: '<div class="spinner-border spinner-border-sm text-primary" role="status"></div>',
        //     css: {
        //       backgroundColor: 'transparent',
        //       border: '0'
        //     },
        //     overlayCSS: {
        //       backgroundColor: '#fff',
        //       opacity: 0.7
        //     }
        //   });
        //   const response = await fetch(API + '/createDevice', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //       name: newItemTitle,
        //       type: 'default',
        //       brand: 'default',
        //       value: 0,
        //       room_id: id,
        //       on_off: false,
        //       pinned: false,
        //       user_id: userId
        //     })
        //   });

        //   if (!response.ok) {
        //     Swal.fire({
        //       title: 'Lỗi!',
        //       text: 'Óh oh, hãy kiểm tra backend!',
        //       icon: 'error',
        //       customClass: {
        //         confirmButton: 'btn btn-primary'
        //       },
        //       buttonsStyling: false
        //     });
        //     throw new Error('Check be pls');
        //   }
        //   $('.app-kanban').unblock();
        //   Swal.fire({
        //     title: 'Tạo thành công!',
        //     text: 'Hãy cấu hình cho thiết bị của bạn!',
        //     icon: 'success',
        //     customClass: {
        //       confirmButton: 'btn btn-primary'
        //     },
        //     buttonsStyling: false
        //   }).then(result => {
        //     if (result.isConfirmed) {
        //       window.location.reload();
        //     }
        //   });
        // } catch (error) {
        //   console.error('Error adding item:', error);
        //   Swal.fire({
        //     title: 'Error!',
        //     text: ' Lỗi code!',
        //     icon: 'error',
        //     customClass: {
        //       confirmButton: 'btn btn-primary'
        //     },
        //     buttonsStyling: false
        //   });
        // }
        Swal.fire({
          title: 'Tạo thành công!',
          text: 'Hãy cấu hình cho thiết bị của bạn!',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
        // add dropdown in new boards
        const kanbanText = [].slice.call(
          document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .kanban-text')
        );
        kanbanText.forEach(function (e) {
          e.insertAdjacentHTML('beforebegin', renderDropdown());
        });

        // prevent sidebar to open onclick dropdown buttons of new tasks
        const newTaskDropdown = [].slice.call(document.querySelectorAll('.kanban-item .kanban-tasks-item-dropdown'));
        if (newTaskDropdown) {
          newTaskDropdown.forEach(function (e) {
            e.addEventListener('click', function (el) {
              el.stopPropagation();
            });
          });
        }

        // delete tasks for new boards
        const deleteTask = [].slice.call(
          document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .delete-task')
        );
        deleteTask.forEach(function (e) {
          e.addEventListener('click', function () {
            const id = this.closest('.kanban-item').getAttribute('data-eid');
            kanban.removeElement(id);
          });
        });
        addNew.remove();
      });

      // Remove form on clicking cancel button
      addNew.querySelector('.cancel-add-item').addEventListener('click', function (e) {
        addNew.remove();
      });
    }
  });

  // Kanban Wrapper scrollbar
  if (kanbanWrapper) {
    new PerfectScrollbar(kanbanWrapper);
  }

  const kanbanContainer = document.querySelector('.kanban-container'),
    kanbanTitleBoard = [].slice.call(document.querySelectorAll('.kanban-title-board')),
    kanbanItem = [].slice.call(document.querySelectorAll('.kanban-item'));

  const categoryIcon = {
    '-tv': 'bx-tv',
    '-book-content': 'bx-book-content',
    '-door-open': 'bx-door-open',
    '-speaker': 'bx-speaker',
    '-bulb': 'bx-bulb',
    ac: 'bx-cloud-snow',
    fan: 'bx-wind',
    led: 'bx-bulb',
    default: 'bx-cog',
    waterpump: 'bx-gas-pump',
    '-speed': 'bx-tachometer'
  };
  // Render custom items
  if (kanbanItem) {
    kanbanItem.forEach(function (el) {
      const element = "<h5 class='kanban-text text-center'>" + el.textContent + '</h5>';
      let img = '';
      if (el.getAttribute('data-image') == '') {
        //skip img
        img =
          "<img class='img-fluid rounded mb-2' src='" +
          assetsPath +
          'img/elements/' +
          el.getAttribute('data-image') +
          "'>";
      } else {
        img = `
          <i class="bx ${categoryIcon[el.getAttribute('data-category')]} text-secondary display-6 text-center"></i>
        `;
      }
      // console.log(img);
      el.textContent = '';
      if (el.getAttribute('data-badge') !== undefined && el.getAttribute('data-category-name') !== undefined) {
        el.insertAdjacentHTML(
          'afterbegin',
          renderHeader(el.getAttribute('data-category'), el.getAttribute('data-category-name')) + img + element
        );
      }
      if (
        el.getAttribute('data-comments') !== undefined ||
        el.getAttribute('data-add-date') !== undefined ||
        el.getAttribute('data-assigned') !== undefined
      ) {
        el.insertAdjacentHTML(
          'beforeend',
          renderFooter(
            el.getAttribute('data-on'),
            el.getAttribute('data-temp'),
            el.getAttribute('data-light'),
            el.getAttribute('data-speed'),
            el.getAttribute('data-pump')
          )
        );
      }
    });
  }

  // To initialize tooltips for rendered items
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // prevent sidebar to open onclick dropdown buttons of tasks
  const tasksItemDropdown = [].slice.call(document.querySelectorAll('.kanban-tasks-item-dropdown'));
  if (tasksItemDropdown) {
    tasksItemDropdown.forEach(function (e) {
      e.addEventListener('click', function (el) {
        el.stopPropagation();
      });
    });
  }

  // Toggle add new input and actions add-new-btn
  if (kanbanAddBoardBtn) {
    kanbanAddBoardBtn.addEventListener('click', () => {
      kanbanAddNewInput.forEach(el => {
        el.value = '';
        el.classList.toggle('d-none');
      });
    });
  }

  // Render add new inline with boards
  if (kanbanContainer) {
    kanbanContainer.appendChild(kanbanAddNewBoard);
  }

  // Makes kanban title editable for rendered boards
  if (kanbanTitleBoard) {
    kanbanTitleBoard.forEach(function (elem) {
      elem.addEventListener('mouseenter', function () {
        this.contentEditable = 'true';
      });

      // Appends delete icon with title
      elem.insertAdjacentHTML('afterend', renderBoardDropdown());
    });
  }

  // To delete Board for rendered boards
  const deleteBoards = [].slice.call(document.querySelectorAll('.delete-board'));
  if (deleteBoards) {
    deleteBoards.forEach(function (elem) {
      elem.addEventListener('click', function () {
        const id = this.closest('.kanban-board').getAttribute('data-id');
        kanban.removeBoard(id);
      });
    });
  }

  // Delete task for rendered boards
  const deleteTask = [].slice.call(document.querySelectorAll('.delete-task'));
  if (deleteTask) {
    deleteTask.forEach(function (e) {
      e.addEventListener('click', async function () {
        const kanbanItem = this.closest('.kanban-item');
        const eid = kanbanItem.getAttribute('data-eid');
        const id = eid.replace('device-', '');

        const confirmDelete = await Swal.fire({
          title: 'Bạn có chắc chắn?',
          text: 'Thiết bị này sẽ bị xóa vĩnh viễn!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-secondary'
          },
          buttonsStyling: false
        });

        if (confirmDelete.isConfirmed) {
          try {
            const response = await customFetch(API + `/deleteDevice/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error('Không thể xóa thiết bị. Vui lòng kiểm tra lại!');
            }

            kanban.removeElement(eid);

            Swal.fire({
              title: 'Đã xóa!',
              text: 'Thiết bị đã được xóa thành công.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            });
          } catch (error) {
            console.error('Lỗi khi xóa thiết bị:', error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Không thể xóa thiết bị. Vui lòng thử lại sau!',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            });
          }
        }
      });
    });
  }

  // Cancel btn add new input
  const cancelAddNew = document.querySelector('.kanban-add-board-cancel-btn');
  if (cancelAddNew) {
    cancelAddNew.addEventListener('click', function () {
      kanbanAddNewInput.forEach(el => {
        el.classList.toggle('d-none');
      });
    });
  }
  console.log(houseId);
  // Add new board
  if (kanbanAddNewBoard) {
    kanbanAddNewBoard.addEventListener('submit', async function (e) {
      e.preventDefault();
      const thisEle = this,
        value = thisEle.querySelector('.form-control').value,
        id = value.replace(/\s+/g, '-').toLowerCase();
      console.log(id, value);
      kanban.addBoards([
        {
          id: id,
          title: value
        }
      ]);
      try {
        const response = await customFetch(API + '/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: value,
            house_id: houseId
          })
        });
        if (!response.ok) {
          throw new Error('Lỗi khi tạo phòng mới!');
        }
        $('.room-count').text(parseInt($('.room-count').text()) + 1);
        Swal.fire({
          title: 'Thành công!',
          text: value + ' đã được thêm thành công.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      } catch (error) {
        console.error('Lỗi khi tạo phòng mới:', error);
        Swal.fire({
          title: 'Lỗi!',
          text: 'Không thể tạo phòng mới. Vui lòng thử lại sau!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false
        });
      }
      // Adds delete board option to new board, delete new boards & updates data-order
      const kanbanBoardLastChild = document.querySelectorAll('.kanban-board:last-child')[0];
      if (kanbanBoardLastChild) {
        const header = kanbanBoardLastChild.querySelector('.kanban-title-board');
        header.insertAdjacentHTML('afterend', renderBoardDropdown());

        // To make newly added boards title editable
        kanbanBoardLastChild.querySelector('.kanban-title-board').addEventListener('mouseenter', function () {
          this.contentEditable = 'true';
        });
      }

      // Add delete event to delete newly added boards
      const deleteNewBoards = kanbanBoardLastChild.querySelector('.delete-board');
      if (deleteNewBoards) {
        deleteNewBoards.addEventListener('click', function () {
          const id = this.closest('.kanban-board').getAttribute('data-id');
          kanban.removeBoard(id);
        });
      }

      // Remove current append new add new form
      if (kanbanAddNewInput) {
        kanbanAddNewInput.forEach(el => {
          el.classList.add('d-none');
        });
      }

      // To place inline add new btn after clicking add btn
      if (kanbanContainer) {
        kanbanContainer.appendChild(kanbanAddNewBoard);
      }
    });
  }

  // Clear comment editor on close
  // kanbanSidebar.addEventListener('hidden.bs.offcanvas', function () {
  //   kanbanSidebar.querySelector('.ql-editor').firstElementChild.innerHTML = '';
  // });

  // Re-init tooltip when offcanvas opens(Bootstrap bug)
  if (kanbanSidebar) {
    kanbanSidebar.addEventListener('shown.bs.offcanvas', function () {
      const tooltipTriggerList = [].slice.call(kanbanSidebar.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  }
})();

$(function () {
  // setInterval(() => {
  //   var dd = JSON.parse(Base64.decode(localStorage.getItem('d')));
  //   console.log(dd);
  // }, 500);
});
