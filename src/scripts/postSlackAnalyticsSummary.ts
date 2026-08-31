// Weekly analytics summary from Umami Cloud to Slack.
//
// Uses Umami's public share URL feature to authenticate (no API key needed,
// works on the free Hobby tier). Fetches summary stats (with week-over-week
// comparison), top pages, and top referrers for the last 7 days, formats a
// Slack message, and posts it to a Slack incoming webhook.
//
// Usage:
//   npm run tsxe src/scripts/postSlackAnalyticsSummary.ts              # live run
//   npm run tsxe src/scripts/postSlackAnalyticsSummary.ts -- --dry-run # print only, no Slack post
//
// Env vars:
//   SLACK_WEBHOOK_URL — Slack incoming webhook URL (required unless --dry-run)

import { parseArgs } from 'node:util';

// --- Config ---

const UMAMI_SHARE_SLUG = '6R9CNotgCUNEmDL5'; // Slug from public URL
const UMAMI_API_BASE = 'https://cloud.umami.is/analytics/eu/api';

// --- Types ---

type ShareTokenResponse = {
  shareId: string;
  shareType: number;
  parameters: Record<string, unknown>;
  websiteId: string;
  token: string;
};

type StatsResponse = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
};

type MetricEntry = {
  x: string;
  y: number;
};

// --- Pure functions (no I/O — testable) ---

/** Formats a count with thousands separators: 1204 → "1,204" */
function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/** Formats a week-over-week delta as a signed percentage: 15 → "+15%", -12 → "-12%" */
function formatPercent(current: number, prev: number): string {
  if (prev === 0) return '—';
  const pct = Math.round(((current - prev) / prev) * 100);
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}%`;
}

/** Formats total seconds as a human duration: 153 → "2m 33s" */
function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}m ${s}s`;
}

/** Formats a date range as "Aug 21–28" */
function formatDateRange(start: Date, end: Date): string {
  const month = start.toLocaleString('en-US', { month: 'short' });
  return `${month} ${start.getDate()}–${end.getDate()}`;
}

/** Builds the Slack message text from stats and metrics */
function buildSlackMessage(
  stats: StatsResponse,
  topPages: MetricEntry[],
  topReferrers: MetricEntry[],
  weekStart: Date,
  now: Date,
): string {
  const prev = stats.comparison;
  const bounceRate =
    stats.visits > 0 ? (stats.bounces / stats.visits) * 100 : 0;
  const prevBounceRate =
    prev.visits > 0 ? (prev.bounces / prev.visits) * 100 : 0;
  const bounceRateChange = bounceRate - prevBounceRate;

  const avgVisitTime = stats.visits > 0 ? stats.totaltime / stats.visits : 0;
  const prevAvgVisitTime = prev.visits > 0 ? prev.totaltime / prev.visits : 0;
  const avgVisitTimeChange = avgVisitTime - prevAvgVisitTime;

  const lines: string[] = [];
  lines.push(
    `📊 Weekly Analytics Summary — ${formatDateRange(weekStart, now)}`,
  );
  lines.push('');
  lines.push(
    `Pageviews: ${formatNumber(stats.pageviews)} (${formatPercent(stats.pageviews, prev.pageviews)} vs last week)`,
  );
  lines.push(
    `Unique visitors: ${formatNumber(stats.visitors)} (${formatPercent(stats.visitors, prev.visitors)})`,
  );
  lines.push(
    `Sessions: ${formatNumber(stats.visits)} (${formatPercent(stats.visits, prev.visits)})`,
  );
  lines.push(
    `Bounce rate: ${bounceRate.toFixed(1)}% (${bounceRateChange >= 0 ? '+' : ''}${bounceRateChange.toFixed(1)}%)`,
  );
  lines.push(
    `Avg visit time: ${formatDuration(avgVisitTime)} (${avgVisitTimeChange >= 0 ? '+' : ''}${formatDuration(Math.abs(avgVisitTimeChange))})`,
  );
  lines.push('');

  if (topPages.length > 0) {
    lines.push('🔥 Top pages');
    topPages.forEach((page, i) => {
      lines.push(`  ${i + 1}. ${page.x} — ${formatNumber(page.y)} views`);
    });
    lines.push('');
  }

  if (topReferrers.length > 0) {
    lines.push('🔗 Top referrers');
    topReferrers.forEach((ref, i) => {
      const label = ref.x || '(direct)';
      lines.push(`  ${i + 1}. ${label} — ${formatNumber(ref.y)}`);
    });
  }

  return lines.join('\n');
}

// --- I/O functions ---

/** Fetches a share token from the public share URL slug */
async function fetchShareToken(
  apiBase: string,
  shareSlug: string,
): Promise<ShareTokenResponse> {
  const url = `${apiBase}/share/${shareSlug}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Share token request failed: ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as ShareTokenResponse;
}

async function fetchStats(
  apiBase: string,
  websiteId: string,
  shareToken: string,
  startAt: number,
  endAt: number,
): Promise<StatsResponse> {
  const url = `${apiBase}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
  const res = await fetch(url, {
    headers: {
      'x-umami-share-token': shareToken,
      'x-umami-share-context': '1',
    },
  });
  if (!res.ok) {
    throw new Error(`Stats request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as StatsResponse;
}

async function fetchMetrics(
  apiBase: string,
  websiteId: string,
  shareToken: string,
  startAt: number,
  endAt: number,
  type: 'path' | 'referrer',
  limit: number,
): Promise<MetricEntry[]> {
  const url = `${apiBase}/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=${type}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      'x-umami-share-token': shareToken,
      'x-umami-share-context': '1',
    },
  });
  if (!res.ok) {
    throw new Error(
      `Metrics (${type}) request failed: ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as MetricEntry[];
}

async function postToSlack(webhookUrl: string, text: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Slack POST failed: ${res.status} ${res.statusText}`);
  }
}

// --- Main ---

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'dry-run': { type: 'boolean', default: false },
    },
  });
  const dryRun = values['dry-run'];

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl && !dryRun) {
    throw new Error(
      'SLACK_WEBHOOK_URL env var is required (use --dry-run to skip posting)',
    );
  }

  // Time window: last 7 days from now, truncated to midnight UTC
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const startAt = weekStart.getTime();
  const endAt = now.getTime();

  console.log(`Fetching analytics for ${formatDateRange(weekStart, now)}...`);

  // Step 1: get share token (provides auth for all subsequent calls)
  const { token: shareToken, websiteId } = await fetchShareToken(
    UMAMI_API_BASE,
    UMAMI_SHARE_SLUG,
  );

  // Step 2: fetch stats + metrics in parallel
  const [stats, topPages, topReferrers] = await Promise.all([
    fetchStats(UMAMI_API_BASE, websiteId, shareToken, startAt, endAt),
    fetchMetrics(
      UMAMI_API_BASE,
      websiteId,
      shareToken,
      startAt,
      endAt,
      'path',
      5,
    ),
    fetchMetrics(
      UMAMI_API_BASE,
      websiteId,
      shareToken,
      startAt,
      endAt,
      'referrer',
      5,
    ),
  ]);

  const message = buildSlackMessage(
    stats,
    topPages,
    topReferrers,
    weekStart,
    now,
  );

  if (dryRun) {
    console.log('\n--- Slack message (dry-run) ---\n');
    console.log(message);
    console.log('\n--- end ---');
    return;
  }

  await postToSlack(webhookUrl!, message);
  console.log('Posted weekly analytics summary to Slack.');
}

main().catch((err) => {
  console.error('Error executing script:', err);
  process.exit(1);
});
