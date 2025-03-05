/*
/* File: rules.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Thu Mar 06 2025
 * Description:
 * Useage:
 */

(function () {
  const handleList1 = document.getElementById('handle-list-1'),
    handleList2 = document.getElementById('handle-list-2');

  if (handleList1) {
    Sortable.create(handleList1, {
      animation: 150,
      group: 'handleList1',
      handle: '.drag-handle'
    });
  }
  if (handleList2) {
    Sortable.create(handleList2, {
      animation: 150,
      group: 'handleList2',
      handle: '.drag-handle'
    });
  }
})();
