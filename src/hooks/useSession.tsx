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
import { useAppState } from "./useAppState";
import {
  AuthEntity,
  LoginResponse,
  SdkMethod,
  UserInfo,
} from "../libs/dto/entities";
import { LoginWalletAuthDto } from "../libs/dto/login-wallet-auth.dto";
import { RegistrationAuthDto } from "../libs/dto/registration-auth.dto";

interface SessionContextProps {
  sdkMethod: SdkMethod;
  userInfo: UserInfo;
  authEntities: AuthEntity[];
  logout(): Promise<void>;
  signIn(payload: LoginWalletAuthDto): Promise<LoginResponse>;
  signUp(payload: RegistrationAuthDto): Promise<LoginResponse>;
}

export type OnAuthPayload = UserInfo | null;

export const SessionContext = createContext<SessionContextProps>(null);

export const SessionProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const userAction = getUserAction();
  const authAction = getAuthAction();

  const { onAuth, isSessionReady, setSessionReady } = useAppState();

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);
  const [sdkMethod, setSdkMethod] = useState<SdkMethod>(SdkMethod.login);

  const logout = useCallback(async () => {
    await authAction.logout();
    onAuth(null);
  }, [onAuth]);

  const fetchProfile = useCallback(async () => {
    const userInfo = await userAction.getUserProfile();
    setUserInfo(userInfo);
  }, [setUserInfo]);

  const signIn = useCallback(
    async (payload: LoginWalletAuthDto) => {
      const authResponse = await authAction.signIn(payload);

      await fetchProfile();

      onAuth && onAuth(userInfo);

      return authResponse;
    },
    [onAuth, fetchProfile]
  );

  const signUp = useCallback(
    async (payload: RegistrationAuthDto) => {
      const authResponse = await authAction.signUp(payload);

      await fetchProfile();

      onAuth && onAuth(userInfo);

      return authResponse;
    },
    [onAuth, fetchProfile]
  );

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

      if (!isSessionReady) {
        setSessionReady(true);
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
        signUp,
        signIn,
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
