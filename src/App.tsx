import { Store, createDefaultPropsWithShuffleDeck } from './Store';
import './tailwind.css';

export default function App(): JSX.Element {
  return <Store {...createDefaultPropsWithShuffleDeck()}></Store>;
}
