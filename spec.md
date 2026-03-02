# Specification

## Summary
**Goal:** Build the initial Makeshift Moguls app — a business/tycoon-themed platform with a Motoko backend and React frontend on ICP.

**Planned changes:**
- Create a Motoko backend actor (`backend/main.mo`) with a persistent store for mogul/player entries (name + score), plus create, read-by-ID, and list-all functions
- Build a React frontend that fetches and displays the list of mogul entries from the backend, with a form to add new entries by name
- Apply a bold industrial tycoon visual theme: dark charcoal and gold color palette, strong typography, gritty/geometric background patterns, consistent across all pages and components
- Display the app header banner image and gold coin icon as part of the themed UI

**User-visible outcome:** Users can visit the Makeshift Moguls app, see a styled list of mogul entries fetched from the blockchain backend, and submit a new mogul name via a form — all within a bold dark-charcoal-and-gold tycoon aesthetic.
