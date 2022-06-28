import React from "react";
import { OnConnectPayload, WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router";
import { OnAuthPayload, SessionProvider } from "./hooks/useSession";
import "./index.css";

const A8Connect: React.FC<{
  onAuth?: (payload: OnAuthPayload) => void;
  onConnected?: (payload: OnConnectPayload) => void;
}> = ({ onAuth, onConnected }) => {
  return (
    <div className="layout">
      <SessionProvider onAuth={onAuth}>
        <WalletProvider onConnected={onConnected}>
          <RouterProvider />
        </WalletProvider>
      </SessionProvider>
    </div>
  );
};

export default A8Connect;
