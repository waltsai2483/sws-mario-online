import { TilemapObjectType, Game, NodeGroup, GameObjectType, EnemyObjectType } from "../lib/GameConstants";
import { UIData } from "../ui/UIData";
import BlockController from "./controller/BlockController";
import EnemyController from "./controller/EnemyController";
import DropObject from "./controller/object/DropObject";

const { ccclass, property } = cc._decorator;

@ccclass("PrefabItem")
export class TilemapObjectData {
    @property({ type: cc.Enum(TilemapObjectType), serializable: true })
    type: TilemapObjectType = TilemapObjectType.brick;

    @property(cc.Prefab)
    prefab: cc.Prefab;

    @property(cc.Integer)
    variant: number = 0;
}

@ccclass("GamePrefabItem")
export class GameObjectData {
    @property({ type: cc.Enum(GameObjectType), serializable: true })
    type: GameObjectType = GameObjectType.red_mushroom;

    @property(cc.Prefab)
    prefab: cc.Prefab;
}

@ccclass("EnemyPrefabItem")
export class EnemyData {
    @property({ type: cc.Enum(EnemyObjectType), serializable: true })
    type: EnemyObjectType = EnemyObjectType.goomba;

    @property(cc.Prefab)
    prefab: cc.Prefab;

    @property(cc.Integer)
    variant: number = 0;
}

@ccclass("LevelData")
export class LevelData {
    @property(cc.String)
    name: string = ""

