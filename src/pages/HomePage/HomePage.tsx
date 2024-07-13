import { Link } from "@/components/Link/Link";
// import { useUserBalance } from "@/hooks/useUserBalance";
import { initInitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const initData = initInitData();

  const [lootboxesCount, setLootboxesCount] = useState(0);
  const [USDT, setUSDT] = useState(0);
  const [LOOT, setLOOT] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [isSendersLootbox, setIsSendersLootbox] = useState(false);
  const [isLootboxAlreadyOpened, setIsLootboxAlreadyOpened] = useState(false);
  const [isNotFirstLootbox, setIsNotFirstLootbox] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase
        .from("lootboxes")
        .select()
        .eq("uuid", initData?.startParam as string);

      // Handle no lootbox
      if (!data?.length) {
        // setIsLoading(false);
        return navigate("/tasks", { replace: true });
      }

      const { sender_id, receiver_id, parent } = data![0];

      // ничего не делаем, если пытаются вручную UUID в ссылке указать
      // и отгадывают реальный НЕоткрытый lootbox => go to next /tasks screen
      if (sender_id == null) return navigate("/tasks", { replace: true });

      // юзер отправил сам себе
      if (sender_id === (initData?.user?.id as number)) {
        setIsSendersLootbox(true);
        return;
      }

      // лутбокс уже открыт
      if (receiver_id != null) {
        setIsLootboxAlreadyOpened(true);
        return;
      }

      // 2ой раз уже от этого sender'a

      // получить все лутбоксы где юзер = receiver_id
      const usersOpenedLootboxes = await supabase
        .from("lootboxes")
        .select("sender_id, balance")
        .eq("receiver_id", initData?.user?.id as number);
      // взять всех сендеров и проверить нет ли там сендера текущего лутбокса
      setIsNotFirstLootbox(
        usersOpenedLootboxes?.data
          ?.map((i) => i.sender_id)
          .includes(sender_id) as boolean
      );

      await supabase
        .from("lootboxes")
        .update({ receiver_id: sender_id }) // sender of current lootbox
        .eq("uuid", parent as string); // условие - parent lootbox

      if (!usersOpenedLootboxes?.data?.length) {
        setIsLoading(false);
        return;
      }

      setLootboxesCount(usersOpenedLootboxes?.data.length);

      setUSDT(
        usersOpenedLootboxes?.data
          .map((i) => i.balance || 0) // Treat null balance as 0
          .filter((i) => i < 11)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0) // Provide a default value for reduce
      );

      setLOOT(
        usersOpenedLootboxes?.data
          .map((i) => i.balance || 0) // Treat null balance as 0
          .filter((i) => i > 40)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0) // Provide a default value for reduce
      );

      setIsLoading(false);
    };

    if (!initData?.startParam) navigate("/tasks", { replace: true });

    run();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      {isSendersLootbox && (
        <span className="text-center mt-50 p-5 pt-50 text-white">
          You can't open your lootboxes!
        </span>
      )}

      {isLootboxAlreadyOpened && (
        <span className="text-center mt-50 p-5 pt-50 text-white">
          Lootbox was already opened!
        </span>
      )}

      {isNotFirstLootbox && (
        <span className="text-center mt-50 p-5 pt-50 text-white">
          You can't open more than one lootbox from a user
        </span>
      )}

      {!isLoading && (
        <>
          <img src="./lootbox-closed.gif" alt="loading..." />
          <span className="text-center mt-50 p-5 pt-50 text-white">
            {`You've already opened ${lootboxesCount} lootboxes and your balance is ${USDT} USDT and ${LOOT} LOOT.
        To open this box, you need to fulfill a task`}
          </span>
        </>
      )}

      <Link to="/tasks" className="bg-blue rounded p-2 px-10 text-white">
        Go!
      </Link>
    </main>
  );
}
