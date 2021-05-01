import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useContext,
} from "react";

import Cookies from "js-cookie";
interface SorteioProviderProps {
  children: ReactNode;
}

interface SorteioContextData {
  sorteio: number[];
  initSorteio: (min: number, max: number) => void;
  clearSorteio(): void;
}

const SorteioContext = createContext<SorteioContextData>(
  {} as SorteioContextData
);

function SorteioProvider({ children }: SorteioProviderProps): JSX.Element {
  const [sorteio, setSorteio] = useState<number[]>(() => {
    const sortList = Cookies.get("sorteioOlinesorteio");

    if (sortList) {
      return JSON.parse(sortList);
    }

    return [] as number[];
  });

  const clearSorteio = useCallback(() => {
    Cookies.remove("sorteioOlinesorteio");

    setSorteio([] as number[]);
  }, []);

  const initSorteio = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    setSorteio([...sorteio, Math.floor(Math.random() * (max - min)) + min]);
  };

  return (
    <SorteioContext.Provider
      value={{
        sorteio,
        initSorteio,
        clearSorteio,
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
