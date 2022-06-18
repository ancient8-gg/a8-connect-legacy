export enum EvmAdapterName {
  metamask = "Adapter::EVM::Metamask",
  coin98 = "Adapter::EVM::Coin98",
  binanceChain = "Adapter::EVM::BinanceChain",
  coinbase = "Adapter::EVM::Coinbase",
  torus = "Adapter::EVM::Torus",
}

export enum SolanaAdapterName {
  phantom = "Adapter::SOL::PHANTOM",
  slope = "Adapter::SOL::SLOPE",
  torus = "Adapter::SOL::TORUS",
  sollet = "Adapter::SOL::SOLLET",
  coin98 = "Adapter::SOL:COIN98",
}

export type AdapterName = EvmAdapterName | SolanaAdapterName;
