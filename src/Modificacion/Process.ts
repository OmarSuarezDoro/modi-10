/**
 * Univeridad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Novena práctica de la asignatura DSI
 * Realizada por: Omar Suárez Doro
 * Correo: alu0101483474@ull.edu.es
 */

/**
 * This class represents a Base Class which implements Template Method
 */
export abstract class Process {
  protected result_: [number[], number[]] = [[],[]];
  protected num_elementos_ : number = -1;
  protected capability_ : number = -1;
  constructor(protected file_path_ : string) {}
  /**
   * This is the template Method, call the others methods
   */
  run() {
    this.beforeProcesar();
    this.result_ =  this.procesar();
    this.afterProcesar();
  }
  /**
   * The mandatory method procesar, read the content of the file and parses it
   * @returns The [[benefit], [weight]] of each element
   */
  abstract procesar(): [number[], number[]];

  /**
   * This method print the result of process in a different way
   * It is not mandatory
   */
  beforeProcesar() : void {}

  /**
   * This method sort the values of the result
   */
  afterProcesar() : void {}

  /**
   * Getter for the attribute numElementos
   */
  get numElementos() : number {
    return this.num_elementos_;
  }
  /**
   * Getter for the attribute capability
   */
  get capability() : number {
    return this.capability_;
  }
    /**
   * Getter for the attribute result
   */
  get result() : [number[], number[]] {
    return this.result_;
  }
}