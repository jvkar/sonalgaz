import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuthContext } from "../hooks/useAuthContext";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import Address from './adresseComponent';
export default function RetabCard({ retablissement }) {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [error, setError] = React.useState(undefined);

  const [etat, setEtat] = React.useState(retablissement.etat);
  const [cause , setCause] = React.useState('')
  const { user } = useAuthContext();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const validate = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/Clients/valider/${retablissement._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setEtat("valider")
      setOpen(false)
    }
  };
  const invalidate = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/Clients/invalider/${retablissement._id}`, {
      method: "PATCH",
      body:JSON.stringify({cause}),

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setEtat("Invalider")
      setCause('')
      setOpen(false)
    }
  };

  return (
    <React.Fragment>
      <Card
        orientation="horizontal"
        sx={{
          width: "90%",
          flexWrap: "wrap",
          [`& > *`]: {
            "--stack-point": "500px",
            minWidth:
              "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
          },
          overflow: "auto",
          resize: "horizontal",
        }}
        style={{ margin: "5px" }}
      >
        <CardContent>
          <Typography fontSize="xl" fontWeight="lg">
            {retablissement?.nomClient}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
          <Address address={retablissement?.adresseClient}/>
          </Typography>
          <Sheet
            sx={{
              bgcolor: "background.level1",
              borderRadius: "sm",
              p: 1.5,
              my: 1.5,
              display: "flex",
              gap: 2,
              "& > div": { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                code Client
              </Typography>
              <Typography fontWeight="lg">{retablissement?.codeClient}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                numero Compteur
              </Typography>
              <Typography fontWeight="lg">{retablissement?.numeroCompteur}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Reference
              </Typography>
              <Typography fontWeight="lg">
                {retablissement?.referenceClient}
              </Typography>
            </div>
          </Sheet>
          {etat==="en attente" && (
              <Box
                sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
              >
                <Button variant="outlined" 
                color="neutral"
                onClick={handleClickOpen2}
                >
                  Invalider
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleClickOpen}
                >
                  Valider
                </Button>
              </Box>
            )}
          {etat==='valider' && (
            <Box sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Client Valider avec succes
              </Alert>
            </Box>
          )}
          {etat==='Invalider' && (
            <Box sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}>
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                Client Invalider avec succes
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"confirmer la validation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            etes vous sur de confirmer la validation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Non</Button>
          <Button onClick={validate} autoFocus>
          confirmer
          </Button>
        </DialogActions>
        {error && <div className='error'>{error}</div>}
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"confirmer l'invalidation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            etes vous sur de confirmer l'invalidation ?
          </DialogContentText>
          <TextField
          id="outlined-multiline-flexible"
          label="la cause"
          multiline
          maxRows={5}
          style={{width:"300px",marginTop:"15px"}}
          value={cause} onChange={(e)=>setCause(e.target.value)}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Non</Button>
          <Button onClick={invalidate} autoFocus>
            confirmer
          </Button>
        </DialogActions>
        
        {error && <div className='error'>{error}</div>}     
      </Dialog>
    </React.Fragment>
  );
}
