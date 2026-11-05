import Phaser from 'phaser'
import { registerAnimations } from '@/game/characters/CharacterAnimations'
import { generateSpritesheet } from '@/game/characters/CharacterSpritesheetGenerator'
import { HeroCharacter } from '@/game/characters/HeroCharacter'
import { InputController } from '@/game/characters/InputController'
import {
  ISLAND_DEFS, OPEN_PAGE_EVENT, WALK_TO_EVENT,
  islCX, islSurface, islW,
  type IslandDef,
} from '@/game/environments/IslandDefinitions'
import { SCENE_KEYS } from '@/types/game'

// Custom event to pause/resume keyboard from React
export const KB_DISABLE_EVENT = 'game:disableKeyboard'
export const KB_ENABLE_EVENT  = 'game:enableKeyboard'

const PROXIMITY = 100

export class GameScene extends Phaser.Scene {
  private hero!:         HeroCharacter
  private inputCtrl!:    InputController
  private platforms!:    Phaser.Physics.Arcade.StaticGroup
  private stateText!:    Phaser.GameObjects.Text
  private nearbyIsland:  IslandDef | null = null
  private walking        = false
  private walkTargetX    = 0
  private keysDisabled   = false   // true when a React overlay is open

  constructor() { super({ key: SCENE_KEYS.GAME }) }

  create(): void {
    const W=this.scale.width, H=this.scale.height
    this.physics.world.setBounds(0,0,W,H)
    this.cameras.main.setBounds(0,0,W,H)

    generateSpritesheet(this as unknown as Phaser.Scene)
    registerAnimations(this as unknown as Phaser.Scene)
    this.createPlatforms(W,H)

    const f=ISLAND_DEFS[0]
    this.hero = new HeroCharacter(
      this as unknown as Phaser.Scene,
      islCX(f,W) - islW(f,W)*0.10,
      islSurface(f,W,H) - 44,
    )
    this.physics.add.collider(
      this.hero as unknown as Phaser.Physics.Arcade.Sprite,
      this.platforms,
    )
    this.inputCtrl = new InputController(this as unknown as Phaser.Scene)

    // Debug HUD
    this.stateText = this.add.text(10,10,'',{
      fontFamily:'monospace',fontSize:'9px',color:'#6d28d9',
      backgroundColor:'#0a051888',padding:{x:3,y:2},
    }).setScrollFactor(0).setDepth(100).setAlpha(0.6)

    // Listen for keyboard disable/enable from React overlays
    const onDisable = () => {
      this.keysDisabled = true
      // Tell Phaser to stop capturing keyboard events so the browser gets them
      this.input.keyboard?.disableGlobalCapture()
    }
    const onEnable = () => {
      this.keysDisabled = false
      this.input.keyboard?.enableGlobalCapture()
    }
    window.addEventListener(KB_DISABLE_EVENT, onDisable)
    window.addEventListener(KB_ENABLE_EVENT,  onEnable)

    window.addEventListener(WALK_TO_EVENT,(e:Event)=>{
      const {x}=(e as CustomEvent<{id:string;x:number}>).detail
      this.startWalkTo(x)
    })

    this.scale.on('resize',(s:Phaser.Structs.Size)=>this.handleResize(s.width,s.height))
  }

  private createPlatforms(W: number, H: number): void {
    this.platforms = this.physics.add.staticGroup()
    // Ground
    this.addPlat(W/2, H*0.88, W, 16)
    // Island surfaces
    for (const isl of ISLAND_DEFS) {
      this.addPlat(islCX(isl,W), islSurface(isl,W,H), islW(isl,W)*0.78, 10)
    }
    // Bridge platforms
    for (let i=0;i<ISLAND_DEFS.length-1;i++) {
      const a=ISLAND_DEFS[i],b=ISLAND_DEFS[i+1]
      const ax=islCX(a,W),bx=islCX(b,W)
      const ay=islSurface(a,W,H),by=islSurface(b,W,H)
      for (let s=1;s<5;s++) {
        const t=s/5
        const px=ax+(bx-ax)*t
        const sag=Math.sin(t*Math.PI)*Math.min(26,(bx-ax)*0.05)
        this.addPlat(px,ay+(by-ay)*t+sag+5,Math.max(52,(bx-ax)*0.12),10)
      }
    }
  }

  private addPlat(cx:number,cy:number,w:number,h:number): void {
    const r=this.add.rectangle(cx,cy,w,h,0,0)
    this.physics.add.existing(r,true)
    this.platforms.add(r)
  }

  startWalkTo(targetX: number): void {
    this.walking=true; this.walkTargetX=targetX
    this.hero.setFlipX(targetX<this.hero.x)
  }

  update(_t: number, delta: number): void {
    if (!this.hero||!this.inputCtrl) return
    // When a React page is open, freeze the character — don't read any input
    if (this.keysDisabled) {
      const body=this.hero.body as Phaser.Physics.Arcade.Body
      body.setVelocityX(0)
      this.hero.update({left:false,right:false,jump:false,attack:false,interact:false,explore:false,run:false},delta)
      return
    }
    const body=this.hero.body as Phaser.Physics.Arcade.Body
    const W=this.scale.width, H=this.scale.height

    if (this.walking) {
      const dx=this.walkTargetX-this.hero.x
      if (Math.abs(dx)<14) { body.setVelocityX(0); this.walking=false }
      else { body.setVelocityX(dx>0?175:-175); this.hero.setFlipX(dx<0) }
      this.hero.update({left:false,right:false,jump:false,attack:false,interact:false,explore:false,run:false},delta)
    } else {
      const input=this.inputCtrl.state
      this.hero.update(input,delta)

      let closest:IslandDef|null=null, closestDist=PROXIMITY
      for (const isl of ISLAND_DEFS) {
        const sx=islCX(isl,W)+(isl.signSide==='right'?islW(isl,W)*0.26:-islW(isl,W)*0.26)
        const sy=islSurface(isl,W,H)-40
        const dx=this.hero.x-sx, dy=this.hero.y-sy
        const d=Math.sqrt(dx*dx+dy*dy)
        if (d<closestDist){closestDist=d;closest=isl}
      }
      if (closest!==this.nearbyIsland) {
        this.nearbyIsland=closest
        const is=this.scene.get(SCENE_KEYS.ISLAND) as {
          showPrompt?:(id:string)=>void;hideAllPrompts?:()=>void
        }|null
        if (is) { closest?is.showPrompt?.(closest.id):is.hideAllPrompts?.() }
      }
      if (input.explore&&this.nearbyIsland) {
        window.dispatchEvent(new CustomEvent(OPEN_PAGE_EVENT,{detail:{id:this.nearbyIsland.id}}))
      }
    }

    this.stateText.setText(
      `${this.hero.getState().padEnd(9)} x:${Math.round(this.hero.x).toString().padStart(5)} `+
      `gnd:${body.blocked.down?'✓':'✗'}`
    )
  }

  private handleResize(W:number,H:number): void {
    this.platforms.clear(true,true)
    this.createPlatforms(W,H)
    this.physics.add.collider(this.hero as unknown as Phaser.Physics.Arcade.Sprite,this.platforms)
  }

  shutdown(): void { this.inputCtrl?.destroy() }
}
