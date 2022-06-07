import React, { useCallback, useState } from "react";
import { AuthType } from "@/libs/entities/auth.entity";
import {
  AdapterName,
  EvmAdapterName,
  SolanaAdapterName,
} from "@/libs/entities/adapter-name.entity";
import { useAdapter } from "@/hooks/useAdapter";
import ConnectButton, { ConnectButtonProps } from "./WalletConnect.button";
import Collapse from "@/components/collapase";
// import { useEvm } from "@/src/hooks/adapters/evm";
// import { useSolanaAuth, adapterNames } from "@/src/hooks/solana";
// import { AuthType, AuthTypeOrChain } from "@/entities/interfaces/auth.entity";
// import { adapterName as SoladapterName } from "@solana/wallet-adapter-base/lib/types/adapter";
// import { AdapterName as EvmAdapterName } from "@/src/hooks/adapters/evm/types";
// import { Collapse } from 'react-collapse';
// import ConnectButton, {
//   ConnectButtonProps,
//   adapterName,
// } from "@/src/components/connect-button/index";
// import {
//   Coin98WalletAdapter,
//   PhantomWalletAdapter,
//   SlopeWalletAdapter,
//   TorusWalletAdapter,
// } from "@solana/wallet-adapter-wallets";
// import { WalletReadyState } from "@solana/wallet-adapter-base";

export type ConnectedCallback = ({
  authType,
  adapterName,
  address,
}: {
  authType: AuthType;
  adapterName: AdapterName;
  address?: string;
}) => void;

export const AvailableWallets = [
  "use_metamask_uid",
  "use_phantom_uid",
  "use_coin98_evm_uid",
  "use_coin98_uid",
  "use_slope_uid",
  "use_torus_uid",
  "use_coinbase_uid",
  "use_binance_chain_uid",
];

export const WalletSelect: React.FC<{
  connectedCallback?: ConnectedCallback;
  enabledWallets?: string[];
}> = ({ connectedCallback, enabledWallets }) => {
  /** @description Amount of options when show default  */
  const DEFAULT_SHOWN_AMOUNT = 4;

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { isInstalled } = useAdapter();

  const _enabledWallets = enabledWallets || [];

  const handleConnect = (authType: AuthType, adapterName: AdapterName) => {};

  const renderConnectButtonList = useCallback(() => {
    const ButtonProps: ConnectButtonProps[] = [
      {
        text: "MetaMask",
        authType: AuthType.EVMChain,
        adapterName: EvmAdapterName.metamask,
        onClick: () =>
          handleConnect(AuthType.EVMChain, EvmAdapterName.metamask),
        trackingId: "use_metamask_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(232 128 7) 0%, rgb(148 82 5) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/metamask.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/metamask-icon.png`,
        },
      },
      {
        text: "Phantom",
        authType: AuthType.Solana,
        adapterName: SolanaAdapterName.phantom,
        onClick: () =>
          handleConnect(AuthType.Solana, SolanaAdapterName.phantom),
        trackingId: "use_phantom_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(144, 88, 216) 0%, rgb(83, 75, 177) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/phantom.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/phantom.png`,
        },
      },
      {
        text: "Binance",
        authType: AuthType.EVMChain,
        adapterName: EvmAdapterName.binanceChain,
        onClick: () =>
          handleConnect(AuthType.EVMChain, EvmAdapterName.binanceChain),
        trackingId: "use_binance_chain_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(218 192 66) 0%, rgb(234 126 0) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/binance.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/binance.png`,
        },
      },
      {
        text: "Coinbase",
        authType: AuthType.EVMChain,
        adapterName: EvmAdapterName.coinbase,
        onClick: () =>
          handleConnect(AuthType.EVMChain, EvmAdapterName.coinbase),
        trackingId: "use_coinbase_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(37 137 255) 0%, rgb(29 30 71) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coinbase.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coinbase.png`,
        },
      },
      {
        text: "Coin98 - EVM",
        authType: AuthType.EVMChain,
        adapterName: EvmAdapterName.coin98,
        onClick: () => handleConnect(AuthType.EVMChain, EvmAdapterName.coin98),
        trackingId: "use_coin98_evm_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(204 173 65) 0%, rgb(13, 13, 24) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coin98.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coin98.png`,
        },
      },
      {
        text: "Coin98 - SOL",
        authType: AuthType.Solana,
        adapterName: SolanaAdapterName.coin98,
        onClick: () => handleConnect(AuthType.Solana, SolanaAdapterName.coin98),
        trackingId: "use_coin98_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(13 13 24) 0%, rgb(237 201 74) 100%)",
        icon: {
          left: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coin98.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/coin98.png`,
        },
      },
      {
        text: "Slope",
        authType: AuthType.Solana,
        adapterName: SolanaAdapterName.slope,
        onClick: () => handleConnect(AuthType.Solana, SolanaAdapterName.slope),
        trackingId: "use_slope_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(108, 100, 249) 0%, rgb(86, 74, 237) 100%)",
        icon: {
          left: `${process.env.HOST_URI || "/profile"}/assets/images/slope.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/slope.png`,
        },
      },
      {
        text: "Torus",
        authType: AuthType.Solana,
        adapterName: SolanaAdapterName.torus,
        onClick: () => handleConnect(AuthType.Solana, SolanaAdapterName.torus),
        trackingId: "use_torus_uid",
        backgroundColor:
          "linear-gradient(90deg, rgb(18 57 170) 0%, rgb(0 57 255) 100%)",
        icon: {
          left: `${process.env.HOST_URI || "/profile"}/assets/images/torus.png`,
          right: `${
            process.env.HOST_URI || "/profile"
          }/assets/images/torus.png`,
        },
      },
    ].filter((button) =>
      _enabledWallets.length > 0
        ? _enabledWallets.includes(button.trackingId)
        : true
    );

    ButtonProps.sort((elm, elm2) => {
      const val1 = isInstalled({
        authType: elm.authType,
        adapterName: elm.adapterName,
      });
      const val2 = isInstalled({
        authType: elm2.authType,
        adapterName: elm2.adapterName,
      });
      return Number(val2) - Number(val1);
    });

    return (
      <div className="wallet-select-container">
        {ButtonProps.filter(
          (_, index: number) => index < DEFAULT_SHOWN_AMOUNT
        ).map((prop) => (
          <ConnectButton {...prop} key={prop.authType} />
        ))}
        <Collapse isOpened={collapsed}>
          {ButtonProps.filter(
            (_, index: number) => index >= DEFAULT_SHOWN_AMOUNT
          ).map((prop) => (
            <ConnectButton {...prop} key={prop.authType} />
          ))}
        </Collapse>
        <div className="text-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[30px]"
          >
            {collapsed ? (
              <i className="bx bx-chevrons-up"></i>
            ) : (
              <i className="bx bx-chevrons-down"></i>
            )}
          </button>
        </div>
      </div>
    );
  }, [isInstalled, collapsed]);

  return <div className="wallet-select">{renderConnectButtonList()}</div>;
};
