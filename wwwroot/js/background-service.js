/*
/* File: background-service.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Wed Apr 23 2025
 * Description: d mean all data, t_o mean temp_out
 * Useage:
 */

'use strict';
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
