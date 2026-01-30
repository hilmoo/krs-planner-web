import type {
  dataJadwal,
  dataMK,
  jsonDataClear,
  JSONRaw,
  MataKuliah,
} from "../types/krs";

function hariKoding(hariStr: string): number {
  if (!hariStr || typeof hariStr !== "string") {
    return 0;
  }

  const hariMap = new Map<string, number>([
    ["Senin", 1],
    ["Selasa", 2],
    ["Rabu", 3],
    ["Kamis", 4],
    ["Jumat", 5],
    ["Sabtu", 6],
  ]);

  return hariMap.get(hariStr) ?? 0;
}

function parseMultipleJadwal(jadwalStr: string): dataJadwal[] {
  if (!jadwalStr || jadwalStr.trim() === "") {
    return [{ Hari: "", Jam: "", KodeHari: 0 }];
  }

  const dayPattern =
    /(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu),\s*(\d{2}:\d{2}-\d{2}:\d{2})/g;
  const matches = [...jadwalStr.matchAll(dayPattern)];

  if (matches.length === 0) {
    return [{ Hari: "", Jam: "", KodeHari: 0 }];
  }

  return matches.map((match) => ({
    Hari: match[1] || "",
    Jam: match[2] || "",
    KodeHari: hariKoding(match[1] || ""),
  }));
}

export async function handleImportDataMk(data: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsText(data);
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const regexMK = /^(\S+)\s+(.+?)\s+Kelas:\s*(\S+)$/;
          const raw: JSONRaw = JSON.parse(event.target.result as string);

          const mataKuliah = raw.mataKuliah;

          const jsonClear: jsonDataClear[] = mataKuliah.flatMap(
            (item: MataKuliah) => {
              const matchResult = item["Mata Kuliah"].match(regexMK);
              const [, Kode, Nama, Kelas] = matchResult
                ? matchResult
                : [undefined, "", "", ""];

              const jadwalList = parseMultipleJadwal(item.Jadwal);

              const mk: dataMK = {
                Kode: Kode ? Kode.trim() : "",
                Nama: Nama.trim(),
                Kelas: Kelas.trim(),
              };

              const baseData = {
                No: item.No,
                MK: mk,
                SKS: parseInt(item.SKS),
                Sem: item.Semester === "" ? 0 : parseInt(item.Semester),
                Prasyarat: item.Prasyarat,
                Dosen: item.Dosen
                  ? item.Dosen.split(/(?=\d+\.)/)
                      .map((d) => d.replace(/^\d+\.\s*/, "").trim())
                      .filter((d) => d.length > 0)
                  : [],
              };

              return jadwalList.map((jadwal, index) => ({
                ...baseData,
                No: jadwalList.length > 1 ? `${item.No}-${index + 1}` : item.No,
                Jadwal: jadwal,
              }));
            },
          );

          localStorage.setItem("dataMK", JSON.stringify(jsonClear));
          resolve(true);
        } catch {
          reject(
            new Error(
              "Failed to parse JSON file. Make sure it's valid JSON format",
            ),
          );
        }
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(reader.error || new Error("Unknown error"));
    };
  });
}
