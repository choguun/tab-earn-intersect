import React, { useEffect, useMemo, useState } from "react";
import { getComponentValue } from "@latticexyz/recs";
import { concat, map } from "rxjs";
import { useObservableValue } from "./hooks/useObservableValue";
import { filterNullish } from "@latticexyz/utils";
import { NetworkLayer } from "./layers/Network";
import { SyncStep } from "@latticexyz/store-sync";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useStore } from "./hooks/useStore";

type Props = {
  networkLayer: NetworkLayer | null;
  usePrepTime?: boolean;
};

export const LoadingScreen = ({ networkLayer, usePrepTime }: Props) => {
  const { loadingPageHidden: hide } = useStore();
  const setHide = (h: boolean) => {
    useStore.setState({ loadingPageHidden: h });
  };

  const [prepareGameProgress, setPrepareGameProgress] = useState(0);
  const [startGameProgress, setStartGameProgress] = useState(false);

  const loadingState = useObservableValue(
    useMemo(() => {
      if (!networkLayer) return;
      const {
        components: { SyncProgress },
      } = networkLayer;

      // use LoadingState.update$ as a trigger rather than a value
      // and concat with an initial value to trigger the first look up
      return concat([1], SyncProgress.update$).pipe(
        map(() => {
          const loadingState = getComponentValue(SyncProgress, singletonEntity);
          return loadingState ?? null;
        }),
        filterNullish(),
      );
    }, [networkLayer]),
    {
      message: "Connecting",
      percentage: 0,
      step: SyncStep.INITIALIZE,
      lastBlockNumberProcessed: 0n,
      latestBlockNumber: 0n,
    },
  );

  const [worldValid,] = useState(true);
//   useEffect(() => {
//     if (!networkLayer) return;
//     if (loadingState.step !== SyncStep.LIVE) return;

//     if (!usePrepTime || prepareGameProgress === 100) {
//       const {
//         components: { SkyPoolConfig },
//       } = networkLayer;

//       // check if there is a value for a table that is only available after the game is ready
//       // SkyPoolConfig is set in the PostDeploy script
//       // if it does not exist something is wrong
//       const skyPoolConfig = getComponentValue(SkyPoolConfig, singletonEntity);
//       setWorldValid(!!skyPoolConfig);
//     }
//   }, [loadingState.step, networkLayer, prepareGameProgress, usePrepTime]);

  useEffect(() => {
    if (!usePrepTime) return;
    if (!networkLayer) return;
    if (loadingState.step !== SyncStep.LIVE) return;

    setStartGameProgress(true);
  }, [loadingState, networkLayer, prepareGameProgress, usePrepTime]);

  const prepTimeSeconds = import.meta.env.PROD ? 10 : 1;
  useEffect(() => {
    if (!startGameProgress) return;

    const interval = setInterval(
      () => {
        setPrepareGameProgress((prev) => {
          if (prev === 100) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      },
      (prepTimeSeconds * 1000) / 100,
    );

    return () => clearInterval(interval);
  }, [networkLayer, prepTimeSeconds, startGameProgress, usePrepTime]);

  const doneLoading = usePrepTime ? prepareGameProgress === 100 : loadingState.step === SyncStep.LIVE;
  useEffect(() => {
    if (doneLoading && worldValid) setHide(true);
  }, [doneLoading, worldValid]);

  const showPrepMessage = loadingState.step === SyncStep.LIVE && usePrepTime;

  const loadingMessage = showPrepMessage ? "Preparing Game" : loadingState.message;
  const loadingPercentage = showPrepMessage ? prepareGameProgress : Math.round(loadingState.percentage);
  const showPercentage = showPrepMessage || loadingPercentage > 0;

  if (hide) {
    return null;
  }

  return (
    <div
      style={{
        zIndex: 1200,
        background: "linear-gradient(rgba(24, 23, 16, 0.4), rgba(24, 23, 16, 0.4))",
        backgroundPosition: "right",
        backgroundSize: "cover",
      }}
      className="fixed items-center justify-center w-screen h-screen bg-black p-12 flex flex-col pointer-events-none"
    >
      <div className="flex flex-col w-[540px] p-8 justify-items">
     
        {!doneLoading && (
          <div className="flex flex-col grow items-center mt-4 text-center">
            <span className="text-4xl">Voxel Tapper</span>

            <div className="h-4"></div>
          </div>
        )}

        {!doneLoading && (
          <div className="flex flex-row w-full mt-8 justify-center items-center">
            {/* <img height="32px" width="32px" src="/public/assets/loading.webp" /> */}
            <div className="w-4"></div>
            <div className="text-center text-3xl text-ss-text-default">
              {loadingMessage}
              {showPercentage && <div className="text-ss-blue">({loadingPercentage}%)</div>}
            </div>
            <div className="w-4"></div>
            {/* <img height="32px" width="32px" src="/public/assets/loading.webp" /> */}
          </div>
        )}
      </div>

      <div className="stretch"></div>

      <div className="flex justify-between stretch">
        <div className="absolute bottom-6 left-6 flex justify-between">
        </div>
      </div>
    </div>
  );
};
