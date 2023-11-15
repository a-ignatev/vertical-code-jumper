import { Component } from "engine/components/Component";
import { Entity } from "engine/entities/Entity";
import { CoffeeMug } from "game/entities/CoffeeMug";
import { Guy } from "game/entities/Guy";

const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";
export const SIDE_SPEED = 225;

export class PlayerController extends Component {
  constructor(entity: Entity) {
    super(entity);

    this.spawnMug = this.spawnMug.bind(this);
    this.getEntity()
      .getScene()
      .getSceneManager()
      .subscribeToKey("m", this.spawnMug);
  }

  private spawnMug() {
    this.getEntity().getScene().spawnEntity("mug", CoffeeMug);
  }

  update() {
    const guy = this.getEntity() as Guy;
    const holdingKeys = guy.getScene().getSceneManager().getHoldingKeys();

    const isHoldingLeft = holdingKeys.includes(LEFT_KEY);
    const isHoldingRight = holdingKeys.includes(RIGHT_KEY);

    if (isHoldingLeft) {
      guy.setSpeedX(-SIDE_SPEED);
    }

    if (isHoldingRight) {
      guy.setSpeedX(SIDE_SPEED);
    }

    if (!isHoldingLeft && !isHoldingRight) {
      guy.setSpeedX(0);
    }
  }

  destroy(): void {
    this.getEntity()
      .getScene()
      .getSceneManager()
      .unsubscribeFromKey("m", this.spawnMug);
  }
}
