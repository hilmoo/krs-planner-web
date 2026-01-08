import { ActionIcon, ScrollArea, Table, Tooltip } from "@mantine/core";
import { matchSorter } from "match-sorter";
import { useMemo, memo, useCallback } from "react";
import type { jsonDataClear } from "../types/krs";
import { useFilter } from "../provider/useFilter";
import MaterialSymbolsAddRounded from "~icons/material-symbols/add-rounded";
import { AddSelectedMK } from "../repository/dataSelectedMk";

type tableProps = {
  trigger: () => void;
};

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

function TableBottom({ trigger }: tableProps) {
  const data: jsonDataClear[] = useMemo(
    () => JSON.parse(localStorage.getItem("dataMK") || "[]"),
    []
  );
  const { search, filSem, filSKS, filDay, filHour } = useFilter();

  const filteredData = useMemo(() => {
    let results = data;

    if (!search && !filSem && !filSKS && !filDay && !filHour) {
      return results;
    }

    if (filSem) {
      const semValue = parseInt(filSem);
      results = results.filter((item) => item.Sem === semValue);
    }

    if (filSKS) {
      const sksValue = parseInt(filSKS);
      results = results.filter((item) => item.SKS === sksValue);
    }

    if (filDay) {
      results = results.filter((item) => item.Jadwal.Hari === filDay);
    }

    if (filHour) {
      results = results.filter((item) =>
        hasTimeOverlap(item.Jadwal.Jam, filHour)
      );
    }

    if (search.trim()) {
      results = matchSorter(results, search, {
        keys: ["MK.*.Nama"],
      });
    }

    return results;
  }, [data, search, filSem, filSKS, filDay, filHour]);

  const handleAddMk = useCallback(
    (mkData: jsonDataClear) => {
      AddSelectedMK(mkData);
      trigger();
    },
    [trigger]
  );

  const rows = filteredData.map((data) => (
    <Table.Tr key={data.No}>
      <Table.Td>
        {data.MK.Nama} ({data.MK.Kode})
        <br />
        Kelas: {data.MK.Kelas}
      </Table.Td>
      <Table.Td>{data.SKS}</Table.Td>
      <Table.Td>{data.Sem}</Table.Td>
      <Table.Td>
        {data.Dosen.filter((dosen) => dosen !== "").map((dosen, i) => (
          <span key={i}>
            {i + 1}. {dosen.slice(0, -1)}
            <br />
          </span>
        ))}
      </Table.Td>
      <Table.Td>
        {data.Jadwal.Jam !== "" && `${data.Jadwal.Hari}, ${data.Jadwal.Jam}`}
      </Table.Td>
      <Table.Td>
        <Tooltip label="Tambah ke daftar KRS">
          <ActionIcon
            variant="filled"
            aria-label="Settings"
            onClick={() => handleAddMk(data)}
          >
            <MaterialSymbolsAddRounded />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={400} type="always">
      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Mata Kuliah</Table.Th>
              <Table.Th>SKS</Table.Th>
              <Table.Th>Semester</Table.Th>
              <Table.Th>Dosen</Table.Th>
              <Table.Th>Jadwal</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </ScrollArea>
  );
}

export const MemoizedTableBottom = memo(TableBottom);
export { MemoizedTableBottom as TableBottom };
