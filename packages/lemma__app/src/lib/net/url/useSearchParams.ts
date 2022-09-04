import { useCallback, useMemo } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';

const toObject = <T extends Record<string, string>>(searchParams: URLSearchParams): T => {
  const params: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params as T;
};

const fromObject = <T extends Record<string, string>>(params: T): URLSearchParams => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  return searchParams;
};

export function useSearchParams<QueryParams extends Record<string, string>>(): [QueryParams, (params: QueryParams) => void] {
  const [params, setParams] = _useSearchParams();

  return [
    useMemo(() => toObject<QueryParams>(params), [params]),
    useCallback((newParams: QueryParams) => setParams(fromObject(newParams)), [setParams]),
  ];
}
