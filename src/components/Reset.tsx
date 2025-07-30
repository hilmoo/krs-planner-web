import { Button, Flex } from "@mantine/core";
import MaterialSymbolsDeviceResetRounded from "~icons/material-symbols/device-reset-rounded";

async function resetHandler() {
  localStorage.removeItem("dataMK");
  localStorage.removeItem("dataSelectedMK");
  window.location.reload();
}

export function Reset() {
  return (
    <>
      <Flex justify="flex-end" pb={"xl"}>
        <Button
          rightSection={<MaterialSymbolsDeviceResetRounded />}
          color="red"
          onClick={resetHandler}
        >
          Reset Data
        </Button>
      </Flex>
    </>
  );
}
