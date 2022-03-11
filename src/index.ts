import "src/styles/main.scss";

import GUI from "lil-gui";

import Metaball from "src/models/metaball";
import Circle from "src/models/circle";

import { CanvasOptions } from "./types/canvas";

interface InitOptions {
  canvas?: CanvasOptions;
  primaryRadius: number;
  intruderRadius: number;
  gravity: number;
  showOriginal: boolean;
  showGravity: boolean;
  showDistance: boolean;
}

const defaultOptions = {
  canvas: {},
  primaryRadius: 50,
  intruderRadius: 50,
  gravity: 50,
  showOriginal: false,
  showGravity: false,
  showDistance: false,
};

class App {
  el: HTMLCanvasElement;
  gui: GUI;

  intruder: Circle;
  metaball: Metaball;

  constructor(el: HTMLCanvasElement, options: InitOptions = defaultOptions) {
    this.el = el;
    this.gui = new GUI();

    options = {
      ...defaultOptions,
      ...(options || {}),
    };

    this.metaball = new Metaball(
      this.el,
      options.canvas,
      options.primaryRadius
    );
    this.intruder = new Circle(-40, -40, options.intruderRadius);
    this.metaball.render(this.intruder);

    this.el.style.cursor = "none";

    this.el.addEventListener("mousemove", (event: MouseEvent) => {
      this.intruder.center.x = event.offsetX;
      this.intruder.center.y = event.offsetY;
      this.metaball.render(this.intruder);
    });

    this.gui
      .add({ primaryRadius: options.primaryRadius }, "primaryRadius", 5, 100, 5)
      .onChange((value: number) => (this.metaball.primary.radius = value))
      .setValue(options.primaryRadius);
    this.gui
      .add(
        { intruderRadius: options.intruderRadius },
        "intruderRadius",
        5,
        100,
        5
      )
      .onChange((value: number) => (this.intruder.radius = value))
      .setValue(options.intruderRadius);
    this.gui
      .add({ gravity: options.gravity }, "gravity", 0, 100, 5)
      .onChange((value: number) => (this.metaball.threshold = value))
      .setValue(options.gravity);
    this.gui
      .add({ showOriginal: false }, "showOriginal")
      .onChange((value: boolean) => (this.metaball.showOriginal = value))
      .setValue(options.showOriginal);
    this.gui
      .add({ showGravity: false }, "showGravity")
      .onChange((value: boolean) => (this.metaball.showGravity = value))
      .setValue(options.showGravity);
    this.gui
      .add({ showDistance: false }, "showDistance")
      .onChange((value: boolean) => (this.metaball.showDistance = value))
      .setValue(options.showDistance);
  }
}

export default App;
