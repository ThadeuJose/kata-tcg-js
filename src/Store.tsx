import Game from './components/Game/Game';
import { Game as GameModel } from './model/Game';
import Player, { type PlayerConfig } from './model/Player';

export interface StoreProps {
  isAggressiveAI: boolean;
  shouldStartInitProcess: boolean;
  player1Config: PlayerConfig;
  player2Config: PlayerConfig;
}

export function Store({
  isAggressiveAI,
  shouldStartInitProcess,
  player1Config,
  player2Config
}: StoreProps): JSX.Element {
  const game: GameModel = new GameModel(
    isAggressiveAI,
    shouldStartInitProcess,
    new Player(player1Config),
    new Player(player2Config)
  );

  return (
    <main>
      <Game game={game} />
    </main>
  );
}

export function createDefaultProps(): StoreProps {
  return {
    isAggressiveAI: false,
    shouldStartInitProcess: true,
    player1Config: {
      name: 'Player 1',
      hand: [],
      health: 30,
      mana: 0,
      deck: [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
    },
    player2Config: {
      name: 'Player 2',
      hand: [],
      health: 30,
      mana: 0,
      deck: [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
    }
  };
}

export function createDefaultPropsWithShuffleDeck(): StoreProps {
  const props: StoreProps = createDefaultProps();
  props.player1Config.deck = shuffleDeck(props.player1Config.deck);
  props.player2Config.deck = shuffleDeck(props.player2Config.deck);
  return props;
}

export function shuffleDeck(deck: any): any {
  const shuffledDeck = [...deck];
  // Shuffle the deck using some algorithm (e.g., Fisher-Yates shuffle)
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}
