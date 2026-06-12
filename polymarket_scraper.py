"""
Polymarket Top-Trader Position Scraper
Shows the most common active positions held by Polymarket's top 20 traders.

Usage:
    pip install requests
    python3 polymarket_scraper.py
"""

import json
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime

try:
    import requests
except ImportError:
    print("Error: 'requests' not installed. Run: pip install requests")
    sys.exit(1)

# --- API endpoints ----------------------------------------------------------------

LEADERBOARD_URL = "https://gamma-api.polymarket.com/leaderboard"
POSITIONS_URL   = "https://data-api.polymarket.com/positions"
MARKET_URL      = "https://gamma-api.polymarket.com/markets"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Referer": "https://polymarket.com/",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)

# --- Fetchers ---------------------------------------------------------------------

def get_top_traders(n: int = 20) -> list[dict]:
    """Return the top-n traders from the Polymarket all-time leaderboard."""
    params = {
        "limit": n,
        "offset": 0,
        "window": "allTime",
    }
    resp = SESSION.get(LEADERBOARD_URL, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    # API may return a list directly or wrap it
    if isinstance(data, list):
        return data[:n]
    return data.get("data", data.get("results", []))[:n]


def get_positions(address: str) -> list[dict]:
    """Return all active (non-zero) positions for a wallet address."""
    params = {
        "user": address,
        "limit": 500,
        "offset": 0,
        "sortBy": "currentValue",
        "sortDirection": "DESC",
    }
    try:
        resp = SESSION.get(POSITIONS_URL, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            return data
        return data.get("data", data.get("results", []))
    except requests.RequestException as exc:
        print(f"  [warn] positions fetch failed for {address[:10]}…: {exc}")
        return []


def get_market_title(condition_id: str) -> str:
    """Resolve a conditionId to a human-readable market title (cached)."""
    cache = get_market_title._cache
    if condition_id in cache:
        return cache[condition_id]
    try:
        resp = SESSION.get(
            f"{MARKET_URL}/{condition_id}",
            timeout=10,
        )
        if resp.status_code == 200:
            title = resp.json().get("question") or resp.json().get("title") or condition_id
            cache[condition_id] = title
            return title
    except requests.RequestException:
        pass
    cache[condition_id] = condition_id
    return condition_id

get_market_title._cache = {}

# --- Analysis ---------------------------------------------------------------------

def aggregate_positions(all_positions: dict[str, list[dict]]) -> list[dict]:
    """
    Given {address: [position, ...]}, return positions ranked by how many
    of the top traders hold them, with aggregate stats.

    Each position dict is expected to have at least:
        conditionId / market_id   — identifier
        outcome                   — "YES" / "NO" / token name
        currentValue              — USD value
        size                      — share count
    """
    # Key = (conditionId, outcome)
    holder_count: Counter = Counter()
    total_value:  defaultdict = defaultdict(float)
    total_size:   defaultdict = defaultdict(float)
    meta:         dict = {}

    for address, positions in all_positions.items():
        for pos in positions:
            cid     = pos.get("conditionId") or pos.get("market_id") or pos.get("marketId") or ""
            outcome = (pos.get("outcome") or pos.get("side") or "").upper()
            value   = float(pos.get("currentValue") or pos.get("value") or 0)
            size    = float(pos.get("size") or pos.get("shares") or 0)

            if not cid:
                continue

            key = (cid, outcome)
            holder_count[key] += 1
            total_value[key]  += value
            total_size[key]   += size

            if key not in meta:
                meta[key] = {
                    "conditionId": cid,
                    "outcome":     outcome,
                    "title":       pos.get("title") or pos.get("question") or "",
                }

    results = []
    for key, count in holder_count.most_common():
        cid, outcome = key
        entry = meta[key].copy()
        if not entry["title"]:
            entry["title"] = get_market_title(cid)
            time.sleep(0.05)
        entry["holders"]    = count
        entry["totalValue"] = total_value[key]
        entry["totalSize"]  = total_size[key]
        results.append(entry)

    return results

# --- Display ---------------------------------------------------------------------

def fmt_usd(v: float) -> str:
    if v >= 1_000_000:
        return f"${v/1_000_000:.2f}M"
    if v >= 1_000:
        return f"${v/1_000:.1f}K"
    return f"${v:.2f}"


def print_report(ranked: list[dict], top_n_traders: int, top_positions: int = 30) -> None:
    bar = "=" * 82
    print(f"\n{bar}")
    print(f"  POLYMARKET — Most Common Positions Among Top {top_n_traders} Traders")
    print(f"  {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
    print(bar)
    print(f"  {'#':>3}  {'Holders':>7}  {'Outcome':>6}  {'Combined Value':>14}  Market")
    print(f"  {'-'*3}  {'-'*7}  {'-'*6}  {'-'*14}  {'-'*40}")

    for i, pos in enumerate(ranked[:top_positions], 1):
        title   = pos["title"][:60] + "…" if len(pos["title"]) > 60 else pos["title"]
        outcome = pos["outcome"] or "—"
        holders = pos["holders"]
        value   = fmt_usd(pos["totalValue"])
        print(f"  {i:>3}  {holders:>7}  {outcome:>6}  {value:>14}  {title}")

    print(bar)
    print(f"  Showing top {min(top_positions, len(ranked))} of {len(ranked)} unique positions.")
    print()


def save_json(ranked: list[dict], path: str = "top_trader_positions.json") -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(ranked, f, indent=2, default=str)
    print(f"Full data saved → {path}")


# --- Main -----------------------------------------------------------------------

def main() -> None:
    TOP_N = 20

    print(f"\nStep 1/3  Fetching Polymarket top-{TOP_N} leaderboard…")
    try:
        traders = get_top_traders(TOP_N)
    except requests.HTTPError as e:
        print(f"Leaderboard fetch failed: {e}")
        sys.exit(1)
    except requests.ConnectionError:
        print("Network error — are you connected to the internet?")
        sys.exit(1)

    if not traders:
        print("No traders returned from leaderboard.")
        sys.exit(0)

    addresses = []
    for t in traders:
        addr = (
            t.get("proxyWallet")
            or t.get("address")
            or t.get("user")
            or t.get("proxy_wallet")
            or ""
        )
        if addr:
            addresses.append(addr)

    print(f"         Found {len(addresses)} trader addresses.\n"
          f"Step 2/3  Fetching positions for each trader…")

    all_positions: dict[str, list[dict]] = {}
    for i, addr in enumerate(addresses, 1):
        print(f"  [{i:>2}/{len(addresses)}] {addr}")
        positions = get_positions(addr)
        # Keep only positions with non-zero value
        active = [p for p in positions if float(p.get("currentValue") or p.get("value") or 0) > 0]
        all_positions[addr] = active
        time.sleep(0.1)  # polite rate-limiting

    print(f"\nStep 3/3  Aggregating…")
    ranked = aggregate_positions(all_positions)

    print_report(ranked, top_n_traders=len(addresses))
    save_json(ranked)


if __name__ == "__main__":
    main()
