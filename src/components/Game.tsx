import { useState } from 'react';
import {
  Paper,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Close, RadioButtonUnchecked } from '@mui/icons-material';

const initialBoardState = Array(9).fill('');

const Game = () => {
  const [currentPlayer, setCurrentPlayer] = useState('O');
  const [board, setBoard] = useState(initialBoardState);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [totalGames, setTotalGames] = useState(0);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const handleCellClick = (index: number) => {
    if (board[index] === '' && !gameOver) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(newBoard, currentPlayer)) {
        setGameOver(true);
        setWinner(currentPlayer);
        updateStatistics(currentPlayer);
      } else if (checkDraw(newBoard)) {
        setGameOver(true);
        setWinner('draw');
        updateStatistics('draw');
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  };

  const checkWinner = (board: any[], player: string) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  };

  const checkDraw = (board: string | any[]) => {
    return !board.includes('');
  };

  const updateStatistics = (result: string) => {
    setTotalGames(totalGames + 1);
    if (result === 'X') {
      setXWins(xWins + 1);
    } else if (result === 'O') {
      setOWins(oWins + 1);
    } else {
      setDraws(draws + 1);
    }
  };

  const handleReset = () => {
    setCurrentPlayer('O');
    setBoard(initialBoardState);
    setGameOver(false);
    setWinner('');
  };

  return (
    <>
      <Typography variant="h5" gutterBottom data-testid="current-player" data-test-value="X">
        Next turn: {currentPlayer}
      </Typography>

      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          maxWidth: 320,
          flexGrow: 1,
          marginBottom: 4,
        }}
      >
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          {board.map((cell, index) => (
            <Grid item xs={4} key={index}>
              <Button
                variant="outlined"
                sx={{
                  height: '100px',
                  width: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2em',
                  cursor: 'pointer',
                }}
                onClick={() => handleCellClick(index)}
                data-testid="game-cell"
                data-test-value={cell}
              >
                {cell === 'X' && <Close fontSize="large" />}
                {cell === 'O' && <RadioButtonUnchecked fontSize="large" />}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleReset}
        disabled={!board.some((cell) => cell !== '')}
        data-testid="reset-game"
      >
        Reset
      </Button>

      <Dialog
        open={gameOver}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="game-winner-modal"
        data-test-value={winner}
      >
        <DialogTitle id="alert-dialog-title">Game Over</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {winner === 'draw' ? 'It\'s a draw!' : `Winner is player ${winner}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus onClick={handleReset} data-testid="game-winner-modal-ok">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <List>
          <ListItem>
            <ListItemText primary="Total games" secondary={totalGames} data-testid="total-games" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="X wins" secondary={xWins} data-testid="x-wins-count" />
          </ListItem>
          <ListItem>
            <ListItemText primary="O wins" secondary={oWins} data-testid="o-wins-count" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Draws" secondary={draws} data-testid="draws-count" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Game;
