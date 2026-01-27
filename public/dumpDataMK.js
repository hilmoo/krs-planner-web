function dumpMataKuliah(filename = "MK_dump.json") {
  var mataKuliah = [];
  var headersText = [];
  var $headers = $("th");

  $("tbody tr").each(function (index) {
    var $cells = $(this).find("td");
    mataKuliah[index] = {};

    $cells.each(function (cellIndex) {
      if (headersText[cellIndex] === undefined) {
        headersText[cellIndex] = $($headers[cellIndex]).text().trim();
      }
      var cellText = $(this).text().replace(/\s+/g, " ").trim();
      mataKuliah[index][headersText[cellIndex]] = cellText;
    });
  });

  var myObj = { mataKuliah };

  const jsonStr = JSON.stringify(myObj, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

dumpMataKuliah();
