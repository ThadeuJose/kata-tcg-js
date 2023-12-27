import { Store, type StoreProps, createDefaultProps } from '../../Store';

describe('<Game />', () => {
  it('renders', () => {
    cy.mount(<Store {...createDefaultProps()}></Store>);
  });

  it('Should draw 3 cards when start', () => {
    const testProps: StoreProps = createDefaultProps();
    testProps.player1Config.deck = [7, 6, 8];
    cy.mount(<Store {...testProps} />);

    cy.get("[data-cy='Player1Hand']").eq(0).should('have.text', 7);
    cy.get("[data-cy='Player1Hand']").eq(1).should('have.text', 6);
    cy.get("[data-cy='Player1Hand']").eq(2).should('have.text', 8);

    cy.get("[data-cy='Player1DeckSize']").should('have.text', 0);
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
    cy.get("[data-cy='Log']").eq(2).should('have.text', 'Player 2 pass');

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
});
