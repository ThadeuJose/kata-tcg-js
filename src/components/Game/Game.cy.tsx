import { Store, type StoreProps, createDefaultProps } from '../../Store';

describe('<Game />', () => {
  it('renders', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);
  });

  it('Player 1 should draw 3 cards when start', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='Player1Hand']").should('have.length', 3);

    cy.get("[data-cy='Player1DeckSize']").should('have.text', 17);
  });

  it('Player 1 should draw 4 cards when start', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='Player2Hand']").should('have.length', 4);

    cy.get("[data-cy='Player2DeckSize']").should('have.text', 16);
  });

  it('Should deal 1 damage to AI', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1, 9];
    testProps.player1Config.mana = 1;
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).click();
    cy.get("[data-cy='PlayButton']").click();

    cy.get("[data-cy='Player2Health']").should('have.text', '29');

    const selectCardClass: string = 'border-emerald-500';
    cy.get("[data-cy='Player1Hand']").eq(0).should('not.have.class', selectCardClass);
  });

  it('Should pass turn between players', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='Log']").eq(0).should('have.text', 'Player 1 pass');
    cy.get("[data-cy='Log']").eq(1).should('have.text', 'Player 2 pass');
  });

  it('Should deal 1 damage to player', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.isAggressiveAI = true;
    testProps.shouldStartInitProcess = false;
    testProps.player2Config.hand = [1, 9];
    testProps.player2Config.mana = 1;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='Log']").eq(0).should('have.text', 'Player 1 pass');
    cy.get("[data-cy='Log']").eq(1).should('have.text', 'Player 2 deal 1 damage to Player 1');
    cy.get("[data-cy='Log']").eq(2).should('have.text', 'Player 2 deal 0 damage to Player 1');
    cy.get("[data-cy='Log']").eq(3).should('have.text', 'Player 2 pass');

    cy.get("[data-cy='Player1Health']").should('have.text', '29');
  });

  it('Should have one mana in slot', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.isAggressiveAI = true;
    testProps.player1Config.hand = [1, 9];
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Mana']").should('have.text', '1');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '1');

    cy.get("[data-cy='Player1Hand']").eq(0).click();
    cy.get("[data-cy='PlayButton']").click();

    cy.get("[data-cy='Player1Mana']").should('have.text', '0');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '1');
  });

  it('Should have three mana in slot', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='Player1Mana']").should('have.text', '1');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '1');

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Player1Mana']").should('have.text', '3');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '3');
  });

  it("Shouldn't have more then 10 mana slot", () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='Player1Mana']").should('have.text', '1');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '1');

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Player1Mana']").should('have.text', '10');
    cy.get("[data-cy='Player1ManaSlot']").should('have.text', '10');
  });

  it("Shouldn't select card if can't cast", () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [8, 8, 8];
    testProps.player1Config.mana = 1;
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).click();

    const selectCardClass: string = 'border-emerald-500';
    cy.get("[data-cy='Player1Hand']").eq(0).should('have.class', selectCardClass);

    const PlayButtonDisableClass: string = 'bg-gray-400';
    cy.get("[data-cy='PlayButton']").should('have.class', PlayButtonDisableClass);

    cy.get("[data-cy='PlayButton']").click();

    cy.get("[data-cy='Player2Health']").should('have.text', '30');
  });

  it('Should have 4 cards', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);

    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Player1Hand']").should('have.length', '4');
  });

  it('Should not draw more then 5 card', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1, 1, 1, 1];
    testProps.player1Config.mana = 0;
    testProps.player1Config.deck = [1, 0, 0];
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Player1DeckSize']").should('have.text', '1');
    cy.get("[data-cy='Player1Hand']").should('have.length', '5');
  });

  it('Should take damage if deck is empty', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1, 1, 1, 1];
    testProps.player1Config.mana = 0;
    testProps.player1Config.deck = [];
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='PassButton']").click();
    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Player1Health']").should('have.text', '28');
  });

  it('Should win if other player has 0 life', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1];
    testProps.player1Config.mana = 1;
    testProps.player1Config.deck = [];
    testProps.player2Config.health = 1;
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).click();
    cy.get("[data-cy='PlayButton']").click();

    cy.get("[data-cy='Log']").eq(1).should('have.text', 'Player 1 wins');
    cy.get("[data-cy='Player2Health']").should('have.text', '0');
    cy.get("[data-cy='NewGameButton']").should('exist');
    cy.get("[data-cy='PlayButton']").should('not.exist');
    cy.get("[data-cy='PassButton']").should('not.exist');
  });

  it('Should lost if has 0 life after draw', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [1];
    testProps.player1Config.mana = 1;
    testProps.player1Config.health = 1;
    testProps.player1Config.deck = [];
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='PassButton']").click();

    cy.get("[data-cy='Log']").eq(3).should('have.text', 'Player 2 wins');
    cy.get("[data-cy='Player1Health']").should('have.text', '0');
    cy.get("[data-cy='NewGameButton']").should('exist');
    cy.get("[data-cy='PlayButton']").should('not.exist');
    cy.get("[data-cy='PassButton']").should('not.exist');
  });

  it('Should heal damage', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [2];
    testProps.player1Config.mana = 2;
    testProps.player1Config.health = 1;
    testProps.player1Config.deck = [];
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).click();
    cy.get("[data-cy='HealButton']").click();

    cy.get("[data-cy='Log']").contains('Player 1 heal 2 damage');
    cy.get("[data-cy='Player1Health']").should('have.text', '3');
  });

  it('Should heal damage until max health', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.hand = [8];
    testProps.player1Config.mana = 8;
    testProps.player1Config.health = 27;
    testProps.player1Config.deck = [];
    testProps.shouldStartInitProcess = false;
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).click();
    cy.get("[data-cy='HealButton']").click();

    cy.get("[data-cy='Log']").contains('Player 1 heal 8 damage');
    cy.get("[data-cy='Player1Health']").should('have.text', '30');
  });
});
