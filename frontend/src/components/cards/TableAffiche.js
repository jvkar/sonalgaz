import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {useState,useEffect} from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TableAffiche() {
    const {user} = useAuthContext()
    const [cadre,setCadre] = useState([]);
    const [responsable,setResponsable] = useState([]);
    const [error,setError] = useState(undefined)
  
    useEffect(() => {
        const fetchData=async()=>{
            const response = await fetch('/api/Admin/Cadres',{
                method:'GET',
                headers:{'Authorization': `Bearer ${user.token}`}
            })
            const json = await response.json();
            if(response.ok){
                setCadre(json)

            }
            else{
                setError(json.error);
            }
        }
        fetchData();
    },[])
    useEffect(() => {
        const fetchData=async()=>{
            const response = await fetch('/api/Admin/Responsables',{
                method:'GET',
                headers:{'Authorization': `Bearer ${user.token}`}
            })
            const json = await response.json();
            if(response.ok){
                setResponsable(json)

            }
            else{
                setError(json.error);
            }
        }
        fetchData();
    },[])
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Les Cadres des agences" {...a11yProps(0)} />
          <Tab label="Les Responsables des entreprises" {...a11yProps(1)} />

        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>agence</TableCell>
                  <TableCell>username</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cadre &&
                  cadre.map((item) => (
                      <TableRow key={item._id} >
                      <TableCell component="th" scope="row">
                      {item?.nomCadre}
                    </TableCell>
                      <TableCell component="th" scope="row">
                      {item?.numeroAgence}
                    </TableCell>
                      <TableCell component="th" scope="row">
                      {item?.username}
                    </TableCell>
                    </TableRow>
                    ))}
              </TableBody>
            </Table>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Entreprise</TableCell>
                  <TableCell>username</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {responsable &&
                  responsable.map((item) => (
                      <TableRow key={item._id} >
                      <TableCell component="th" scope="row">
                      {item?.nomResponsable}
                    </TableCell>
                      <TableCell component="th" scope="row">
                      {item?.NumeroEtablissement}
                    </TableCell>
                      <TableCell component="th" scope="row">
                      {item?.username}
                    </TableCell>
                    </TableRow>
                    ))}
              </TableBody>
            </Table>
      </CustomTabPanel>

    </Box>
  );
}
