import type { ContentBlock } from "@/constants/blog";
import { cn } from "@/lib/utils";

type StatGridBlock = Extract<ContentBlock, { type: "stat-grid" }>;
type ChartBlock = Extract<ContentBlock, { type: "chart" }>;

const CHART_COLORS = [
  "#00E5FF",
  "#5EEAD4",
  "#F59E0B",
  "#A78BFA",
  "#FB7185",
  "#60A5FA",
];

function asNumber(value: string | number | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function colorFor(index: number, explicit?: string) {
  return explicit || CHART_COLORS[index % CHART_COLORS.length];
}

function formatValue(value: number) {
  return Intl.NumberFormat("en", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function ChartFrame({
  block,
  children,
}: {
  block: ChartBlock;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8 rounded-xl border border-line bg-surface/60 p-5">
      <figcaption className="mb-5">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {block.title}
        </h3>
        {block.description ? (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {block.description}
          </p>
        ) : null}
      </figcaption>
      {children}
      {(block.caption || block.source) ? (
        <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-faint">
          {block.caption}
          {block.caption && block.source ? " " : ""}
          {block.source ? <span>Source: {block.source}</span> : null}
        </p>
      ) : null}
    </figure>
  );
}

function BarChart({ block }: { block: ChartBlock }) {
  const width = 720;
  const height = 320;
  const padding = { top: 18, right: 24, bottom: 58, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const max = Math.max(
    1,
    ...block.data.flatMap((row) =>
      block.series.map((series) => asNumber(row[series.key])),
    ),
  );
  const groupWidth = chartWidth / Math.max(block.data.length, 1);
  const barWidth = Math.max(
    8,
    (groupWidth - 18) / Math.max(block.series.length, 1),
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      <line
        x1={padding.left}
        x2={padding.left + chartWidth}
        y1={padding.top + chartHeight}
        y2={padding.top + chartHeight}
        stroke="rgba(138,155,176,0.35)"
      />
      <line
        x1={padding.left}
        x2={padding.left}
        y1={padding.top}
        y2={padding.top + chartHeight}
        stroke="rgba(138,155,176,0.35)"
      />
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = padding.top + chartHeight - chartHeight * tick;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={y}
              y2={y}
              stroke="rgba(138,155,176,0.12)"
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="fill-ink-faint text-[11px]"
            >
              {formatValue(max * tick)}
            </text>
          </g>
        );
      })}
      {block.data.map((row, rowIndex) => {
        const groupX = padding.left + rowIndex * groupWidth + 9;
        return (
          <g key={rowIndex}>
            {block.series.map((series, seriesIndex) => {
              const value = asNumber(row[series.key]);
              const barHeight = (value / max) * chartHeight;
              const x = groupX + seriesIndex * barWidth;
              const y = padding.top + chartHeight - barHeight;
              return (
                <rect
                  key={series.key}
                  x={x}
                  y={y}
                  width={barWidth - 3}
                  height={barHeight}
                  rx="4"
                  fill={colorFor(seriesIndex, series.color)}
                >
                  <title>{`${series.label}: ${formatValue(value)}`}</title>
                </rect>
              );
            })}
            <text
              x={groupX + groupWidth / 2 - 9}
              y={height - 24}
              textAnchor="middle"
              className="fill-ink-faint text-[11px]"
            >
              {String(row[block.xKey] ?? "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ block }: { block: ChartBlock }) {
  const width = 720;
  const height = 320;
  const padding = { top: 18, right: 24, bottom: 58, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const max = Math.max(
    1,
    ...block.data.flatMap((row) =>
      block.series.map((series) => asNumber(row[series.key])),
    ),
  );
  const xStep = chartWidth / Math.max(block.data.length - 1, 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = padding.top + chartHeight - chartHeight * tick;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={y}
              y2={y}
              stroke="rgba(138,155,176,0.12)"
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="fill-ink-faint text-[11px]"
            >
              {formatValue(max * tick)}
            </text>
          </g>
        );
      })}
      {block.series.map((series, seriesIndex) => {
        const points = block.data.map((row, rowIndex) => {
          const x = padding.left + rowIndex * xStep;
          const y =
            padding.top +
            chartHeight -
            (asNumber(row[series.key]) / max) * chartHeight;
          return { x, y, value: asNumber(row[series.key]) };
        });
        const path = points
          .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
          .join(" ");
        const color = colorFor(seriesIndex, series.color);
        return (
          <g key={series.key}>
            <path d={path} fill="none" stroke={color} strokeWidth="3" />
            {points.map((point, pointIndex) => (
              <circle
                key={pointIndex}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                stroke="var(--color-surface)"
                strokeWidth="2"
              >
                <title>{`${series.label}: ${formatValue(point.value)}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
      <line
        x1={padding.left}
        x2={padding.left + chartWidth}
        y1={padding.top + chartHeight}
        y2={padding.top + chartHeight}
        stroke="rgba(138,155,176,0.35)"
      />
      {block.data.map((row, rowIndex) => (
        <text
          key={rowIndex}
          x={padding.left + rowIndex * xStep}
          y={height - 24}
          textAnchor="middle"
          className="fill-ink-faint text-[11px]"
        >
          {String(row[block.xKey] ?? "")}
        </text>
      ))}
    </svg>
  );
}

function DonutChart({ block }: { block: ChartBlock }) {
  const series = block.series[0];
  if (!series) return null;

  const values = block.data.map((row) => ({
    label: String(row[block.xKey] ?? ""),
    value: Math.max(0, asNumber(row[series.key])),
  }));
  const total = values.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return null;

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const { segments } = values.reduce<{
    offset: number;
    segments: Array<
      (typeof values)[number] & {
        color: string;
        strokeDasharray: string;
        strokeDashoffset: number;
      }
    >;
  }>((acc, item, index) => {
    const dashLength = (item.value / total) * circumference;
    return {
      offset: acc.offset - dashLength,
      segments: [
        ...acc.segments,
        {
          ...item,
          color: colorFor(index),
          strokeDasharray: `${dashLength} ${circumference}`,
          strokeDashoffset: acc.offset,
        },
      ],
    };
  }, { offset: 25, segments: [] });

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr] md:items-center">
      <svg viewBox="0 0 220 220" className="mx-auto size-56">
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="rgba(138,155,176,0.14)"
          strokeWidth="26"
        />
        {segments.map((item) => (
            <circle
              key={item.label}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="26"
              strokeDasharray={item.strokeDasharray}
              strokeDashoffset={item.strokeDashoffset}
              strokeLinecap="butt"
              transform="rotate(-90 110 110)"
            >
              <title>{`${item.label}: ${formatValue(item.value)}`}</title>
            </circle>
        ))}
        <text
          x="110"
          y="104"
          textAnchor="middle"
          className="fill-ink text-2xl font-semibold"
        >
          {formatValue(total)}
        </text>
        <text
          x="110"
          y="126"
          textAnchor="middle"
          className="fill-ink-faint text-[11px]"
        >
          total
        </text>
      </svg>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-md border border-line bg-page/70 px-3 py-2"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm text-ink-muted">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colorFor(index) }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="font-mono text-xs text-ink">
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ block }: { block: ChartBlock }) {
  return (
    <details className="mt-4 rounded-lg border border-line bg-page/70">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ink-muted">
        View chart data
      </summary>
      <div className="overflow-x-auto border-t border-line">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-surface-hi text-ink-faint">
            <tr>
              <th className="px-3 py-2 font-medium">{block.xKey}</th>
              {block.series.map((series) => (
                <th key={series.key} className="px-3 py-2 font-medium">
                  {series.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.data.map((row, index) => (
              <tr key={index} className="border-t border-line">
                <td className="px-3 py-2 text-ink-muted">
                  {String(row[block.xKey] ?? "")}
                </td>
                {block.series.map((series) => (
                  <td key={series.key} className="px-3 py-2 font-mono text-ink">
                    {String(row[series.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function Legend({ block }: { block: ChartBlock }) {
  if (block.chartType === "donut") return null;

  return (
    <div className="mb-3 flex flex-wrap gap-3">
      {block.series.map((series, index) => (
        <span
          key={series.key}
          className="inline-flex items-center gap-2 text-xs text-ink-muted"
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: colorFor(index, series.color) }}
          />
          {series.label}
        </span>
      ))}
    </div>
  );
}

export function ArticleStatGrid({ block }: { block: StatGridBlock }) {
  return (
    <section className="my-8 rounded-xl border border-line bg-surface/50 p-5">
      {(block.title || block.description) ? (
        <div className="mb-4">
          {block.title ? (
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
              {block.title}
            </h3>
          ) : null}
          {block.description ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {block.description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {block.items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="rounded-lg border border-line bg-page/70 p-4"
          >
            <p className="text-xs uppercase tracking-wider text-ink-faint">
              {item.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
              {item.value}
            </p>
            {item.helper ? (
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {item.helper}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ArticleChart({ block }: { block: ChartBlock }) {
  if (block.data.length === 0 || block.series.length === 0) return null;

  return (
    <ChartFrame block={block}>
      <Legend block={block} />
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-line bg-page/70 p-3",
          block.chartType === "donut" && "p-5",
        )}
      >
        {block.chartType === "bar" ? <BarChart block={block} /> : null}
        {block.chartType === "line" ? <LineChart block={block} /> : null}
        {block.chartType === "donut" ? <DonutChart block={block} /> : null}
      </div>
      <DataTable block={block} />
    </ChartFrame>
  );
}
