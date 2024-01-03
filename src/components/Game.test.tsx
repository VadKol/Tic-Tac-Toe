import { render, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from './Game';

const playAndOWins = (cells: HTMLElement[]) => {
  fireEvent.click(cells[0]);
  fireEvent.click(cells[3]);
  fireEvent.click(cells[1]);
  fireEvent.click(cells[4]);
  fireEvent.click(cells[2]);
}

const playAndXWins = (cells: HTMLElement[]) => {
  fireEvent.click(cells[3]);
  fireEvent.click(cells[0]);
  fireEvent.click(cells[4]);
  fireEvent.click(cells[1]);
  fireEvent.click(cells[8]);
  fireEvent.click(cells[2]);
}

const playAndDraw = (cells: HTMLElement[]) => {
  fireEvent.click(cells[0]);
  fireEvent.click(cells[1]);
  fireEvent.click(cells[2]);
  fireEvent.click(cells[3]);
  fireEvent.click(cells[5]);
  fireEvent.click(cells[4]);
  fireEvent.click(cells[6]);
  fireEvent.click(cells[8]);
  fireEvent.click(cells[7]);
}

test('renders current player element', () => {
  const { getByTestId }: RenderResult = render(<Game />);

  expect(getByTestId('current-player')).toBeInTheDocument();
});

test('renders empty game cells', () => {
  const { getAllByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  expect(cells.length).toBe(9);
  cells.forEach((cell) => expect(cell).toHaveAttribute('data-test-value', ''));
});

test('reset button is disabled when no moves made', () => {
  const { getByTestId }: RenderResult = render(<Game />);
  const resetButton = getByTestId('reset-game');

  expect(resetButton).toBeDisabled();
});

test('reset button is enabled when any move was made', () => {
  const { getByTestId, getAllByTestId }: RenderResult = render(<Game />);
  const resetButton = getByTestId('reset-game');
  const cells = getAllByTestId('game-cell');

  fireEvent.click(cells[0]);

  expect(resetButton).toBeEnabled();
});

test('fills game cell on click', () => {
  const { getAllByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  fireEvent.click(cells[0]);
  expect(cells[0]).toHaveAttribute('data-test-value', 'O');
});

test('shows game winner modal for player O', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  playAndOWins(cells);

  const modal = await findByTestId('game-winner-modal');
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveAttribute('data-test-value', 'O');
});

test('shows game winner modal for player X', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  playAndXWins(cells);

  const modal = await findByTestId('game-winner-modal');
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveAttribute('data-test-value', 'X');
});

test('shows game winner modal for player O in case of diagonal line', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  fireEvent.click(cells[0]);
  fireEvent.click(cells[1]);
  fireEvent.click(cells[4]);
  fireEvent.click(cells[2]);
  fireEvent.click(cells[8]);

  const modal = await findByTestId('game-winner-modal');
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveAttribute('data-test-value', 'O');
});

test('handles a draw game correctly', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  playAndDraw(cells);

  const modal = await findByTestId('game-winner-modal');
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveAttribute('data-test-value', 'draw');
});

test('shows ok button in winner modal', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  playAndXWins(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  expect(okButton).toBeInTheDocument();
});

test('resets game on ok button click', async () => {
  const { getAllByTestId, findByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');

  playAndXWins(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  fireEvent.click(okButton);
  cells.forEach((cell) => expect(cell).toHaveAttribute('data-test-value', ''));
});

test('resets game on reset button click', () => {
  const { getAllByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  const resetButton = getByTestId('reset-game');

  fireEvent.click(cells[0]);
  fireEvent.click(resetButton);

  cells.forEach((cell) => expect(cell).toHaveAttribute('data-test-value', ''));
});

test('updates total games count after each game', async () => {
  const { getAllByTestId, findByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  let totalGames = getByTestId('total-games');

  expect(totalGames).toHaveTextContent('0');

  playAndOWins(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  fireEvent.click(okButton);

  totalGames = getByTestId('total-games');
  expect(totalGames).toHaveTextContent('1');

  playAndXWins(cells);

  fireEvent.click(okButton);

  totalGames = getByTestId('total-games');
  expect(totalGames).toHaveTextContent('2');
});

test('doesn\'t update total games count after reset', () => {
  const { getAllByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  const resetButton = getByTestId('reset-game');
  let totalGames = getByTestId('total-games');

  expect(totalGames).toHaveTextContent('0');

  fireEvent.click(cells[0]);
  fireEvent.click(resetButton);

  totalGames = getByTestId('total-games');
  expect(totalGames).toHaveTextContent('0');
});

test('updates O wins count after O wins a game', async () => {
  const { getAllByTestId, findByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  let oWins = getByTestId('o-wins-count');

  expect(oWins).toHaveTextContent('0');

  playAndOWins(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  fireEvent.click(okButton);

  oWins = getByTestId('o-wins-count');
  expect(oWins).toHaveTextContent('1');
});

test('updates X wins count after X wins a game', async () => {
  const { getAllByTestId, findByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  let xWins = getByTestId('x-wins-count');

  expect(xWins).toHaveTextContent('0');

  playAndXWins(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  fireEvent.click(okButton);

  xWins = getByTestId('x-wins-count');
  expect(xWins).toHaveTextContent('1');
});

test('updates draws count after a draw game', async () => {
  const { getAllByTestId, findByTestId, getByTestId }: RenderResult = render(<Game />);
  const cells = getAllByTestId('game-cell');
  let draws = getByTestId('draws-count');

  expect(draws).toHaveTextContent('0');

  playAndDraw(cells);

  const okButton = await findByTestId('game-winner-modal-ok');
  fireEvent.click(okButton);

  draws = getByTestId('draws-count');
  expect(draws).toHaveTextContent('1');
});

