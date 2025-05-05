/*
/* File: background-service.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Wed Apr 23 2025
 * Description: d mean all data, t_o mean temp_out
 * Useage:
 */

'use strict';

['.user-name', '.user-address', '.user-home-name'].forEach(selector => {
  $(selector).block({
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
});
const API = document.querySelector('#domain').value;
async function customFetch(url, options = {}) {
  const token = Base64.decode(localStorage.getItem('t'));
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers
  };

  // return fetch(url, options);
  const response = await fetch(url, options);

  if (response.status === 401) {
    Swal.fire({
      title: 'Thông báo!',
      text: 'Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại!',
      icon: 'info',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
      timer: 5000,
      showConfirmButton: false
    }).then(() => {
      logout();
    });
    throw new Error('Unauthorized: Token expired');
  }
  return response;
}
function logout() {
  localStorage.clear();
  window.location.href = '/login';
}
(async function () {
  async function fc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          )
            .then(response => response.json())
            .then(data => {
              const temperature = data.current_weather.temperature;
              localStorage.setItem('t_o', Base64.encode(JSON.stringify(temperature)));
            })
            .catch(error => console.error('Lỗi:', error));
        },
        error => {
          console.error('Không thể lấy vị trí:', error);
        }
      );
    } else {
      console.error('Check trình duyệt pls');
    }
  }
  async function ft() {
    var ac = Base64.decode(localStorage.getItem('t'));
    if (ac) {
      await fetch(API + '/users/profile/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + ac
        }
      })
        .then(response => {
          console.log(response);
          if (response.status === 401) {
            Swal.fire({
              title: 'Thông báo!',
              text: 'Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại!',
              icon: 'info',
              customClass: {
                confirmButton: 'btn btn-primary'
              },
              buttonsStyling: false
            });
            logout();
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data['admin_house'].length <= 0) window.location.href = '/Home/Pricing';
          localStorage.setItem('user', Base64.encode(JSON.stringify(data)));
          if ($('.user-name').length > 0) {
            $('.user-name').each(function (item, index) {
              $(index).text(data.first_name + ' ' + data.last_name);
            });
            $('.user-name').unblock();
          }
          $('#user-id').text(data.id);
          $('.user-home-name').length > 0 ? $('.user-home-name').text(data.home_name) : '';
          $('.user-home-name').unblock();
          $('.user-address').length > 0 ? $('.user-address').text(data.address) : '';
          $('.user-address').unblock();
        })
        .catch(error => console.error('There was an error:', error));
    }
  }
  var user = localStorage.getItem('user');
  if (!user) {
    await ft();
  } else {
    user = JSON.parse(Base64.decode(localStorage.getItem('user')));
    if (user['admin_house'].length <= 0) window.location.href = '/Home/Pricing';
    if ($('.user-name').length > 0) {
      $('.user-name').each(function (item, index) {
        $(index).text(user.first_name + ' ' + user.last_name);
      });
      $('.user-name').unblock();
    }
    $('.user-home-name').length > 0 ? $('.user-home-name').text(user.home_name) : '';
    $('.user-home-name').unblock();
    $('.user-address').length > 0
      ? ($('.user-address').text(user.address), $('.user-address').attr('value', user.admin_house[0]))
      : '';
    $('.user-address').unblock();
  }
  await fc();
  const connection = new signalR.HubConnectionBuilder().withUrl('/Hubs').build();
  const currentUrl = window.location.pathname;
  connection.on('ReceiveData', (data, data2, data3) => {
    // console.log(data2);
    if (data2) {
      localStorage.setItem('d2', Base64.encode(data2));
      // data2 = JSON.parse(data2);
      // console.log(data2);
    }
    if (data3) {
      // console.log(data3);
      localStorage.setItem('d3', Base64.encode(data3));
      // data2 = JSON.parse(data2);
    }
    // console.log(data);
    localStorage.setItem('d', Base64.encode(data));
  });
  connection
    .start()
    .then(() => {
      // console.log(currentUrl, localStorage.getItem('user'), localStorage.getItem('t'));
      connection.invoke('SetCurrentUrl', currentUrl, localStorage.getItem('user'), localStorage.getItem('t'));
    })
    .catch(err => console.error(err));
})();

$(async function () {});
