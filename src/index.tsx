import {
  Adapters,
  AppFlow,
  closeModal,
  init,
  openModal,
  Providers,
} from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init("a8-connect", {
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.ALL,
        withCredential:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWREYXRhIjp7InVpZCI6IjYyN2RjODZmYWY4MjE1NGZkZDcxZWQxNyIsImVtIjoia2hhbmdAYW5jaWVudDguZ2ciLCJzY29wZSI6WyJVc2VyUm9sZTo6U3lzdGVtQWRtaW4iXSwidmVyaWZpZWQiOmZhbHNlLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVHlwZSI6IlNFU1NJT05fVFlQRTo6UkVTRVRfQ1JFREVOVElBTCJ9LCJ0eXAiOiJCZWFyZXIiLCJhY3IiOiIxIiwic2lkIjoiNjJkMTVkMDM2NjllZTUwZDYzZGFkMDk5IiwiaWF0IjoxNjU3ODg4MDAzLCJleHAiOjE2NTg0OTI4MDMsImF1ZCI6IndhbGxldC1jb25uZWN0LXZpYS1lbWFpbCIsImlzcyI6Imh0dHBzOi8vYW5jaWVudDguZGV2Iiwic3ViIjoiJDJiJDEwJFZJTndmbTYyaDlDUjVCVzBqLmlWTU83elNRdFBiNkdWTFBqMS5uVVdMeUxWd28zZkNLaVNPIiwianRpIjoiNjJkMTVkMDM2NjllZTUwZDYzZGFkMDk5In0.UFSE8cRF1kfkpEy46YNoB6L3SVckmAqFgx9o6QTbAgmsO9_6gJy2E5PkfPy9NP6EHuzPcUq4jaofGScWq72dxl3LuU1TFs6ipP8shhfQjJFaszqOfe7puwwyPx7gUHzF2LwmYwSZVU49X5keYZ7glxaoBgLuAwj1BiVsNx6_SKl-YeJ-P6fcWfHbYULzX5kCIYoPEyuB7k2k2FEjlVHVSvc532tsUUuszaCT-7ieEnXBoANtBshxwcTNjQsn3rxPVOEsOVWIO-UNwk3gZPh_9g2KI9bSQ8C_fxrN1NfrLx9wWNQqjdCXo81MVzSM7V540ejRcoTireKMeU67Yqh3Eg",
        initAppFlow: AppFlow.LOST_WALLET_FLOW,
        onClose: () => {
          closeModal();
        },
      }).then(() => {
        openModal();
      });
    }
  };
}
