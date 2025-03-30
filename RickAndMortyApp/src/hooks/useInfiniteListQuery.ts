import {
  useInfiniteQuery,
  type QueryKey,
  type UseInfiniteQueryResult,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import type { ApiInfo } from '@/types/api';

const getPageParam = (urlString: string | null): number | undefined => {
  if (!urlString) {
    return undefined;
  }
  try {
    const url = new URL(urlString);
    const page = url.searchParams.get('page');
    return page ? parseInt(page, 10) : undefined;
  } catch (e) {
    console.error('Error parsing URL:', e);
    return undefined;
  }
};

interface PaginatedApiResponse {
  info: ApiInfo;
}

interface UseInfiniteListQueryProps<TData extends PaginatedApiResponse, TFilters> {
  queryKeyBase: string; // e.g., 'characters', 'episodes'
  filters: TFilters;
  fetchFn: (params: TFilters & { page?: number }) => Promise<TData>;
}

export function useInfiniteListQuery<
  TData extends PaginatedApiResponse,
  TFilters = Record<string, unknown>,
>({
  queryKeyBase,
  filters,
  fetchFn,
}: UseInfiniteListQueryProps<TData, TFilters>): UseInfiniteQueryResult<TData> {
  const queryKey: QueryKey = [queryKeyBase, filters];

  const queryFn = async ({
    pageParam = 1,
  }: QueryFunctionContext<QueryKey, number | undefined>): Promise<TData> => {
    const data = await fetchFn({ ...filters, page: pageParam });
    return data;
  };

  const getNextPageParam = (lastPage: TData): number | undefined => {
    return getPageParam(lastPage.info.next);
  };

  return useInfiniteQuery<TData, Error, TData, QueryKey, number>({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
  });
}