    @property(cc.TiledMapAsset)
    asset: cc.TiledMapAsset;
}

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Node)
    public canvas: cc.Node;
    @property(cc.Node)
    public enemies: cc.Node;
    @property(cc.Node)
    public player: cc.Node;
    @property(cc.Node)
    public ui: cc.Node;
    @property(cc.TiledMap)
    public tilemap: cc.TiledMap;
    public flowers: cc.Node;

    @property({ type: [LevelData] })
    levels: LevelData[] = [];

    @property(cc.Prefab)
    public scorePrefab: cc.Prefab;

    @property({ type: [TilemapObjectData] })
    public tilemapPrefabs: TilemapObjectData[] = [];
    public tilemapPrefabMap: Map<number, TilemapObjectData> = new Map();

    @property({ type: [GameObjectData] })
    public gamePrefabs: GameObjectData[] = [];
    public gamePrefabMap: Map<GameObjectType, GameObjectData> = new Map();

    @property({ type: [EnemyData] })
    public enemyPrefabs: EnemyData[] = [];
    public enemyPrefabMap: Map<EnemyObjectType, EnemyData> = new Map();

    public fullblock: cc.TiledLayer;
    
    protected onLoad(): void {
        this.flowers = this.tilemap.node.getChildByName("decoration");
        this.player.setParent(this.tilemap.node.getChildByName("player"));
        cc.director.getPhysicsManager().enabled = true;
        Game.manager = this;
        for (let item of this.tilemapPrefabs) {
            this.tilemapPrefabMap.set(item.type, item);
        }
        for (let item of this.gamePrefabs) {
            this.gamePrefabMap.set(item.type, item);
        }
        for (let item of this.enemyPrefabs) {
            this.enemyPrefabMap.set(item.type, item);
        }
    }

    protected start(): void {
        let tiledSize = this.tilemap.getTileSize();
        let layer: cc.TiledLayer = null;
        layer = this.tilemap.getLayer("fullblocked");
        layer.node.addComponent(cc.RigidBody).type = cc.RigidBodyType.Static;

        let layerSize = layer.getLayerSize();
        const originX = -layerSize.width * tiledSize.width / 2;
        const originY = -layerSize.height * tiledSize.height / 2;

        for (let i = 0; i < layerSize.width; i++) {
            let colliderExtended = false;
            let collider: cc.PhysicsBoxCollider;
            for (let j = 0; j < layerSize.height; j++) {
                let tile = layer.getTiledTileAt(i, j, true);
                if (tile.gid != 0) {
                    if (colliderExtended) {
                        collider.offset = collider.offset.add(cc.v2(0, -8));
                        collider.size = cc.size(collider.size.width, collider.size.height + tiledSize.height);
                        collider.apply();
                    } else {
                        layer.node.group = NodeGroup.block;
                        collider = layer.node.addComponent(cc.PhysicsBoxCollider);
                        collider.offset = cc.v2(originX + i * tiledSize.width + tiledSize.width / 2, originY + (layerSize.height - j - 1) * tiledSize.height + tiledSize.height / 2);
                        collider.size = tiledSize;
                        collider.friction = 0;
                        collider.apply();
                        colliderExtended = true;
                    }
                } else {
                    colliderExtended = false;
                }
            }
        }

        layer = this.tilemap.getLayer("topblocked");
        layerSize = layer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tile = layer.getTiledTileAt(i, j, true);
                if (tile.gid != 0) {
                    layer.node.group = NodeGroup.penetratableBlock;

                    let rigidbody = layer.node.addComponent(cc.RigidBody);
                    rigidbody.type = cc.RigidBodyType.Static;

                    let collider = layer.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(originX + i * tiledSize.width + tiledSize.width / 2, originY + (layerSize.height - j - 1) * tiledSize.height + tiledSize.height / 2);
                    collider.size = cc.size(tiledSize.width, tiledSize.height);
                    collider.friction = 0;
                    collider.apply();
                }
            }
        }

        layer = this.tilemap.getLayer("object");
        layerSize = layer.getLayerSize();

        for (let i = 0; i < layerSize.width; i++) {
            for (let j = 0; j < layerSize.height; j++) {
                let tile = layer.getTiledTileAt(i, j, true);
                if (this.tilemapPrefabMap.has(tile.gid)) {
                    let objData = this.tilemapPrefabMap.get(tile.gid);
                    let block = cc.instantiate(objData.prefab);
                    block.position = cc.v3(originX + i * tiledSize.width + tiledSize.width / 2, originY + (layerSize.height - j - 1) * tiledSize.height + tiledSize.height / 2);

                    let controller = block.getComponents(cc.Component).find((component) => component instanceof BlockController);
                    if (controller != null) {
                        controller.variant = objData.variant;
                    }
                    this.tilemap.node.addChild(block);
                } else if (tile.gid == 269) {
                    let coin = cc.instantiate(this.gamePrefabMap.get(GameObjectType.coin).prefab);
                    coin.position = cc.v3(originX + i * tiledSize.width + tiledSize.width / 2, originY + (layerSize.height - j - 1) * tiledSize.height + tiledSize.height / 2);
                    coin.getComponent(cc.RigidBody).gravityScale = 0;
                    coin.getComponent(cc.PhysicsBoxCollider).tag = -2;
                    this.tilemap.node.addChild(coin);
                } else if (tile.gid == 25) {
                    let flower = cc.instantiate(this.enemyPrefabMap.get(EnemyObjectType.flower).prefab);
                    flower.position = cc.v3(originX + i * tiledSize.width + tiledSize.width / 2, originY + (layerSize.height - j - 1) * tiledSize.height + tiledSize.height / 2);
                    flower.position = flower.position.add(cc.v3(8, -8));
                    flower.getComponent(cc.RigidBody).gravityScale = 0;
                    this.flowers.addChild(flower);
                }
            }
        }
        layer.node.removeFromParent();

        let enemies = this.tilemap.getObjectGroup("enemy").getObjects();
        for (let enemy of enemies) {
            let data = this.enemyPrefabMap.get(enemy.type);
            let enemyObject = cc.instantiate(data.prefab);
            enemyObject.position = cc.v3(originX + enemy.x, originY + enemy.y);

            let controller = enemyObject.getComponents(cc.Component).find((component) => component instanceof EnemyController);
            if (controller != null) {
                controller.variant = data.variant;
            }
            this.enemies.addChild(enemyObject);
        }

        this.schedule(() => UIData.time = Math.max(UIData.time - 1, 0), 1);
    }
}
