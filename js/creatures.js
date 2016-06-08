// @flow

import expect from 'expect';


type vector = [number, number]; // each up to 3 digits
type color = [number, number, number, number]; // each up to 255

type creature = {
  dna: string,
  lifespan: number,
  birthdate: number,
  position: vector,
  velocity: vector
};

type creatureProps = {
  size: number, // 2 digits
  color: color
};

const pI = (val) => parseInt(val, 10);

export function dnaToProps(dna: string): creatureProps {
  return {
    size: pI(dna.slice(0, 2)),
    color: [
      pI(dna.slice(2, 5)),
      pI(dna.slice(5, 8)),
      pI(dna.slice(8, 11)),
      pI(dna.slice(11, 14)),
    ],
  };
}

export function mergeDNA(dna1: string, dna2: string): string {
  const cut = (Math.random() * dna1.length) | 0;
  return dna1.slice(0, cut) + dna2.slice(cut);
}

export function createCreature(position: vector, dna: string): creature {
  const lifespan = 10000;
  const birthdate = Date.now();
  const velocity = [0, 0];
  return { dna, lifespan, birthdate, position, velocity };
}


// ******** tests ********

expect(mergeDNA('abcdefg', 'hijklmn').length).toBe(7, 'mergeDNA: output length does not match');
const dnaTestIn = ['12', '053', '012', '245', '111'].join('');
const dnaTestOut = dnaToProps(dnaTestIn);
expect(dnaTestOut).toEqual({
  size: 12,
  color: [53, 12, 245, 111],
}, `dnaToProps: output does not match input.\n\ninput: ${dnaTestIn} \n\noutput: ${dnaTestOut}`);
console.log('Tests pass!');
