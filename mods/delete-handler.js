/* global db:true $:true */

module.exports.load = () => {
  const sel = $('#mouse');
  // Request Mice
  const res = db.select('SELECT ID FROM mice ORDER BY ID');
  res.forEach(r => {
    sel.append(`<option>${r.ID}</option>`);
  });

  // Mouse on change
  sel.change(() => {
    const id = $('#mouse option:selected').text();
    let res = db.select(`SELECT * FROM mice WHERE ID="${id}" LIMIT 1`);
    const r = res[0];
    $('#del-info').text(`Born: ${r.birth}, Sex: ${r.sex}, Genotype: ${r.genotype}, Box: ${r.box}`);
    // Events
    const ul = $('#events').empty();
    res = db.select(`SELECT * FROM events WHERE mouse="${id}" ORDER BY day`);
    res.forEach(r => {
      // Add li
      ul.append(`<li id="li-${r.ID}">
        <button type="button" class="btn btn-sm btn-outline-danger" id="e-${r.ID}">X</button>
        <span class="col-sm-10">${r.start} [P${r.day}]: ${r.label} - ${r.desc}</span>
      </li>`);
      // Button click
      $(`#e-${r.ID}`).click(() => {
        console.log('event button click');
        // Del the event
        const str = `DELETE FROM events WHERE ID="${r.ID}"`;
        db.run(str);
        // Remove the li
        $(`#li-${r.ID}`).remove();
      });
    });

    // Delete mouse
    $('#del-mouse').click(() => {
      // Del the mouse
      let str = `DELETE FROM mice WHERE ID="${id}"`;
      db.run(str);
      // Del all related events
      str = `DELETE FROM events WHERE mouse="${id}"`;
      db.run(str);
      $('#delete').click();
    });
  });
};
