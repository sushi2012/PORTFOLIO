import Phaser from 'phaser'
import { ISLAND_DEFS, islCX, islCY, islH, islSurface, islW } from '@/game/environments/IslandDefinitions'
import { SCENE_KEYS } from '@/types/game'

const C = {
  skyDeep:       0x04020e,
  skyMid:        0x0a0520,
  skyHorizon:    0x160840,
  purple:        0x7c3aed,
  violet:        0xa855f7,
  lilac:         0xd8b4fe,
  gold:          0xfbbf24,
  white:         0xffffff,
  rockDark:      0x0f0e0c,
  rockMid:       0x1e1c1a,
  rockLight:     0x3a3632,
  crystalBlue:   0x67e8f9,
  crystalPurple: 0xc084fc,
  crystalGold:   0xfde68a,
}

const lerp    = (a: number, b: number, t: number) => a + (b - a) * t
const lerpCol = (a: number, b: number, t: number): number => {
  const [ar,ag,ab] = [(a>>16)&0xff,(a>>8)&0xff,a&0xff]
  const [br,bg,bb] = [(b>>16)&0xff,(b>>8)&0xff,b&0xff]
  return (Math.round(lerp(ar,br,t))<<16)|(Math.round(lerp(ag,bg,t))<<8)|Math.round(lerp(ab,bb,t))
}

export class EnvironmentScene extends Phaser.Scene {
  private elapsed = 0
  private starGfx!:     Phaser.GameObjects.Graphics
  private cloudGfx!:    Phaser.GameObjects.Graphics
  private bridgeGfx!:   Phaser.GameObjects.Graphics
  private crystalGfx!:  Phaser.GameObjects.Graphics
  private particleGfx!: Phaser.GameObjects.Graphics

  private stars:     { x:number;y:number;r:number;a:number;sp:number }[] = []
  private clouds:    { x:number;y:number;w:number;h:number;sp:number;a:number }[] = []
  private crystals:  { x:number;y:number;h:number;col:number;ph:number;sp:number }[] = []
  private particles: { x:number;y:number;vx:number;vy:number;r:number;col:number;a:number;life:number;max:number }[] = []

  constructor() { super({ key: SCENE_KEYS.ENVIRONMENT }) }

  create(): void {
    const W = this.scale.width, H = this.scale.height
    this.drawSky(W, H)
    this.drawMountains(W, H)
    this.drawPlanet(W, H)
    this.drawIslands(W, H)
    this.drawBridges(W, H)
    this.drawForeground(W, H)
    this.initStars(W, H)
    this.initClouds(W, H)
    this.initCrystals(W, H)
    this.initParticles(W, H)
    this.bridgeGfx = this.add.graphics().setDepth(10)
    this.scale.on('resize', () => this.scene.restart())
  }

  // ── Deep space sky ────────────────────────────────────────────────────────
  private drawSky(W: number, H: number): void {
    const g = this.add.graphics().setDepth(0)
    const stops = [
      {t:0.00,c:C.skyDeep},
      {t:0.35,c:C.skyMid},
      {t:0.65,c:C.skyHorizon},
      {t:0.82,c:0x2a0e5a},
      {t:1.00,c:0x3d1268},
    ]
    for (let i=0;i<120;i++) {
      const t0=i/120
      let col=stops[0].c
      for (let s=0;s<stops.length-1;s++) {
        if (t0>=stops[s].t && t0<stops[s+1].t) {
          col=lerpCol(stops[s].c,stops[s+1].c,(t0-stops[s].t)/(stops[s+1].t-stops[s].t))
          break
        }
      }
      g.fillStyle(col,1); g.fillRect(0,t0*H,W,H/120+1)
    }
  }

