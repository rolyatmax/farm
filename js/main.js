// @flow

import Sketch from 'sketch-js';
import InfoBox from './info_box';
import { random } from 'utils';
import { COUNT, PROCREATE_RATE, KILL_ZONE } from './settings';
import {
  createCreature, createRandomDNA, drawCreature, updateCreature, mergeDNA,
} from './creatures';
import type { Creature } from './creatures'; // eslint-disable-line


const info = new InfoBox(document.querySelector('.info'));
setTimeout(() => info.show(), 3000);

let creatures: Creature[] = [];
const container = document.getElementById('wrapper');

const sketch = Sketch.create({
  container,
  autopause: false,
  fullscreen: false,
  retina: true,
  globals: false,
  width: container.getBoundingClientRect().width,
  height: container.getBoundingClientRect().height,

  createPopulation() {
    let i = COUNT;
    while (i--) {
      const position = [random(this.width), random(this.height)];
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
      const mate = random(procreators);
      const dna = mergeDNA(c.dna, mate.dna);
      const position = [random(this.width), random(this.height)];
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
  resize() {
    const { width, height } = container.getBoundingClientRect();
    this.canvas.style.height = `${height}px`;
    this.canvas.style.width = `${width}px`;
    this.canvas.height = height;
    this.canvas.width = width;
    this.height = height;
    this.width = width;
  },
});

window.sketch = sketch;
