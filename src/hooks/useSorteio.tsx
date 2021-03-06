import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useContext,
} from "react";

import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/toast";
interface SorteioProviderProps {
  children: ReactNode;
}

interface SorteioContextData {
  sorteio: any[];
  initSorteio: (min: number, max: number) => void;
  clearSorteio(): void;
  clearSorteioFile(): void;

  trataFile: (file: any) => void;
  sorteioFile: any[];
}

const SorteioContext = createContext<SorteioContextData>(
  {} as SorteioContextData
);

function SorteioProvider({ children }: SorteioProviderProps): JSX.Element {
  const toast = useToast();

  const [sorteio, setSorteio] = useState<any[]>(() => {
    const sortList = Cookies.get("sorteioOlinesorteio");

    if (sortList) {
      return JSON.parse(sortList);
    }

    return [] as any[];
  });

  const [sorteioFile, setSorteioFile] = useState<any[]>(() => {
    const sortListFile = Cookies.get("sorteioOlinesorteioFileEE");

    if (sortListFile) {
      return JSON.parse(sortListFile);
    }

    return [] as any[];
  });

  const clearSorteio = useCallback(() => {
    Cookies.remove("sorteioOlinesorteio");

    setSorteio([] as number[]);
  }, []);

  const clearSorteioFile = useCallback(() => {
    Cookies.remove("sorteioOlinesorteioFileEE");

    setSorteio([] as any[]);
  }, []);

  function randomCustomizado() {
    let possibilidades = [1, 2, 3, 4, 6, 7, 8, 9, 10];
    return possibilidades[Math.floor(Math.random() * possibilidades.length)];
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const initSorteio = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
console.log("sorteioFile.length", sorteioFile.length);
    if (sorteio.length < sorteioFile.length) {
      //console.log("===>>>>randomCustomizado", randomCustomizado());

      let numberSelected = Math.floor(Math.random() * (max - min + 1)) + min;

      let checkSorteio = sorteio.find((user) => user.id === numberSelected);
      //const t = sorteioFile.filter((p) => sorteio.filter((s) => p.id !== s.id));
      //console.log("=>>>>Matriz:: ", t);
      if (checkSorteio && sorteio.length < sorteioFile.length) {
        initSorteio(min, max);
      } else {
        setSorteio([
          ...sorteio,
          sorteioFile.find((user) => user.id === numberSelected),
        ]);
      }
    } else {
      toast({
        title: "Erro ao sortear.",
        description:
          "N??o foi poss??vel fazer o sorteio, j?? foram sorteado todos, tente novamente!",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const trataFile = (file: any) => {
    //clearSorteioFile();
    console.log("MIUIUIUI:::init===============");
    console.log(JSON.stringify(file));
    console.log("MIUIUIUI:::end================");

    setSorteioFile(file);
  };

  return (
    <SorteioContext.Provider
      value={{
        sorteio,
        initSorteio,
        clearSorteio,
        clearSorteioFile,
        trataFile,
        sorteioFile,
      }}
    >
      {children}
    </SorteioContext.Provider>
  );
}

function useSorteio(): SorteioContextData {
  const context = useContext(SorteioContext);

  if (!context) {
    throw new Error("useProduct mus be used within an SorteioProduct");
  }

  return context;
}

export { SorteioProvider, useSorteio };
