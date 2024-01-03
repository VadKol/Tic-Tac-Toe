import { Box, Typography } from '@mui/material';
import Game from './components/Game';

export default function App() {
  return (
    <Box textAlign="center">
      <Typography variant="h2">Tic Tac Toe</Typography>
      <Game />
    </Box>
  );
}
