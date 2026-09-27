export default function RainbowGauge({
  total = 20,
  filled = 12,
  radius = 72,
  barWidth = 8,
  barHeight = 28,
  activeColor = "#f97316",
  inactiveColor = "#e5e7eb",
}) {
  const cx = radius + barHeight;
  const cy = radius + barHeight;

  const width = cx * 2;
  const height = cy + barHeight;

  const startAngle = -69;
  const endAngle = 99;
  const step = (endAngle - startAngle) / (total - 1);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {Array.from({ length: total }).map((_, i) => {
        const angle = startAngle + i * step;

        return (
          <rect
            key={i}
            x={cx - barWidth / 2}
            y={cy - radius - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={i < filled ? activeColor : inactiveColor}
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}
