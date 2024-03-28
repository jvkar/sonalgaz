import React from 'react'
import { LuPencilLine } from "react-icons/lu";


const UpdateBtnAgence = ({agenceId,openModal}) => {

  return (
    <div>
       <button onClick={() => openModal(agenceId)} style={{  backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><LuPencilLine style={{ width: "24px", height: "24px" }} /></button>

    </div>
  )
}

export default UpdateBtnAgence