import React, { useState, useEffect } from "react";
import { getStorageProvider } from "../libs/providers/";
import { UserAction } from "../libs/actions";
import { SdkMethod, UserInfo, AuthEntity } from "../libs/dto/entities";
import { NetworkType } from "../libs/providers/registry.provider";
interface SessionContextProps {
  sdkMethod: SdkMethod;
  userInfo: UserInfo;
  authEntities: AuthEntity[];
  logout(): void;
}

export const SessionContext = React.createContext<SessionContextProps>(null);

export const SessionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const userAction = new UserAction(NetworkType.testnet);
  const storageProvider = getStorageProvider();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);
  const [sdkMethod, setSdkMethod] = useState<SdkMethod>();

  const logout = () => {
    storageProvider.removeItem("jwt");
    window.location.reload();
  };

  useEffect(() => {
    (async () => {
      const authEntities = await userAction.getAuthEntities();
      setAuthEntities(authEntities);
    })();
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await userAction.getUserProfile();

        if (userInfo._id) {
          setSdkMethod(SdkMethod.connect);

          setUserInfo(userInfo);
          return;
        }
        throw new Error();
      } catch {
        setSdkMethod(SdkMethod.login);
      }
    })();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        sdkMethod,
        userInfo,
        authEntities,
        logout,
      }}
    >
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
