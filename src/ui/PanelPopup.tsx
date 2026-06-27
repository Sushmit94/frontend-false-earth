import { useEffect, useRef } from 'react';
import { useGameStore } from '../core/store/gameStore';

export function PanelPopup() {
    const selectedPanel = useGameStore((state) => state.selectedPanel);
    const setSelectedPanel = useGameStore((state) => state.setSelectedPanel);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        if (!selectedPanel) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedPanel(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedPanel, setSelectedPanel]);

    // Animate in
    useEffect(() => {
        if (selectedPanel && overlayRef.current && contentRef.current) {
            requestAnimationFrame(() => {
                if (overlayRef.current) overlayRef.current.style.opacity = '1';
                if (contentRef.current) {
                    contentRef.current.style.opacity = '1';
                    contentRef.current.style.transform = 'scale(1) translateY(0)';
                }
            });
        }
    }, [selectedPanel]);

    if (!selectedPanel) return null;

    const handleClose = () => setSelectedPanel(null);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) handleClose();
    };

    return (
        <div
            ref= { overlayRef }
    onClick = { handleOverlayClick }
    style = {{
        position: 'fixed',
            top: 0,
                left: 0,
                    width: '100vw',
                        height: '100vh',
                            backgroundColor: 'rgba(0, 5, 15, 0.85)',
                                backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                        display: 'flex',
                                            alignItems: 'center',
                                                justifyContent: 'center',
                                                    zIndex: 1000,
                                                        pointerEvents: 'auto',
                                                            opacity: 0,
                                                                transition: 'opacity 0.4s ease',
                                                                    cursor: 'pointer',
            }
}
        >
    {/* Animated scanline overlay */ }
    < div style = {{
    position: 'absolute',
        top: 0,
            left: 0,
                width: '100%',
                    height: '100%',
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 200, 255, 0.015) 3px, rgba(0, 200, 255, 0.015) 4px)',
                            pointerEvents: 'none',
            }} />

{/* Content card */ }
<div
                ref={ contentRef }
style = {{
    position: 'relative',
        width: 'min(600px, 90vw)',
            maxHeight: '85vh',
                background: 'linear-gradient(135deg, rgba(0, 25, 50, 0.6) 0%, rgba(0, 40, 65, 0.35) 50%, rgba(0, 20, 45, 0.55) 100%)',
                    border: '1px solid rgba(0, 200, 255, 0.25)',
                        borderRadius: '16px',
                            padding: '40px',
                                cursor: 'default',
                                    opacity: 0,
                                        transform: 'scale(0.9) translateY(20px)',
                                            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                                boxShadow: '0 0 60px rgba(0, 150, 255, 0.1), inset 0 0 60px rgba(0, 150, 255, 0.03)',
                                                    overflow: 'auto',
                }}
            >
    {/* Corner brackets */ }
    < CornerBracket position = "top-left" />
        <CornerBracket position="top-right" />
            <CornerBracket position="bottom-left" />
                <CornerBracket position="bottom-right" />

                    {/* Close button */ }
                    < button
onClick = { handleClose }
style = {{
    position: 'absolute',
        top: '16px',
            right: '16px',
                background: 'rgba(0, 180, 255, 0.1)',
                    border: '1px solid rgba(0, 200, 255, 0.3)',
                        borderRadius: '8px',
                            color: 'rgba(0, 220, 255, 0.9)',
                                fontSize: '14px',
                                    fontFamily: '"Courier New", monospace',
                                        padding: '6px 14px',
                                            cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                    letterSpacing: '1px',
                    }}
onMouseEnter = {(e) => {
    e.currentTarget.style.background = 'rgba(0, 180, 255, 0.25)';
    e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.6)';
    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.2)';
}}
onMouseLeave = {(e) => {
    e.currentTarget.style.background = 'rgba(0, 180, 255, 0.1)';
    e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.3)';
    e.currentTarget.style.boxShadow = 'none';
}}
                >
                    ✕ CLOSE
    </button>

{/* Title */ }
<div style={
    {
        fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 600,
                    color: 'rgba(0, 200, 255, 0.85)',
                        letterSpacing: '4px',
                            marginBottom: '8px',
                                textShadow: '0 0 20px rgba(0, 200, 255, 0.3)',
                }
}>
    { selectedPanel.title }
    </div>

{/* Subtitle line */ }
<div style={
    {
        fontFamily: '"Courier New", monospace',
            fontSize: '11px',
                color: 'rgba(0, 200, 255, 0.35)',
                    letterSpacing: '2px',
                        marginBottom: '24px',
                }
}>
                    ── SYSTEM DATA RETRIEVAL ──
</div>

{/* Divider */ }
<div style={
    {
        height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.3), transparent)',
                marginBottom: '32px',
                }
} />

{/* Data rows */ }
<div style={ { display: 'flex', flexDirection: 'column', gap: '0' } }>
{
    selectedPanel.rows.map((row, i) => (
        <div
                            key= { row.label }
                            style = {{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 16px',
        borderBottom: i < selectedPanel.rows.length - 1
            ? '1px solid rgba(0, 200, 255, 0.08)'
            : 'none',
        transition: 'background 0.2s ease',
        borderRadius: '4px',
    }}
onMouseEnter = {(e) => {
    e.currentTarget.style.background = 'rgba(0, 200, 255, 0.04)';
}}
onMouseLeave = {(e) => {
    e.currentTarget.style.background = 'transparent';
}}
                        >
    <span style={
    {
        fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
                color: 'rgba(160, 220, 255, 0.65)',
                    letterSpacing: '1px',
                        textTransform: 'uppercase',
                            }
}>
    { row.label }
    </span>
    < span style = {{
    fontFamily: '"Courier New", monospace',
        fontSize: 'clamp(14px, 2.5vw, 18px)',
            color: 'rgba(200, 248, 255, 0.95)',
                fontWeight: 500,
                    textShadow: '0 0 10px rgba(0, 200, 255, 0.15)',
                            }}>
    { row.value }
    </span>
    </div>
                    ))}
</div>



{/* Footer hint */ }
<div style={
    {
        marginTop: '28px',
            textAlign: 'center',
                fontFamily: '"Courier New", monospace',
                    fontSize: '11px',
                        color: 'rgba(0, 200, 255, 0.25)',
                            letterSpacing: '2px',
                                animation: 'breathe 3s ease-in-out infinite',
                }
}>
    CLICK OUTSIDE OR PRESS ESC TO CLOSE
        </div>
        </div>
        </div>
    );
}

/* Corner bracket decoration */
function CornerBracket({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
    const isTop = position.includes('top');
    const isLeft = position.includes('left');

    return (
        <div style= {{
        position: 'absolute',
            top: isTop ? '8px' : undefined,
                bottom: !isTop ? '8px' : undefined,
                    left: isLeft ? '8px' : undefined,
                        right: !isLeft ? '8px' : undefined,
                            width: '24px',
                                height: '24px',
                                    borderColor: 'rgba(0, 220, 255, 0.5)',
                                        borderStyle: 'solid',
                                            borderWidth: 0,
                                                borderTopWidth: isTop ? '2px' : 0,
                                                    borderBottomWidth: !isTop ? '2px' : 0,
                                                        borderLeftWidth: isLeft ? '2px' : 0,
                                                            borderRightWidth: !isLeft ? '2px' : 0,
                                                                pointerEvents: 'none',
        }
} />
    );
}