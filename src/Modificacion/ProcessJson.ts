import  { Process } from './Process.js'
import fs from 'fs';

/**
 * Custom type to represent Products
 */
export type Product = {
  númElemento: number,
  peso: number,
  beneficio: number
}
/**
 * Custom type to represent the input JSON Format
 */
export type inputJsonFormat = {
  capacidad: number,
  numElementos: number,
  elementos: []
}

/**
 * This class process Json files
 */
export class ProcessJson extends Process {
  /**
   * This is the constructor of the class that calls the father constructor
   * @param filep Is the file path
   */
  constructor(filep : string) {
    super(filep);
  }
  /**
   * This is the implementation of the abstract method of the classs which has the template method
   * @returns Two Arrays [weight, benefit] processed by the problem
   */
  procesar(): [number[], number[]] {
    let fileContent : string = fs.readFileSync(this.file_path_).toString();
    let json_parsed: inputJsonFormat = JSON.parse(fileContent);
    // console.log(json_parsed);
    this.num_elementos_ = json_parsed.numElementos;
    this.capability_ = json_parsed.capacidad;
    // console.log(this.num_elementos_, this.capability_);
    let weightArray: number[] = []; 
    let benefitArray: number[] = []; 
    json_parsed.elementos.forEach((element : Product) => {
      weightArray.push(element.peso);
      benefitArray.push(element.beneficio);
    })
    // console.log([weightArray,benefitArray])
    return [weightArray,benefitArray];
  }
  afterProcesar(): string {
    return "Se acaba de procesar el JSON";
  }
}