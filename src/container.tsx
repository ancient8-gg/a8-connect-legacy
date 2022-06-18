import React from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router/useRouter";
import "./index.css";

const A8Connect: React.FC = () => {
  return (
    <div className="layout">
      <WalletProvider>
        <RouterProvider />
      </WalletProvider>
    </div>
  );
};
function App() {
  return <A8Connect />;
}

export default App;
