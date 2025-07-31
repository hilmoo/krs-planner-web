import type { dataJadwal, dataMK, jsonDataClear, JSONRaw, MataKuliah } from "../types/krs";

function timeKoding(timeStr: string): number {
    if (!timeStr || typeof timeStr !== 'string') {
        return 0;
    }

    const timeCodeMap = new Map<string, number>([
        ["07:00", 1],
        ["09:30", 2],
        ["13:00", 3],
        ["15:30", 4],
        ["18:00", 5]
    ]);

    const startTime = timeStr.split("-")[0]?.trim();
    return timeCodeMap.get(startTime) ?? 0;
}

function hariKoding(hariStr: string): number {
    if (!hariStr || typeof hariStr !== 'string') {
        return 0;
    }

    const hariMap = new Map<string, number>([
        ["Senin", 1],
        ["Selasa", 2],
        ["Rabu", 3],
        ["Kamis", 4],
        ["Jumat", 5],
        ["Sabtu", 6]
    ]);

    return hariMap.get(hariStr) ?? 0;
}

export async function handleImportDataMk(data: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsText(data);
        reader.onload = async (event) => {
            if (event.target?.result) {
                try {
                    const regexMK = /^(\S+)\s+(.+?)\s+Kelas:\s*(\S+)$/;
                    const raw: JSONRaw = JSON.parse(
                        event.target.result as string,
                    );

                    const mataKuliah = raw.mataKuliah;

                    const jsonClear: jsonDataClear[] = mataKuliah.map((item: MataKuliah) => {
                        const matchResult = (item)["Mata Kuliah"].match(regexMK);
                        const [, Kode, Nama, Kelas] = matchResult ? matchResult : [undefined, "", "", ""];

                        const jadwalParts = item.Jadwal ? item.Jadwal.split(", ") : ["", ""];
                        const hari = jadwalParts[0] || "";
                        const jam = jadwalParts[1] || "";

                        const jadwal: dataJadwal = {
                            Hari: hari,
                            Jam: jam,
                            KodeJam: timeKoding(jam),
                            KodeHari: hariKoding(hari),
                        };

                        const mk: dataMK = {
                            Kode: Kode ? Kode.trim() : "",
                            Nama: Nama.trim(),
                            Kelas: Kelas.trim(),
                        };

                        return {
                            No: parseInt(item.No),
                            MK: mk,
                            SKS: parseInt(item.SKS),
                            Sem: item.Semester === "" ? 0 : parseInt(item.Semester),
                            Prasyarat: item.Prasyarat,
                            Dosen: item.Dosen ?
                                item.Dosen
                                    .split(/(?=\d+\.)/)
                                    .map(d => d.replace(/^\d+\.\s*/, '').trim())
                                    .filter(d => d.length > 0)
                                : [],
                            Jadwal: jadwal
                        };
                    });

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