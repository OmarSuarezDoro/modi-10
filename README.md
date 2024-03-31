- Autor: **Omar Suárez Doro** 
- Email: **alu0101483474@ull.edu.es**
- Asignatura: **Desarrollo de Sistemas Informáticos**
  
# Índice
- [Índice](#índice)
- [1. 📚 Introducción 📚](#1--introducción-)
- [2. 🧠 Trabajo previo 🧠](#2--trabajo-previo-)
- [3. 🖥️ Desarrollo de la práctica 🖥️](#3-️-desarrollo-de-la-práctica-️)
- [4. Conclusiones](#4-conclusiones)
- [5. Referencias](#5-referencias)

# 1. 📚 Introducción 📚
Este informe tiene como objetivo la redacción de los pasos seguidos durante el desarrollo de la séptima practica de la asignatura **Desarrollo de Sistemas Informáticos**.

# 2. 🧠 Trabajo previo 🧠

Para la realización de esta práctica, en primer lugar se han visualizado los vídeos se ha leido y entendido la documentación de [yargs](https://www.npmjs.com/package/yargs), y por otro lado, [chalk](https://www.npmjs.com/package/chalk). A su vez, se han elaborado los siguientes resumenes acerca de la configuración del repositorio.

> [!Important]
> # GitHub Actions
> 1. Nos dirigimos a la pestaña `actions` en el repositorio de GitHub. Si nos centramos en *Continuous integration workflows*, seleccionamos [Node.js](https://nodejs.org/en).
> 
> 2. La estructura del archivo `node.js.yml` es la siguiente:
> - name: Nombre del flujo de trabajo
> - Pull y Push: Cada vez que se realice un push o un pull en la rama main, se realizarán los jobs especificados.
> - jobs: Los trabajos a realizar, un ejemplo sería el siguiente.
> ```js
> name: Tests
> on:
>   push:
>      branches: [ main ]
>   pull_request:
>      branches: [ main ]
> 
> jobs:
>  build:
>    runs-on: ubuntu-latest # Se debe correr en la última versión de ubuntu estable
>
>    strategy:
>      matrix:
>        node-version: [16.x, 18.x, 19.x, 20.x, 21.x] # Se ejecuta en todos estornos.
>        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/
>
>    steps: # Pasos a arealizar
>    - uses: actions/checkout@v4
>    - name: Use Node.js ${{ matrix.node-version }}
>      uses: actions/setup-node@v4
>      with:
>        node-version: ${{ matrix.node-version }} # Configuración del entorno.
>    - run: npm install
>    - run: npm test
> ```
> 3. Realizar un commit (se habrá creado un fichero para nuestra github action).
> 4. Se puede crear un badge (opcional)
> # Integración de Coveralls en GitHub action
> 5. Desinstalamos Coveralls `npm uninstall coveralls`.
> 6. Modificación del script coverage
> ```json
> "coverage": "nyc npm test && nyc report --reporter=lcov",
> ```
> 7. Creamos en el directorio `.github/workflows` un nuevo fichero `coveralls.yml`.
>
> ```js
> name: Coveralls
> on:
>   push:
>      branches: [ main ]
>   pull:
>      branches: [ main ]
> 
> jobs:
>  build:
>
>    runs-on: ubuntu-latest
>
>    steps:
>    - name: Cloning repo
>      uses: actions/checkout@v4
>    - name: Use Node.js 21.x
>      uses: actions/setup-node@v4
>      with:
>        node-version: 21.x
>    - name: Installing dependencies
>      run: npm install
>    - name: Generating coverage information
>      run: npm run coverage
>    - name: Coveralls GitHub Action
>      uses: coverallsapp/github-action@v2.2.3
>      with:
>        github-token: ${{ secrets.GITHUB_TOKEN }}
> ```
> 
> # Integración de SonarCloud en GitHub action
> 8. Inicio de sesión en la web de [SonarCloud](https://sonarcloud.io)
> 9. Se añade el repositorio en cuestión.
> 10. Nos dirigimos a la pestaña de `Administration > Analysis Method` y desactivamos el análisis automático.
> 11. En esa misma pestaña, en el apartado `with Github Actions` hacemos click y copiamos el token.
> 12. En Github en la configuración del repositorio, concretamente en el apartado `Secrets and variables`, añadimos un nuevo secreto con la información obtenida.
> 13. En la misma página que estábamos seleccionamos la opción de JS en el siguiente paso y copiamos el contenido que se proporciona para la action.
> 
>

# 3. 🖥️ Desarrollo de la práctica 🖥️

En esta práctica se propone implementar una aplicación capaz de poder gestionar colecciones de cartas de magic de diferentes usuarios, sin la necesidad de ser de manera simultánea.

Para ello, en primer lugar, debemos definir la estructura de nuestras cartas. Esto se ha hecho en la clas `Card`:
```ts
export class Card {
  constructor(protected id_: number, protected name_: string,
    protected mana_cost_: number, protected color_: COLOR,
    protected type_: TYPE, protected rarity_: RARITY,
    protected rules_text_: string, protected market_value_: number) {
  }
  // getters & setters
}
```
Como se puede apreciar, se tienen los siguientes atributos:
- id
- nombre
- coste de mana
- color
- tipo
- rareza
- texto
- valor en mercado

Nótese que se han empleado tres tipos de datos personalizados, `COLOR`, `TYPE` y `RARITY`, que corresponden con enumerados:
```ts
export enum COLOR {
  WHITE = 'white',
  BLUE = 'blue',
  BLACK = 'black',
  RED = 'red',
  GREEN = 'green',
  NOCOLOR = 'nocolor',
  MULTICOLOR = 'multicolor'
}

export enum TYPE {
  LAND = 'land',
  CREATURE = 'creature',
  ENCHANTMENT = 'enchantment',
  INSTANT = 'instant',
  SORCERY = 'sorcery',
  ARTIFACT = 'artifact',
  PLANESWALKER = 'planeswalker'
}

export enum RARITY {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  MYTHIC = 'mythic'
}
```

Cabe aclarar que se han creado dos clases hijas `CreatureCard` y `PlanesWalkerCard` que tienen atributos adicionales:
```ts
export class CreatureCard extends Card {
  constructor(id: number, name: string, mana_cost: number, color: COLOR, type: TYPE, rarity: RARITY, rules_text: string, market_value: number, protected power_: number, protected toughness_: number) {
    super(id, name, mana_cost, color, type, rarity, rules_text, market_value);
  }
}
``` 

Como se puede apreciar, las cartas de criatura tienen:
- poder
- dureza


Mientras que los `PlanesWalkerCard`:
```ts
export class CreatureCard extends Card {
  constructor(id: number, name: string, mana_cost: number, color: COLOR, type: TYPE, rarity: RARITY, rules_text: string, market_value: number, protected power_: number, protected toughness_: number) {
    super(id, name, mana_cost, color, type, rarity, rules_text, market_value);
  }
}
```

Tienen un atributo adicional:
- puntos de lealtad


El siguiente paso, se desarrolló la clase `Database`, que permite cargar la colección de cartas de un usuario en específico:
```ts
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
```

Como se puede apreciar, se intenta leer el contenido de una carpeta que contiene el nombre del usuario, en caso de no encontrar la carpeta, se creará. En caso de existir la carpeta, inicializará las diferentes instancias de las cartas y devolverá un array de cartas con los resultados obtenidos de la búsqueda.


Por otro lado tenemos un método para escribir un conjunto de cartas que se le pase:
```ts
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
      console.log(chalk.red('[-] ') + chalk.gray('Could not read the directory.'));
    }
    console.log(chalk.green('[✓] ') + chalk.white.underline('The changes was successfully applied.'));
  }
```

Como se puede apreciar, se itera por las cartas, y se escriben en formato JSON. También nótese que si no se encuentra alguno de los archivos relativos a las cartas del conjunto, lo que se hace es eliminarlo, pues consideraremos que se ha eliminado.


Una vez se tiene una manera de poder operar con los archivos, necesitamos alguna manera de poder operar sobre el conjunto de elementos cargados. Es ahí cuando se pensó en desarrollar la clase `App`. Esta clase permite:

- Añadir cartas (se comprueba que no exista)
```ts
  addCard(cardp: Card) {
    for (const card of this.cards_) {
      if (card.id === cardp.id) {
        console.error(chalk.red('[-] ') + chalk.white('The card is already in the collection.'));
        return;
      }
    }
    this.cards_.push(cardp);
    this.saveChanges();
    console.log(chalk.green('[✓] ') + chalk.white('The card has been written successfully.'));
  }
  ```

- Eliminar cartas (se comprueba que exista la carta en al colección)
```ts
  removeCard(id: number) {
    let index = this.cards_.findIndex(card => card.id === id);
    if (index === -1) {
      console.error(chalk.red('[-] ') + chalk.white('The card is not in the collection.'));
      return;
    }
    this.cards_.splice(index, 1);
    this.saveChanges();
    console.log(chalk.green('[✓] ') + chalk.white('The card has been removed successfully.'));
  }
```

- Modificar cartas (se pasa un objeto con los nuevos valores que tomará el objeto)
```ts
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
    this.saveChanges();
    console.log(chalk.green('[✓] ') + chalk.white('The card has been modified successfully.'));
  }
```

- Mostrar las cartas de la colección
```ts
  showCollection() : void {
    console.log('----------------------------------------');
    console.log(chalk.green('The collection of ') + chalk.bold.white.underline(this.user_) + chalk.green(' is:'));
    for (const card of this.cards_) {
      console.log(card.toString());
      console.log('- - - - - - - - - - - - - - - - - - - ')
    }
    console.log('----------------------------------------');
  }
```

- Aplicando el patrón de [Factory Method](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/typescript-patterns.html#factory-method), se ha elaborado una jerarquía de clases de creación de cartas
```ts
export class CardCreator implements CardCreatorIface {
  constructor(protected id_: number, protected name_: string,
    protected mana_cost_: number, protected color_: COLOR,
    protected type_: TYPE, protected rarity_: RARITY,
    protected rules_text_: string, protected market_value_: number) {
  }
  public createCard(): Card {
    return new Card(this.id_, this.name_, this.mana_cost_, this.color_, this.type_, this.rarity_, this.rules_text_, this.market_value_);
  }
}

export class CreatureCardCreator extends CardCreator {
  constructor(id: number, name: string, mana_cost: number, color: COLOR, type: TYPE, rarity: RARITY, rules_text: string, market_value: number, protected power_: number, protected toughness_: number) {
    super(id, name, mana_cost, color, type, rarity, rules_text, market_value);
  }
  public createCard(): Card {
    return new CreatureCard(this.id_, this.name_, this.mana_cost_, this.color_, this.type_, this.rarity_, this.rules_text_, this.market_value_, this.power_, this.toughness_);
  }
}

export class PlanesWalkerCardCreator extends CardCreator {
  constructor(id: number, name: string, mana_cost: number, color: COLOR, type: TYPE, rarity: RARITY, rules_text: string, market_value: number, protected loyalty_marks_: number) {
    super(id, name, mana_cost, color, type, rarity, rules_text, market_value);
  }
  public createCard(): Card {
    return new PlanesWalkerCard(this.id_, this.name_, this.mana_cost_, this.color_, this.type_, this.rarity_, this.rules_text_, this.market_value_, this.loyalty_marks_);
  }
}
```

- Guardar los cambios en la base de datos
```ts
  saveChanges() {
    this.database_.writeCards(this.user_, this.cards_);
  }
```

---
Finalmente, queda controlar la manera en la que se ingresan los inputs por línea de comando. Dicho control se lleva a cabo en el fichero `index.ts`. Este control se lleva a cabo haciendo uso de las funcionalidades proporcionadas por yargs. No se ha incluido el código en el informe pues se considera redundante, lo único destacable son los parámetros que son obligatorios y otros opcionales.


## Modificación
En la modificación se propuso implementar un sistema que permitiese la extracción de información de una instancia del problema de la mochila de archivos que tienen diferente formato. Por un lado tenemos archivos JSON y archivos CSV. Se pedía la implementación de un método plantilla que tuviese un único método `procesar`, que extrae la información y devuelve dos arrays, uno con los pesos de los elementos, y por otro lado, un array con los beneficios de cada elemento.

En primer lugar, se deasrrolló una clase abstracta `Process` que definira, la interfaz común que compartirá las clases de procesamiento. Además implementará el método plantilla `run`, que contiene un método abstracto procesar que deberá ser implementado en las clases hijas.

```ts
export abstract class Process {
  protected result_: [number[], number[]] = [[],[]];
  protected num_elementos_ : number = -1;
  protected capability_ : number = -1;
  constructor(protected file_path_ : string) {}
  // Método plantilla
  run() {
    this.beforeProcesar();
    this.result_ =  this.procesar();
    this.afterProcesar();
  }
  // Método a implementar en clases hijas
  abstract procesar(): [number[], number[]];
  // hooks
  beforeProcesar() : void {}
  afterProcesar() : void {}
  //  Getters
}
```

A continuación se implementaron las dos clase hijas, solo se va a comentar el código relativo al método abstracto obligatorio a implementar. Las clases en cuestión `ProcessJSON`:
```ts
  procesar(): [number[], number[]] {
    let fileContent : string = fs.readFileSync(this.file_path_).toString();
    let json_parsed: inputJsonFormat = JSON.parse(fileContent);
    this.num_elementos_ = json_parsed.numElementos;
    this.capability_ = json_parsed.capacidad;
    let weightArray: number[] = []; 
    let benefitArray: number[] = []; 
    json_parsed.elementos.forEach((element : Product) => {
      weightArray.push(element.peso);
      benefitArray.push(element.beneficio);
    })
    return [weightArray,benefitArray];
  }
```
Solo queda aclarar que `inputJsonFormat` y `Product`son tipos personalizados creados con el objetivo de poder tipar los datos leidos del archivo.

Por otro lado, la clase `ProcessCsv` tiene la siguiente implementación del método procesar:
```ts
  procesar(): [number[], number[]] {
    let fileContent : string = fs.readFileSync(this.file_path_).toString();
    let stringSplitted : string[] = fileContent.split('\n'); 
    this.capability_ = +stringSplitted[0];
    this.num_elementos_ = +stringSplitted[1];
    stringSplitted.splice(0,2);
    let weightArray: number[] = []; 
    let benefitArray: number[] = []; 
    stringSplitted.forEach((element: string) => {
      let splittedElement : string[] = element.split(',');
      weightArray.push(+splittedElement[1]);
      benefitArray.push(+splittedElement[2]);
    })
    return [weightArray,benefitArray];
  }
```

# 4. Conclusiones
Tras la realización de la práctica se ha comprendido perfectamente el funcionamiento del paquete xargs y chalk. Además de aprender el manejo de la API sícrona de node File System.

# 5. Referencias
- [Documentación del módulo FileSystem de Node](https://nodejs.org/api/fs.html)
- [Vídeo acerca del FileSystem de Node](https://www.youtube.com/watch?v=8JYBwCaZviE)