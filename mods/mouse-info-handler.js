/* global db:true $:true */

module.exports.load = () => {
  const today = new Date();
  // Request Mice
  const sel = $('#mouse');
  const res = db.select('SELECT ID FROM mice');
  res.forEach(r => {
    sel.append(`<option>${r.ID}</option>`);
  });

  // Select on change
  sel.change(() => {
    const id = $('#mouse option:selected').text();
    let res = db.select(`SELECT * FROM mice WHERE ID="${id}" LIMIT 1`);
    console.log(res);
    const r = res[0];
    const valid = r.validated === 1 ? 'validated' : 'non validate';
    $('#info-age').text(`P${duration(r.birth, today)}`);
    $('#info-box').text(r.box);
    $('#info-sex').text(r.sex);
    $('#info-genotype').text(`${r.genotype} [${valid}]`);
    $('#info-mother').text(r.mother);
    $('#info-father').text(r.father);
    $('#info-birth').text(r.birth);
    $('#info-death').text(r.death);
    // Events
    const ul = $('#info-events').empty();
    res = db.select(`SELECT * FROM events WHERE mouse="${id}" ORDER BY day`);
    console.log(res);
    res.forEach(r => {
      ul.append(`<li>${r.start} [P${r.day}]: ${r.label} - ${r.desc}</li>`);
    });
  });
};

function duration(first, second) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
  const start = new Date(first);
  const end = new Date(second);
  return Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
}
