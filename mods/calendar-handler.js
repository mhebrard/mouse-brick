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
  const res = db.select('SELECT ID, birth, death, sex FROM mice');
  res.forEach((r, i) => {
    g.push({id: r.ID, content: r.ID});
    e.push({id: 'life' + i, start: r.birth, end: r.death || endYear, type: 'background', className: r.sex, group: r.ID});
  });
  const groups = new vis.DataSet(g);

  // Add items to the DataSet
  e.push({id: 0, content: 'blabla', start: '2017-09-22', end: '2017-09-22', group: 'L41 #2'});
  e.push({id: 1, content: 'bloblo', start: '2017-09-20', end: '2017-09-25', group: 'L41 #4'});
  items.add(e);

  const options = {
    // Orientation:'top'
    start: startMonth,
    end: endMonth,
    editable: false,
    stack: false,
    stackSubgroups: true
  };

  function toggleStackSubgroups() {
      options.stackSubgroups = !options.stackSubgroups;
      timeline.setOptions(options);
  }

  const timeline = new vis.Timeline(container, items, groups, options);
};
