/* global db:true $:true */

module.exports.load = () => {
  // Initiate datepicker
  $('#addMouseForm input.date').datepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayHighlight: true
  });

  // Request Males & add in father list
  let res = db.select('SELECT ID FROM mice WHERE sex="male"');
  let sel = $('#father');
  res.forEach(r => {
    sel.append(`<option>${r.ID}</option>`);
  });
  // Request Female & add in mother list
  res = db.select('SELECT ID FROM mice WHERE sex="female"');
  sel = $('#mother');
  res.forEach(r => {
    sel.append(`<option>${r.ID}</option>`);
  });

  // Submit
  $('#addMouseForm').submit(e => {
    e.preventDefault();
    console.log('submit event');
    const insert = {
      table: 'mice',
      id: $('#mouseID').val(),
      birth: $('#birth').val(),
      death: null,
      sex: $('input[name=sex]:checked').val(),
      father: $('#father').val(),
      mother: $('#mother').val(),
      genotype: $('#genotype').val(),
      validated: $('#validated')[0].checked ? 1 : 0,
      box: null
    };
    console.log('form', insert);
    db.insert(insert);
    $('#add').click();
  });
};
