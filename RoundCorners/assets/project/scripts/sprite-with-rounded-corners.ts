import {_decorator, CCBoolean, Component, Material, Sprite, UITransform, Vec2, assetManager, EffectAsset, CCInteger} from 'cc';

class Constants {
    public static SPRITE_TEXTURE: string = "spriteTexture";
    public static RADIUS: string = "radius";
    public static SIZE: string = "size";
}

@_decorator.ccclass('SpriteWithRoundedCorners')
@_decorator.executeInEditMode
export class SpriteWithRoundedCorners extends Component {
    @_decorator.property(CCInteger) public radius: number = 0;
    @_decorator.property(CCBoolean) private is_edit_mode: boolean;

    private declare _sprite: Sprite;
    private declare _material: Material;
    private declare _uiTransform: UITransform;

    protected onLoad(): void {
        this._sprite = this.getComponent(Sprite);
        this._uiTransform = this.getComponent(UITransform);

        this.validate();
    }

    protected update(): void {
        if (this.is_edit_mode) {
            this.validate();
        }
    }

    private validate(): void {
        // Well, that's pretty lame, but it's the best way to do it for now
        // (so you can use this component in the edit mode)

        // All you have to do is copy the uuid from the effect and paste it here:
        const uuid: string = "66faad1e-c36c-4c15-ad33-723feba537b3";

        let effect: EffectAsset = new EffectAsset();

        assetManager.loadAny({uuid: uuid, type: EffectAsset}, (err, effectAsset) => {
            if (err) {
                console.warn("Cannot load effect!");
                return;
            }

            effect = effectAsset;

            this._material = new Material();
            this._material.reset({ effectAsset: effect });

            this._sprite.setSharedMaterial(this._material, 0);
            this._sprite.customMaterial = this._material;

            this._sprite.getMaterialInstance(0).recompileShaders({ USE_LOCAL: true, USE_TEXTURE: true });

            this.updateProperties();
        });
    }

    private updateProperties(): void {
        if (!this._material) {
            return;
        }

        const frame = this._sprite.spriteFrame;

        if (!frame.texture) {
            return;
        }

        const size = this._uiTransform.contentSize;
        const sizeVector = new Vec2(size.x, size.y);

        this._material.setProperty(Constants.SIZE, sizeVector);
        this._material.setProperty(Constants.SPRITE_TEXTURE, frame.texture);
        this._material.setProperty(Constants.RADIUS, this.radius);

        this._sprite.setMaterialInstance(this._material, 0);
        this._sprite.setSharedMaterial(this._material, 0);
    }
}