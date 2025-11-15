# Which Day Do Top Weekly Podcasts Release?

I’m continuing a series on the patterns the top shows follow.

Here’s what we’ve covered so far:
- [How often the top shows publish](https://www.adithyan.io/blog/top-podcast-cadence)
- [How long their episodes run](https://www.adithyan.io/blog/how-long-top-podcasts-run)
- [Who hosts these top podcasts](https://www.adithyan.io/blog/who-hosts-top-podcasts)

The next basic question is timing: on which weekday do these shows release new episodes?

To keep the analysis clean, I’m looking only at the shows that publish weekly (for details, see the [previous post](https://www.adithyan.io/blog/top-podcast-cadence)).

How this post works:
- First I show the results.
- Then the key takeaways.
- Then a short methodology section if you want to know more about the data and analysis.
- Then I include a link to the raw JSON data so you can explore the data yourself.

## Results

### When do weekly shows release?

*The same table below in a downloadable chart format is here:* [*When Do Top Weekly Shows Release?*](https://www.adithyan.io/blog/release-timing-weekly#when-do-weekly-shows-release)

| Weekday | Shows | Share |
|:-|:-:|:-:|
| Mon | 130 | 22.3% |
| Tue | 131 | 22.5% |
| Wed | 124 | 21.3% |
| Thu | 90 | 15.5% |
| Fri | 70 | 12.0% |
| Sat | 12 | 2.1% |
| Sun | 25 | 4.3% |
| **Total** | **582** | **100%** |

What stands out:
- Of the top 1,000 shows, 582 weekly shows with ≥5 dated recent episodes were evaluated.
- Releases cluster on Monday–Wednesday; Thursday follows. Weekends are rare.
- Split by weekday: Tue 22.5%, Mon 22.3%, Wed 21.3%, Thu 15.5%, Fri 12.0%, Sun 4.3%, Sat 2.1%.

### How consistent are they on that day?

Weekly shows sometimes miss their usual release day.
We capture this with a stability band: the share of recent episodes that land on the weekday a show posts most often.

*The same table below in a downloadable chart format is here:* [*How Consistent Are Top Weekly Shows?*](https://www.adithyan.io/blog/release-timing-weekly#how-consistent-are-top-weekly-shows)

| Stability band | Shows | Share |
|:-|:-:|:-:|
| ≥80% | 308 | 52.9% |
| 60–79% | 86 | 14.8% |
| 40–59% | 158 | 27.1% |
| <40% | 30 | 5.2% |
| **Total** | **582** | **100%** |

What the bands mean, in plain terms:
- 308 shows (52.9%) hit the same weekday at least four out of five times (≥80%).
- 86 shows (14.8%) land there most of the time (60 to 79%).
- 158 shows (27.1%) are looser (40 to 59%).
- 30 shows (5.2%) are highly irregular (under 40%).

## Key takeaways

- If you publish weekly and want reliability, aim for a Monday–Wednesday release (Thursday also common). The key is the discipline to keep hitting it.
- Your audience and downstream workflows (clips, newsletter, social) benefit from a predictable rhythm.

## Method (short)

- Cohort: Top 1,000 shows by audience; keep only weekly‑cadence shows.
- For each show, consider up to the last 40 episodes (require ≥5 dated).
- For each show, find the weekday it posts most often (UTC).
- Measure stability as the share of recent episodes that land on that same weekday.
- Aggregate shows into weekday counts and stability bands.

Notes
- Using UTC may shift some late night local releases to the next day. The effect is small and applied evenly across shows.
- Evaluated weekly shows: 582 of the 1,000 selected. The rest did not have enough dated episodes.
- Data snapshot generated on 2025-11-06.

Raw data (for reproducibility)
- [Raw JSON snapshot (Top‑1k weekly)](https://gist.github.com/AdithyanI/5165d9311d9dc0660969e7794c6b5440) — generated on 2025‑11‑06
- SHA‑256: 2904e33f1dd88fab81e1da096a2ea0ca6303c5472e972348904ee0a23c27918f

