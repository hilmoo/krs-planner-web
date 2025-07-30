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
      const hourValue = parseInt(filHour);
      results = results.filter((item) => item.Jadwal.KodeJam === hourValue);
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
        {data.Jadwal.KodeJam !== 0 && `${data.Jadwal.Hari}, ${data.Jadwal.Jam}`}
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
    <ScrollArea h={400}>
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
