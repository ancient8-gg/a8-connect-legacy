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

interface SessionContextProps {
  sdkMethod: SdkMethod;
  userInfo: UserInfo;
  authEntities: AuthEntity[];
  logout(): Promise<void>;
  onAuth: (payload: OnAuthPayload) => void;
}

export type OnAuthPayload = UserInfo | null;

export const SessionContext = createContext<SessionContextProps>(null);

export const SessionProvider: FC<{
  children: ReactNode;
  onAuth: (payload: UserInfo | null) => void;
}> = ({ children, onAuth }) => {
  const userAction = getUserAction();
  const authAction = getAuthAction();

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);
  const [sdkMethod, setSdkMethod] = useState<SdkMethod>();

  const logout = useCallback(async () => {
    await authAction.logout();
    onAuth(null);
  }, [onAuth]);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await userAction.getUserProfile();

        console.log({ userInfo });
        if (userInfo && userInfo._id) {
          setSdkMethod(SdkMethod.connect);
          setUserInfo(userInfo);

          // fetch auth entities
          const authEntities = await userAction.getAuthEntities();
          setAuthEntities(authEntities);

          onAuth && onAuth(userInfo);
          return;
        }
      } catch {
        setSdkMethod(SdkMethod.login);
        setUserInfo(null);
        onAuth && onAuth(null);
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
        onAuth,
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
