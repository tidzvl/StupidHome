/**
 * DataTables Basic
 */
/*
/* File: tables-datatables-basic.js
/* Author: TiDz
/* Contact: nguyentinvs123@gmail.com
 * Created on Thu Mar 06 2025
 * Description:
 * Useage:
 */

'use strict';

let fv, offCanvasEl;

// datatable (jquery)
$(function () {
  var dt_complex_header_table = $('.dt-complex-header');

  // Complex Header DataTable
  // --------------------------------------------------------------------

  if (dt_complex_header_table.length) {
    var dt_complex = dt_complex_header_table.DataTable({
      ajax: assetsPath + 'json/table-datatable.json',
      columns: [
        { data: 'title' },
        { data: 'title-position' },
        { data: 'category-name' },
        { data: 'people' },
        { data: 'last-update' },
        { data: 'status' }
      ],
      columnDefs: [
        {
          // Label
          targets: -1,
          render: function (data, type, full, meta) {
            var $status_number = full['status'];
            var $status = {
              1: { title: 'Bật', class: 'bg-label-primary' },
              2: { title: 'Điều Chỉnh', class: ' bg-label-success' },
              3: { title: 'Tắt', class: ' bg-label-warning' },
              4: { title: 'Cảnh Báo', class: ' bg-label-danger' }
            };
            if (typeof $status[$status_number] === 'undefined') {
              return data;
            }
            return (
              '<span class="badge rounded-pill ' +
              $status[$status_number].class +
              '">' +
              $status[$status_number].title +
              '</span>'
            );
          }
        }
      ],
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      displayLength: 7,
      lengthMenu: [7, 10, 25, 50, 75, 100]
    });
  }

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
