import { notifications } from "@mantine/notifications";
import type { jsonDataClear } from "../types/krs";

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function hasTimeOverlap(time1: string, time2: string): boolean {
  if (!time1 || !time2 || time1 === "" || time2 === "") {
    return false;
  }

  const [start1Str, end1Str] = time1.split("-").map((s) => s.trim());
  const [start2Str, end2Str] = time2.split("-").map((s) => s.trim());

  if (!start1Str || !end1Str || !start2Str || !end2Str) {
    return false;
  }

  const start1 = parseTime(start1Str);
  const end1 = parseTime(end1Str);
  const start2 = parseTime(start2Str);
  const end2 = parseTime(end2Str);

  return start1 < end2 && start2 < end1;
}

export function AddSelectedMK(selectedMk: jsonDataClear) {
  const prevData = localStorage.getItem("dataSelectedMK");
  const dataSelectedMK: jsonDataClear[] = prevData ? JSON.parse(prevData) : [];
  const isAlreadySelected = dataSelectedMK.some(
    (item) => item.No === selectedMk.No
  );
  const hasScheduleConflict = dataSelectedMK.some(
    (item) =>
      item.Jadwal.KodeHari === selectedMk.Jadwal.KodeHari &&
      hasTimeOverlap(item.Jadwal.Jam, selectedMk.Jadwal.Jam)
  );
  notifications.clean();
  if (!isAlreadySelected && !hasScheduleConflict) {
    dataSelectedMK.push(selectedMk);
    localStorage.setItem("dataSelectedMK", JSON.stringify(dataSelectedMK));
    notifications.show({
      title: "Berhasil menambahkan MK",
      message: `${selectedMk.MK.Nama} (${selectedMk.MK.Kelas}) telah ditambahkan`,
      color: "green",
    });
    return;
  }
  notifications.show({
    title: "Gagal menambahkan MK",
    message: isAlreadySelected
      ? "Mata kuliah ini sudah ada di daftar"
      : "Jadwal bentrok dengan mata kuliah lain",
    color: "red",
  });
}
