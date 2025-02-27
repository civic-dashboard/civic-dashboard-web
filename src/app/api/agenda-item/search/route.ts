import { parseNumberParam } from '@/api/utils';
import { createDB } from '@/database/kyselyDb';
import {
  AgendaItem,
  searchAgendaItems,
  SortByOption,
  sortByOptions,
  SortDirectionOption,
  sortDirectionOptions,
} from '@/database/queries/agendaItems';
import { NextRequest } from 'next/server';

export type AgendaItemSearchResponse = {
  page: number;
  pageSize: number;
  totalCount: number;
  results: AgendaItem[];
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseNumberParam(searchParams, 'page') ?? 0;
  if (Number.isNaN(page) || page < 0) {
    return Response.json({ error: `Invalid page: ${page} ` }, { status: 422 });
  }
  const pageSize = parseNumberParam(searchParams, 'pageSize') ?? 10;
  if (Number.isNaN(pageSize) || pageSize < 1) {
    return Response.json(
      { error: `Invalid page size: ${pageSize} ` },
      { status: 422 },
    );
  }
  const sortBy = (searchParams.get('sortBy') ?? 'date') as SortByOption;
  if (!sortByOptions.includes(sortBy)) {
    return Response.json(
      { error: `Invalid sort by: ${sortBy} ` },
      { status: 422 },
    );
  }
  const sortDirection = (searchParams.get('sortDirection') ??
    'ascending') as SortDirectionOption;
  if (!sortDirectionOptions.includes(sortDirection)) {
    return Response.json(
      { error: `Invalid sort direction: ${sortDirection} ` },
      { status: 422 },
    );
  }
  const decisionBodyId = parseNumberParam(searchParams, 'decisionBodyId');
  if (Number.isNaN(decisionBodyId)) {
    return Response.json(
      { error: `Invalid decision body: ${decisionBodyId} ` },
      { status: 422 },
    );
  }
  const termId = parseNumberParam(searchParams, 'termId');
  if (Number.isNaN(termId)) {
    return Response.json(
      { error: `Invalid term: ${decisionBodyId} ` },
      { status: 422 },
    );
  }
  const textQuery = searchParams.get('textQuery') ?? '';
  const minimumDate = parseNumberParam(searchParams, 'minimumDate');

  let result: AgendaItemSearchResponse;
  try {
    result = await searchAgendaItems(createDB(), {
      textQuery,
      page,
      pageSize,
      decisionBodyId,
      termId,
      sortBy,
      sortDirection,
      minimumDate,
    });
  } catch (e) {
    console.log((e as Error).message);
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }

  return Response.json(result);
}
