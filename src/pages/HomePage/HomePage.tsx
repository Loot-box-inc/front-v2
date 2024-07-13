import { Link } from "@/components/Link/Link";
import { initInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export function HomePage() {
  const initData = initInitData();

  const [lootboxesCount, setLootboxesCount] = useState(1);
  const [USDT, setUSDT] = useState(2);
  const [LOOT, setLOOT] = useState(3);

  const [d, setD] = useState([]);
  const [err, setErr] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSendersLootbox, setIsSendersLootbox] = useState(false);

  // TODO avoid unnecceary calls if receiver_id is not NULL already

  useEffect(() => {
    const run = async () => {
      // get startParam lootbox - parent and sender
      try {
        const [usersOpenedLootboxes, usersSendedLootboxes] = await Promise.all([
          supabase
            .from("lootboxes")
            .select("balance")
            .eq("receiver_id", initData?.user?.id as number),
          supabase
            .from("lootboxes")
            .select("uuid")
            .eq("sender_id", initData?.user?.id as number),
        ]);

        if (
          usersSendedLootboxes.data
            ?.map((i) => i.uuid)
            .includes(initData?.startParam as string)
        ) {
          setIsSendersLootbox(true);
          setIsLoading(false);
          return;
        }

        if (!usersOpenedLootboxes?.data?.length) {
          setLootboxesCount(0);
          setUSDT(0);
          setLOOT(0);
          setIsLoading(false);
          return;
        }

        setLootboxesCount(usersOpenedLootboxes?.data.length);

        setUSDT(
          usersOpenedLootboxes?.data
            .map((i) => i.balance || 0) // Treat null balance as 0
            .filter((i) => i < 11)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) // Provide a default value for reduce
        );

        setLOOT(
          usersOpenedLootboxes?.data
            .map((i) => i.balance || 0) // Treat null balance as 0
            .filter((i) => i > 40)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) // Provide a default value for reduce
        );

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      const { data, error } = await supabase
        .from("lootboxes")
        .select()
        .eq("uuid", initData?.startParam as string);

      setD(data as []);
      // @ts-expect-error
      setErr(error as string);
      // TODO handle no lootbox

      const { sender_id, parent } = data![0];

      // ничего не делаем, если пытаются вручную UUID в ссылке указать
      // и отгадывают реальный НЕоткрытый lootbox => go to next /tasks screen
      if (sender_id == null || parent == null) return;

      await supabase
        .from("lootboxes")
        .update({ receiver_id: sender_id }) // sender of current lootbox
        .eq("uuid", parent as string); // условие - parent lootbox
    };

    if (initData?.startParam) run();
  }, []);

  useEffect(() => {
    const run = async () => {
      await supabase.from("users").upsert({
        telegram_id: initData?.user?.id as number,
        username: initData?.user?.username as string,
        first_name: initData?.user?.firstName as string,
        last_name: initData?.user?.lastName as string,
      });
    };

    run();
  }, []);

  // ADD SPINNER HERE

  if (isLoading)
    return (
      <>
        <div>Loading...</div>
        <div>D: {JSON.stringify(d)}</div>
        <div>ERROR: {JSON.stringify(err)}</div>
      </>
    );

  if (isSendersLootbox) return <div>You can't open your lootboxes!</div>;

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

      <div>D: {JSON.stringify(d)}</div>
      <div>ERROR: {JSON.stringify(err)}</div>
    </main>
  );
}
