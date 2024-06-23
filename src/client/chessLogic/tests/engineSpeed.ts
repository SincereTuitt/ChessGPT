import {getEngineMove} from "../engine";
import { board, engineFunc } from "../types";

// These the only value that should be changed
const engines = [getEngineMove];
const depth = 1;
const rounds = 5;

const testBoard: board = [
  ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw'],
  ['pw', 'pw', '-', '-', '-', 'pw', 'pw', 'pw'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['-', '-', '-', '-', '-', '-', '-', '-'],
  ['pb', 'pb', '-', '-', '-', 'pb', 'pb', 'pb'],
  ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
];
const canCastle = {rb0: false, rb7: false, kb: false, rw0: false, rw7: false, kw: false};


function compareEngineSpeeds (engines: engineFunc[], depth: number, rounds: number): string {
  const speeds : number[] = [];
  let output: string = '';

  engines.forEach((engine) => {
    const t1 = Date.now();
    for (let i = 0; i < rounds; i++) {
      engine(
        depth,
        'w',
        testBoard,
        canCastle,
        false
      );
    }
    const t2 = Date.now();
    speeds.push(t2 - t1)
  })

  output += `Each engine ran ${rounds} times at depth ${depth}.\n\n`;
  speeds.forEach((speed, index) => {
    const result = `Function ${index + 1} took ${speed} milliseconds to complete\n`;
    output += result;
  })
  return output;
}

console.log(compareEngineSpeeds(
  engines,
  depth,
  rounds
));