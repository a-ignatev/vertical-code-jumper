import { Graphics } from "engine/core/Graphics";
import { Entity } from "engine/entities/Entity";
import { AnimatedImage } from "./AnimatedImage";
import { Component } from "./Component";
import { IRenderable } from "./IRenderable";

export class AnimationSet<Name extends string>
  extends Component
  implements IRenderable
{
  private currentAnimation: Name;
  private animations: Record<Name, AnimatedImage | null>;

  constructor(
    entity: Entity,
    animations: Record<Name, AnimatedImage | null>,
    startAnimation: Name
  ) {
    super(entity);

    this.animations = animations;
    this.currentAnimation = startAnimation;
  }

  setCurrentAnimation(name: Name) {
    this.currentAnimation = name;
  }

  update(delta: number) {
    this.getCurrentAnimation().update(delta);
  }

  render(graphics: Graphics) {
    this.getCurrentAnimation().render(graphics);
  }

  getCurrentAnimation() {
    const animation = this.animations[this.currentAnimation];

    if (!animation) {
      throw new Error(
        `Animation "${this.currentAnimation.toString()}" not found!`
      );
    }

    return animation;
  }

  getAnimation(name: Name) {
    return this.animations[name];
  }

  destroy(): void {}
}
