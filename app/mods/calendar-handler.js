/* global $:true db:true */
const vis = require('vis');

let range = 'month'; // Range: week | month | year
let g = []; // Groups array;

module.exports.load = () => {
  console.log('calendar handler');
  // Get container
  const container = document.getElementById('calendar');
  // Specify date format
  const items = new vis.DataSet({
    type: {start: 'ISODate', end: 'ISODate'}
  });
  // Groups and events
  g = [];
  const e = [];
  const today = new Date(); // Today
  const y = today.getFullYear(); // Current year
  const endYear = new Date(y, 11, 31).toISOString();
  // Get Mices
  let res = db.select('SELECT ID, birth, death, sex FROM mice');
  res.forEach((r, i) => {
    const age = r.death ? -1 : duration(r.birth, today);
    g.push({id: r.ID, content: r.ID, title: `age: ${age < 0 ? 'dead' : 'P' + age}`, age, visible: true});
    e.push({id: 'life' + i, start: r.birth, end: r.death || endYear, type: 'background', className: r.sex, group: r.ID});
  });
  const groups = new vis.DataSet(g);

  // Get Events
  res = db.select('SELECT * FROM events');
  res.forEach(r => {
    e.push({id: r.ID, content: r.label, start: r.start, end: null, group: r.mouse, title: `(P${r.day}) ${r.desc}`});
  });
  items.add(e);

  // Range
  const [start, end] = getRange(today);
  const options = {
    // Orientation:'top'
    start,
    end,
    editable: false,
    stack: false,
    tooltip: {
      followMouse: true
    },
    groupOrder(a, b) {
      // Elder first, Younger, then Dead
      return b.age - a.age;
    }
  };

  const timeline = new vis.Timeline(container, items, groups, options);

  // On click Manager
  container.onclick = event => {
    const props = timeline.getEventProperties(event);
    console.log(props);
    if (!props.item && props.group) {
      $('#info').click();
      $(document).ready(() => {
        console.log('click ready');
        $('#mouse').val(props.group).trigger('change');
      });
    }
  };

  // Toogle Groop
  $('#toogleGroup').click(() => {
    options.stack = !options.stack;
    timeline.setOptions(options);
  });
  // Toogle Dead
  $('#toogleDead').click(() => {
    console.log('pre', g);
    g.forEach(f => {
      if (f.age < 0) {
        f.visible = !f.visible;
      }
      return f;
    });
    console.log('post', g);
    const groups = new vis.DataSet(g);
    timeline.setGroups(groups);
  });

  // Today
  $('#today').click(() => {
    const [start, end] = getRange(today);
    options.start = start;
    options.end = end;
    timeline.setOptions(options);
  });
  // Week
  $('#week').click(() => {
    range = 'week';
    $('#today').click();
  });
  // Month
  $('#month').click(() => {
    range = 'month';
    $('#today').click();
  });
  // Year
  $('#year').click(() => {
    range = 'year';
    $('#today').click();
  });

  return timeline;
};

function duration(first, second) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
  const start = new Date(first);
  const end = new Date(second);
  return Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
}

function getRange(today) {
  const y = today.getFullYear(); // Current year
  const m = today.getMonth(); // Current month
  let start;
  let end;
  switch (range) {
    case 'year':
      start = new Date(y, 0, 1);
      end = new Date(y, 11, 31);
      break;
    case 'month':
      start = new Date(y, m, 1);
      end = new Date(y, m + 1, 0);
      break;
    case 'week': {
      // Copy date
      const wd = today.getDay(); // Current weekday index
      const d = today.getDate(); // Current day
      start = new Date(today.getTime());
      end = new Date(today.getTime());
      const startShift = d - wd + 1; // Shift for sunday
      const endShift = d - wd + 7; // Shift for saturday
      start.setDate(startShift);
      end.setDate(endShift);
      break;
    }
    default:
  }
  return [start.toISOString(), end.toISOString()];
}
