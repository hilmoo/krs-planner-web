import { Table, UnstyledButton, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import type { jsonDataClear } from "../types/krs";
import { useForceUpdate } from "@mantine/hooks";

function getAllSelectedMK(): jsonDataClear[] {
  const data = localStorage.getItem("dataSelectedMK") || "[]";
  return JSON.parse(data);
}

function removeSelectedMK(
  kodeHari: number,
  jamSlot: string,
  courseCode?: string
) {
  const data = getAllSelectedMK();
  const updatedData = data.filter((item) => {
    if (kodeHari === 0 && jamSlot === "" && courseCode) {
      return item.MK.Kode !== courseCode;
    }
    return !(item.Jadwal.KodeHari === kodeHari && item.Jadwal.Jam === jamSlot);
  });
  localStorage.setItem("dataSelectedMK", JSON.stringify(updatedData));
}

function findCourseBySlot(
  selectedData: jsonDataClear[],
  kodeHari: number,
  jamSlot: string
) {
  return selectedData.find(
    (item) => item.Jadwal.KodeHari === kodeHari && item.Jadwal.Jam === jamSlot
  );
}

function getSpecialCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => item.Jadwal.KodeHari === 0 && item.Jadwal.Jam === ""
  );
}

function getScheduledCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => !(item.Jadwal.KodeHari === 0 && item.Jadwal.Jam === "")
  );
}

function getUniqueTimeSlots(selectedData: jsonDataClear[]): string[] {
  const scheduledCourses = getScheduledCourses(selectedData);
  const timeSlots = new Set<string>();

  scheduledCourses.forEach((course) => {
    if (course.Jadwal.Jam) {
      timeSlots.add(course.Jadwal.Jam);
    }
  });

  return Array.from(timeSlots).sort((a, b) => {
    const timeA = a.split("-")[0]?.trim() || "";
    const timeB = b.split("-")[0]?.trim() || "";
    return timeA.localeCompare(timeB);
  });
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

  const fetchData = useCallback(() => {
    const result = getAllSelectedMK();
    setUpdatedData(result);
    setTotalSKS(sksView(result));
  }, []);

  useEffect(() => {
    fetchData();
  }, [rerender, fetchData]);

  function handleRemove(
    kodeHari: number,
    jamSlot: string,
    courseCode?: string
  ) {
    removeSelectedMK(kodeHari, jamSlot, courseCode);
    fetchData();
    forceUpdate();
  }

  const timeSlots = getUniqueTimeSlots(updatedData);

  const rows = timeSlots.map((jamSlot) => (
    <Table.Tr key={jamSlot} h={50}>
      <Table.Td>{jamSlot}</Table.Td>
      {[1, 2, 3, 4, 5, 6].map((kodeHari) => {
        const scheduledCourses = getScheduledCourses(updatedData);
        const course = findCourseBySlot(scheduledCourses, kodeHari, jamSlot);
        const displayText = getCourseDisplay(course);

        return (
          <Table.Td key={kodeHari}>
            <UnstyledButton onClick={() => handleRemove(kodeHari, jamSlot)}>
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
          <UnstyledButton onClick={() => handleRemove(0, "", course.MK.Kode)}>
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
