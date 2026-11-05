import Phaser from 'phaser'
import {
  ISLAND_DEFS, OPEN_PAGE_EVENT, WALK_TO_EVENT, ROBOT_MOVE_EVENT,
  islCX, islH, islSignX, islSurface, islW,
  type IslandDef,
} from '@/game/environments/IslandDefinitions'
import { SCENE_KEYS } from '@/types/game'

export class IslandScene extends Phaser.Scene {
  private elapsed = 0
  private runeGfx!: Phaser.GameObjects.Graphics
  private runes: { x:number;y:number;col:number;ph:number;sp:number;r:number }[] = []
  private signZones: { isl:IslandDef; prompt:Phaser.GameObjects.Text; promptVisible:boolean }[] = []

  constructor() { super({ key: SCENE_KEYS.ISLAND }) }

  create(): void {
    const W=this.scale.width, H=this.scale.height
    this.buildSignboards(W,H)
    this.buildRunes(W,H)
    this.buildLabels(W,H)
    this.buildHitZones(W,H)
    this.scale.on('resize',()=>this.scene.restart())
  }

  // ── Signboards ────────────────────────────────────────────────────────────
  private buildSignboards(W: number, H: number): void {
    const g = this.add.graphics().setDepth(15)
    for (const isl of ISLAND_DEFS) {
      const sx    = islSignX(isl,W)
      const surf  = islSurface(isl,W,H)
      const iw    = islW(isl,W)
      const ih    = islH(isl,H)
      const bw    = Math.max(130, iw*0.66)
      const bh    = Math.max(64,  ih*0.70)
      const postH = Math.max(48,  ih*0.68)
      const by    = surf - postH - bh - 6

      // Wooden post
      g.fillStyle(0x6b2d0a,1); g.fillRect(sx-4,surf-postH,9,postH)
      g.fillStyle(0x92400e,0.5); g.fillRect(sx-1,surf-postH,3,postH)

      // Board shadow
      g.fillStyle(0x000000,0.45); g.fillRoundedRect(sx-bw/2+3,by+4,bw,bh,8)

      // Board layers (dark → medium → light wood)
      g.fillStyle(0x3d1406,1); g.fillRoundedRect(sx-bw/2,   by,   bw,   bh,   8)
      g.fillStyle(0x7c2d0e,1); g.fillRoundedRect(sx-bw/2+3, by+3, bw-6, bh-6, 6)
      g.fillStyle(0xb45309,1); g.fillRoundedRect(sx-bw/2+6, by+6, bw-12,bh-12,5)

      // Wood grain
      g.lineStyle(1,0x92400e,0.25)
      for (let gr=0;gr<7;gr++) {
        g.beginPath()
        g.moveTo(sx-bw/2+10,by+10+gr*((bh-20)/7))
        g.lineTo(sx+bw/2-10,by+10+gr*((bh-20)/7))
        g.strokePath()
      }

      // Glowing accent border
      g.lineStyle(2.5, isl.colors.accent, 1.0)
      g.strokeRoundedRect(sx-bw/2+3,by+3,bw-6,bh-6,6)
      // Inner line
      g.lineStyle(1, isl.colors.rune, 0.50)
      g.strokeRoundedRect(sx-bw/2+8,by+8,bw-16,bh-16,4)

      // Nails
      g.fillStyle(0xf59e0b,1)
      for (const [nx,ny] of [[-bw/2+10,10],[bw/2-10,10],[-bw/2+10,bh-8],[bw/2-10,bh-8]]) {
        g.fillCircle(sx+nx,by+ny,3.5)
        g.fillStyle(0xfde68a,0.55); g.fillCircle(sx+nx-1,by+ny-1,1.5)
        g.fillStyle(0xf59e0b,1)
      }
      // Top-center rune mark
      g.fillStyle(isl.colors.rune,0.75); g.fillCircle(sx,by+12,4)
      g.fillStyle(isl.colors.accent,0.40); g.fillCircle(sx-1,by+11,2)
    }
  }

  // ── Ground rune rings + floating orbs ─────────────────────────────────────
  private buildRunes(W: number, H: number): void {
    this.runeGfx = this.add.graphics().setDepth(16)
    for (const isl of ISLAND_DEFS) {
      const cx=islCX(isl,W), surf=islSurface(isl,W,H), iw=islW(isl,W)
      this.runes.push({x:cx,y:surf,col:isl.colors.rune,ph:Math.random()*Math.PI*2,sp:0.4+Math.random()*0.5,r:iw*0.22})
      const sx=islSignX(isl,W), ih=islH(isl,H)
      this.runes.push({x:sx,y:surf-ih*0.95-islW(isl,W)*0.30,col:isl.colors.accent,ph:Math.random()*Math.PI*2,sp:0.7+Math.random()*0.4,r:7})
    }
  }

