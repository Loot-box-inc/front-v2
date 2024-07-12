import { Link } from "@/components/Link/Link";
import { initInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export function HomePage() {
  const initData = initInitData();

  const [lootboxesCount, setLootboxesCount] = useState(1);
  const [USDT, setUSDT] = useState(2);
  const [LOOT, setLOOT] = useState(3);

  const [isLoading, setIsLoading] = useState(true);
  const [lootboxes, setLootboxes] = useState([]);
  const [steps, setSteps] = useState("");
  const [startParam, setStartParam] = useState("");
  const [ltbx, setLtbx] = useState({});

  const [isSendersLootbox, setIsSendersLootbox] = useState(false);
  const [err, setErr] = useState("");

  // TODO avoid unnecceary calls if receiver_id is not NULL already

  useEffect(() => {
    const run = async () => {
      // get startParam lootbox - parent and sender
      try {
        const [lootbox, usersOpenedLootboxes, usersSendedLootboxes] =
          await Promise.all([
            supabase
              .from("lootboxes")
              .select()
              .eq("uuid", initData?.startParam as string),
            supabase
              .from("lootboxes")
              .select("balance")
              .eq("receiver_id", initData?.user?.id as number),
            supabase
              .from("lootboxes")
              .select("uuid")
              .eq("sender_id", initData?.user?.id as number),
            supabase.from("users").upsert({
              telegram_id: initData?.user?.id as number,
              username: initData?.user?.username as string,
              first_name: initData?.user?.firstName as string,
              last_name: initData?.user?.lastName as string,
            }),
          ]);
        setLootboxes(usersOpenedLootboxes.data as []);
        setLtbx(lootbox);
        setStartParam(initData?.startParam as string);
        setSteps("1");
        if (
          usersSendedLootboxes.data
            ?.map((i) => i.uuid)
            .includes(initData?.startParam as string)
        ) {
          setIsSendersLootbox(true);
          setIsLoading(false);
          return;
        }
        setSteps("12");
        const { data } = lootbox;

        const { sender_id, parent } = data![0];

        await supabase
          .from("lootboxes")
          .update({ receiver_id: sender_id }) // sender of current lootbox
          .eq("uuid", parent as string); // условие - parent lootbox
        setSteps("123");
        if (!usersOpenedLootboxes?.data?.length) {
          setLootboxesCount(0);
          setUSDT(0);
          setLOOT(0);
          setIsLoading(false);
          return;
        }
        setSteps("1234");
        setLootboxesCount(usersOpenedLootboxes?.data.length);
        setSteps("12345");
        setUSDT(
          usersOpenedLootboxes?.data
            .map((i) => i.balance || 0) // Treat null balance as 0
            .filter((i) => i < 11)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) // Provide a default value for reduce
        );
        setSteps("123456");
        setLOOT(
          usersOpenedLootboxes?.data
            .map((i) => i.balance || 0) // Treat null balance as 0
            .filter((i) => i > 40)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) // Provide a default value for reduce
        );
        setSteps("1234567");
        setIsLoading(false);
        setSteps("12345678");
        return;
      } catch (error) {
        setErr(error as string);
        console.error(error);
      }
    };

    run();
  }, []);

  // ADD SPINNER HERE

  if (isLoading)
    return (
      <>
        <div>Loading...</div>
        <div>lootboxes: {JSON.stringify(lootboxes)}</div>
        <div>isLoading: {JSON.stringify(isLoading)}</div>
        <div>LOOT: {JSON.stringify(LOOT)}</div>
        <div>USDT: {JSON.stringify(USDT)}</div>

        <div>ERROR: {JSON.stringify(err)}</div>
        <div>STEPS: {JSON.stringify(steps)}</div>

        <div>LTBX: {JSON.stringify(ltbx)}</div>
        <div>STARTPARAM: {JSON.stringify(startParam)}</div>
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
    </main>
  );
}
