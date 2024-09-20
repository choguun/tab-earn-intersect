/* eslint-disable @typescript-eslint/no-unused-vars */
import { useStore } from "./hooks/useStore";
import { App as Amalgema } from "./app/index";
import { LoadingScreen } from "./LoadingScreen";

export const App = () => {
  const networkLayer = useStore((state) => state.networkLayer);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <LoadingScreen networkLayer={networkLayer} usePrepTime={true} />
      <Amalgema />
    </div>
  );
};
