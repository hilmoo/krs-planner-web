import { useToggle } from "@mantine/hooks";
import { TableBottom } from "./components/TableBottom";
import { TableTop } from "./components/TableTop";
import { Welcome } from "./components/Welcome";
import { Center, Container, Space, Text, Title } from "@mantine/core";
import Filter from "./components/Filter";
import { FilterProvider } from "./provider/FilterProvider";
import { Reset } from "./components/Reset";

function App() {
  const data = localStorage.getItem("dataMK");
  const [value, toggle] = useToggle(["render", "rerender"]);

  if (!data) {
    return (
      <Container size="xl" pb={"xl"}>
        <Welcome />
      </Container>
    );
  }
  return (
    <>
      <Container size="xl">
        <FilterProvider>
          <Title>
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: "pink", to: "yellow" }}
            >
              KRS Planner SIMASTER
            </Text>
          </Title>
          <Space h="xl" />
          Klik pada jadwal mata kuliah untuk menghapusnya
          <TableTop rerender={value} />
          <Space h="md" />
          <Filter />
          <Space h="md" />
          <TableBottom trigger={toggle} />
        </FilterProvider>
        <Space h="xl" />
        <Reset />
        <Center py={"lg"}>
          <Text component="a" href="https://github.com/hilmoo/krs-planner-web">
            Source Code
          </Text>
        </Center>
      </Container>
    </>
  );
}

export default App;
