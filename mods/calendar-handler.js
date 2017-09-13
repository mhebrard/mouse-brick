/* global db:true */
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
    g.push({id: r.ID, content: r.ID});
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
    stackSubgroups: true,
    tooltip: {
      followMouse: true
    }
  };

  function toggleStackSubgroups() {
      options.stackSubgroups = !options.stackSubgroups;
      timeline.setOptions(options);
  }

  const timeline = new vis.Timeline(container, items, groups, options);
};
