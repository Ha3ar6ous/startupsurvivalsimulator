import { useState } from 'react';
import { Icons } from './icons';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={tipStyles.tooltip}>
          {text}
          <span style={tipStyles.arrow} />
        </span>
      )}
    </span>
  );
}

const tipStyles: Record<string, React.CSSProperties> = {
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    marginBottom: '10px',
    transform: 'translateX(-50%)',
    background: 'var(--nb-black)',
    color: 'var(--nb-white)',
    padding: '12px 16px',
    fontSize: '0.8rem',
    fontWeight: 500,
    lineHeight: 1.5,
    width: 250,
    zIndex: 100,
    border: '2px solid var(--nb-yellow)',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    textTransform: 'none' as const,
    letterSpacing: 0,
    fontFamily: 'var(--font-sans)',
    textAlign: 'left' as const,
    wordWrap: 'break-word',
  },
  arrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--nb-black)',
  },
};

export { Tooltip, Icons };
