import React from 'react';
import { KIDS_SHAPES, ShapeType } from '@/types/game';

interface ShapeSVGProps {
  shape: ShapeType;
  color: string;
  borderColor: string;
  size?: number;
  number?: number;
  showNumber?: boolean;
  className?: string;
  muted?: boolean;
}

function ShapePath({ shape, color, borderColor, size = 32 }: { shape: ShapeType; color: string; borderColor: string; size: number }) {
  const half = size / 2;
  const strokeW = size * 0.06;

  switch (shape) {
    case 'circle':
      return (
        <circle
          cx={half}
          cy={half}
          r={half - strokeW}
          fill={color}
          stroke={borderColor}
          strokeWidth={strokeW}
        />
      );
    case 'triangle': {
      const pts = `${half},${strokeW} ${size - strokeW},${size - strokeW} ${strokeW},${size - strokeW}`;
      return <polygon points={pts} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    case 'square': {
      const m = strokeW;
      const s = size - strokeW * 2;
      return <rect x={m} y={m} width={s} height={s} rx={size * 0.1} fill={color} stroke={borderColor} strokeWidth={strokeW} />;
    }
    case 'diamond': {
      const pts = `${half},${strokeW} ${size - strokeW},${half} ${half},${size - strokeW} ${strokeW},${half}`;
      return <polygon points={pts} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    case 'star': {
      const outerR = half - strokeW;
      const innerR = outerR * 0.4;
      const points: string[] = [];
      for (let i = 0; i < 5; i++) {
        const ox = half + outerR * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 5);
        const oy = half + outerR * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / 5);
        const ix = half + innerR * Math.cos(-Math.PI / 2 + (i + 0.5) * 2 * Math.PI / 5);
        const iy = half + innerR * Math.sin(-Math.PI / 2 + (i + 0.5) * 2 * Math.PI / 5);
        points.push(`${ox},${oy}`);
        points.push(`${ix},${iy}`);
      }
      return <polygon points={points.join(' ')} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    case 'hexagon': {
      const r = half - strokeW;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = -Math.PI / 6 + (i * Math.PI) / 3;
        return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
      }).join(' ');
      return <polygon points={pts} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    case 'pentagon': {
      const r = half - strokeW;
      const pts = Array.from({ length: 5 }, (_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
      }).join(' ');
      return <polygon points={pts} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    case 'heart': {
      const s = size * 0.85;
      const ox = (size - s) / 2;
      const oy = (size - s) / 2 + s * 0.05;
      return (
        <path
          d={`M ${ox + s / 2} ${oy + s * 0.35}
              C ${ox + s / 2} ${oy + s * 0.25}, ${ox + s * 0.25} ${oy}, ${ox + s * 0.05} ${oy + s * 0.2}
              C ${ox - s * 0.1} ${oy + s * 0.45}, ${ox + s * 0.15} ${oy + s * 0.7}, ${ox + s / 2} ${oy + s * 0.95}
              C ${ox + s * 0.85} ${oy + s * 0.7}, ${ox + s * 1.1} ${oy + s * 0.45}, ${ox + s * 0.95} ${oy + s * 0.2}
              C ${ox + s * 0.75} ${oy}, ${ox + s / 2} ${oy + s * 0.25}, ${ox + s / 2} ${oy + s * 0.35} Z`}
          fill={color}
          stroke={borderColor}
          strokeWidth={strokeW}
        />
      );
    }
    case 'octagon': {
      const r = half - strokeW;
      const pts = Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        return `${half + r * Math.cos(angle)},${half + r * Math.sin(angle)}`;
      }).join(' ');
      return <polygon points={pts} fill={color} stroke={borderColor} strokeWidth={strokeW} strokeLinejoin="round" />;
    }
    default:
      return <circle cx={half} cy={half} r={half - strokeW} fill={color} stroke={borderColor} strokeWidth={strokeW} />;
  }
}

export const ShapeSVG: React.FC<ShapeSVGProps> = ({
  shape,
  color,
  borderColor,
  size = 32,
  number,
  showNumber = true,
  className = '',
  muted = false,
}) => {
  const finalColor = muted ? '#D1D5DB' : color;
  const finalBorder = muted ? '#9CA3AF' : borderColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <ShapePath shape={shape} color={finalColor} borderColor={finalBorder} size={size} />
      {showNumber && number !== undefined && (
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={muted ? '#6B7280' : '#FFFFFF'}
          fontSize={size * 0.4}
          fontWeight="bold"
          style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)`, pointerEvents: 'none' }}
        >
          {number}
        </text>
      )}
    </svg>
  );
};

// Component that renders a shape for a given number value
interface NumberShapeProps {
  value: number;
  size?: number;
  showNumber?: boolean;
  muted?: boolean;
  className?: string;
}

export const NumberShape: React.FC<NumberShapeProps> = ({ value, size = 32, showNumber = true, muted = false, className = '' }) => {
  const shapeInfo = KIDS_SHAPES[value];
  if (!shapeInfo) return <span>{value}</span>;

  return (
    <ShapeSVG
      shape={shapeInfo.shape}
      color={shapeInfo.color}
      borderColor={shapeInfo.borderColor}
      size={size}
      number={value}
      showNumber={showNumber}
      muted={muted}
      className={className}
    />
  );
};

// Legend component showing all shapes and their numbers
export const ShapeLegend: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`flex flex-wrap justify-center gap-1 ${compact ? 'gap-0.5' : 'gap-2'}`}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const info = KIDS_SHAPES[num];
        return (
          <div
            key={num}
            className={`flex items-center gap-1 ${compact ? 'px-1 py-0.5' : 'px-2 py-1'} rounded-lg`}
            style={{ backgroundColor: info.bgColor }}
          >
            <NumberShape value={num} size={compact ? 16 : 22} />
            {!compact && (
              <span className="text-[10px] font-semibold" style={{ color: info.borderColor }}>
                {info.colorName}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
