/* global db:true $:true */
const calendar = require('./calendar-handler.js');
const event = require('./event-handler.js');
const addmouse = require('./addmouse-handler.js');

module.exports.load = () => {
  // Include calendar
  $('#home').click(() => {
    console.log('Calendar clicked');
    $('#content').load('./mods/calendar.html', calendar.load);
  });
  // Init
  $('#home').click();

  // Include event
  $('#event').click(() => {
    console.log('New Event clicked');
    $('#content').load('./mods/event.html', event.load);
  });

  // Include add mouse form + handler
  $('#add').click(() => {
    console.log('Add mouse clicked');
    $('#content').load('./mods/addmouse-form.html', addmouse.load);
  });

  // Select
  $('#select').click(() => {
    console.log('select clicked');
    console.log('mice', db.select('SELECT * from mice'));
    console.log('events', db.select('SELECT * from events'));
  });
};
