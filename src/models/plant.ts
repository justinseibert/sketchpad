import { minBy } from "lodash";

import Point from "src/models/point";
import Node from "src/models/node";
import Sun from "src/models/sun";
import Canvas from "src/models/canvas";

import { chance } from "src/utils/math";

import { CanvasOptions } from "src/types/canvas";
import { PlantOptions } from "src/types/plant";

class Plant extends Canvas {
  nodeTree: Node;
  nodeCount: number;
  maxBranching: number;
  sun: Sun;

  constructor(
    container: HTMLDivElement,
    options: CanvasOptions,
    plantOptions: PlantOptions
  ) {
    super(container, options);
    this.init();
    this.maxBranching = plantOptions.branches || 2;
  }

  public init() {
    const stem = new Point(this.center.x, this.height);
    this.nodeTree = new Node(stem);
    this.nodeCount = 1;
  }

  private _addStem(sun: Sun) {
    let traversal = 0;
    let node = this.nodeTree;
    while (traversal < this.nodeCount) {
      const childCount = node.children.length;
      if (childCount < this.maxBranching) {
        return node.addChild(sun);
      } else {
        if (chance(sun.power).bool) {
          // either find child node closest to sun
          node = minBy(node.children, (child: Node) => {
            const distance = child.origin.distanceFrom(sun.position);
            return distance;
          });
        } else {
          // or some percentage of the time, choose the smallest branch
          node = minBy(node.children, (child: Node) => {
            return child.weight;
          });
        }
      }
      traversal++;
    }
    return node;
  }

  public grow(sun: Sun) {
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "rgba(180,180,180,0.25)";

    let node = this._addStem(sun);
    if (!node) {
      return;
    }

    this.nodeCount++;
    const baseWeight = this.nodeTree.children[0].weight;
    const maxWeight = (this.nodeCount / baseWeight) * 5;
    while (node.parent) {
      this.ctx.lineWidth = maxWeight * (node.weight / (baseWeight + maxWeight));
      this.ctx.beginPath();
      this.ctx.moveTo(node.origin.x, node.origin.y);
      this.ctx.lineTo(node.parent.origin.x, node.parent.origin.y);
      this.ctx.stroke();
      node.addWeight();
      node = node.parent;
    }
  }
}

export default Plant;
