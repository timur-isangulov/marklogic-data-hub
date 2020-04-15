import React, { useState, useEffect, useContext } from 'react';
import { getUserPreferences } from '../services/user-preferences';
import { UserContext } from './user-context';

type SearchContextInterface = {
  query: string,
  entityTypeIds: string[],
  start: number,
  pageNumber: number,
  pageLength: number,
  pageSize: number,
  selectedFacets: any,
  maxRowsPerPage: number
}

const defaultSearchOptions = {
  query: '',
  entityTypeIds: [],
  start: 1,
  pageNumber: 1,
  pageLength: 20,
  pageSize: 20,
  selectedFacets: {},
  maxRowsPerPage: 100
}

interface ISearchContextInterface {
  searchOptions: SearchContextInterface;
  setSearchFromUserPref: (username: string) => void;
  setQuery: (searchString: string) => void;
  setPage: (pageNumber: number, totalDocuments: number) => void;
  setPageLength: (current: number, pageSize: number) => void;
  setSearchFacets: (constraint: string, vals: string[]) => void;
  setEntity: (option: string) => void;
  setEntityClearQuery: (option: string) => void;
  setLatestJobFacet: (vals: string, option: string) => void;
  applyQuery: (searchText: string, entityTypeIds: string[], selectedFacets: {}) => void;
  clearFacet: (constraint: string, val: string) => void;
  clearAllFacets: () => void;
  clearDateFacet: () => void;
  clearRangeFacet: (range: string) => void;
  clearGreyDateFacet: () => void;
  clearGreyRangeFacet: (range: string) => void;
  resetSearchOptions: () => void;
  setAllSearchFacets: (facets: any) => void;
  greyedOptions: SearchContextInterface;
  setAllGreyedOptions: (facets: any) => void;
  clearGreyFacet: (constraint: string, val: string) => void;
  clearAllGreyFacets: () => void;
  resetGreyedOptions: () => void;
}

export const SearchContext = React.createContext<ISearchContextInterface>({
  searchOptions: defaultSearchOptions,
  greyedOptions: defaultSearchOptions,
  setSearchFromUserPref: () => { },
  setQuery: () => { },
  setPage: () => { },
  setPageLength: () => { },
  setSearchFacets: () => { },
  setEntity: () => { },
  setEntityClearQuery: () => { },
  applyQuery: () => { },
  setLatestJobFacet: () => { },
  clearFacet: () => { },
  clearAllFacets: () => { },
  clearDateFacet: () => { },
  clearRangeFacet: () => { },
  clearGreyDateFacet: () => { },
  clearGreyRangeFacet: () => { },
  resetSearchOptions: () => { },
  setAllSearchFacets: () => { },
  setAllGreyedOptions: () => {},
  clearGreyFacet: () => { },
  clearAllGreyFacets: () => { },
  resetGreyedOptions: () => { }
});

