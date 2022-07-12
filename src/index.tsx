import {
  init,
  openModal,
  closeModal,
  Providers,
  Adapters,
  AppFlow,
} from "./lib.entrypoint";

if (document) {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init("a8-connect", {
        disableCloseButton: false,
        cleanWalletCache: true,
        networkType: Providers.NetworkType.testnet,
        chainType: Adapters.ChainType.SOL,
        initAppFlow: AppFlow.ADD_WALLET_FLOW,
        resetWithNewWalletPayload: {
          authToken:
            "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWREYXRhIjp7InVpZCI6IjYyNzY0NjU0NjZmNjc2ZGNjNGRhOTAzNyIsImVtIjoic3RlcGhlbkBhbmNpZW50OC5nZyIsInVuIjoic3lzdGVtb2lzZHNhZHNhIiwic2NvcGUiOlsiVXNlclJvbGU6OlVzZXIiLCJVc2VyUm9sZTo6U3lzdGVtQWRtaW4iXSwidmVyaWZpZWQiOnRydWUsImVuYWJsZWQiOnRydWUsInNlc3Npb25UeXBlIjoiU0VTU0lPTl9UWVBFOjpSRVNFVF9DUkVERU5USUFMIn0sInR5cCI6IkJlYXJlciIsImFjciI6IjEiLCJzaWQiOiI2MmNjMTViYTQ5NDYzMzUwZjY5YWU5M2QiLCJpYXQiOjE2NTc1NDIwNzQsImV4cCI6MTY1ODE0Njg3NCwiYXVkIjoid2FsbGV0LWNvbm5lY3QtdmlhLWVtYWlsIiwiaXNzIjoiaHR0cHM6Ly9hbmNpZW50OC5kZXYiLCJzdWIiOiIkMmIkMTAkMm9oWlJaL28wZlB2RHV3TEJIRUVVLkowNVRndGRqQXR4QlFmMi92a0RtbUJNb1o4MXpKQUsiLCJqdGkiOiI2MmNjMTViYTQ5NDYzMzUwZjY5YWU5M2QifQ.jw6KoIB7FPecCnfhT8q2sQx3aEp2danU7wDjzuiCw8BBK6h2PARvBfalRdSSgG36zcZAh7Fj1AKaAStlPKoFsn285rcAnZAazK9T07smsEAPf4cFYn1Dva3pr9AWctwdF3v5SIs9qze6aezKjh840bpC_xj-_i8UyHXQcHwh3od6dShXmTtDZPQ7WpC0SkPZMPvEO5HjpDf1Q4YpTrK-YA1-mqnx8Crwe7_UlFfS3776RpVW0E_PIdv-e-rkLFZu-4QDrDweo-O1fcU93wQu7s1Ct9VQzYkFlTOl-JrF2PcPPsGa-5XXWr8ytIwD-YRPVzgVXcMAuGQZTtqsAUhdcA",
          email: "stephen@ancient8.gg",
        },
        onClose: () => {
          closeModal();
        },
      }).then(() => {
        openModal();
      });
    }
  };
}
