import React from "react";
import { WalletProvider } from "./hooks/useWallet";
import { RouterProvider } from "./hooks/router/useRouter";
import { SessionProvider } from "./hooks/useSession";
import { SdkMethod } from "./libs/dto/entities";
import "./index.css";

const A8Connect: React.FC<{ sdkMethod: SdkMethod }> = ({ sdkMethod }) => {
  return (
    <div className="layout">
      <SessionProvider sdkMethod={sdkMethod}>
        <WalletProvider>
          <RouterProvider />
        </WalletProvider>
      </SessionProvider>
    </div>
  );
};
function App() {
  return <A8Connect sdkMethod={SdkMethod.login} />;
}

export default App;
