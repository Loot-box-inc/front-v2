import { Link } from "@/components/Link/Link";
import { initInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export function HomePage() {
  const initData = initInitData();

  const [lootboxesCount, setLootboxesCount] = useState(1);
  const [USDT, setUSDT] = useState(2);
  const [LOOT, setLOOT] = useState(3);

  // TODO avoid unnecceary calls if receiver_id is not NULL already

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <img src="./lootbox-closed.gif" alt="loading..." />
      <span className="text-center mt-50 p-5 pt-50 ">
        {`You've already opened ${lootboxesCount} lootboxes and your balance is ${USDT} USDT and ${LOOT} LOOT. 
        To open this box, you need to fulfill a task`}
      </span>

      <Link to="/tasks" className="bg-blue rounded p-2 px-10 text-white">
        Go!
      </Link>
    </main>
  );
}
