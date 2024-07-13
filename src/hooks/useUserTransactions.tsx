import { supabase } from "@/supabase";
import { Database } from "@/types/supabase";
import { InitData } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

interface useUserTransactionsProps {
  initData?: InitData;
}

type userTransactionsType =
  | Database["public"]["Tables"]["lootboxes"]["Row"][]
  | null;

export const useUserTransactions = ({ initData }: useUserTransactionsProps) => {
  const [userTransactions, setUserTransactions] =
    useState<userTransactionsType>();

  useEffect(() => {
    const getData = async () => {
      const data = await supabase
        .from("lootboxes")
        .select()
        .eq("sender_id", initData?.user?.id as number);

      setUserTransactions(data.data);
    };
    getData();
  }, []);

  return { userTransactions };
};
