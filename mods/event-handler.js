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
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-id').css('display', 'flex');
        $('#div-birth').css('display', 'flex');
        $('#div-sex').css('display', 'flex');
        $('#div-mother').css('display', 'flex');
        $('#div-father').css('display', 'flex');
        $('#div-genotype').css('display', 'flex');
        $('#div-box').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      case 'Death':
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-mouse').css('display', 'flex');
        $('#div-date').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      case 'Move':
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-mouse').css('display', 'flex');
        $('#div-date').css('display', 'flex');
        $('#div-box').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      case 'Genotype':
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-mouse').css('display', 'flex');
        $('#div-date').css('display', 'flex');
        $('#div-genotype').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      case 'Other':
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
        $('#div-label').css('display', 'flex');
        $('#div-desc').css('display', 'flex');
        $('#div-mouse').css('display', 'flex');
        $('#div-date').css('display', 'flex');
        $('#div-submit').css('display', 'flex');
        break;
      default:
        $('#addEvent div.form-group').css('display', 'none');
        $('#div-type').css('display', 'flex');
    }
  });

  // Request Mouse for id, mother, father
  const res = db.select('SELECT ID, sex FROM mice WHERE death IS NULL');
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
        const id = $('#id').val();
        const date = $('#birth').val();
        opts = {
          table: 'mice',
          id,
          birth: date,
          death: null,
          sex: $('input[name=sex]:checked').val(),
          father: $('#father').val(),
          mother: $('#mother').val(),
          genotype: $('#genotype').val(),
          validated: $('#validated')[0].checked ? 1 : 0,
          box: $('#box').val()
        };
        db.insert(opts);
        opts = {
          table: 'events',
          type: 'birth',
          label: 'birth',
          desc: 'the mouse is born',
          mouse: id,
          start: date,
          end: null,
          day: 0
        };
        db.insert(opts);
        break;
      }
      case 'Death': {
        const id = $('#mouse option:selected').text();
        const date = $('#date').val();
        opts = {
          table: 'mice',
          id,
          set: `death="${date}"`
        };
        db.update(opts);
        opts = {
          table: 'events',
          type: 'death',
          label: 'death',
          desc: 'the mouse died',
          mouse: id,
          start: date,
          end: null,
          day: days(date, id)
        };
        db.insert(opts);
        break;
      }
      case 'Move': {
        const id = $('#mouse option:selected').text();
        const date = $('#date').val();
        const newbox = $('#box').val();
        // Get oldbox
        const res = db.select(`SELECT box FROM mice WHERE ID="${id}"`);
        const oldbox = res[0].box;

        opts = {
          table: 'mice',
          id,
          set: `box="${newbox}"`
        };
        db.update(opts);
        opts = {
          table: 'events',
          type: 'move',
          label: 'move',
          desc: `move the mouse from ${oldbox} to ${newbox}`,
          mouse: id,
          start: date,
          end: null,
          day: days(date, id)
        };
        db.insert(opts);
        break;
      }
      case 'Genotype': {
        const id = $('#mouse option:selected').text();
        const date = $('#date').val();
        const gen = $('#genotype').val();
        const v = $('#validated')[0].checked ? 1 : 0;
        opts = {
          table: 'mice',
          id,
          set: `genotype="${gen}", validated=${v}`
        };
        db.update(opts);
        opts = {
          table: 'events',
          type: 'genotype',
          label: 'genotype',
          desc: `the genotype ${gen} of the mouse is ${v === 1 ? '' : 'not'} confirmed`,
          mouse: id,
          start: date,
          end: null,
          day: days(date, id)
        };
        db.insert(opts);
        break;
      }
      case 'Other': {
        const label = $('#label').val();
        const desc = $('#desc').val();
        const id = $('#mouse option:selected').text();
        const date = $('#date').val();
        opts = {
          table: 'events',
          type: 'other',
          label,
          desc,
          mouse: id,
          start: date,
          end: null,
          day: days(date, id)
        };
        db.insert(opts);
        break;
      }
      default:
    }

    $('#event').click();
  });
};

function days(date, id) {
  const res = db.select(`SELECT birth FROM mice WHERE ID="${id}"`);
  const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
  const start = new Date(res[0].birth);
  const end = new Date(date);
  const day = Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
  return day;
}
