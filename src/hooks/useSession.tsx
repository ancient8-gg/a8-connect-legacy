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

interface SessionProviderProps {
  initAppFlow?: AppFlow;
}

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

export const SessionProvider: FC<
  {
    children: ReactNode;
  } & SessionProviderProps
> = ({ children, initAppFlow }) => {
  const userAction = getUserAction();
  const authAction = getAuthAction();

  const { isSessionReady, onAuth, setSessionReady, setCurrentAppFlow } =
    useAppState();

  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [authEntities, setAuthEntities] = useState<AuthEntity[]>([]);

  const logout = useCallback(async () => {
    await authAction.logout();
    onAuth(null);
  }, [onAuth]);

  const fetchSession = useCallback(async () => {
    let sessionUser = null;
    let authEntities: AuthEntity[] = [];

    try {
      sessionUser = await userAction.getUserProfile();
    } catch {}

    try {
      authEntities = await userAction.getAuthEntities();
    } catch {}

    setUserInfo(sessionUser);
    setAuthEntities(authEntities);

    return {
      sessionUser,
      authEntities,
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

    const { sessionUser } = await fetchSession();

    let isDefaultFlow = true;

    if (initAppFlow === AppFlow.LOST_WALLET_FLOW) {
      setCurrentAppFlow(initAppFlow);
      isDefaultFlow = false;
    }

    if (initAppFlow === AppFlow.ADD_WALLET_FLOW && sessionUser?._id) {
      setCurrentAppFlow(initAppFlow);
      isDefaultFlow = false;
    }

    if (isDefaultFlow) {
      if (sessionUser && sessionUser?._id) {
        setCurrentAppFlow(AppFlow.CONNECT_FLOW);
      } else {
        setCurrentAppFlow(AppFlow.LOGIN_FLOW);
      }
    }

    onAuth(sessionUser);
    if (!isSessionReady) {
      setSessionReady(true);
    }
  }, [onAuth, initAppFlow]);

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
