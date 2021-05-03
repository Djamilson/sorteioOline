import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Flex,
  Button,
  Stack,
  Text,
  Link as ChakraLink,
  SimpleGrid,
  VStack,
  useToast,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useSorteio } from "../hooks/useSorteio";

export default function Home() {
  const {
    initSorteio,
    sorteio,
    clearSorteio,
    trataFile,
    sorteioFile,
  } = useSorteio();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddSortear = (min: number, max: number) => {
    initSorteio(1, 10);
  };
  const toast = useToast();

  function toObject(pairs) {
    return Array.from(pairs).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }

  function handleOnChange(e) {
    e.preventDefault();
    setIsLoading(true);
    let files = e.target.files;

    const type = files[0].type.trim().split("/");

    if (
      type[0] === "image" ||
      type[0] === "audio" ||
      type[0] === "video" ||
      type[1] === "vnd.octet-stream" ||
      type[1] === "vnd.postscript" ||
      type[1] === "vnd.ms-powerpoint"
    ) {
      setIsLoading(false);
      toast({
        title: "Erro ao selecionar o arquivo.",
        description:
          "Arquivo não suportado ou  erro no arquivo, tente novamente!",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    } else {
      let leitorDeCSV = new FileReader();
      leitorDeCSV.readAsText(files[0]);

      const array = [];

      //array.push(JSON.parse(line));

      leitorDeCSV.addEventListener(
        "load",
        () => {
          let testData = [];
          let splitList = leitorDeCSV.result
            .toString()
            .split(/s*;s*/)
            .toString()
            .split("\n");

          for (let i = 0; i < splitList.length; i++) {
            //let object = Object.assign(...array.map((v) => ({ [v]: v })));
            const el = splitList[i].split(" ").map((v, ind) => {
              if (ind === 0) {
                return { name: v };
              } else {
                return { email: v };
              }
            });

            testData.push(splitList[i].split(" "));
          }

          let sum = 0;
          Object.entries(toObject(testData)).forEach(([key, value]) => {
            sum++;
            array.push({ id: sum, name: key, email: value });
          });

          trataFile(array.filter((user) => user.name !== ""));
        },
        false
      );
    }

    toast({
      title: "Sucesso.",
      description:
        "Arquivo carregado com sucesso, agora prossiga com o sorteio!",
      status: "success",
      duration: 3000,
      position: "top-right",
      isClosable: true,
    });

    setIsLoading(false);
    return;
  }

  return (
    <Flex w="100vm" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        mt={450}
        borderRadius={8}
        flexDir="column"
        onSubmit={() => {}}
      >
        <VStack spacing="8">
          {isLoading && <Spinner size="sm" color="gray.500" ml="4" />}

          <SimpleGrid
            minChildWidth="240px"
            spacing={["6", "8"]}
            mt="10"
            w="100%"
          >
            <Input
              type="file"
              name="file"
              onChange={(e) => handleOnChange(e)}
              accept=".csv, .xls, .xlsx, text/csv, text/plain, application/csv,
text/comma-separated-values, application/csv, application/excel,
application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </SimpleGrid>
        </VStack>

        <Button
          type="button"
          onClick={() => handleAddSortear(10, 3000)}
          mt="6"
          size="lg"
          colorScheme="pink"
        >
          Iniciar Sorteio
        </Button>

        <Button
          type="button"
          onClick={clearSorteio}
          mt="6"
          size="lg"
          colorScheme="pink"
        >
          Limpar sorteados{" "}
        </Button>
        <Link href="/new/ecount" passHref>
          <Text textAlign="center" fontSize="sm" color="gray.300" marginTop={6}>
            Esqueceu a senha?{" "}
            <ChakraLink
              color="purple.600"
              fontWeight="bold"
              _hover={{ color: "purple.500" }}
            >
              Recupera
            </ChakraLink>
          </Text>
        </Link>

        <Stack spacing="4">
          <pre>{JSON.stringify(sorteio, null, 2)}</pre>
        </Stack>
        <Flex alignItems="center">
          <Text fontSize="sm">Ou entre com</Text>
          <Button
            height="50px"
            flex="1"
            backgroundColor="gray.600"
            marginLeft={6}
            borderRadius="sm"
            _hover={{ backgroundColor: "purple.500" }}
          >
            GITHUB
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
