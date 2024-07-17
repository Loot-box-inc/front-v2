import { type FC } from "react";

import lootbox from "../../assets/lootbox.svg";
import "./lockedlootbox.css";

export const LockedLootbox: FC<{ width: number; height: number }> = (props) => (
  <>
    <div
      className="ani-body"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
      }}
    >
      <div className="lock-box-pan">
        <div className="lock-boxbody">
          <img className="lock-lootbox" src={lootbox} alt="" />
        </div>
      </div>
    </div>
  </>
);
