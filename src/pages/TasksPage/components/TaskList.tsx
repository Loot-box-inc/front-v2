// @ts-nocheck

import { ActionButton } from "@/pages/TasksPage/components/ActionButton";
import { ActionItem } from "@/pages/TasksPage/components/ActionItem";
import { initInitData, initUtils } from "@tma.js/sdk";

import { supabase } from "../../../supabase";

interface TasksListProps {
  onShare: (arg0: boolean) => void;
}

export const TasksList = ({ onShare }: TasksListProps) => {
  const initData = initInitData();
  const utils = initUtils();

  const _onShare = async () => {
    try {
      const { data } = await supabase
        .from("lootboxes")
        .select("id")
        .is("sender_id", null); // get not used lootboxes only

      if (!data?.length) return;

      const lootbox = data[Math.floor(Math.random() * data.length)];

      await supabase
        .from("lootboxes")
        .update({
          sender_id: initData.user.id,
          parent: initData.startParam, // TODO revert
        }) // пишем себя сендером = берем лутбокс
        .eq("id", lootbox.id);

      utils.shareURL(
        `${import.meta.env.VITE_APP_BOT_URL}?startapp=${lootbox.id}`,
        "Look! Some cool app here!"
      );

      onShare(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="-mt-20 pb-5 text-center font-bold text-lg">
        Choose from one of the tasks below:
      </h1>
      <div>
        <ActionItem
          text="1. Share a lootbox with a friend/s"
          actionButton={<ActionButton onShare={_onShare}>Send</ActionButton>}
        />
        <ActionItem
          text="2. Upload a video with you and your friends"
          actionButton={<ActionButton onShare={() => {}}>Upload</ActionButton>}
        />
        <ActionItem
          text="3. Join our group"
          actionButton={<ActionButton onShare={() => {}}>Join</ActionButton>}
        />
      </div>
    </>
  );
};
