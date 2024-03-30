import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { HiOutlinePlusSm } from "react-icons/hi";
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';
import { useRef } from 'react';


export default function AddButtonClient({Open}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const btt1=(<Button  onClick={Open}>Ajouter une liste des clients  (Format CSV)</Button>);

const options = [btt1];

//handleToggle bah ytkhbaw sub-Button
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
//handleClose hadi bah t3awd tnghle9 ba3d ma n cklikiw ela +
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        >
        <Button >Add</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleToggle}
          
        >
          <HiOutlinePlusSm />
        </Button>
      </ButtonGroup>
      
      <Popper
      //sub Buttons
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" >
                  {options.map((option, index) => (
                    <MenuItem 
                      key={option}
                      disabled={index === 2}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}