/**
 * Univeridad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Novena práctica de la asignatura DSI
 * Realizada por: Omar Suárez Doro
 * Correo: alu0101483474@ull.edu.es
 */

import * as fs from 'node:fs';
import chalk from 'chalk';
import { Card } from './Card.js';
import { CardCreator, CreatureCardCreator, PlanesWalkerCardCreator } from './CardsCreaters.js';

export class Database {
  private static instance: Database;
  private constructor() {}

  /**
   * This method return the instance of the Database
   * @returns the instance of the Database
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  /**
   * This method return the cards of the user
   * @param username The username of the user
   * @returns The cards of the user
   */
  getCardsbyUserName(username: string): Card[] {
    let result: Card[] = [];
    try {
      const filesNames: string[] = fs.readdirSync(`Database/${username}`);      
      for (const fileName of filesNames) {
        const fileContent = JSON.parse(fs.readFileSync(`Database/${username}/${fileName}`, 'utf-8'));
        let cardCreator: CardCreator;
        switch (fileContent.type_) {
          case 'creature':
            cardCreator = new CreatureCardCreator(fileContent.id_,
              fileContent.name_, fileContent.mana_cost_, fileContent.color_,
              fileContent.type_, fileContent.rarity_, fileContent.rules_text_,
              fileContent.market_value_, fileContent.power_, fileContent.toughness_);
            break;
          case 'planeswalker':
            cardCreator = new PlanesWalkerCardCreator(
              fileContent.id_, fileContent.name_, fileContent.mana_cost_,
              fileContent.color_, fileContent.type_, fileContent.rarity_,
              fileContent.rules_text_, fileContent.market_value_, fileContent.loyalty_marks_);
            break;
          default:
            cardCreator = new CardCreator(
              fileContent.id_, fileContent.name_, fileContent.mana_cost_,
              fileContent.color_, fileContent.type_, fileContent.rarity_,
              fileContent.rules_text_, fileContent.market_value_);
            break;
        }
        result.push(cardCreator.createCard());
      }
    } catch {
      console.log(chalk.yellow('[!] The username does not exists.'));
      console.log(chalk.blue('[i] Creating the directory of the user.'));
      fs.mkdirSync(`Database/${username}`);
    }
    return result;
  }

  /**
   * This method write a card in the database
   * @param username The username of the user
   * @param card Card to write
   * @returns void
   */
  writeCards(username: string, cards: Card[]): void {
    let filePath: string;
    for (const card of cards) {
      filePath = `Database/${username}/${card.name.toLowerCase().trim().replace(/\s/g, '_')}.json`;
      const cardData : string = JSON.stringify(card, null, 2);
      fs.writeFileSync(filePath, cardData);
    }
    try {
      const filesNames: string[] = fs.readdirSync(`Database/${username}`);
      filesNames.forEach((fileName) => {
        if (!cards.find((card) => fileName === `${card.name.toLowerCase().trim().replace(/\s/g, '_')}.json`)) {
          fs.unlinkSync(`Database/${username}/${fileName}`);
        }
      });
    } catch {
      console.log(chalk.red('[-] Could not read the directory.'));
    }
    console.log(`\n${chalk.white('Session saved in ')}${chalk.green(`Database/${username}`)}`);
  }
}