  // ── Large planet (like the reference image) ───────────────────────────────
  private drawPlanet(W: number, H: number): void {
    const g = this.add.graphics().setDepth(3)
    // Big glowing planet — upper right
    const px = W * 0.82, py = H * 0.28, pr = Math.min(W, H) * 0.22

    // Outer glow rings
    for (let i = 8; i >= 0; i--) {
      g.fillStyle(0x4c1d95, 0.022 + i * 0.012)
      g.fillCircle(px, py, pr + i * pr * 0.18)
    }
    // Planet body gradient (bands)
    for (let b = 0; b < 30; b++) {
      const t = b / 30
      const col = lerpCol(0x1e0a3c, 0x4c1d95, Math.pow(t, 0.6))
      g.fillStyle(col, 1)
      g.fillCircle(px, py, pr * (1 - t * 0.02))
    }
    g.fillStyle(0x6d28d9, 0.5); g.fillCircle(px, py, pr)
    // Atmosphere rim
    g.lineStyle(pr * 0.08, 0x8b5cf6, 0.35); g.strokeCircle(px, py, pr * 1.04)
    g.lineStyle(pr * 0.04, 0xa855f7, 0.55); g.strokeCircle(px, py, pr * 1.02)
    g.lineStyle(pr * 0.015, 0xc4b5fd, 0.70); g.strokeCircle(px, py, pr)
    // Planet highlight
    g.fillStyle(0xffffff, 0.06); g.fillCircle(px - pr * 0.28, py - pr * 0.25, pr * 0.55)
    // Ring / orbit arc
    g.lineStyle(3, 0x8b5cf6, 0.45)
    g.beginPath(); g.arc(px, py, pr * 1.38, -0.4, Math.PI + 0.4); g.strokePath()
    g.lineStyle(1.5, 0xc4b5fd, 0.25)
    g.beginPath(); g.arc(px, py, pr * 1.44, -0.35, Math.PI + 0.35); g.strokePath()

    // Shooting star streak
    g.lineStyle(2, 0xfbbf24, 0.6)
    g.beginPath(); g.moveTo(W * 0.48, H * 0.08); g.lineTo(W * 0.56, H * 0.14); g.strokePath()
    g.lineStyle(1, 0xfde68a, 0.3)
    g.beginPath(); g.moveTo(W * 0.46, H * 0.07); g.lineTo(W * 0.48, H * 0.08); g.strokePath()
  }

  // ── Mountain silhouettes ──────────────────────────────────────────────────
  private drawMountains(W: number, H: number): void {
    const layers = [
      {col:0x0d0525,alpha:0.98,base:0.82,peak:0.55,peaks:9},
      {col:0x150832,alpha:0.92,base:0.85,peak:0.63,peaks:7},
      {col:0x1c0c40,alpha:0.80,base:0.88,peak:0.70,peaks:6},
    ]
    for (const l of layers) {
      const g = this.add.graphics().setDepth(2)
      g.fillStyle(l.col, l.alpha)
      const pts: Phaser.Math.Vector2[] = [new Phaser.Math.Vector2(0,H)]
      for (let i=0;i<=l.peaks;i++) {
        const bx=(i/l.peaks)*W
        const px=bx+Math.sin(i*2.8)*(W/l.peaks)*0.30
        const py=(l.peak+Math.abs(Math.sin(i*1.5))*(l.base-l.peak))*H
        pts.push(new Phaser.Math.Vector2(px-(W/l.peaks)*0.14,py))
        pts.push(new Phaser.Math.Vector2(px+(W/l.peaks)*0.10,l.base*H))
      }
      pts.push(new Phaser.Math.Vector2(W,H)); g.fillPoints(pts,true,true)
      // Purple mountain ridge glow
      g.lineStyle(1, 0x7c3aed, 0.18)
      g.beginPath()
      let first = true
      for (const p of pts) { first ? (g.moveTo(p.x,p.y),first=false) : g.lineTo(p.x,p.y) }
      g.strokePath()
    }
  }

