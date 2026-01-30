import { Kbd, Stack, Text, Title } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";

const jsCode = `
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

  const jsonStr = JSON.stringify({ mataKuliah }, null, 2);
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
`;

export function Tutorial() {
  return (
    <>
      <Title order={3}>
        Tutorial mendapatkan file json mata kuliah dari SIMASTER:
      </Title>
      <Stack gap="xs" pt={"xs"} pl={"md"}>
        <Text>
          1. Buka link SIMASTER{" "}
          <Text
            component="a"
            href="https://simaster.ugm.ac.id/akademik/mhs_kelas_ambil/view"
            target="_blank"
            td="underline"
          >
            Mata Kuliah Ditawarkan
          </Text>{" "}
          (Login di SIMASTER terlebih dahulu)
        </Text>
        <Text>
          2. Buka console browser
          <Stack pl="md" gap="xs">
            <div dir="ltr">
              <strong>Chrome / Edge / Opera</strong>
              <div>
                Windows / Linux: <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> +
                <Kbd>J</Kbd>
              </div>
              <div>
                Mac: <Kbd>⌘</Kbd> + <Kbd>Option</Kbd> + <Kbd>J</Kbd>
              </div>
            </div>

            <div dir="ltr">
              <strong>Firefox</strong>
              <div>
                Windows / Linux: <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> +
                <Kbd>K</Kbd>
              </div>
              <div>
                Mac: <Kbd>⌘</Kbd> + <Kbd>Option</Kbd> + <Kbd>K</Kbd>
              </div>
            </div>

            <div dir="ltr">
              <strong>Safari</strong>
              <div>
                Mac: <Kbd>⌘</Kbd> + <Kbd>Option</Kbd> + <Kbd>C</Kbd>
              </div>
              <small>(Aktifkan menu “Develop” terlebih dahulu)</small>
            </div>
          </Stack>
        </Text>
        <Text>3. Paste kode berikut ke console</Text>
        <CodeHighlight
          language="js"
          code={jsCode}
          copyLabel="Copy button code"
          copiedLabel="Copied!"
        />
        <Text>4. Tekan Enter, file akan otomatis terdownload</Text>
      </Stack>
    </>
  );
}
