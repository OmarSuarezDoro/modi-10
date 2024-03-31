import  { Process } from './Process.js'
import fs from 'fs';

/**
 * This class processCsv files
 */
export class ProcessCsv extends Process {
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
    // console.log([weightArray,benefitArray]);
    return [weightArray,benefitArray];
  }
  afterProcesar(): string {
    return "Se acaba de procesar el CSV";
  }

}