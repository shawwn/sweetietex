// @flow

import FuzzySearch from 'fuzzy-search';

type SearchOptions = {
  caseSensitive?: boolean,
  sort?: boolean
};

export const makeSearcher = (
  data: Object[], paths: string[], options?: SearchOptions,
): FuzzySearch => new FuzzySearch(data, paths, options);
