/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { Entity } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { addressToEntityID } from "../mud/setupNetwork";
import { useExternalAccount } from "../hooks/useExternalAccount";
import IconBlock from "../assets/icon/grass_block_icon.webp";
import IconPickAxe from "../assets/icon/pickaxe_icon.png";
import IconCracked from "../assets/icon/cracked_icon.png";
import CrackSound from "../assets/sound/coral4.ogg";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAmalgema } from "../hooks/useAmalgema";

export const App = () => {
  const {
      components: { Score },
      executeSystemWithExternalWallet,
  } = useAmalgema();

  const {isConnected} = useAccount();

  const { address } = useExternalAccount();

  const score = useComponentValue(
    Score,
    address ? addressToEntityID(address) : ("0" as Entity)
  );

  // const counter = useComponentValue(Counter, singletonEntity);
  // TODO: connect wallet first to start play then click start to call chainlink to random resource
  // TODO: chainlink VRF(Random), Chainlink Function to call Mine API

  const [isStart, setIsStart] = useState(false);
  const [isCracked, setIsCracked] = useState(false);
  const [blockDuration, setBlockDuration] = useState(1);
  const [token, setToken] = useState(0);
  const audioRef = useRef(null); // Reference for the audio element

  useEffect(() => {
    if (score) {
      setToken(Number(score.value));
    }
  }, [score]);

  const handleStartGame = async () => {
    // await executeSystemWithExternalWallet({
    //   systemCall: "registerPlayer",
    //   systemId: "Start Game",
    //   args: [{ account: address }],
    // });

    setIsStart(true);
    // TODO: call chainlink VRF to random resource
    // TODO: call regenerateBlock
  }

  const handleImageClick = async () => {
    // await executeSystemWithExternalWallet({
    //   systemCall: "mineBlock",
    //   systemId: "Mine Block",
    //   args: [{ account: address }],
    // });
    
    setIsCracked(true);
    setBlockDuration(0);

    // Play the crack sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    let _token = token;
    setToken(_token + 1);

    // Reset the cracked state after some time (optional if you want the crack to disappear after blinking)
    setTimeout(() => {
      setIsCracked(false);
      setBlockDuration(1);
    }, 500); // Duration for how long the crack should blink (2 seconds)
  };
  
  return (
    <>
      {/* <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div> */}
      <nav className="w-full bg-orange-400 py-2 px-4">
        <div className="flex justify-end">
          <ConnectButton />
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center bg-slate-400">
        <div className="mt-10">
          <span className="text-6xl font-bold bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500 text-transparent bg-clip-text">VOXEL TAPPER</span>
        </div>
        <div className="mt-10 relative">
          <img src={IconBlock} className="w-30 h-30" />
          { isCracked && <img src={IconCracked} className="w-full h-full absolute top-0 left-0" /> }
          <span className="absolute top-1/4 -mt-12 left-1/2 transform -translate-x-1/2 text-8xl font-bold text-red-500">
            {isStart ? blockDuration : '-'}
          </span>
          {isConnected ? (
          <div className="absolute top-1/2 -mt-2 left-1/2 transform -translate-x-1/2">
            {!isStart ? <><button onClick={handleStartGame} className="text-white text-xl font-bold p-4 rounded-full bg-purple-500 hover:bg-purple-700">START GAME</button></> : <></>}
          </div>
          ) : (
            <div className="absolute top-1/2 -mt-2 left-1/2 transform -translate-x-1/2">
            <ConnectButton />
          </div>
          )}
           {/* Audio element to play crack sound */}
          <audio ref={audioRef} src={CrackSound} />
        </div>
        <button
          type="button"
          onClick={handleImageClick}
          className="mt-10 cursor-pointer border-4 border-black bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:opacity-50 disabled:grayscale text-white font-bold p-4 rounded-full"
          disabled={!isStart}
        >
          <img src={IconPickAxe} className="w-28 h-28" />
        </button>
        <div className="mt-10 mb-10">
          <span className="text-5xl font-bold text-orange-600">Token: {token}</span>
        </div>
        <div className="h-10"></div>
        <div className="h-10"></div>
      </div>
    </>
  );
};
