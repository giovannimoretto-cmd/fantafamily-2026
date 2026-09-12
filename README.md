# FantaFamily 2026/27

Private family fantasy game for Gio, Pietro and Gabri.

## Stack
- Cloudflare Worker + Workers Static Assets
- Cloudflare D1
- API-Football
- GitHub as source/CI

## Rules
- Serie A 2026/27
- No budget
- New team every matchday
- Same player can be selected by all three coaches
- 7 formations: 3-4-3, 3-5-2, 4-3-3, 4-4-2, 4-5-1, 5-3-2, 5-4-1
- 11 starters + 7 bench
- Teams become unavailable once their match is live
- Base score = API player rating + agreed bonuses/maluses
- Clean sheet bonus only for goalkeeper
- Matchday ranking: 3 / 2 / 1 points
- Tie-break: higher fantasy score

## Secrets
Set `API_FOOTBALL_KEY` and `LEAGUE_TOKEN` as Cloudflare Worker secrets. Never commit either to GitHub.
