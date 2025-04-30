import React, { useMemo } from 'react';
import Fuse, { FuseResultMatch } from 'fuse.js';
import styles from './index.module.css';

export function useFuzzySearch<T>(items: T[], options: FuzzySearchOptions<T> = {}): UseFuzzySearchResult<T> {
  const fuse = useMemo(() => {
    return new Fuse(items, options);
  }, [items, options]);

  return useMemo(() => {
    return {
      search(query: string) {
        return fuse.search(query);
      },
      highlightText(text: string, matches?: FuseResultMatch[]) {
        if (!matches || matches.length === 0) return text;

        let highlightedText: (string | React.ReactNode)[] = [text];

        // Sort matches in reverse order to avoid index shifting
        matches
          .sort((a, b) => b.indices[0][0] - a.indices[0][0])
          .forEach((match) => {
            highlightedText = highlightedText
              .map((chunk) => {
                if (typeof chunk !== 'string') return chunk;

                const [start, end] = match.indices[0];
                return [
                  chunk.slice(0, start),
                  <mark key={start} className={styles.highlightedText}>
                    {chunk.slice(start, end + 1)}
                  </mark>,
                  chunk.slice(end + 1),
                ].filter(Boolean);
              })
              .flat();
          });

        return highlightedText;
      },
    };
  }, [fuse]);
}

type UseFuzzySearchResult<T> = {
  search: (query: string) => SearchResult<T>[];
  highlightText: (text: string, matches?: FuseResultMatch[]) => string | React.ReactNode[];
};

type FuzzySearchOptions<T> = {
  isCaseSensitive?: boolean;
  /** Determines how close the match must be to the fuzzy location (specified by `location`). An exact letter match which is `distance` characters away from the fuzzy location would score as a complete mismatch. A `distance` of `0` requires the match be at the exact `location` specified. A distance of `1000` would require a perfect match to be within `800` characters of the `location` to be found using a `threshold` of `0.8`. */
  distance?: number;
  /** When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string. */
  findAllMatches?: boolean;
  /** The function to use to retrieve an object's value at the provided path. The default will also search nested paths. */
  getFn?: GetFunction<T>;
  /** When `true`, search will ignore `location` and `distance`, so it won't matter where in the string the pattern appears. */
  ignoreLocation?: boolean;
  /** When `true`, the calculation for the relevance score (used for sorting) will ignore the `field-length norm`. */
  ignoreFieldNorm?: boolean;
  /** Determines how much the `field-length norm` affects scoring. A value of `0` is equivalent to ignoring the field-length norm. A value of `0.5` will greatly reduce the effect of field-length norm, while a value of `2.0` will greatly increase it. */
  fieldNormWeight?: number;
  /** Whether the matches should be included in the result set. When `true`, each record in the result set will include the indices of the matched characters. These can consequently be used for highlighting purposes. */
  includeMatches?: boolean;
  /** Whether the score should be included in the result set. A score of `0`indicates a perfect match, while a score of `1` indicates a complete mismatch. */
  includeScore?: boolean;
  /** List of keys that will be searched. This supports nested paths, weighted search, searching in arrays of `strings` and `objects`. */
  keys?: OptionKey<T>[];
  /** Determines approximately where in the text is the pattern expected to be found. */
  location?: number;
  /** Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to `2`). */
  minMatchCharLength?: number;
  /** Whether to sort the result list, by score. */
  shouldSort?: boolean;
  /** The function to use to sort all the results. The default will sort by ascending relevance score, ascending index. */
  sortFn?: SortFunction;
  /** At what point does the match algorithm give up. A threshold of `0.0` requires a perfect match (of both letters and location), a threshold of `1.0` would match anything. */
  threshold?: number;
  /** When `true`, it enables the use of unix-like search commands. See [example](/examples.html#extended-search). */
  useExtendedSearch?: boolean;
};

type OptionKeyObject<T> = {
  name: string | string[];
  weight?: number;
  getFn?: (obj: T) => string[] | string;
};

type OptionKey<T> = OptionKeyObject<T> | string | string[];

type GetFunction<T> = (obj: T, path: string | string[]) => string[] | string;

type SortFunction = (a: SortFunctionArg, b: SortFunctionArg) => number;

type SortFunctionArg = {
  idx: number;
  item: SortFunctionItem;
  score: number;
  matches?: (SortFunctionMatch | SortFunctionMatchList)[];
};

type SortFunctionItem = {
  [key: string]: { $: string } | { $: string; idx: number }[];
};

type SortFunctionMatch = {
  score: number;
  key: string;
  value: string;
  indices: (readonly number[])[];
};

type SortFunctionMatchList = SortFunctionMatch & {
  idx: number;
};

type SearchResult<T> = {
  item: T;
  refIndex: number;
  score?: number;
  matches?: readonly ResultMatch[];
};

type ResultMatch = {
  indices: readonly RangeTuple[];
  key?: string;
  refIndex?: number;
  value?: string;
};

type RangeTuple = [number, number];