  // ── Four themed islands ───────────────────────────────────────────────────
  private drawIslands(W: number, H: number): void {
    const g = this.add.graphics().setDepth(8)
    for (const isl of ISLAND_DEFS) {
      const cx=islCX(isl,W), cy=islCY(isl,H), iw=islW(isl,W), ih=islH(isl,H)
      const col=isl.colors

      // Rock underbelly — dark, tapered stalactite shape
      g.fillStyle(C.rockDark, 1.0); g.fillEllipse(cx, cy+ih*0.70, iw*0.82, ih*1.60)
      g.fillStyle(C.rockMid,  1.0); g.fillEllipse(cx, cy+ih*0.28, iw*0.90, ih*1.18)
      g.fillStyle(C.rockLight,0.40); g.fillEllipse(cx-iw*0.18, cy, iw*0.26, ih*0.34)
      g.fillStyle(C.rockLight,0.28); g.fillEllipse(cx+iw*0.16, cy+ih*0.10, iw*0.18, ih*0.26)

      // Grass cap — rich color
      g.fillStyle(col.grass, 1);        g.fillEllipse(cx, cy-ih*0.06, iw, ih*0.44)
      g.fillStyle(col.grassLight, 0.55); g.fillEllipse(cx, cy-ih*0.18, iw*0.80, ih*0.26)

      // Grass tufts along edge
      const n = Math.max(8, Math.floor(iw/18))
      for (let t=0;t<n;t++) {
        const tx=cx-iw*0.46+t*(iw/n)
        const ty=cy-ih*0.24+Math.sin(t*0.75)*ih*0.04
        g.fillStyle(col.grassLight, 0.85)
        g.fillTriangle(tx,ty,tx-4,ty+9,tx+4,ty+9)
        g.fillTriangle(tx+6,ty+2,tx+2,ty+9,tx+10,ty+9)
        g.fillTriangle(tx-6,ty+2,tx-10,ty+9,tx-2,ty+9)
      }

      // Accent glow halos (the "magical ring" around each island)
      g.fillStyle(col.accent, 0.06); g.fillEllipse(cx, cy, iw*1.45, ih*2.0)
      g.fillStyle(col.accent, 0.04); g.fillEllipse(cx, cy, iw*1.90, ih*2.6)
      // Golden ring on grass line
      g.lineStyle(1.5, col.accent, 0.40); g.strokeEllipse(cx, cy-ih*0.06, iw*1.05, ih*0.25)
      // Drop shadow
      g.fillStyle(0x000000, 0.22); g.fillEllipse(cx, cy+ih*1.15, iw*0.55, ih*0.18)
    }
  }

  // ── Rope bridges between adjacent islands ─────────────────────────────────
  private drawBridges(W: number, H: number): void {
    const g = this.add.graphics().setDepth(9)
    for (let i=0;i<ISLAND_DEFS.length-1;i++) {
      const a=ISLAND_DEFS[i], b=ISLAND_DEFS[i+1]
      const ax=islCX(a,W), ay=islSurface(a,W,H)
      const bx=islCX(b,W), by=islSurface(b,W,H)
      const sag=Math.min(30,(bx-ax)*0.05), segs=18

      for (const off of [-3,3]) {
        g.lineStyle(2, lerpCol(a.colors.accent,b.colors.accent,0.5), 0.55)
        g.beginPath()
        for (let s=0;s<=segs;s++) {
          const t=s/segs, x=lerp(ax,bx,t), y=lerp(ay,by,t)+Math.sin(t*Math.PI)*sag+off
          s===0?g.moveTo(x,y):g.lineTo(x,y)
        }
        g.strokePath()
      }
      const planks=Math.max(5,Math.floor((bx-ax)/24))
      for (let p=1;p<planks;p++) {
        const t=p/planks, x=lerp(ax,bx,t), y=lerp(ay,by,t)+Math.sin(t*Math.PI)*sag
        g.lineStyle(1.5,0x6b3a0a,0.55); g.beginPath(); g.moveTo(x,y-3); g.lineTo(x,y+3); g.strokePath()
        g.fillStyle(0x78350f,0.78); g.fillRect(x-8,y,16,4)
        g.fillStyle(0x92400e,0.40); g.fillRect(x-8,y,16,2)
      }
      for (let r=1;r<=3;r++) {
        const t=r/4, x=lerp(ax,bx,t), y=lerp(ay,by,t)+Math.sin(t*Math.PI)*sag
        const col=lerpCol(a.colors.accent,b.colors.accent,t)
        g.fillStyle(col,0.12); g.fillCircle(x,y,9)
        g.fillStyle(col,0.40); g.fillCircle(x,y,4)
        g.fillStyle(C.white,0.45); g.fillCircle(x-1,y-1,1.2)
      }
    }
  }

