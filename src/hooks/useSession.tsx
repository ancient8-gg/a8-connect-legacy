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
import { AuthEntity, LoginResponse, UserInfo } from "../libs/dto/entities";
import { LoginWalletAuthDto } from "../libs/dto/login-wallet-auth.dto";
import { RegistrationAuthDto } from "../libs/dto/registration-auth.dto";
import { AppFlow } from "../components/router";

interface SessionContextProps {
  userInfo: UserInfo;
  authEntities: AuthEntity[];
  logout(): Promise<void>;
  signIn(payload: LoginWalletAuthDto): Promise<LoginResponse>;
  signUp(payload: RegistrationAuthDto): Promise<LoginResponse>;
  initState: () => Promise<void>;
}

export type OnAuthPayload = UserInfo | null;

export const SessionContext = createContext<SessionContextProps>(null);

export const SessionProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const userAction = getUserAction();
  const authAction = getAuthAction();

  const { onAuth, isSessionReady, setSessionReady, setCurrentAppFlow } =
    useAppState();

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);

  const logout = useCallback(async () => {
    await authAction.logout();
    onAuth(null);
  }, [onAuth]);

  const fetchProfile = useCallback(async () => {
    const userInfo = await userAction.getUserProfile();
    setUserInfo(userInfo);
    return userInfo;
  }, [setUserInfo]);

  const signIn = useCallback(
    async (payload: LoginWalletAuthDto) => {
      const authResponse = await authAction.signIn(payload);

      const sessionUser = await fetchProfile();

      onAuth(sessionUser);

      return authResponse;
    },
    [onAuth, fetchProfile, userInfo]
  );

  const signUp = useCallback(
    async (payload: RegistrationAuthDto) => {
      const authResponse = await authAction.signUp(payload);

      const sessionUser = await fetchProfile();

      onAuth(sessionUser);

      return authResponse;
    },
    [onAuth, fetchProfile, userInfo]
  );

  const initState = useCallback(async () => {
    setSessionReady(false);

    try {
      const userInfo = await fetchProfile();

      if (userInfo && userInfo._id) {
        setCurrentAppFlow(AppFlow.CONNECT_FLOW);

        // fetch auth entities
        const authEntities = await userAction.getAuthEntities();
        setAuthEntities(authEntities);

        onAuth(userInfo);
      }
    } catch {
      setCurrentAppFlow(AppFlow.LOGIN_FLOW);
      onAuth(null);
    }

    if (!isSessionReady) {
      setSessionReady(true);
    }
  }, [onAuth, setCurrentAppFlow, setSessionReady, setAuthEntities]);

  useEffect(() => {
    initState();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        userInfo,
        authEntities,
        logout,
        signUp,
        signIn,
        initState,
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
