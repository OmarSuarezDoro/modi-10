import { describe, it } from 'mocha';
import { expect } from "chai";
import { ProcessJson } from "../src/Modificacion/ProcessJson.js"
import { ProcessCsv } from '../src/Modificacion/ProcessCsv.js'


describe('Tests of the class ProcessJSON', () => {
  let processjson1 : ProcessJson;
  beforeEach(() => {
    processjson1 = new ProcessJson('./src/Modificacion/test.json');
    processjson1.run();
  });

  it('should create an instance of Processjson', () => {
    expect(processjson1).to.be.instanceof(ProcessJson);
  });

  it('should process in a right way', () => {
    expect(processjson1.procesar()).to.be.eql([[1,2,2],[3,3,5]]);
  })

  it('should return the correct number of elements', () => {
    expect(processjson1.numElementos).to.be.eql(3);
  })

  it('should return the correct capability of the bag', () => {

    expect(processjson1.capability).to.be.eql(10);
  })

  it('should return the correct result', () => {
    expect(processjson1.result).to.be.eql([[1,2,2],[3,3,5]]);
  })

  it('shoudld return the correct string', () =>{
    expect(processjson1.afterProcesar()).to.be.eql("Se acaba de procesar el JSON");
  })
});




describe('Tests of the class ProcessCSV', () => {
  let processCSV : ProcessCsv;
  beforeEach(() => {
    processCSV = new ProcessCsv('./src/Modificacion/test1.csv');
    processCSV.run();
  });

  it('should create an instance of ProcessCsv', () => {
    expect(processCSV).to.be.instanceof(ProcessCsv);
  });

  it('should process in a right way', () => {
    expect(processCSV.procesar()).to.be.eql([[10,3,1],[2,6,4]]);
  })

  it('should return the correct number of elements', () => {
    expect(processCSV.numElementos).to.be.eql(3);
  })

  it('should return the correct capability of the bag', () => {

    expect(processCSV.capability).to.be.eql(10);
  })

  it('should return the correct result', () => {
    expect(processCSV.result).to.be.eql([[10,3,1],[2,6,4]]);
  })

  it('shoudld return the correct string', () =>{
    expect(processCSV.afterProcesar()).to.be.eql("Se acaba de procesar el CSV");
  })
});