  // ── Dark foreground ground ────────────────────────────────────────────────
  private drawForeground(W: number, H: number): void {
    const g = this.add.graphics().setDepth(7)
    g.fillStyle(0x0a0518,1); g.fillRect(0,H*0.88,W,H*0.12)
    g.fillStyle(0x1a0a38,1); g.fillRect(0,H*0.88,W,H*0.018)
    g.fillStyle(0x4c1d95,0.30); g.fillRect(0,H*0.88,W,H*0.006)
    // Glowing ground line
    g.lineStyle(1,0x6d28d9,0.55)
    g.beginPath(); g.moveTo(0,H*0.88); g.lineTo(W,H*0.88); g.strokePath()
    // Small rocks
    for (let i=0;i<22;i++) {
      const rx=(i/22)*W+Math.sin(i*1.4)*48, ry=H*0.91+Math.sin(i*0.8)*3
      const rw=10+Math.abs(Math.sin(i*2.0))*9
      g.fillStyle(C.rockDark,0.9); g.fillEllipse(rx,ry,rw,rw*0.50)
      g.fillStyle(C.rockLight,0.22); g.fillEllipse(rx-rw*0.1,ry-rw*0.14,rw*0.30,rw*0.22)
    }
  }

  // ── Stars ─────────────────────────────────────────────────────────────────
  private initStars(W: number, H: number): void {
    this.starGfx = this.add.graphics().setDepth(1)
    for (let i=0;i<Math.floor(W*H/1800);i++) {
      this.stars.push({
        x:Math.random()*W, y:Math.random()*H*0.82,
        r:Math.random()*1.6+0.25,
        a:Math.random()*0.7+0.3,
        sp:Math.random()*0.016+0.003,
      })
    }
  }

  // ── Clouds (wispy nebula-style) ───────────────────────────────────────────
  private initClouds(W: number, H: number): void {
    this.cloudGfx = this.add.graphics().setDepth(5)
    for (let i=0;i<8;i++) {
      this.clouds.push({
        x:Math.random()*W*1.2,
        y:H*(0.08+Math.random()*0.32),
        w:100+Math.random()*180,
        h:28+Math.random()*40,
        sp:0.018+Math.random()*0.04,
        a:0.06+Math.random()*0.10,
      })
    }
  }

