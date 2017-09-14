/* global $:true */
const calendar = require('./calendar-handler');
const event = require('./event-handler');
const micelist = require('./mice-list-handler');
const mouseinfo = require('./mouse-info-handler');
const io = require('./export-handler');

module.exports.load = () => {
  // Include calendar
  $('#home').click(() => {
    $('.header > .btn-group > .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#home').removeClass('btn-outline-primary').addClass('btn-primary');
    $('#content').load('./mods/calendar.html', calendar.load);
  });
  // Init
  $('#home').click();

  // Include event
  $('#event').click(() => {
    console.log('New Event clicked');
    $('.header > .btn-group > .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#event').removeClass('btn-outline-primary').addClass('btn-primary');
    $('#content').load('./mods/event.html', event.load);
  });

  // Include mice list
  $('#mice').click(() => {
    console.log('Mice List clicked');
    $('.header > .btn-group > .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#mice').removeClass('btn-outline-primary').addClass('btn-primary');
    $('#content').load('./mods/mice-list.html', micelist.load);
  });

  // Include mouse info
  $('#info').click(() => {
    console.log('Mouse Info clicked');
    $('.header > .btn-group > .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#info').removeClass('btn-outline-primary').addClass('btn-primary');
    $('#content').load('./mods/mouse-info.html', mouseinfo.load);
  });

  // Inclide export
  $('#export').click(() => {
    console.log('Export clicked');
    $('.header > .btn-group > .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#export').removeClass('btn-outline-primary').addClass('btn-primary');
    $('#content').load('./mods/export.html', io.load);
  });
};