  private drawRunes(): void {
    const g=this.runeGfx; g.clear()
    for (const rn of this.runes) {
      const pulse=0.4+Math.sin(this.elapsed*0.001*rn.sp+rn.ph)*0.42
      if (rn.r>15) {
        g.lineStyle(1.5,rn.col,0.24*pulse); g.strokeCircle(rn.x,rn.y,rn.r)
        g.lineStyle(1,  rn.col,0.12*pulse); g.strokeCircle(rn.x,rn.y,rn.r*0.68)
        const cr=rn.r*0.46
        g.lineStyle(1,rn.col,0.18*pulse)
        g.beginPath(); g.moveTo(rn.x-cr,rn.y); g.lineTo(rn.x+cr,rn.y); g.strokePath()
        g.beginPath(); g.moveTo(rn.x,rn.y-cr); g.lineTo(rn.x,rn.y+cr); g.strokePath()
        g.lineStyle(1,rn.col,0.28*pulse)
        g.beginPath()
        g.moveTo(rn.x,rn.y-cr*0.66); g.lineTo(rn.x+cr*0.46,rn.y)
        g.lineTo(rn.x,rn.y+cr*0.66); g.lineTo(rn.x-cr*0.46,rn.y)
        g.closePath(); g.strokePath()
      } else {
        g.fillStyle(rn.col,0.10*pulse*3); g.fillCircle(rn.x,rn.y,rn.r*2.5)
        g.fillStyle(rn.col,0.36*pulse);   g.fillCircle(rn.x,rn.y,rn.r)
        g.fillStyle(0xffffff,0.48*pulse); g.fillCircle(rn.x-rn.r*0.30,rn.y-rn.r*0.30,rn.r*0.30)
      }
    }
  }

  // ── Labels — bold, white, high contrast ───────────────────────────────────
  private buildLabels(W: number, H: number): void {
    for (const isl of ISLAND_DEFS) {
      const sx    = islSignX(isl,W)
      const surf  = islSurface(isl,W,H)
      const iw    = islW(isl,W)
      const ih    = islH(isl,H)
      const bw    = Math.max(130, iw*0.66)
      const bh    = Math.max(64,  ih*0.70)
      const postH = Math.max(48,  ih*0.68)
      const by    = surf - postH - bh - 6
      const midY  = by + bh/2

      const lblSize = Math.max(14, Math.min(19, bw*0.128))
      this.add.text(sx, midY-9, isl.label, {
        fontFamily: '"Trebuchet MS",Georgia,serif',
        fontSize:   `${lblSize}px`,
        fontStyle:  'bold',
        color:      '#ffffff',
        stroke:     '#000000',
        strokeThickness: 4,
        shadow: { color:'#'+isl.colors.accent.toString(16).padStart(6,'0'), blur:14, fill:true, offsetX:0, offsetY:1 },
      }).setOrigin(0.5).setDepth(17)

      const subSize = Math.max(9, Math.min(11, bw*0.072))
      this.add.text(sx, midY+10, isl.sublabel, {
        fontFamily: 'system-ui,Arial,sans-serif',
        fontSize:   `${subSize}px`,
        color:      '#'+isl.colors.rune.toString(16).padStart(6,'0'),
        stroke:     '#000000',
        strokeThickness: 2.5,
      }).setOrigin(0.5).setDepth(17)
    }
  }

  // ── Hit zones + E-key prompt ───────────────────────────────────────────────
  private buildHitZones(W: number, H: number): void {
    for (const isl of ISLAND_DEFS) {
      const sx    = islSignX(isl,W)
      const surf  = islSurface(isl,W,H)
      const iw    = islW(isl,W)
      const ih    = islH(isl,H)
      const bh    = Math.max(64,ih*0.70)
      const postH = Math.max(48,ih*0.68)
      const zoneW = Math.max(100,iw*0.70)
      const zoneH = Math.max(80, postH+bh)
      const zoneCY= surf-(postH+bh)/2-3

      const zone  = this.add.rectangle(sx,zoneCY,zoneW,zoneH,0xffffff,0)
        .setDepth(18).setInteractive({useHandCursor:true})
      zone.on('pointerover',  ()=>zone.setFillStyle(0xffffff,0.04))
      zone.on('pointerout',   ()=>zone.setFillStyle(0xffffff,0.00))
      zone.on('pointerdown',  ()=>{
        // Fire robot move first
        window.dispatchEvent(new CustomEvent(ROBOT_MOVE_EVENT, { detail: { id: isl.id, x: islCX(isl, W) } }))
        window.dispatchEvent(new CustomEvent(WALK_TO_EVENT,{detail:{id:isl.id,x:islCX(isl,W)}}))
        setTimeout(()=>{
          window.dispatchEvent(new CustomEvent(OPEN_PAGE_EVENT,{detail:{id:isl.id}}))
        },900)
      })

      const prompt = this.add.text(sx, surf-postH-bh-26, '[ E ]  Explore', {
        fontFamily:'monospace', fontSize:'12px',
        color:'#fde68a', stroke:'#000000', strokeThickness:3,
        backgroundColor:'#0a0518ee', padding:{x:8,y:4},
      }).setOrigin(0.5).setDepth(25).setAlpha(0)

      this.signZones.push({isl,prompt,promptVisible:false})
    }
  }

  showPrompt(id: string): void {
    for (const z of this.signZones) {
      const show=z.isl.id===id
      if (show!==z.promptVisible) {
        z.promptVisible=show
        this.tweens.add({targets:z.prompt,alpha:show?1:0,duration:200,ease:'Linear'})
      }
    }
  }

  hideAllPrompts(): void {
    for (const z of this.signZones) {
      if (z.promptVisible) {
        z.promptVisible=false
        this.tweens.add({targets:z.prompt,alpha:0,duration:160,ease:'Linear'})
      }
    }
  }

  update(_t: number, delta: number): void {
    this.elapsed+=delta
    this.drawRunes()
    for (const z of this.signZones) {
      if (z.promptVisible) z.prompt.y+=Math.sin(this.elapsed*0.004)*0.28
    }
  }
}
