/**
 * Univeridad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Novena práctica de la asignatura DSI
 * Realizada por: Omar Suárez Doro
 * Correo: alu0101483474@ull.edu.es
 */

import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import { App, inputCardModify } from './App.js'
import { CardCreator, CreatureCardCreator, PlanesWalkerCardCreator } from './CardsCreaters.js';
import { COLOR, TYPE, RARITY } from './Card.js';

function main() {
  let app = new App('test_user');
  yargs(hideBin(process.argv))
    .command('add', 'Adds a card to the collection', {
      user: {
        description: 'username of the user',
        type: 'string',
        demandOption: true
      },
      id: {
        description: 'Card ID',
        type: 'number',
        demandOption: true
      },
      name: {
        description: 'Card name',
        type: 'string',
        demandOption: true
      },
      mana_cost: {
        description: 'Card mana cost',
        type: 'number',
        demandOption: true
      },
      color: {
        description: 'Card color',
        type: 'string',
        demandOption: true
      },
      type: {
        description: 'Card type',
        type: 'string',
        demandOption: true
      },
      rarity: {
        description: 'Card rarity',
        type: 'string',
        demandOption: true
      },
      rules_text: {
        description: 'Card rules text',
        type: 'string',
        demandOption: true
      },
      market_value: {
        description: 'Card market value',
        type: 'number',
        demandOption: true
      },
      power: {
        description: 'Card power',
        type: 'number',
        demandOption: false
      },
      toughness: {
        description: 'Card toughness',
        type: 'number',
        demandOption: false
      },
      loyalty_marks: {
        description: 'Card loyalty marks',
        type: 'number',
        demandOption: false
      }
    }, (argv) => {
      if (argv.type === 'creature' && (!argv.power || !argv.toughness)) {
        console.log('The power and toughness are required for creature cards');
        return;
      }
      if (argv.type === 'planeswalker' && !argv.loyalty_marks) {
        console.log('The loyalty marks are required for planeswalker cards');
        return;
      }
      if (!Object.values(TYPE).some((element) => argv.type === element)) {
        console.error(chalk.red('[-] The type is not suported'));
        return;
      }
      let cardCreator: CardCreator;
      switch (argv.type) {
        case 'creature':
          cardCreator = new CreatureCardCreator(
            argv.id, argv.name, argv.mana_cost, argv.color as COLOR,
            argv.type as TYPE, argv.rarity as RARITY, argv.rules_text,
            argv.market_value, argv.power!, argv.toughness!);
          break;
        case 'planeswalker':
          cardCreator = new PlanesWalkerCardCreator(
            argv.id, argv.name, argv.mana_cost, argv.color as COLOR,
            argv.type as TYPE, argv.rarity as RARITY, argv.rules_text,
            argv.market_value, argv.loyalty_marks!);
          break;
        default:
          cardCreator = new CardCreator(
            argv.id, argv.name, argv.mana_cost, argv.color as COLOR,
            argv.type as TYPE, argv.rarity as RARITY, argv.rules_text,
            argv.market_value);
          break;
      }
      app = new App(argv.user);
      app.addCard(cardCreator.createCard());
    })
    .command('modify', 'Modify a card of a collection', {
      user: {
        description: 'username of the user',
        type: 'string',
        demandOption: true
      },
      id: {
        description: 'Card ID',
        type: 'number',
        demandOption: true
      },
      name: {
        description: 'Card name',
        type: 'string',
        demandOption: false
      },
      mana_cost: {
        description: 'Card mana cost',
        type: 'number',
        demandOption: false
      },
      color: {
        description: 'Card color',
        type: 'string',
        demandOption: false
      },
      type: {
        description: 'Card type',
        type: 'string',
        demandOption: false
      },
      rarity: {
        description: 'Card rarity',
        type: 'string',
        demandOption: false
      },
      rules_text: {
        description: 'Card rules text',
        type: 'string',
        demandOption: false
      },
      market_value: {
        description: 'Card market value',
        type: 'number',
        demandOption: false
      },
      power: {
        description: 'Card power',
        type: 'number',
        demandOption: false
      },
      toughness: {
        description: 'Card toughness',
        type: 'number',
        demandOption: false
      },
      loyalty_marks: {
        description: 'Card loyalty marks',
        type: 'number',
        demandOption: false
      }
    }, (argv) => {
      let card: inputCardModify = {
        id_: argv.id,
        name_: argv.name,
        mana_cost_: argv.mana_cost,
        color_: argv.color,
        type_: argv.type,
        rarity_: argv.rarity,
        rules_text_: argv.rules_text,
        market_value_: argv.market_value,
        power_: argv.power,
        toughness_: argv.toughness,
        loyalty_marks_: argv.loyalty_marks
      }
      app = new App(argv.user);
      app.modifyCard(argv.id, card);
    })
    .command('remove', 'Remove a card from a collection', {
      user: {
        description: 'username of the user',
        type: 'string',
        demandOption: true
      },
      id: {
        description: 'Card ID',
        type: 'number',
        demandOption: true
      }
    }, (argv) => {
      app = new App(argv.user);
      app.removeCard(argv.id);
    })
    .command('show', 'Show the collection', {
      user: {
        description: 'username of the user',
        type: 'string',
        demandOption: true
      }
    }, (argv) => {
      app = new App(argv.user);
      app.showCollection();
    })
    .help()
    .argv
  app.saveChanges();
}

main();
