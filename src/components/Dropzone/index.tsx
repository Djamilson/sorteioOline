import {
  Flex,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Image,
  Stack,
  Icon,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const reader = new FileReader();

      console.log("=>>>FILE:: ", acceptedFiles);
      //const fileUrl = URL.createObjectURL(file);
      // setSelectedFileUrl(fileUrl);

      let leitorDeCSV = new FileReader();
      leitorDeCSV.readAsText(file);

      console.log("evt.target.result.split", file.result.split("\n"));

      if (file) {
        console.log("=>>>FILE::dfsdfsd ", acceptedFiles);
      }

      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,

    accept: [
      ".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values",
    ],
  });

  const renderDragMessage = useCallback(() => {
    if (!isDragActive) {
      return <>Arraste imagens aqui...</>;
    }

    if (isDragReject) {
      console.log("eroor");
    }

    return <>Solte as imagens aqui</>;
  }, [isDragActive, isDragReject]);

  return (
    <Center h="100%">
      <Flex
        bg="gray.700"
        w={250}
        h={250}
        justify="center"
        align="center"
        p={50}
        m={2}
        borderRadius={5}
        textAlign="center"
        {...getRootProps()}
      >
        <input {...getInputProps()} accept="image/*" />
        {selectedFileUrl ? (
          <Image src={selectedFileUrl} alt="Point thumbnail" />
        ) : (
          <Stack spacing={["10px", "15px"]} direction={"column"}>
            <Center h="100%">
              <Icon as={FiUpload} fontSize="28" />
            </Center>

            <Text>Selecione a imagem</Text>
          </Stack>
        )}
      </Flex>
      {(error || message) && (
        <Alert
          status={error ? "error" : "success"}
          w={250}
          borderRadius={5}
          m={2}
        >
          <AlertIcon />
          <AlertDescription w={200}>{error || message}</AlertDescription>
        </Alert>
      )}
    </Center>
  );
};

export default Dropzone;
