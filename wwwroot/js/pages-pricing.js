/**
 * Pricing
 */

'use strict';

const userId = JSON.parse(Base64.decode(localStorage.getItem('user'))).id;

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
    logout();
    throw new Error('Unauthorized: Token expired');
  }
  return response;
}

document.addEventListener('DOMContentLoaded', function (event) {
  (function () {
    const createHouseForm = document.querySelector('#create-new-house');
    if (createHouseForm) {
      createHouseForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const address = createHouseForm.querySelector('#address').value;

        try {
          console.log(
            JSON.stringify({
              id: userId,
              location: address
            })
          );

          const createHouseResponse = await customFetch(`${document.querySelector('#domain').value}/createHouse`, {
            method: 'POST',
            body: JSON.stringify({
              id: userId,
              location: address
            })
          });

          if (createHouseResponse.status === 201) {
            const changeProfileResponse = await customFetch(
              `${document.querySelector('#domain').value}/users/changeProfile/`,
              {
                method: 'POST',
                body: JSON.stringify({
                  first_name: 'Chủ',
                  last_name: 'Nhà',
                  address: address
                })
              }
            );

            if (changeProfileResponse.status === 200) {
              alert('Đã tạo nhà thành công! Vui lòng đăng nhập lại để bất ngờ!');
              localStorage.clear();
              window.location.href = '/login';
            }
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }

    const priceDurationToggler = document.querySelector('.price-duration-toggler'),
      priceMonthlyList = [].slice.call(document.querySelectorAll('.price-monthly')),
      priceYearlyList = [].slice.call(document.querySelectorAll('.price-yearly'));

    function togglePrice() {
      if (priceDurationToggler.checked) {
        // If checked
        priceYearlyList.map(function (yearEl) {
          yearEl.classList.remove('d-none');
        });
        priceMonthlyList.map(function (monthEl) {
          monthEl.classList.add('d-none');
        });
      } else {
        // If not checked
        priceYearlyList.map(function (yearEl) {
          yearEl.classList.add('d-none');
        });
        priceMonthlyList.map(function (monthEl) {
          monthEl.classList.remove('d-none');
        });
      }
    }
    // togglePrice Event Listener
    togglePrice();

    priceDurationToggler.onchange = function () {
      togglePrice();
    };
  })();
});
