interface dataMK {
  Kode: string;
  Nama: string;
  Kelas: string;
}

interface dataJadwal {
  Hari: string;
  Jam: string;
  KodeJam: number;
  KodeHari: number;
}

export interface jsonDataClear {
  No: number;
  MK: dataMK;
  SKS: number;
  Sem: number;
  Prasyarat: string;
  Dosen: string[];
  Jadwal: dataJadwal;
}

export interface JSONRaw {
  mataKuliah: MataKuliah[];
}

export interface MataKuliah {
  No: string;
  "Mata Kuliah": string;
  SKS: string;
  Semester: string;
  Prasyarat: string;
  Dosen: string;
  Jadwal: string;
}
