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
} from "@chakra-ui/react";
import { useSorteio } from "../hooks/useSorteio";
import Dropzone from "../components/Dropzone";

export default function Home() {
  const {
    initSorteio,
    sorteio,
    clearSorteio,
    trataFile,
    sorteioFile,
  } = useSorteio();
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleAddSortear = (min: number, max: number) => {
    initSorteio(1, 10);
  };

  function toObject(pairs) {
    return Array.from(pairs).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }

  function handleOnChange(e) {
    e.preventDefault();

    let files = e.target.files;

    //const fileUrl = URL.createObjectURL(file);
    // setSelectedFileUrl(fileUrl);

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

    // Caso file esteja populado
    // dispara a função.
    if (files[0]) {
      // leitorDeCSV.readAsDataURL(files[0]);
      //console.log(leitorDeCSV.readAsDataURL(files[0]));
    }
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
          <SimpleGrid
            minChildWidth="240px"
            spacing={["6", "8"]}
            mt="10"
            w="100%"
          >
            <Dropzone onFileUploaded={setSelectedFile} />
            <input
              type="file"
              name="file"
              onChange={(e) => handleOnChange(e)}
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
