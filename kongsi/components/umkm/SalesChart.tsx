import type { SalesDataPoint } from "@/lib/umkmMockData";

interface SalesChartProps {
  data: SalesDataPoint[];
}

const CHART_HEIGHT = 160;
const BAR_WIDTH = 28;
const GAP = 20;

export default function SalesChart({ data }: SalesChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = data.length * (BAR_WIDTH + GAP) - GAP;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${CHART_HEIGHT + 28}`}
        className="h-[188px] w-full min-w-[320px]"
        role="img"
        aria-label="Grafik penjualan 7 hari terakhir"
      >
        {data.map((point, index) => {
          const barHeight = Math.max(6, (point.value / max) * CHART_HEIGHT);
          const x = index * (BAR_WIDTH + GAP);
          const y = CHART_HEIGHT - barHeight;
          const isMax = point.value === max;

          return (
            <g key={point.label}>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={8}
                fill={isMax ? "#3991FA" : "#3991FA"}
                opacity={isMax ? 1 : 0.35}
              />
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT + 20}
                textAnchor="middle"
                className="fill-[#7A7876] text-[11px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
