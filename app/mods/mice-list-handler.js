/* global db:true $:true */

module.exports.load = () => {
  const today = new Date();
  // Request Mice
  const res = db.select('SELECT * FROM mice');
  // Add mice in table
  const tbody = $('#miceList > tbody');
  res.forEach(r => {
    const days = r.death ? '<i>dead</i>' : `P${duration(r.birth, today)}`;
    const valid = r.validated === 1;
    tbody.append(`<tr>
      <td>${r.ID}</td>
      <td>${days}</td>
      <td>${r.box}</td>
      <td>${r.sex}</td>
      <td>${r.genotype}</td>
      <td>${valid}</td>
      <td>${r.mother}</td>
      <td>${r.father}</td>
      <td>${r.birth}</td>
      <td>${r.death}</td>
      </tr>`);
  });
  // Initiate dataTable
  $(document).ready(() => {
    const table = $('#miceList').DataTable();
    table.order([1, 'desc']).draw(); // Order by age
  });
};

function duration(first, second) {
  const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
  const start = new Date(first);
  const end = new Date(second);
  return Math.round(Math.abs((start.getTime() - end.getTime()) / (oneDay)));
}
