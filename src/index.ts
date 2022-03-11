import "src/styles/main.scss";

import GUI from "lil-gui";

import Plant from "src/models/plant";
import Sun from "src/models/sun";
import Animation from "src/models/animation";

import { PlantOptions } from "./types/plant";
import { SunOptions } from "./types/sun";
import { CanvasOptions } from "./types/canvas";

interface InitOptions {
  canvas?: CanvasOptions;
  plant?: PlantOptions;
  sun?: SunOptions;
}

const defaultOptions = {
  canvas: {
    width: 500,
    height: 500,
  },
  plant: {
    branches: 2,
  },
  sun: {
    power: 0.85,
  },
};

class App {
  el: HTMLDivElement;
  gui: GUI;

  sun: Sun;
  plant: Plant;
  growth: Animation;

  constructor(el: HTMLDivElement, options: InitOptions = defaultOptions) {
    this.el = el;
    this.gui = new GUI();

    options = {
      ...defaultOptions,
      ...(options || {}),
    };

    let isAnimated = true;
    const canvasOptions = {
      ...(options.canvas || {
        width: 500,
        height: 500,
      }),
    };
    this.sun = new Sun(this.el, canvasOptions, {
      power: options.sun.power || 0.85,
    });
    this.plant = new Plant(this.el, canvasOptions, {
      branches: options.plant.branches || 2,
    });
    this.growth = new Animation(() => this.plant.grow(this.sun), 30);

    this.el.addEventListener("mousemove", (event: MouseEvent) => {
      this.sun.position.x = event.offsetX;
      this.sun.position.y = event.offsetY;
      this.sun.render();
    });

    this.el.addEventListener("click", (event: MouseEvent) => {
      this.sun.position.x = event.offsetX;
      this.sun.position.y = event.offsetY;
      this.sun.opacity = isAnimated ? 1 : 0.25;
      this.sun.render();

      this.growth.animate(isAnimated);
      isAnimated = !isAnimated;
    });

    this.gui
      .add({ branches: options.plant.branches || 2 }, "branches", 1, 16, 1)
      .onChange(
        (maxBranching: number) => (this.plant.maxBranching = maxBranching)
      );
    this.gui
      .add(
        { solarPower: (options.sun.power || 0.85) * 100 },
        "solarPower",
        1,
        100,
        5
      )
      .onChange((solarPower: number) => (this.sun.power = solarPower / 100));
    this.gui.add({ reset: () => this.reset() }, "reset");
  }

  reset() {
    this.plant.init();
    this.plant.ctx.clearRect(0, 0, this.plant.width, this.plant.height);
  }
}

export default App;
