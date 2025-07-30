import { Container, FileInput, Space, Text, Title } from "@mantine/core";
import { handleImportDataMk } from "../repository/dataMk";
import { Tutorial } from "./Tutorial";
import MaterialSymbolsFileJsonOutline from "~icons/material-symbols/file-json-outline";

export function Welcome() {
  return (
    <>
      <Title ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          KRS Planner SIMASTER
        </Text>
      </Title>
      <Text ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Untuk memulai, import json mata kuliah
      </Text>
      <Container size="xs">
        <FileInput
          onChange={(data) => {
            if (data) {
              handleImportDataMk(data);
              window.location.reload();
            }
          }}
          leftSection={<MaterialSymbolsFileJsonOutline />}
          label="File Json Mata Kuliah"
          placeholder="Pilih file json"
          rightSectionPointerEvents="none"
          mt="md"
          accept="application/json"
        />
      </Container>
      <Space h={"xl"} />
      <Container>
        <Tutorial />
      </Container>
    </>
  );
}
