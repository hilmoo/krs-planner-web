import { Table, UnstyledButton, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import type { jsonDataClear } from "../types/krs";
import { useForceUpdate } from "@mantine/hooks";

const Jadwal = ["07:00-09:30", "09:30-12:00", "13:00-15:00", "15:30-18:00"];

function getAllSelectedMK(): jsonDataClear[] {
  const data = localStorage.getItem("dataSelectedMK") || "[]";
  return JSON.parse(data);
}

function removeSelectedMK(
  kodeHari: number,
  kodeJam: number,
  courseCode?: string
) {
  const data = getAllSelectedMK();
  const updatedData = data.filter((item) => {
    if (kodeHari === 0 && kodeJam === 0 && courseCode) {
      return item.MK.Kode !== courseCode;
    }
    return !(
      item.Jadwal.KodeHari === kodeHari && item.Jadwal.KodeJam === kodeJam
    );
  });
  localStorage.setItem("dataSelectedMK", JSON.stringify(updatedData));
}

function findCourseBySlot(
  selectedData: jsonDataClear[],
  kodeHari: number,
  kodeJam: number
) {
  return selectedData.find(
    (item) =>
      item.Jadwal.KodeHari === kodeHari && item.Jadwal.KodeJam === kodeJam
  );
}

function getSpecialCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => item.Jadwal.KodeHari === 0 && item.Jadwal.KodeJam === 0
  );
}

function getScheduledCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => !(item.Jadwal.KodeHari === 0 && item.Jadwal.KodeJam === 0)
  );
}

function getCourseDisplay(course: jsonDataClear | undefined) {
  if (!course) return "";
  return `${course.MK.Nama} (${course.MK.Kelas})`;
}

function sksView(selectedData: jsonDataClear[]) {
  return selectedData.reduce((total, item) => total + item.SKS, 0);
}

type TableTopProps = {
  rerender: string;
};

export function TableTop({ rerender }: TableTopProps) {
  const [updatedData, setUpdatedData] = useState<jsonDataClear[]>([]);
  const [totalSKS, setTotalSKS] = useState(0);
  const forceUpdate = useForceUpdate();

  function getSKS() {
    const payload = getAllSelectedMK();
    return sksView(payload);
  }

  function fetchData() {
    const result = getAllSelectedMK();
    setUpdatedData(result);
    const resultsks = getSKS();
    setTotalSKS(resultsks);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  function handleRemove(
    kodeHari: number,
    kodeJam: number,
    courseCode?: string
  ) {
    removeSelectedMK(kodeHari, kodeJam, courseCode);
    fetchData();
    forceUpdate();
  }

  const rows = [1, 2, 3, 4].map((kodeJam) => (
    <Table.Tr key={kodeJam} h={50}>
      <Table.Td>{Jadwal[kodeJam - 1]}</Table.Td>
      {[1, 2, 3, 4, 5, 6].map((kodeHari) => {
        const scheduledCourses = getScheduledCourses(updatedData);
        const course = findCourseBySlot(scheduledCourses, kodeHari, kodeJam);
        const displayText = getCourseDisplay(course);

        return (
          <Table.Td key={kodeHari}>
            <UnstyledButton onClick={() => handleRemove(kodeHari, kodeJam)}>
              {displayText}
            </UnstyledButton>
          </Table.Td>
        );
      })}
    </Table.Tr>
  ));

  const specialCourses = getSpecialCourses(updatedData);

  return (
    <>
      <Table.ScrollContainer minWidth={900}>
        <Table highlightOnHover withTableBorder layout="fixed">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Jam</Table.Th>
              <Table.Th>Senin</Table.Th>
              <Table.Th>Selasa</Table.Th>
              <Table.Th>Rabu</Table.Th>
              <Table.Th>Kamis</Table.Th>
              <Table.Th>Jumat</Table.Th>
              <Table.Th>Sabtu</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {specialCourses.map((course, index) => (
        <div key={index}>
          <UnstyledButton onClick={() => handleRemove(0, 0, course.MK.Kode)}>
            <Text fw={700}>
              {getCourseDisplay(course)} - {course.SKS} SKS
            </Text>
          </UnstyledButton>
        </div>
      ))}

      <div>Total SKS: {totalSKS}</div>
    </>
  );
}
