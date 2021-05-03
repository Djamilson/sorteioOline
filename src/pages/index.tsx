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
    clearSorteioFile,
    sorteioFile,
  } = useSorteio();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddSortear = (min: number, max: number) => {
    initSorteio(1, 122880);
  };
  const toast = useToast();

  function toObject(pairs) {
    return Array.from(pairs).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }
  const [uploadedFileContents, setUploadedFileContents] = useState(null);
  const [waitingForFileUpload, setWaitingForFileUpload] = useState<boolean>(
    false
  );

  const readUploadedFileAsText = (inputFile) => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };

  const uploadFile = async (e) => {
    e.persist();
    setIsLoading(true);

    let files = e.target.files;

    const type = files[0].type.trim().split("/");

    if (!e.target || !files) {
      return;
    }

    setWaitingForFileUpload(true);

    // const fileList = event.target.files;

    // Uploads will push to the file input's `.files` array. Get the last uploaded file.
    const latestUploadedFile = files.item(files.length - 1);

    try {
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
      }
      {
        const fileContents = await readUploadedFileAsText(latestUploadedFile);

        let testData = [];
        let splitList = fileContents
          .toString()
          .split(/s*;s*/)
          .toString()
          .split("\n");

        for await (const k of splitList) {
          testData.push(k.split(" "));
        }

        const array = [];
        let sum = 0;
        Object.entries(toObject(testData)).forEach(([key, value]) => {
          sum++;
          array.push({ id: sum, name: key, email: value });
        });

        trataFile(array);

        setWaitingForFileUpload(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setWaitingForFileUpload(false);
      setIsLoading(false);
    }
  };

  function handleOnChange(e) {
    e.preventDefault();
    setIsLoading(true);

    clearSorteioFile();
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
        async () => {
          let testData = [];
          let splitList = leitorDeCSV.result
            .toString()
            .split(/s*;s*/)
            .toString()
            .split("\n");

          console.log("leitorDeCSV.result::", leitorDeCSV.result);
          console.log("leitorDeCSV.result::", leitorDeCSV.result.toString);
          for await (const k of splitList) {
            testData.push(k.split(" "));
          }
          /*
          for (let i = 0; i < splitList.length; i++) {
            testData.push(splitList[i].split(" "));
          }*/

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
              onChange={(e) => uploadFile(e)}
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
          {/* <pre>{JSON.stringify(sorteioFile, null, 2)}</pre>
          <pre>{JSON.stringify(uploadedFileContents, null, 2)}</pre>*/}

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
