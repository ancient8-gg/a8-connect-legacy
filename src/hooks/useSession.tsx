import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuthAction, getUserAction } from "../libs/actions";
import { AuthEntity, SdkMethod, UserInfo } from "../libs/dto/entities";
import { useAppState } from "./useAppState";

interface SessionContextProps {
  sdkMethod: SdkMethod;
  userInfo: UserInfo;
  authEntities: AuthEntity[];
  logout(): Promise<void>;
}

export type OnAuthPayload = UserInfo | null;

export const SessionContext = createContext<SessionContextProps>(null);

export const SessionProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const userAction = getUserAction();
  const authAction = getAuthAction();

  const { onAuth, isReady, setReady } = useAppState();

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);
  const [sdkMethod, setSdkMethod] = useState<SdkMethod>(SdkMethod.login);

  const logout = useCallback(async () => {
    await authAction.logout();
    onAuth(null);
  }, [onAuth]);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await userAction.getUserProfile();

        if (userInfo && userInfo._id) {
          setSdkMethod(SdkMethod.connect);
          setUserInfo(userInfo);

          // fetch auth entities
          const authEntities = await userAction.getAuthEntities();
          setAuthEntities(authEntities);

          onAuth && onAuth(userInfo);
        }
      } catch {
        setSdkMethod(SdkMethod.login);
        setUserInfo(null);
        onAuth && onAuth(null);
      }

      if (!isReady) {
        setReady(true);
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
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("Must be in hook");
  }
  return context;
};
