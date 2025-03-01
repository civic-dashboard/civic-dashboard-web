export default function AgendaItemSearch({
  onSearch,
}: {
  onSearch: (term: string) => void;
}) {
  return (
    <form
      className="flex items-center gap-2 mb-4 p-2 border rounded-lg"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        aria-label="Search agenda items"
        placeholder="Search agenda items…"
        className="flex-1 bg-transparent"
        onChange={(e) => onSearch(e.currentTarget.value)}
      />
    </form>
  );
}
