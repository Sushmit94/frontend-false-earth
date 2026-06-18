import { useMemo, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { useGameStore } from '../core/store/gameStore'

/* ── Panel data (extracted from TeamCrystals) ── */
export const PANELS = [
    {
        id: 'mentor',
        title: '◈ FACULTY MENTOR',
        rows: [
            { label: 'Name', value: 'Dr. A. Raman' },
            { label: 'Role', value: 'Faculty Mentor' },
            { label: 'Crystal', value: 'Gem / Gold' },
        ],
        bar: 1.0,
    },
    {
        id: 'coordinator',
        title: '◈ COORDINATOR',
        rows: [
            { label: 'Name', value: 'Ishita Verma' },
            { label: 'Role', value: 'Club Coord.' },
            { label: 'Crystal', value: 'Shard / Violet' },
        ],
        bar: 0.85,
    },
    {
        id: 'leads',
        title: '◈ TEAM LEADS',
        rows: [
            { label: 'AI / ML', value: 'Arjun, Priya' },
            { label: 'WebSec', value: 'Neha, Karan' },
            { label: 'Interdisc.', value: 'Raghav, Sneha' },
        ],
        bar: 0.65,
    },
    {
        id: 'core',
        title: '◈ CORE MEMBERS',
        rows: [
            { label: 'AI / ML', value: 'Dev, Tanvi...' },
            { label: 'WebSec', value: 'Nikhil, Ankita...' },
            { label: 'Interdisc.', value: 'Sahil, Pooja...' },
        ],
        bar: 0.45,
    },
]

/* ── Render panel onto a 2D canvas and return a CanvasTexture ── */
function createPanelTexture(panel: typeof PANELS[0]): THREE.CanvasTexture {
    const W = 512
    const H = 320
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // ── Background: fully transparent so the 3D material opacity controls it
    ctx.clearRect(0, 0, W, H)

    // ── Subtle glass fill
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, 'rgba(0, 25, 50, 0.35)')
    grad.addColorStop(0.5, 'rgba(0, 40, 65, 0.18)')
    grad.addColorStop(1, 'rgba(0, 20, 45, 0.30)')
    ctx.fillStyle = grad
    roundRect(ctx, 0, 0, W, H, 20)
    ctx.fill()

    // ── Border glow
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)'
    ctx.lineWidth = 2
    roundRect(ctx, 1, 1, W - 2, H - 2, 20)
    ctx.stroke()

    // ── Corner brackets
    const cLen = 24
    const cOff = 6
    ctx.strokeStyle = 'rgba(0, 220, 255, 0.6)'
    ctx.lineWidth = 3
    // TL
    ctx.beginPath(); ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff); ctx.stroke()
    // TR
    ctx.beginPath(); ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen); ctx.stroke()
    // BL
    ctx.beginPath(); ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff); ctx.stroke()
    // BR
    ctx.beginPath(); ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen); ctx.stroke()

    // ── Scanlines
    ctx.fillStyle = 'rgba(0, 200, 255, 0.02)'
    for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1)
    }

    // ── Title
    ctx.font = '600 18px "Courier New", monospace'
    ctx.fillStyle = 'rgba(0, 200, 255, 0.7)'
    ctx.letterSpacing = '3px'
    ctx.fillText(panel.title, 30, 52)

    // ── Title divider
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(30, 64); ctx.lineTo(W - 30, 64); ctx.stroke()

    // ── Data rows
    let rowY = 105
    ctx.font = '400 20px "Courier New", monospace'
    for (const row of panel.rows) {
        ctx.fillStyle = 'rgba(160, 220, 255, 0.55)'
        ctx.fillText(row.label, 30, rowY)
        ctx.fillStyle = 'rgba(200, 248, 255, 0.9)'
        ctx.textAlign = 'right'
        ctx.fillText(row.value, W - 30, rowY)
        ctx.textAlign = 'left'
        rowY += 45
    }

    // ── Progress bar
    const barY = H - 40
    const barW = W - 60
    ctx.fillStyle = 'rgba(0, 200, 255, 0.08)'
    roundRect(ctx, 30, barY, barW, 6, 3)
    ctx.fill()

    const fillGrad = ctx.createLinearGradient(30, 0, 30 + barW * panel.bar, 0)
    fillGrad.addColorStop(0, 'rgba(0, 180, 255, 0.3)')
    fillGrad.addColorStop(1, 'rgba(0, 220, 255, 0.6)')
    ctx.fillStyle = fillGrad
    roundRect(ctx, 30, barY, barW * panel.bar, 6, 3)
    ctx.fill()

    // ── Glow around bar fill end
    ctx.shadowColor = 'rgba(0, 200, 255, 0.4)'
    ctx.shadowBlur = 8
    ctx.fillStyle = 'rgba(0, 220, 255, 0.8)'
    ctx.beginPath()
    ctx.arc(30 + barW * panel.bar, barY + 3, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // ── "More Info" button
    const btnW = 140
    const btnH = 28
    const btnX = W - 30 - btnW
    const btnY = barY - 42

    // Button background
    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY + btnH)
    btnGrad.addColorStop(0, 'rgba(0, 180, 255, 0.15)')
    btnGrad.addColorStop(1, 'rgba(0, 220, 255, 0.25)')
    ctx.fillStyle = btnGrad
    roundRect(ctx, btnX, btnY, btnW, btnH, 4)
    ctx.fill()

    // Button border
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)'
    ctx.lineWidth = 1
    roundRect(ctx, btnX, btnY, btnW, btnH, 4)
    ctx.stroke()

    // Button text
    ctx.font = '600 12px "Courier New", monospace'
    ctx.fillStyle = 'rgba(0, 220, 255, 0.9)'
    ctx.textAlign = 'center'
    ctx.fillText('[ MORE INFO ]', btnX + btnW / 2, btnY + 18)
    ctx.textAlign = 'left'

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
}

