# Brutalist Britain

**Brutalist Britain** is a website that maps, documents, and celebrates Britain’s concrete landmarks. It offers an interactive map of notable brutalist buildings, with details on architects, dates, status, and sources. The site aims to make this architecture discoverable and to support awareness and preservation.

## Technologies Used

- **[Next.js](https://nextjs.org)** (App Router) – React framework and routing
- **[React](https://react.dev)** – UI components
- **[TypeScript](https://www.typescriptlang.org)** – Typed JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** – Styling
- **[Leaflet](https://leafletjs.com)** / **[React-Leaflet](https://react-leaflet.js.org)** – Interactive map
- **JSON** – Building and collection data (`data/buildings.json`, `data/collections.json`)

## Project Structure

```
BrutalistBritain/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home (hero, collections, CTAs)
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── map/
│   │   └── page.tsx        # Map view page
│   └── b/[id]/
│       └── page.tsx        # Individual building page
├── components/             # React components
│   ├── BuildingCard.tsx
│   ├── BuildingDrawer.tsx
│   ├── CollectionList.tsx
│   ├── FilterChips.tsx
│   ├── KoFiWidget.tsx
│   ├── MapClient.tsx
│   ├── MapView.tsx
│   └── Sidebar.tsx
├── data/
│   ├── buildings.json      # Building entries (id, name, location, type, etc.)
│   └── collections.json    # Curated collections
├── lib/                    # Utilities and types
│   ├── buildings.ts        # Data loading/helpers
│   ├── geo.ts              # Geo utilities
│   └── types.ts            # TypeScript types
├── public/
│   └── buildings/          # Building images (e.g. .webp)
└── .github/
    └── ISSUE_TEMPLATE/     # “Suggest a building” issue template
```

## Running the project locally

1. **Clone the repo** (if you haven’t already):
   ```bash
   git clone <repo-url>
   cd BrutalistBritain
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Build for production**: `npm run build`  
- **Run production build**: `npm start`  
- **Lint**: `npm run lint`

## Contributing

Contributions are welcome. Ways to help:

- **Suggest a building** – Open an issue using the [Suggest a Building](.github/ISSUE_TEMPLATE/suggest-building.yml) template. Include the building name, location, and why it’s notable (brutalist features, history, or significance).
- **Code and data** – Pull requests that fix bugs, improve the map or UI, or add/update buildings or collections in the JSON data are encouraged.

Please open an issue first for larger changes so we can align on approach.
