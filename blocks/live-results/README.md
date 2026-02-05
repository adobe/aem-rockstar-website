# Live Results Block

A full-screen, live-updating results board for on-stage display. It renders candidate cards that rank and resize as votes come in. A timer gates when votes are accepted and persists final results to local storage.

## Authoring

No authoring data is required. The block builds candidate cards dynamically as vote events arrive. If you want to pre-seed names for layout testing, you can add a simple list:

```
| live-results |
| Person One |
| Person Two |
| Person Three |
```

### Config (optional)

```
| live-results |
| mode | default |
```

Notes:
- `mode` is optional and currently only supports `default`. It is reserved for future variants.

Notes:
- Header-like labels (e.g., `Name`, `Names`, `Candidate`, `Candidates`) are ignored if present in data rows.
- If no data is provided, fallback candidates are used.

## Behavior

- **Live updates**: Listens for incoming vote events and updates the board in real time.
- **Vote gating**: Votes are ignored until the **Start** button is pressed.
- **Timer**: Default 2 minutes. Adjustable before start via `-15s` / `+15s`.
- **End state**: When the timer ends, votes stop, progress bars are removed, and final percentages + trophy for the leader are shown.
- **Reorder animation**: Cards animate into new positions when rankings change.
- **Fullscreen**: The block applies a fullscreen layout and hides page header/footer while present.

## Local Storage

Final results are saved on timer end to local storage under the key:

- `live-results-history`

The value is a JSON array of the **last 5 runs**, newest first:

```
[
  {
    "savedAt": "2026-02-05T12:34:56.789Z",
    "totalVotes": 123,
    "results": [
      { "name": "Person One", "votes": 50, "percent": 40.7 },
      { "name": "Person Two", "votes": 45, "percent": 36.6 },
      { "name": "Person Three", "votes": 28, "percent": 22.8 }
    ]
  }
]
```

## Simulator

You can simulate live events using the Node script:

```
node tools/simulate-votes.js "Person One,Person Two,Person Three"
```

The script reads credentials from `../aws-audience-vote/routes/vote.js` by default. If you need overrides, set the environment variables in the script header.

## Files

- `blocks/live-results/live-results.js`
- `blocks/live-results/live-results.css`
- `blocks/live-results/README.md`
