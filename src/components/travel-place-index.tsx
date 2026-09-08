import {
  travelPlaces,
  type TravelPlaceEntry,
  type TravelPlaceId,
} from "@/lib/travel-data";

type GroupedPlaces = Record<string, Record<string, TravelPlaceEntry[]>>;

const groupedPlaces = travelPlaces.reduce<GroupedPlaces>(
  (continents, place) => {
    continents[place.continent] ??= {};
    continents[place.continent][place.country] ??= [];
    continents[place.continent][place.country].push(place);

    return continents;
  },
  {},
);

export function TravelPlaceIndex({
  selectedId,
  onSelect,
}: {
  selectedId: TravelPlaceId;
  onSelect: (id: TravelPlaceId) => void;
}) {
  return (
    <div className="rounded-md border border-line/70 bg-surface/65 p-5">
      <p className="font-mono text-xs uppercase text-accent-strong">
        City index
      </p>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {Object.entries(groupedPlaces).map(([continent, countries]) => (
          <div key={continent}>
            <h3 className="text-lg font-semibold text-foreground">
              {continent}
            </h3>
            <div className="mt-3 space-y-4">
              {Object.entries(countries).map(([country, places]) => (
                <div key={country}>
                  <p className="font-mono text-xs uppercase text-accent">
                    {country}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {places.map((place) => {
                      const active = place.id === selectedId;

                      return (
                        <button
                          key={place.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => onSelect(place.id)}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                            active
                              ? "border-accent-strong/80 bg-accent-strong/15 text-foreground"
                              : "border-line/70 bg-surface-soft/55 text-muted hover:border-accent/70 hover:text-foreground"
                          }`}
                        >
                          {place.place}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
