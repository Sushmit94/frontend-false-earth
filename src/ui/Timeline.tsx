function GemIcon({ isActive, accent }: { isActive: boolean; accent: string }) {
    return (
        <div style= {{
        width: 80,
            height: 80,
                display: 'flex',
                    alignItems: 'center',
                        justifyContent: 'center',
                            opacity: isActive ? 1 : 0.5,
                                filter: isActive
                                    ? `drop-shadow(0 0 12px ${accent}) drop-shadow(0 0 24px ${accent})`
                                    : 'none',
                                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                                        transition: 'all 0.4s ease',
                                            pointerEvents: 'none',
        }
}>
    <svg viewBox="0 0 40 40" width = { isActive? 48: 36 } height = { isActive? 48: 36 } >
        <polygon
                    points="20,2 38,14 20,38 2,14"
fill = { isActive? `${accent}cc` : '#a0d4ff33'}
stroke = { isActive? accent: '#a0d4ff' }
strokeWidth = "1.5"
    />
    <polygon
                    points="20,7 33,14 20,30 7,14"
fill = "none"
stroke = "white"
strokeWidth = "0.8"
opacity = { isActive? 0.5: 0.15 }
    />
    <polygon
                    points="20,2 38,14 20,14"
fill = "white"
fillOpacity = { isActive? 0.15: 0.05 }
    />
    </svg>
    </div>
    );
}

export function Timeline() {
    const accent = '#ffffff';
    const years = [2026, 2027, 2028];

    return (
        <div style= {{
        position: 'relative',
            width: '100%',

                background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)',
                        overflow: 'hidden',
        }
}>
    <svg style={ { display: 'none' } }>
        <filter id="electric-turbulence" >
            <feTurbulence type="fractalNoise" baseFrequency = "0.5" numOctaves = "3" result = "noise" />
                <feDisplacementMap in="SourceGraphic" in2 = "noise" scale = "6" />
                    </filter>
                    </svg>

{/* Left fade */ }
<div style={
    {
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '96px',
            background: 'linear-gradient(to right, #000, rgba(0,0,0,0.9), transparent)',
                zIndex: 10, pointerEvents: 'none',
            }
} />

{/* Right fade */ }
<div style={
    {
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '96px',
            background: 'linear-gradient(to left, #000, rgba(0,0,0,0.9), transparent)',
                zIndex: 10, pointerEvents: 'none',
            }
} />

{/* Center horizontal line */ }
<div style={
    {
        position: 'absolute', top: '50%', left: 0, right: 0,
            height: '1px', transform: 'translateY(-50%)', opacity: 0.7, pointerEvents: 'none',
            }
}>
    <div style={
    {
        width: '100%', height: '100%',
            backgroundColor: accent,
                boxShadow: `0 0 10px ${accent}`,
                    filter: 'url(#electric-turbulence)',
                        animation: 'breathe 2s infinite ease-in-out',
                }
} />
    </div>

{/* Years row */ }
<div style={
    {
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            overflowX: 'auto', scrollbarWidth: 'none',
                paddingTop: '64px', paddingBottom: '56px',
                    paddingLeft: '48px', paddingRight: '48px',
                        gap: '96px', width: '100%', position: 'relative', zIndex: 20,
                            scrollBehavior: 'smooth', boxSizing: 'border-box',
            }
}>
    <div style={ { width: '8vw', flexShrink: 0 } } />

{
    years.map((year, index) => {
        const isActive = year === 2026;
        const isTop = true;

        return (
            <button
                            key= { year }
        style = {{
            position: 'relative', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.5s ease', outline: 'none',
                        background: 'none', border: 'none', cursor: 'default',
                            overflow: 'visible', color: 'white',
                                opacity: isActive ? 1 : 0.6,
                                    zIndex: isActive ? 30 : 1,
                            }
    }
                        >
        {/* Year label */ }
        < span style = {{
        position: 'absolute',
        ...(isTop ? { top: '-56px' } : { bottom: '-56px' }),
        fontSize: '1.125rem', fontWeight: 'bold',
        letterSpacing: '0.2em', fontFamily: 'Cousine, monospace',
        color: isActive ? accent : '#6b7280',
        filter: isActive ? `drop-shadow(0 0 15px ${accent})` : 'none',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
    }}>
        { year }
        </span>

        < GemIcon isActive = { isActive } accent = { accent } />

            {/* Vertical connector */ }
            < div style = {{
    position: 'absolute', left: '50%', width: '1px',
        height: '24px', transition: 'all 0.5s',
                                ...(isTop ? { bottom: '100%' } : { top: '100%' }),
        backgroundColor: isActive ? accent : `${accent}66`,
            boxShadow: isActive ? `0 0 10px ${accent}` : 'none',
                            }} />
    </button>
                    );
                })}

<div style={ { width: '5vw', flexShrink: 0 } } />
    </div>
    </div>
    );
}
