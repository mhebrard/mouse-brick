/* global db:true $:true */

module.exports.load = () => {
  const today = new Date();
// Initiate datepicker
  $('#addEvent input.date')
  .attr('value', `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`)
  .datepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayHighlight: true
  });

  // Hide all but type
  $('#addEvent div.form-group').css('display', 'none');
  $('#div-type').css('display', 'flex');

  // Type on change
  $('#div-type').change(() => {
    switch ($('#type option:selected').text()) {
      case 'Birth':
        $('#addEvent div.form-group').css('display', 'flex');
        $('#div-mouse').css('display', 'none');
        $('#div-death').css('display', 'none');
        break;
      case 'Death':
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-mouse').css('display', 'flex');
        $('#div-death').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      default:
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
    }
  });

  // Request Mouse for id, mother, father
  const res = db.select('SELECT ID, sex FROM mice');
  const s = $('#mouse');
  const m = $('#mother');
  const f = $('#father');
  res.forEach(r => {
    s.append(`<option>${r.ID}</option>`);
    if (r.sex === 'male') {
      f.append(`<option>${r.ID}</option>`);
    } else {
      m.append(`<option>${r.ID}</option>`);
    }
  });

  // Submit
  $('#addEvent').submit(e => {
    e.preventDefault();
    console.log('submit event');
    let opts;
    switch ($('#type option:selected').text()) {
      case 'Birth': {
        opts = {
          table: 'mice',
          id: $('#id').val(),
          birth: $('#birth').val(),
          death: null,
          sex: $('input[name=sex]:checked').val(),
          father: $('#father').val(),
          mother: $('#mother').val(),
          genotype: $('#genotype').val(),
          validated: $('#validated')[0].checked ? 1 : 0,
          box: $('#box').val()
        };
        db.insert(opts);
        break;
      }
      case 'Death': {
        opts = {
          table: 'mice',
          id: $('#mouse option:selected').text(),
          set: `death="${$('#birth').val()}"`
        };
        db.update(opts);
        break;
      }
      default:
    }

    $('#event').click();
  });
};
