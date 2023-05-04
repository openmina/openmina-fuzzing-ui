import { FuzzingState } from '@fuzzing/fuzzing.state';
import {
  FUZZING_CLOSE,
  FUZZING_FILTER,
  FUZZING_GET_DIRECTORIES,
  FUZZING_GET_DIRECTORIES_SUCCESS,
  FUZZING_GET_FILE_DETAILS,
  FUZZING_GET_FILE_DETAILS_SUCCESS,
  FUZZING_GET_FILES_SUCCESS,
  FUZZING_SET_ACTIVE_DIRECTORY,
  FUZZING_SORT,
  FuzzingActions,
} from '@fuzzing/fuzzing.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';

const initialState: FuzzingState = {
  directories: [],
  activeDirectory: undefined,
  files: [],
  filteredFiles: [],
  activeFile: undefined,
  activeFileDetails: undefined,
  sort: {
    sortDirection: SortDirection.DSC,
    sortBy: 'path',
  },
  urlType: undefined,
  filterText: undefined,
};

export function reducer(state: FuzzingState = initialState, action: FuzzingActions): FuzzingState {
  switch (action.type) {

    case FUZZING_GET_DIRECTORIES_SUCCESS: {
      if (JSON.stringify(action.payload) === JSON.stringify(state.directories)) {
        return state;
      }
      return {
        ...state,
        directories: action.payload,
      };
    }

    case FUZZING_SET_ACTIVE_DIRECTORY: {
      if (action.payload === state.activeDirectory) {
        return state;
      }
      return {
        ...state,
        activeDirectory: action.payload,
        activeFile: undefined,
        activeFileDetails: undefined,
      };
    }

    case FUZZING_GET_DIRECTORIES: {
      return {
        ...state,
        urlType: action.payload.urlType,
      };
    }

    case FUZZING_GET_FILES_SUCCESS: {
      const files = sortFiles(action.payload, state.sort);
      if (JSON.stringify(files) === JSON.stringify(state.files)) {
        return state;
      }
      return {
        ...state,
        files,
        filteredFiles: state.filterText ? files.filter(file => file.path.toLowerCase().includes(state.filterText.toLowerCase())) : files,
      };
    }

    case FUZZING_GET_FILE_DETAILS: {
      return {
        ...state,
        activeFile: action.payload,
      };
    }

    case FUZZING_GET_FILE_DETAILS_SUCCESS: {
      if (JSON.stringify(action.payload) === JSON.stringify(state.activeFileDetails)) {
        return state;
      }
      return {
        ...state,
        activeFile: { ...state.activeFile },
        activeFileDetails: action.payload,
      };
    }

    case FUZZING_SORT: {
      return {
        ...state,
        filteredFiles: sortFiles(state.filteredFiles, action.payload),
        sort: action.payload,
      };
    }

    case FUZZING_FILTER: {
      const filteredFiles = sortFiles(!action.payload ? state.files : state.files.filter(file => file.path.includes(action.payload)), state.sort);
      return {
        ...state,
        filterText: action.payload,
        filteredFiles,
      };
    }

    case FUZZING_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortFiles(files: FuzzingFile[], tableSort: TableSort<FuzzingFile>): FuzzingFile[] {
  return sort<FuzzingFile>(files, tableSort, ['path']);
}
