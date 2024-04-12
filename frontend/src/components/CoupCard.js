import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

export default function CoupCard({ coupure }) {
  return (
    <Card
      orientation="horizontal"
      sx={{
        width: '90%',
        flexWrap: 'wrap',
        [`& > *`]: {
          '--stack-point': '500px',
          minWidth:
            'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
        },
        // make the card resizable for demo
        overflow: 'auto',
        resize: 'horizontal',
      }}
      style={{margin:"5px"}}
    >
      <CardContent>
        <Typography fontSize="xl" fontWeight="lg">
          {coupure?.nomClient}
        </Typography>
        <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
          {coupure?.adresseClient}
        </Typography>
        <Sheet
          sx={{
            bgcolor: 'background.level1',
            borderRadius: 'sm',
            p: 1.5,
            my: 1.5,
            display: 'flex',
            gap: 2,
            '& > div': { flex: 1 },
          }}
        >
          <div>
            <Typography level="body-xs" fontWeight="lg">
              code Client
            </Typography>
            <Typography fontWeight="lg">{coupure?.codeClient}</Typography>
          </div>
          <div>
            <Typography level="body-xs" fontWeight="lg">
              numero Compteur
            </Typography>
            <Typography fontWeight="lg">{coupure?.numeroCompteur}</Typography>
          </div>
          <div>
            <Typography level="body-xs" fontWeight="lg">
              Reference
            </Typography>
            <Typography fontWeight="lg">{coupure?.referenceClient}</Typography>
          </div>
        </Sheet>
        <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
          <Button variant="outlined" color="neutral">
            Invalider
          </Button>
          <Button variant="solid" color="primary">
            Valider
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
