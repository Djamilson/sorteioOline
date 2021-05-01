import React from "react";
import { SorteioProvider } from "./useSorteio";
const AppProvider: React.FC = ({ children }) => {
  return <SorteioProvider>{children}</SorteioProvider>;
};
export default AppProvider;