/* Rounded-rect helper (path only, no fill/stroke) */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

/* ── Single 3D panel card ── */
function PanelCard({
    panel,
    position,
    rotation,
}: {
    panel: typeof PANELS[0]
    position: [number, number, number]
    rotation?: [number, number, number]
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const setSelectedPanel = useGameStore((state) => state.setSelectedPanel)

    const { texture, material } = useMemo(() => {
        const tex = createPanelTexture(panel)

        const mat = new THREE.MeshBasicNodeMaterial()
        mat.map = tex
        mat.transparent = true
        mat.opacity = 0.85
        mat.side = THREE.DoubleSide
        mat.depthWrite = false
        mat.blending = THREE.NormalBlending

        return { texture: tex, material: mat }
    }, [panel])

    // Gentle hover animation
    const baseY = position[1]
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime
            meshRef.current.position.y = baseY + Math.sin(t * 0.8 + position[0]) * 0.08
        }
    })

    const handleClick = useCallback((e: any) => {
        e.stopPropagation()
        setSelectedPanel(panel)
    }, [panel, setSelectedPanel])

    const cardWidth = 4.5
    const cardHeight = 2.8 // maintain ~512:320 ratio

    return (
        <mesh
            ref= { meshRef }
    position = { position }
    rotation = { rotation || [0, 0, 0]
}
onClick = { handleClick }
onPointerOver = {(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
onPointerOut = {(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}
        >
    <planeGeometry args={ [cardWidth, cardHeight] } />
        < primitive object = { material } />
            </mesh>
    )
}

/* ── Main component: 4 panels arranged in a cluster ── */
/* ── Main component: 4 panels spread across the scene ── */
export function FloatingPanels() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
        }
    })

    return (
        <group ref= { groupRef } >
        {/* Far left */ }
        < PanelCard
    panel = { PANELS[0]}
    position = { [-7.5, 3.0, -3]}   // ← y: 0.9 → 3.0
    rotation = { [0, 0.25, 0]}
        />
        {/* Center left */ }
        < PanelCard
    panel = { PANELS[1]}
    position = { [-2.5, 3.0, -4.5]}  // ← y: 0.9 → 3.0
    rotation = { [0, 0.1, 0]}
        />
        {/* Center right */ }
        < PanelCard
    panel = { PANELS[2]}
    position = { [2.5, 3.0, -4.5]}   // ← y: 0.9 → 3.0
    rotation = { [0, -0.1, 0]}
        />
        {/* Far right */ }
        < PanelCard
    panel = { PANELS[3]}
    position = { [7.5, 3.0, -3]}     // ← y: 0.9 → 3.0
    rotation = { [0, -0.25, 0]}
        />
        </group>
    )
}