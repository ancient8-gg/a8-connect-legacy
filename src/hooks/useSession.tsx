import React from "react";
import { SdkMethod } from "../libs/dto/entities";
interface SessionContextProps {
  sdkMethod: SdkMethod;
}

export const SessionContext = React.createContext<SessionContextProps>(null);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
  sdkMethod: SdkMethod;
}> = ({ children, sdkMethod }) => {
  return (
    <SessionContext.Provider value={{ sdkMethod }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
