import { notifications } from "@mantine/notifications";
import type { jsonDataClear } from "../types/krs";

export function AddSelectedMK(
    selectedMk: jsonDataClear,
) {
    const prevData = localStorage.getItem("dataSelectedMK");
    const dataSelectedMK: jsonDataClear[] = prevData
        ? JSON.parse(prevData)
        : [];
    const isAlreadySelected = dataSelectedMK.some(
        (item) => item.No === selectedMk.No,
    );
    const hasScheduleConflict = dataSelectedMK.some(
        (item) => item.Jadwal.KodeJam === selectedMk.Jadwal.KodeJam &&
            item.Jadwal.KodeHari === selectedMk.Jadwal.KodeHari,
    );
    if (!isAlreadySelected && !hasScheduleConflict) {
        dataSelectedMK.push(selectedMk);
        localStorage.setItem(
            "dataSelectedMK",
            JSON.stringify(dataSelectedMK),
        );
        notifications.show({
            title: "Berhasil menambahkan MK",
            message: `${selectedMk.MK.Nama} (${selectedMk.MK.Kelas}) telah ditambahkan`,
            color: "green",
        });
        return
    }
    notifications.show({
        title: "Gagal menambahkan MK",
        message: isAlreadySelected
            ? "Mata kuliah ini sudah ada di daftar"
            : "Jadwal bentrok dengan mata kuliah lain",
        color: "red",
    });
}