// @flow

import Sketch from 'sketch-js';
import { rand } from './utils';
import { COUNT, PROCREATE_RATE, KILL_ZONE } from './settings';
import {
  createCreature, createRandomDNA, drawCreature, updateCreature, mergeDNA,
} from './creatures';
import type { Creature } from './creatures'; // eslint-disable-line


let creatures: Creature[] = [];

const sketch = Sketch.create({
  autopause: false,
  container: document.getElementById('wrapper'),

  createPopulation() {
    let i = COUNT;
    while (i--) {
      const position = [rand(this.width), rand(this.height)];
      const dna = createRandomDNA();
      const birthdate = this.millis;
      creatures.push(createCreature(position, birthdate, dna));
    }
  },
  setup() {
    this.createPopulation();
  },
  update() {
    creatures = creatures.filter((c) => c.birthdate + c.lifespan > this.millis);
    creatures = creatures.filter((c) => {
      if (!this.dragging) return true;
      const dX = c.position[0] - this.mouse.x;
      const dY = c.position[1] - this.mouse.y;
      return Math.sqrt(dX * dX + dY * dY) > KILL_ZONE + c.size;
    });
    creatures.forEach((c) => updateCreature(this, c));
    const procreators = creatures.filter(() => Math.random() < PROCREATE_RATE);
    procreators.forEach((c) => {
      const mate = procreators[rand(procreators.length)];
      const dna = mergeDNA(c.dna, mate.dna);
      const position = [rand(this.width), rand(this.height)];
      const birthdate = this.millis;
      creatures.push(createCreature(position, birthdate, dna));
    });
    if (!creatures.length) this.createPopulation();
  },
  draw() {
    creatures.forEach((c) => drawCreature(this, c));
  },
  keydown() {
    if (this.keys.SPACE) this.toggle();
  },
});

window.sketch = sketch;
