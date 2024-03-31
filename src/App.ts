/**
 * Univeridad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Novena práctica de la asignatura DSI
 * Realizada por: Omar Suárez Doro
 * Correo: alu0101483474@ull.edu.es
 */

import chalk from 'chalk';
import { Database } from './Database.js';
import { TYPE, COLOR, RARITY, Card } from './Card.js';
import { CreatureCard } from './CreatureCard.js';
import { PlanesWalkerCard } from './PlanesWalkerCard.js';


/**
 * This interface represents the input to modify a card
 */
export type inputCardModify = {
  id_?: number,
  name_?: string,
  mana_cost_?: number,
  color_?: string,
  type_?: string,
  rarity_?: string,
  rules_text_?: string,
  market_value_?: number,
  power_?: number,
  toughness_?: number,
  loyalty_marks_?: number

}

/**
 * This class represents the App
 */
export class App {
  private database_: Database = Database.getInstance();
  private cards_: Card[];
  constructor(private user_ : string) {
    this.cards_ = this.database_.getCardsbyUserName(this.user_);
  }
  /**
   * This method add a card to the collection
   * @param card The card to add
   */
  addCard(cardp: Card) {
    for (const card of this.cards_) {
      if (card.id === cardp.id) {
        console.error(chalk.red('[-] The card is already in the collection.'));
        return;
      }
    }
    this.cards_.push(cardp);
    console.log(chalk.green('[✓] The card has been written successfully.'));
  }
  
  /**
   * This method remove a card from the collection
   * @param id The id of the card to remove
   */
  removeCard(id: number) {
    let index = this.cards_.findIndex(card => card.id === id);
    if (index === -1) {
      console.error(chalk.red('[-] The card is not in the collection.'));
      return;
    }
    this.cards_.splice(index, 1);
    console.log(chalk.green('[✓] The card has been removed successfully.'));
  }
  
  /**
   * This method save the changes in the database
   */
  saveChanges() {
    this.database_.writeCards(this.user_, this.cards_);
  }
  
  /**
   * This method modify a card from the collection
   * @param id id of the card to modify
   * @param cardp The values to modify
   * @returns 
   */
  modifyCard(id: number, cardp: inputCardModify) {
    let index = this.cards_.findIndex(card => card.id === id);
    if (index === -1) {
      console.error(chalk.red('[-] ') + chalk.white('The card is not in the collection.'));
      return;
    }
    if (cardp.id_) {
      this.cards_[index].id = cardp.id_;
    }
    if (cardp.name_) {
      this.cards_[index].name = cardp.name_;
    }
    if (cardp.mana_cost_) {
      this.cards_[index].manaCost = cardp.mana_cost_;
    }
    if (cardp.color_) {
      this.cards_[index].color = cardp.color_ as COLOR;
    }
    if (cardp.type_) {
      this.cards_[index].type = cardp.type_ as TYPE;
    }
    if (cardp.rarity_) {
      this.cards_[index].rarity = cardp.rarity_ as RARITY;
    }
    if (cardp.rules_text_) {
      this.cards_[index].rulesText = cardp.rules_text_;
    }
    if (cardp.market_value_) {
      this.cards_[index].marketValue = cardp.market_value_;
    }
    if (cardp.power_) {
      (this.cards_[index] as CreatureCard).power = cardp.power_;
    }
    if (cardp.toughness_) {
      (this.cards_[index] as CreatureCard).toughness = cardp.toughness_;
    }
    if (cardp.loyalty_marks_) {
      (this.cards_[index] as PlanesWalkerCard).loyaltyMarks = cardp.loyalty_marks_;
    }
    console.log(chalk.green('[✓] ') + chalk.white('The card has been modified successfully.'));
  }

  /**
   * This method show the collection
   */
  showCollection() : void {
    console.log('----------------------------------------');
    console.log(chalk.green('The collection of ') + chalk.bold.white.underline(this.user_) + chalk.green(' is:'));
    for (const card of this.cards_) {
      console.log(card.toString());
      console.log('- - - - - - - - - - - - - - - - - - - ')
    }
    console.log('----------------------------------------');
  }
  
  /**
   * This method return the cards of the collection
   * @returns The cards of the collection
   */
  getCards() : Card[] {
    return this.cards_;
  }
}