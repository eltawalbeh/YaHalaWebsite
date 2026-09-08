export type ListFilters = {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
};

export function filterRecords<T extends Record<string, any>>(
  records: T[],
  filters: ListFilters,
  searchableFields: string[],
): T[] {
  const search = filters.search?.trim().toLowerCase() || "";
  const from = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : -Infinity;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999`).getTime() : Infinity;
  return records.filter((record) => {
    const searchable = searchableFields.some((field) => String(record[field] ?? "").toLowerCase().includes(search));
    const created = new Date(record.created_at || 0).getTime();
    return (!search || searchable) && (!filters.status || filters.status === "all" || record.status === filters.status) && created >= from && created <= to;
  });
}

export function csvCell(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function rowsToCsv(rows: unknown[][]): string {
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`;
}

export function printPdf(): void {
  if (typeof window !== "undefined") window.print();
}
