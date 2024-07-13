import { useState, useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export const ClaimPage = () => {
  const [showText, setShowText] = useState(false);
  const [showConnectButton, setShowConnectButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowText(true);
    }, 5000);

    setTimeout(() => {
      setShowConnectButton(true);
    }, 7000);
  });

  return (
    <TonConnectUIProvider manifestUrl="https://lootfront.netlify.app/tonconnect-manifest.json">
      <div className="mt-10 flex flex-col items-center justify-center justify-items-center">
        <video src="123.mp4" autoPlay playsInline muted />
        <div className="text-center items-center justify-center  text-2xl transition ease-in-out delay-150 mb-5">
          <span>
            {showText ? "Congratulations! You have unlocked 5 Tons!" : null}
          </span>
        </div>

        <TonConnectButton className={showConnectButton ? "" : "hidden"} />
      </div>
    </TonConnectUIProvider>
  );
};
