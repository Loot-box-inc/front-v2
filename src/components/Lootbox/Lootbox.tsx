import { type FC } from "react";

import seeklogo from "../../assets/tether-usdt-seeklogo.svg";
import lootbox from "../../assets/lootbox.svg";
import lootbox_opened2 from "../../assets/lootbox_opened2.svg";
import lootbox_opened3 from "../../assets/lootbox_opened3.svg";
import rays from "../../assets/rays.svg";
import "./lootbox.css";

export const Lootbox: FC<{ width: number; height: number }> = (props) => (
  <>
    <div
      className="ani-body"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
      }}
    >
      <img className="seeklogo" src={seeklogo} />
      <div className="box-pan">
        <div className="boxbody">
          <img className="lootbox" src={lootbox} alt="" />
        </div>
      </div>
      <div className="box-pan">
        <img className="lootbox_opened2" src={lootbox_opened2} alt="" />
      </div>
      <div className="box-pan">
        <img className="lootbox_opened3" src={lootbox_opened3} alt="" />
      </div>
      <div className="box-pan">
        <img className="rays" src={rays} alt="" />
      </div>
    </div>
  </>
);