  // ── Crystals ──────────────────────────────────────────────────────────────
  private initCrystals(W: number, H: number): void {
    this.crystalGfx = this.add.graphics().setDepth(12)
    for (const isl of ISLAND_DEFS) {
      const cx=islCX(isl,W), surf=islSurface(isl,W,H), iw=islW(isl,W), ih=islH(isl,H)
      // Push crystals to the outer edges of each island — away from signboard
      for (let k=0;k<2;k++) {
        // Always place on the OPPOSITE side from the signboard
        const sign = isl.signSide === 'right' ? -1 : 1
        const offX = sign * (iw * (0.32 + k * 0.10))
        this.crystals.push({
          x: cx + offX,
          y: surf - ih * 0.04,
          h: ih * 0.28 + k * ih * 0.10,
          col: isl.colors.accent,
          ph: Math.random() * Math.PI * 2,
          sp: 0.5 + Math.random() * 0.8,
        })
      }
    }
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  private initParticles(W: number, H: number): void {
    this.particleGfx = this.add.graphics().setDepth(13)
    const pal=[C.violet,C.gold,C.crystalBlue,C.crystalGold,0x2dd4bf,C.lilac,0xf472b6]
    for (let i=0;i<80;i++) {
      const life=3000+Math.random()*5000
      this.particles.push({
        x:Math.random()*W, y:H*0.25+Math.random()*H*0.60,
        vx:(Math.random()-0.5)*0.20, vy:-(0.04+Math.random()*0.18),
        r:0.6+Math.random()*1.8,
        col:pal[Math.floor(Math.random()*pal.length)],
        a:0.28+Math.random()*0.45,
        life:Math.random()*life, max:life,
      })
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  update(_t: number, delta: number): void {
    this.elapsed += delta
    const W=this.scale.width, H=this.scale.height

    // Stars twinkle
    this.starGfx.clear()
    for (const s of this.stars) {
      const a=0.2+Math.abs(Math.sin(this.elapsed*s.sp))*0.8
      this.starGfx.fillStyle(C.white, s.a*a)
      this.starGfx.fillCircle(s.x, s.y, s.r)
    }

    // Nebula clouds drift
    this.cloudGfx.clear()
    for (const c of this.clouds) {
      c.x+=c.sp*delta*0.05; if (c.x>W+200) c.x=-200
      for (let j=0;j<4;j++) {
        const ox=(j-1.5)*c.w*0.28, oy=Math.abs(j-1.5)*c.h*0.28
        this.cloudGfx.fillStyle(0x4c1d95, c.a*0.50)
        this.cloudGfx.fillEllipse(c.x+ox,c.y+oy,c.w*0.50,c.h*0.62)
      }
      this.cloudGfx.fillStyle(0x6d28d9, c.a*0.18)
      this.cloudGfx.fillEllipse(c.x, c.y, c.w, c.h*0.46)
    }

    // Crystals pulse
    this.crystalGfx.clear()
    for (const c of this.crystals) {
      const glow=0.4+Math.sin(this.elapsed*0.001*c.sp+c.ph)*0.38
      this.crystalGfx.fillStyle(c.col,0.05*glow*4); this.crystalGfx.fillCircle(c.x,c.y-c.h*0.4,c.h)
      this.crystalGfx.fillStyle(c.col,0.48+glow*0.30)
      this.crystalGfx.fillTriangle(c.x,c.y-c.h,c.x-c.h*0.28,c.y,c.x+c.h*0.28,c.y)
      this.crystalGfx.fillStyle(C.white,0.20+glow*0.16)
      this.crystalGfx.fillTriangle(c.x,c.y-c.h,c.x-c.h*0.08,c.y-c.h*0.48,c.x+c.h*0.05,c.y-c.h*0.22)
    }

    // Bridge glow
    this.bridgeGfx.clear()
    for (let i=0;i<ISLAND_DEFS.length-1;i++) {
      const a=ISLAND_DEFS[i],b=ISLAND_DEFS[i+1]
      const ax=islCX(a,W),bx=islCX(b,W)
      const ay=islSurface(a,W,H),by=islSurface(b,W,H)
      const pulse=0.45+Math.sin(this.elapsed*0.0018+i)*0.35
      this.bridgeGfx.fillStyle(lerpCol(a.colors.accent,b.colors.accent,0.5),0.05*pulse)
      this.bridgeGfx.fillEllipse((ax+bx)/2,lerp(ay,by,0.5)+26,(bx-ax)*0.48,16)
    }

    // Particles float up
    this.particleGfx.clear()
    const pal=[C.violet,C.gold,C.crystalBlue,C.crystalGold,0x2dd4bf,C.lilac,0xf472b6]
    for (const p of this.particles) {
      p.x+=p.vx*delta*0.06; p.y+=p.vy*delta*0.06; p.life+=delta
      if (p.life>p.max||p.y<-10) {
        p.x=Math.random()*W; p.y=H*0.60+Math.random()*H*0.28
        p.col=pal[Math.floor(Math.random()*pal.length)]; p.life=0
      }
      const t=p.life/p.max, fade=t<0.1?t/0.1:t>0.85?(1-t)/0.15:1
      this.particleGfx.fillStyle(p.col,p.a*fade); this.particleGfx.fillCircle(p.x,p.y,p.r)
      this.particleGfx.fillStyle(p.col,p.a*fade*0.18); this.particleGfx.fillCircle(p.x,p.y,p.r*2.2)
    }
  }
}
