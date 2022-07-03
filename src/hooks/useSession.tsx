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

  const fetchSession = useCallback(async () => {
    const [_sessionUser, _authEntities] = await Promise.all([
      userAction.getUserProfile(),
      userAction.getAuthEntities(),
    ]).then(([_sessionUser, _authEntities]) => {
      setUserInfo(_sessionUser);
      setAuthEntities(_authEntities);

      return [_sessionUser, _authEntities];
    });

    return {
      sessionUser: _sessionUser as UserInfo,
      authEntities: _authEntities as AuthEntity[],
    };
  }, []);

  const signIn = useCallback(
    async (payload: LoginWalletAuthDto) => {
      const authResponse = await authAction.signIn(payload);

      const { sessionUser } = await fetchSession();

      onAuth(sessionUser);

      return authResponse;
    },
    [onAuth, userInfo]
  );

  const signUp = useCallback(
    async (payload: RegistrationAuthDto) => {
      const authResponse = await authAction.signUp(payload);

      const { sessionUser } = await fetchSession();

      onAuth(sessionUser);

      return authResponse;
    },
    [onAuth, userInfo]
  );

  const initState = useCallback(async () => {
    setSessionReady(false);

    try {
      const { sessionUser } = await fetchSession();

      if (sessionUser && sessionUser._id) {
        setCurrentAppFlow(AppFlow.CONNECT_FLOW);
        onAuth(sessionUser);
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
