import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Flex,
  Button,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useSorteio } from "../hooks/useSorteio";

export default function Home() {
  const { initSorteio, sorteio, clearSorteio } = useSorteio();

  const handleAddSortear = (min: number, max: number) => {
    initSorteio(10, 5000);
  };

  return (
    <Flex w="100vm" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={() => {}}
      >
        <Stack spacing="4">
          <pre>{JSON.stringify(sorteio, null, 2)}</pre>
        </Stack>
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
