import { createContext, useContext, useState } from "react";

const SwitchContext = createContext(null);

export function SwitchProvider({ children }) {
  const [switchContext, setSwitchContext] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [availableContexts, setAvailableContexts] = useState([]);

  const switchTo = (context) => {
    setSwitchContext(context);
    setIsSwitching(true);
    sessionStorage.setItem("parentContext", JSON.stringify(context));
  };

  const returnToParent = () => {
    const parent = JSON.parse(sessionStorage.getItem("parentContext"));
    if (parent) {
      setSwitchContext(parent);
      setIsSwitching(false);
    }
  };

  const setContexts = (contexts) => {
    setAvailableContexts(contexts);
  };

  return (
    <SwitchContext.Provider
      value={{
        switchContext,
        isSwitching,
        availableContexts,
        switchTo,
        returnToParent,
        setContexts,
      }}
    >
      {children}
    </SwitchContext.Provider>
  );
}

export const useSwitch = () => {
  const context = useContext(SwitchContext);
  if (!context) {
    throw new Error("useSwitch must be used within a SwitchProvider");
  }
  return context;
};
