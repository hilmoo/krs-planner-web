import { Kbd, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { CodeHighlight } from "@mantine/code-highlight";

export function Tutorial() {
  const [code, setCode] = useState("");

  useEffect(() => {
    fetch("/dumpDataMK.js")
      .then((response) => response.text())
      .then((data) => setCode(data));
  }, []);

  return (
    <>
      <Title order={3}>
        Tutorial mendapatkan file json mata kuliah dari SIMASTER:{" "}
      </Title>
      <Stack gap="xs" pt={"xs"} pl={"md"}>
        <Text>
          1. Buka link SIMASTER{" "}
          <Text
            component="a"
            href="https://simaster.ugm.ac.id/akademik/mhs_kelas_ambil/view"
            target="_blank"
            td="underline"
          >
            Mata Kuliah Ditawarkan
          </Text>{" "}
          (Login di SIMASTER terlebih dahulu)
        </Text>
        <Text>
          2. Buka console browser
          <Stack pl={"md"} gap={0}>
            <div dir="ltr">
              Windows: <Kbd>Shift</Kbd> + <Kbd>CTRL</Kbd> + <Kbd>J</Kbd>
            </div>
            <div dir="ltr">
              Mac: <Kbd>Option</Kbd> + <Kbd>⌘</Kbd> + <Kbd>J</Kbd>
            </div>
          </Stack>
        </Text>
        <Text>3. Paste kode berikut ke console</Text>
        <CodeHighlight
          language="js"
          code={code}
          copyLabel="Copy button code"
          copiedLabel="Copied!"
        />
        <Text>4. Tekan Enter, file akan otomatis terdownload</Text>
      </Stack>
    </>
  );
}
