/*
/* File: background-service.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Wed Apr 23 2025
 * Description: d mean all data, t_o mean temp_out
 * Useage:
 */

'use strict';
const API = document.querySelector('#domain').value;
(function () {
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
  fc();
  const connection = new signalR.HubConnectionBuilder().withUrl('/Hubs').build();
  const currentUrl = window.location.pathname;
  connection.on('ReceiveData', data => {
    console.log(data);
    data = JSON.parse(data);
    localStorage.setItem('d', Base64.encode(JSON.stringify(data)));
  });
  connection
    .start()
    .then(() => {
      connection.invoke('SetCurrentUrl', currentUrl);
    })
    .catch(err => console.error(err));
})();

$(function () {
  // console.log('ok');
  //user service
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
  async function ft() {
    var ac = Base64.decode(localStorage.getItem('t'));
    if (ac) {
      fetch(API + '/users/profile/', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + ac
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => localStorage.setItem('user', Base64.encode(JSON.stringify(data))))
        .catch(error => console.error('There was an error:', error));
    }
  }
  var user = localStorage.getItem('user');
  if (!user) {
    ft();
    user = JSON.parse(Base64.decode(localStorage.getItem('user'))); //localStorage.getItem('user');
  } else {
    user = JSON.parse(Base64.decode(localStorage.getItem('user'))); //localStorage.getItem('user');
  }
  if ($('.user-name').length > 0) {
    $('.user-name').each(function (item, index) {
      $(index).text(user.first_name + ' ' + user.last_name);
      console.log($(index));
    });
    $('.user-name').unblock();
  }
  $('.user-home-name').length > 0 ? $('.user-home-name').text(user.home_name) : '';
  $('.user-home-name').unblock();
  $('.user-address').length > 0 ? $('.user-address').text(user.address) : '';
  $('.user-address').unblock();

  //end user
});
