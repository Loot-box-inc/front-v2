import { Link } from "@/components/Link/Link";
import { TonConnectButton } from "@tonconnect/ui-react";
import USDT from "@/assets/usdt.svg?react";
import LOOT from "@/assets/loot.svg?react";
import { supabase } from "@/supabase";
import { useEffect } from "react";
import { initInitData } from "@telegram-apps/sdk";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import { format } from "date-fns";

export const HistoryPage = () => {
  const initData = initInitData();
  const { USDT: usdtBalance, LOOT: lootBalance } = useUserBalance({ initData });
  const { userTransactions } = useUserTransactions({ initData });

  useEffect(() => {
    const getData = async () => {
      const data = await supabase.from("lootboxes").select("id");
      return data;
    };

    getData().then((res) => console.log("res", res));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#1D2733] text-white">
      {/* Header */}
      <div className="flex w-full px-2 mt-5 items-center justify-between gap-2">
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <USDT />
            <p className="text-sm">USDT {usdtBalance}</p>
          </div>
          <div className="flex gap-2 items-center">
            <LOOT />
            <p className="text-sm">LOOT {lootBalance}</p>
          </div>
        </div>
        <TonConnectButton />
      </div>

      <Link
        to="/tasks"
        className="bg-blue py-2 px-6 text-white rounded-full my-12"
      >
        Send another link
      </Link>

      {/* Transaction history */}
      <div className="w-full px-2">
        <p>Transaction history</p>

        {userTransactions?.map((el) => {
          console.log("time", el.created_at);
          return (
            <div
              key={el.id}
              className="bg-black rounded-md mt-2 px-2 flex items-center gap-2"
            >
              <img src="./box.png" height={75} width={75} />
              <p className="w-fit">
                {format(new Date(el.created_at), "hh:mm dd MMMyyyy")}
              </p>
              <p className="w-1/4">{el.receiver_id || "-"}</p>
              <p className="w-1/4">{el.status || "-"}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
};
