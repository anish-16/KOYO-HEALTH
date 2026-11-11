import { cn } from '@/lib/utils';

export function Sparkline({
  values,
  tone = 'teal',
  className,
}: {
  values: number[];
  tone?: 'teal' | 'gold' | 'clay';
  className?: string;
}) {
  const width = 132;
  const height = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((value, i) => {
    const x = (i / (values.length - 1 || 1)) * width;
    const y = height - ((value - min) / span) * (height - 6) - 3;
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${path} L${width},${height} L0,${height} Z`;
  const colors = { teal: '#0F7A6C', gold: '#BF9B4F', clay: '#AC4F2A' } as const;
  const stroke = colors[tone];
  const id = `spark-${tone}-${values.join('-')}`.replace(/[^a-zA-Z0-9-]/g, '');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-10 w-[132px]', className)}
      role="img"
      aria-label="Trend over the last six readings"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1][0] - 1} cy={points[points.length - 1][1]} r="2.5" fill={stroke} />
    </svg>
  );
}
