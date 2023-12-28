import { useState } from 'react';
import { type GameState, type Game as GameModel } from './../../model/Game';
import './../../tailwind.css';

interface GameProps {
  game: GameModel;
}

export default function Game({ game }: GameProps): JSX.Element {
  const [state, setState] = useState<GameState>(game.getState());
  const [cardSelectIndex, setCardSelectIndex] = useState<number>(-1);

  function handlePlayButtonClick(): void {
    if (cardSelectIndex !== -1 && game.canCast(cardSelectIndex)) {
      game.play(cardSelectIndex);
      setState(game.getState());
      setCardSelectIndex(-1);
    }
  }

  function handlePassButtonClick(): void {
    game.pass();
    setState(game.getState());
  }

  function handleNewGameButtonClick(): void {
    game.reset();
    setState(game.getState());
  }

  function handleCardButton(index: number): void {
    setCardSelectIndex(index);
  }

  function selectButton(): string {
    if (cardSelectIndex !== -1 && game.canCast(cardSelectIndex)) {
      return 'bg-green-400';
    }
    return 'bg-gray-400';
  }

  function Panel(): JSX.Element {
    if (game.isPlaying()) {
      return (
        <>
          <button
            data-cy="PlayButton"
            className={`${selectButton()} hover:bg-green-500 rounded px-2 py-1 font-semibold text-center`}
            onClick={handlePlayButtonClick}>
            Play Card
          </button>
          <button
            data-cy="PassButton"
            className={`bg-green-400 hover:bg-green-500 rounded px-2 py-1 font-semibold text-center`}
            onClick={handlePassButtonClick}>
            Pass
          </button>
        </>
      );
    }
    return (
      <button
        data-cy="NewGameButton"
        className={`bg-green-400 hover:bg-green-500 rounded px-2 py-1 font-semibold text-center`}
        onClick={handleNewGameButtonClick}>
        New Game
      </button>
    );
  }

  return (
    <div className="m-auto w-fit">
      <div className="flex">
        {state.player2.hand.map((elem, index) => {
          return (
            <div
              data-cy="Player2Hand"
              className="border-gray-300hover:border-emerald-500 border-2 rounded px-2 py-1 font-semibold flex items-center justify-center h-28 w-24"
              key={index}
              data-index={index}></div>
          );
        })}
      </div>
      <div data-cy="Player2DeckSize" className="ml-auto">
        {state.player2.deckSize}
      </div>
      <div className="flex items-center">
        <div className="font-semibold text-xl pr-2">Player 2</div>
        <div
          data-cy="Player2Health"
          className="bg-red-500 rounded-full p-4 w-12 h-12 flex items-center justify-center text-center">
          {state.player2.health}
        </div>
      </div>

      <div className="flex items-center">
        <div className="font-semibold text-xl pr-2">Player 1</div>
        <div
          data-cy="Player1Health"
          className="bg-red-500 rounded-full p-4 w-12 h-12 flex items-center justify-center text-center">
          {state.player1.health}
        </div>
      </div>

      <div className="bg-blue-500 rounded-xl p-3 w-fit">
        <span data-cy="Player1Mana" className="text-lg">
          {state.player1.mana}
        </span>
        <span className="text-lg">/</span>
        <span data-cy="Player1ManaSlot" className="text-lg">
          {state.player1.manaSlot}
        </span>
      </div>

      <div className="flex">
        {Panel()}
        <div data-cy="Player1DeckSize" className="ml-auto">
          {state.player1.deckSize}
        </div>
      </div>
      <div className="flex">
        {state.player1.hand.map((elem, index) => {
          return (
            <div
              data-cy="Player1Hand"
              className={`${
                cardSelectIndex === index ? 'border-emerald-500' : 'border-gray-300'
              } hover:border-emerald-500 border-2 rounded px-2 py-1 font-semibold flex items-center justify-center h-28 w-24`}
              key={index}
              data-index={index}
              onClick={() => {
                handleCardButton(index);
              }}>
              {elem.manaCost}
            </div>
          );
        })}
      </div>
      <div>
        {state.log.map((element, index) => {
          return (
            <div data-cy="Log" key={index}>
              {element}
            </div>
          );
        })}
      </div>
    </div>
  );
}
