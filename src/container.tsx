import React from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router/useRouter";
import { SessionProvider } from "./hooks/useSession";
import "./index.css";

const A8Connect: React.FC = () => {
  return (
    <div className="layout">
      <SessionProvider>
        <WalletProvider>
          <RouterProvider />
        </WalletProvider>
      </SessionProvider>
    </div>
  );
};
function App() {
  return <A8Connect />;
}

export default App;