const SearchProvider: React.FC<{ children: any }> = ({ children }) => {

  const [searchOptions, setSearchOptions] = useState<SearchContextInterface>(defaultSearchOptions);
  const [greyedOptions, setGreyedOptions] = useState<SearchContextInterface>(defaultSearchOptions);
  const { user } = useContext(UserContext);

  const setSearchFromUserPref = (username: string) => {
    let userPreferences = getUserPreferences(username);
    if (userPreferences) {
      let values = JSON.parse(userPreferences);
      setSearchOptions({
        ...searchOptions,
        start: 1,
        pageNumber: 1,
        query: values.query.searchText,
        entityTypeIds: values.query.entityTypeIds,
        selectedFacets: values.query.selectedFacets,
        pageLength: values.pageLength
      });
    }
  }

  const setQuery = (searchString: string) => {
    setSearchOptions({
      ...searchOptions,
      start: 1,
      query: searchString,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const setPage = (pageNumber: number, totalDocuments: number) => {
    let pageLength = searchOptions.pageSize;
    let start = pageNumber === 1 ? 1 : (pageNumber - 1) * searchOptions.pageSize + 1;

    if ((totalDocuments - ((pageNumber - 1) * searchOptions.pageSize)) < searchOptions.pageSize) {
      pageLength = (totalDocuments - ((pageNumber - 1) * searchOptions.pageLength))
    }
    setSearchOptions({
      ...searchOptions,
      start,
      pageNumber,
      pageLength
    });
  }

  const setPageLength = (current: number, pageSize: number) => {
    setSearchOptions({
      ...searchOptions,
      start: 1,
      pageNumber: 1,
      pageLength: pageSize,
      pageSize
    });
  }

  const setSearchFacets = (constraint: string, vals: string[]) => {
    let facets = {};
    if (vals.length > 0) {
      facets = { ...searchOptions.selectedFacets, [constraint]: vals };
    } else {
      facets = { ...searchOptions.selectedFacets };
      delete facets[constraint];
    }
    setSearchOptions({
      ...searchOptions,
      start: 1,
      selectedFacets: facets,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const setEntity = (option: string) => {
    let entityOptions = option ? [option] : [];
    setSearchOptions({
      ...searchOptions,
      start: 1,
      selectedFacets: {},
      entityTypeIds: entityOptions,
      pageLength: searchOptions.pageSize
    });
      setGreyedOptions({
          ...greyedOptions,
          start: 1,
          selectedFacets: {},
          entityTypeIds: entityOptions,
          pageLength: greyedOptions.pageSize
      });
  }

  const setEntityClearQuery = (option: string) => {
    setSearchOptions({
      ...searchOptions,
      query: '',
      start: 1,
      selectedFacets: {},
      entityTypeIds: [option],
      pageNumber: 1,
      pageLength: searchOptions.pageSize,
    });
  }

  const setLatestJobFacet = (vals: string, option: string) => {
    let facets = {};
    facets = { createdByJob: {dataType: "string", stringValues: [vals]} };
    setSearchOptions({
      ...searchOptions,
      start: 1,
      selectedFacets: facets,
      entityTypeIds: [option],
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  const clearFacet = (constraint: string, val: string) => {
    let facets = searchOptions.selectedFacets;
    let valueKey = '';
    if (facets[constraint].dataType === 'xs:string' || facets[constraint].dataType === 'string') {
      valueKey = 'stringValues';
    }
    if (facets[constraint][valueKey].length > 1) {
      facets[constraint][valueKey] = facets[constraint][valueKey].filter(option => option !== val);
    } else {
      delete facets[constraint]
    }
    setSearchOptions({ ...searchOptions, selectedFacets: facets });
      if(Object.entries(greyedOptions.selectedFacets).length > 0 && greyedOptions.selectedFacets.hasOwnProperty(constraint))
        clearGreyFacet(constraint, val);
  }

  const clearAllFacets = () => {
    setSearchOptions({
      ...searchOptions,
      selectedFacets: {},
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
    clearAllGreyFacets();
  }

/*
  const setDateFacet = (dates) => {
   setSearchOptions({
      ...searchOptions,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize,
      selectedFacets: {
        ...searchOptions.selectedFacets,
        createdOnRange: dates
      }
    });
  }
*/

  const clearDateFacet = () => {
    let facets = searchOptions.selectedFacets;
    if (facets.hasOwnProperty('createdOnRange')) {
      delete facets.createdOnRange;
      setSearchOptions({
        ...searchOptions,
        selectedFacets: facets,
        start: 1,
        pageNumber: 1,
        pageLength: searchOptions.pageSize
      });
    }
  }

  const clearRangeFacet = (range: string) => {
    let facets = searchOptions.selectedFacets;
    let constraints = Object.keys(facets)
    constraints.forEach(facet => {
      if (facets[facet].hasOwnProperty('rangeValues') && facet === range) {
        delete facets[facet]
      }
    });

    setSearchOptions({
      ...searchOptions,
      selectedFacets: facets,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
      if(Object.entries(greyedOptions.selectedFacets).length > 0)
       clearGreyRangeFacet(range)
  }


  const resetSearchOptions = () => {
    setSearchOptions({ ...defaultSearchOptions });
  }

  const setAllSearchFacets = (facets: any) => {
    setSearchOptions({
      ...searchOptions,
      selectedFacets: facets,
      start: 1,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

    const clearGreyDateFacet = () => {
        let facets = greyedOptions.selectedFacets;
        if (facets.hasOwnProperty('createdOnRange')) {
            delete facets.createdOnRange;
            setGreyedOptions({
                ...greyedOptions,
                selectedFacets: facets,
                start: 1,
                pageNumber: 1,
                pageLength: greyedOptions.pageSize
            });
        }
    }

    const clearGreyRangeFacet = (range: string) => {
        let facets = greyedOptions.selectedFacets;
        let constraints = Object.keys(facets)
        constraints.forEach(facet => {
            if (facets[facet].hasOwnProperty('rangeValues') && facet === range) {
                delete facets[facet]
            }
        });

        setGreyedOptions({
            ...greyedOptions,
            selectedFacets: facets,
            start: 1,
            pageNumber: 1,
            pageLength: greyedOptions.pageSize
        });
    }

  const clearGreyFacet = (constraint: string, val: string) => {
    let facets = greyedOptions.selectedFacets;
    let valueKey = '';
        if (facets[constraint].dataType === 'xs:string' || facets[constraint].dataType === 'string') {
            valueKey = 'stringValues';
        }
        if (facets[constraint][valueKey].length > 1) {
            facets[constraint][valueKey] = facets[constraint][valueKey].filter(option => option !== val);
        } else {
            delete facets[constraint]
        }
        setGreyedOptions({...greyedOptions, selectedFacets: facets})
 }

  const clearAllGreyFacets = () => {
    setGreyedOptions({
      ...greyedOptions,
      selectedFacets: {},
      start: 1,
      pageNumber: 1,
      pageLength: greyedOptions.pageSize
    });
    resetGreyedOptions();
  }

  const resetGreyedOptions = () => {
    setGreyedOptions({ ...defaultSearchOptions });
  }

  const setAllGreyedOptions = (facets: any) => {
    setGreyedOptions({
      ...greyedOptions,
      selectedFacets: facets,
      start: 1,
      pageNumber: 1,
      pageLength: greyedOptions.pageSize
    });
  }

  const applyQuery = (searchText: string, entityTypeIds: string[], selectedFacets: {}) => {
    setSearchOptions({
      ...searchOptions,
      start: 1,
      selectedFacets: selectedFacets,
      query: searchText,
      entityTypeIds: entityTypeIds,
      pageNumber: 1,
      pageLength: searchOptions.pageSize
    });
  }

  useEffect(() => {
    if (user.authenticated) {
      setSearchFromUserPref(user.name);
    }
  }, [user.authenticated]);

  return (
    <SearchContext.Provider value={{
      searchOptions,
      greyedOptions,
      setSearchFromUserPref,
      setQuery,
      setPage,
      setPageLength,
      setSearchFacets,
      setEntity,
      setEntityClearQuery,
      clearFacet,
      clearAllFacets,
      setLatestJobFacet,
      clearDateFacet,
      clearRangeFacet,
      clearGreyDateFacet,
      clearGreyRangeFacet,
      resetSearchOptions,
      setAllSearchFacets,
      setAllGreyedOptions,
      clearGreyFacet,
      clearAllGreyFacets,
      resetGreyedOptions,
      applyQuery
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export default SearchProvider;
