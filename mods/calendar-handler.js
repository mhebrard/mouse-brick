/* global $:true db:true */
const vis = require('vis');

module.exports.load = () => {
  console.log('calendar handler');
  // Get container
  const container = document.getElementById('calendar');
  // Specify date format
  const items = new vis.DataSet({
    type: {start: 'ISODate', end: 'ISODate'}
  });
  // Groups and events
  const g = [];
  const e = [];
  const today = new Date(); // Today
  const y = today.getFullYear(); // Current year
  const m = today.getMonth(); // Current month
  const startMonth = new Date(y, m, 1).toISOString();
  const endMonth = new Date(y, m + 1, 0).toISOString();
  const endYear = new Date(y, 11, 31).toISOString();
  // Get Mices
  let res = db.select('SELECT ID, birth, death, sex FROM mice');
  res.forEach((r, i) => {
    const age = r.death ? -1 : duration(r.birth, today);
    g.push({id: r.ID, content: r.ID, title: `age: ${age < 0 ? 'dead' : 'P' + age}`, age});
    e.push({id: 'life' + i, start: r.birth, end: r.death || endYear, type: 'background', className: r.sex, group: r.ID});
  });
  const groups = new vis.DataSet(g);

  // Get Events
  res = db.select('SELECT * FROM events');
  res.forEach(r => {
    e.push({id: r.ID, content: r.label, start: r.start, end: null, group: r.mouse, title: `(P${r.day}) ${r.desc}`});
  });
  items.add(e);

  const options = {
    // Orientation:'top'
    start: startMonth,
    end: endMonth,
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

  // Toogle
  $('#toogleGroup').click(() => {
    options.stack = !options.stack;
    timeline.setOptions(options);
  });

  return timeline;
};

function duration(first, second) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
  const start = new Date(first);
  const end = new Date(second);
  return Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
}
