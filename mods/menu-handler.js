/* global $:true */
const calendar = require('./calendar-handler');
const event = require('./event-handler');
const micelist = require('./mice-list-handler');
const mouseinfo = require('./mouse-info-handler')

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

  // Include mice list
  $('#mice').click(() => {
    console.log('Mice List clicked');
    $('#content').load('./mods/mice-list.html', micelist.load);
  });

  // Select
  $('#info').click(() => {
    console.log('Mouse Info clicked');
    $('#content').load('./mods/mouse-info.html', mouseinfo.load);
  });
};
