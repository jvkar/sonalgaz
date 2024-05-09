import React from "react";
import { LuPencilLine } from "react-icons/lu";
import Tooltip from "@mui/material/Tooltip";

const UpdateBtnTechnicien = ({ openModal }) => {
  return (
    <div>
      <Tooltip title="modifier" placement="top">
        <button
          onClick={openModal}
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            cursor: "pointer",
          }}
        >
          <LuPencilLine style={{ width: "24px", height: "24px" }} />
        </button>
      </Tooltip>
    </div>
  );
};

export default UpdateBtnTechnicien;
