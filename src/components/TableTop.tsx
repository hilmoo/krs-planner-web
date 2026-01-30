import { Table, UnstyledButton, Text, Box } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import type { jsonDataClear } from "../types/krs";
import { useForceUpdate } from "@mantine/hooks";

const TIME_SLOTS = [
  "07:00-09:30",
  "09:30-12:00",
  "12:00-13:00",
  "13:00-15:30",
  "15:30-18:00",
];

function getAllSelectedMK(): jsonDataClear[] {
  const data = localStorage.getItem("dataSelectedMK") || "[]";
  return JSON.parse(data);
}

function removeSelectedMK(
  kodeHari: number,
  jamSlot: string,
  courseCode?: string,
) {
  const data = getAllSelectedMK();
  const updatedData = data.filter((item) => {
    if (kodeHari === 0 && jamSlot === "" && courseCode) {
      return item.MK.Kode === courseCode;
    }
    return !(item.Jadwal.KodeHari === kodeHari && item.Jadwal.Jam === jamSlot);
  });
  localStorage.setItem("dataSelectedMK", JSON.stringify(updatedData));
}

function getSpecialCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => item.Jadwal.KodeHari === 0 && item.Jadwal.Jam === "",
  );
}

function getScheduledCourses(selectedData: jsonDataClear[]) {
  return selectedData.filter(
    (item) => !(item.Jadwal.KodeHari === 0 && item.Jadwal.Jam === ""),
  );
}

function getCourseDisplay(course: jsonDataClear | undefined) {
  if (!course) return "";
  return `${course.MK.Nama} (${course.MK.Kelas})`;
}

function sksView(selectedData: jsonDataClear[]) {
  return selectedData.reduce((total, item) => total + item.SKS, 0);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function getTimeSlotSpan(courseTime: string): { start: number; span: number } {
  const [startTime, endTime] = courseTime.split("-");
  if (!startTime || !endTime) return { start: -1, span: 1 };

  const startMinutes = timeToMinutes(startTime.trim());
  const endMinutes = timeToMinutes(endTime.trim());

  let startSlot = -1;
  let endSlot = -1;

  TIME_SLOTS.forEach((slot, index) => {
    const [slotStart, slotEnd] = slot.split("-");
    const slotStartMin = timeToMinutes(slotStart || "");
    const slotEndMin = timeToMinutes(slotEnd || "");

    if (startMinutes >= slotStartMin && startMinutes < slotEndMin) {
      if (startSlot === -1) startSlot = index;
    }
    if (endMinutes > slotStartMin && endMinutes <= slotEndMin) {
      endSlot = index;
    }
  });

  if (startSlot === -1) return { start: -1, span: 1 };
  const span = endSlot === -1 ? 1 : Math.max(1, endSlot - startSlot + 1);
  return { start: startSlot, span };
}

function findCoursesBySlot(
  selectedData: jsonDataClear[],
  kodeHari: number,
  slotIndex: number,
): jsonDataClear[] {
  return selectedData.filter((item) => {
    if (item.Jadwal.KodeHari !== kodeHari) return false;
    const { start, span } = getTimeSlotSpan(item.Jadwal.Jam);
    return slotIndex >= start && slotIndex < start + span;
  });
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
    courseCode?: string,
  ) {
    removeSelectedMK(kodeHari, jamSlot, courseCode);
    fetchData();
    forceUpdate();
  }

  const scheduledCourses = getScheduledCourses(updatedData);
  const renderedCells = new Set<string>();

  const rows = TIME_SLOTS.map((timeSlot, slotIndex) => (
    <Table.Tr key={timeSlot}>
      <Table.Td style={{ width: "120px" }}>
        <Text size="xs" fw={500}>
          {timeSlot}
        </Text>
      </Table.Td>
      {[1, 2, 3, 4, 5, 6].map((kodeHari) => {
        const cellKey = `${kodeHari}-${slotIndex}`;

        if (renderedCells.has(cellKey)) {
          return null;
        }

        const courses = findCoursesBySlot(
          scheduledCourses,
          kodeHari,
          slotIndex,
        );

        if (courses.length === 0) {
          return <Table.Td key={kodeHari} />;
        }

        const firstCourse = courses[0];
        const { start, span } = getTimeSlotSpan(firstCourse.Jadwal.Jam);

        if (start !== slotIndex) {
          return null;
        }

        for (let i = 0; i < span; i++) {
          renderedCells.add(`${kodeHari}-${slotIndex + i}`);
        }

        return (
          <Table.Td
            key={kodeHari}
            rowSpan={span}
            style={{ verticalAlign: "top", padding: "4px" }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                maxHeight: span > 1 ? "160px" : "80px",
                overflowY: "auto",
              }}
            >
              {courses.map((course) => (
                <UnstyledButton
                  key={course.No}
                  onClick={() => handleRemove(kodeHari, course.Jadwal.Jam)}
                  style={{
                    width: "100%",
                    backgroundColor: "var(--mantine-color-blue-light)",
                    borderRadius: "4px",
                    border: "1px solid var(--mantine-color-blue-outline)",
                  }}
                >
                  <Box p="xs">
                    <Text size="xs" fw={700} lineClamp={2}>
                      {getCourseDisplay(course)}
                    </Text>
                    <Text size="10px" c="dimmed">
                      {course.Jadwal.Jam}
                    </Text>
                  </Box>
                </UnstyledButton>
              ))}
            </Box>
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
              <Table.Th style={{ width: "120px" }}>Jam</Table.Th>
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

      {specialCourses.length > 0 && (
        <Box mt="md">
          <Text fw={700} mb="xs">
            Mata Kuliah Tanpa Jadwal Tetap:
          </Text>
          {specialCourses.map((course, index) => (
            <Box key={index} mb="xs">
              <UnstyledButton
                onClick={() => handleRemove(0, "", course.MK.Kode)}
              >
                <Text fw={700}>
                  {getCourseDisplay(course)} - {course.SKS} SKS
                </Text>
              </UnstyledButton>
            </Box>
          ))}
        </Box>
      )}

      <Box mt="md">
        <Text fw={700}>Total SKS: {totalSKS}</Text>
      </Box>
    </>
  );
}
