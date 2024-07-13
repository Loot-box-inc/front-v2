import { supabase } from "@/supabase";
import { InitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

interface useUserBalanceProps {
  initData?: InitData;
}

export const useUserBalance = ({ initData }: useUserBalanceProps) => {
  const [lootboxesCount, setLootboxesCount] = useState(1);
  const [USDT, setUSDT] = useState(2);
  const [LOOT, setLOOT] = useState(3);

  useEffect(() => {
    const run = async () => {
      // get startParam lootbox - parent and sender

      const [lootbox, usersLootboxes] = await Promise.all([
        supabase
          .from("lootboxes")
          .select()
          .eq("id", initData?.startParam as string),
        supabase
          .from("lootboxes")
          .select("balance")
          .eq("receiver_id", initData?.user?.id as number),
      ]);

      const { data } = lootbox;

      // @ts-expect-error - to lazy to fix now
      const { sender_id, parent } = data[0];

      await supabase
        .from("lootboxes")
        .update({ receiver_id: sender_id }) // sender of current lootbox
        .eq("id", parent as string); // условие - parent lootbox

      if (!usersLootboxes?.data?.length) {
        setLootboxesCount(0);
        setUSDT(0);
        setLOOT(0);
        return;
      }

      setLootboxesCount(usersLootboxes?.data.length);

      setUSDT(
        usersLootboxes?.data
          .map((i) => i.balance || 0) // Treat null balance as 0
          .filter((i) => i < 11)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0) // Provide a default value for reduce
      );

      setLOOT(
        usersLootboxes?.data
          .map((i) => i.balance || 0) // Treat null balance as 0
          .filter((i) => i > 40)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0) // Provide a default value for reduce
      );
    };

    run();
  });

  return { lootboxesCount, USDT, LOOT };
};
