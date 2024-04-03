import React from 'react'
import { LuPencilLine } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UpdateBtnEntreprise = ({openModal }) => {


  return (
    <div>
       <button onClick={openModal} style={{  backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><LuPencilLine style={{ width: "24px", height: "24px" }} /></button>

    </div>
  )
}

export default UpdateBtnEntreprise