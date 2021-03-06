/**
 * @typedef {import('../helpers/types').ReduxAction} ReduxAction
 * @typedef {import('../helpers/types').FileResponse} FileResponse
 * @typedef {import('../helpers/types').FolderResponse} FolderResponse
 * @typedef {import('../helpers/types').LibraryState} LibraryState
 */

import { FILES_PER_PAGE } from './ui.duck'
import { LiveEndpoints } from '../api'
import { Trash, Modals } from './'

/**
 * Add file to state
 */
export const ADD_FILES = 'drivestorage/library/ADD_FILES'

/**
 * Edit file in state
 */
export const EDIT_FILE = 'drivestorage/library/EDIT_FILE'

/**
 * Remove file from state
 */
export const REMOVE_FILE = 'drivestorage/library/REMOVE_FILE'

/**
 * Add file to state
 */
export const ADD_FOLDERS = 'drivestorage/library/ADD_FOLDERS'

/**
 * Rename a folder in state
 */
export const RENAME_FOLDER = 'drivestorage/library/RENAME_FOLDER'

/**
 * Remove folder from state
 */
export const REMOVE_FOLDER = 'drivestorage/library/REMOVE_FOLDER'

/**
 * Updates current list of results to be displayed
 */
export const UPDATE_CURRENT_LIST = 'drivestorage/library/UPDATE_CURRENT_LIST'

/**
 * Updates current page of results to be displayed
 */
export const UPDATE_CURRENT_PAGE = 'drivestorage/library/UPDATE_CURRENT_PAGE'

/**
 * Updates total number of pages of results
 */
export const UPDATE_TOTAL_PAGES = 'drivestorage/library/UPDATE_TOTAL_PAGES'

/**
 * Updates currently displayed folder contents
 */
export const UPDATE_DISPLAY_FOLDER = 'drivestorage/library/UPDATE_DISPLAY_FOLDER'

/**
 * Loads initial set of files
 */
export const LOAD_FILES = 'drivestorage/library/LOAD_FILES'

/**
 * Loads initial set of files
 */
export const LOAD_FOLDERS = 'drivestorage/library/LOAD_FOLDERS'

/**
 * Initial base-line trash view state
 * @type {LibraryState}
 */
const initialState = {
  fileList: [],
  folderList: [],
  currentList: [],
  currentFolder: null,
  currentPage: 0,
  totalPages: 1,
  displayItems: [],
  foldersLoaded: false,
  displayFolder: null
}

/**
 * Library reducer
 * @param {LibraryState} state Current state
 * @param {ReduxAction} action Action being performed
 * @returns {LibraryState}
 */
export default function config (state = initialState, action) {
  switch (action.type) {
    case ADD_FILES:
    case LOAD_FILES:
      return {
        ...state,
        fileList: [...state.fileList, ...action.payload]
      }
    case EDIT_FILE:
      return {
        ...state,
        fileList: state.fileList.map(e => e.uid === action.payload.uid ? action.payload : e)
      }
    case ADD_FOLDERS:
    case LOAD_FOLDERS:
      return {
        ...state,
        folderList: [...state.folderList, ...action.payload]
      }
    case REMOVE_FILE:
      return {
        ...state,
        fileList: state.fileList.filter(e => e.uid !== action.payload.uid)
      }
    case REMOVE_FOLDER:
      return {
        ...state,
        folderList: state.folderList.filter(e => e.uid !== action.payload.uid)
      }
    case UPDATE_CURRENT_LIST:
      return state.displayFolder
        ? {
          ...state,
          currentList: state.displayFolder.filesContained.slice(
            state.currentPage * FILES_PER_PAGE,
            state.currentPage * FILES_PER_PAGE + FILES_PER_PAGE
          )
        }
        : {
          ...state,
          currentList: [...state.folderList, ...state.fileList].slice(
            state.currentPage * FILES_PER_PAGE,
            state.currentPage * FILES_PER_PAGE + FILES_PER_PAGE
          )
        }
    case UPDATE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      }
    case UPDATE_TOTAL_PAGES:
      return {
        ...state,
        totalPages: state.displayFolder === null
          ? Math.ceil((state.folderList.length + state.fileList.length) / FILES_PER_PAGE)
          : Math.ceil((0.0001 + state.displayFolder.filesContained.length) / FILES_PER_PAGE)
      }
    case UPDATE_DISPLAY_FOLDER:
      return {
        ...state,
        displayFolder: action.payload
      }
    default:
      return state
  }
}

/**
 * Adds one or more files to fileList
 * @param {FileResponse} files Files to add
 * @returns {ReduxAction}
 */
export const addFilesAction = files => ({
  type: ADD_FILES,
  payload: files
})

/**
 * Applies changes to a file in fileList
 * @param {FileResponse} file Updated file
 * @returns {ReduxAction}
 */
export const editFileAction = file => ({
  type: EDIT_FILE,
  payload: file
})

/**
 * Adds a folder to folderList
 * @param {FolderResponse} folders Folder to add
 * @returns {ReduxAction}
 */
export const addFoldersAction = folders => ({
  type: ADD_FOLDERS,
  payload: folders
})

/**
 * Remnoves a file from fileList
 * @param {FileResponse} file File to add
 * @returns {ReduxAction}
 */
export const removeFileAction = file => ({
  type: REMOVE_FILE,
  payload: file
})

/**
 * Removes a folder from folderList
 * @param {FolderResponse} folder Folder to add
 * @returns {ReduxAction}
 */
export const removeFolderAction = folder => ({
  type: REMOVE_FOLDER,
  payload: folder
})

/**
 * Removes a folder from folderList
 * @returns {ReduxAction}
 */
export const updateCurrentListAction = () => ({
  type: UPDATE_CURRENT_LIST
})

/**
 * Sets page of results to display
 * @param {Number} page Index of results to show
 * @returns {ReduxAction}
 */
export const updateCurrentPageAction = page => ({
  type: UPDATE_CURRENT_PAGE,
  payload: page
})

/**
* Updates number of total pages of results
* @returns {ReduxAction}
*/
export const updateTotalPagesAction = () => ({
  type: UPDATE_TOTAL_PAGES
})

/**
 * Sets folder to display contents
 * @param {FolderResponse} [folder] Folder to display, defaults to null which is root
 * @returns {ReduxAction}
 */
export const updateDisplayFolderAction = (folder = null) => ({
  type: UPDATE_DISPLAY_FOLDER,
  payload: folder
})

/**
* Initializes fileList with loaded files
* @returns {ReduxAction}
*/
export const loadFilesAction = files => ({
  type: LOAD_FILES,
  payload: files
})

/**
* Adds folders into folderList
* @returns {ReduxAction}
*/
export const loadFoldersAction = folders => ({
  type: LOAD_FOLDERS,
  payload: folders
})

/**
 * Load files to initialize fileList with
 * @param {FileResponse[]} files Files to load
 */
export const loadFiles = files => dispatch => {
  dispatch(loadFilesAction(files.map(e => ({ ...e, isFolder: false }))))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
}

/**
 * Load folders to initialize folderList with
 * @param {FolderResponse[]} folders Folders to load
 */
export const loadFolders = folders => dispatch => {
  dispatch(loadFoldersAction(folders.map(e => ({ ...e, isFolder: true }))))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
}

/**
 * Adds one or more files to state
 * @param {FileResponse} file File(s) to add
 */
export const addFiles = files => dispatch => {
  dispatch(addFilesAction(files.map(e => ({ ...e, isFolder: false }))))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
}

/**
 * Adds a folder to state
 * @param {FolderResponse} folders Folder(s) to add
 */
export const addFolders = folder => dispatch => {
  dispatch(addFoldersAction(folder.map(e => ({ ...e, isFolder: true }))))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
}

/**
 * Uploads one or more files
 * @param {FileResponse} files Files to add
 */
export const uploadFiles = files => dispatch => {
  LiveEndpoints.File.uploadFiles(files)
    .then(({ data }) => {
      dispatch(addFiles(data))
    }).catch(err => {
      console.error(err)
    })
}

/**
 * Uploads a folder
 * @param {FolderResponse} folders Folders to add
 */
export const uploadFolders = (folderName, files) => dispatch => {
  LiveEndpoints.Folder.uploadFolders(folderName, files)
    .then(({ data }) => {
      // console.log(data)
      dispatch(addFolders([data]))
    }).catch(err => {
      console.error(err)
    })
}

/**
 * Removes a file
 * @param {FileResponse} file File to remove
 */
export const removeFile = file => dispatch => {
  dispatch(removeFileAction(file))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
  dispatch(checkBackPage())
}

/**
 * Removes a folder
 * @param {FolderResponse} folder Folder to remove
 */
export const removeFolder = folder => dispatch => {
  dispatch(removeFolderAction(folder))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
  dispatch(checkBackPage())
}

/**
 * Updates an individual file
 * @param {FileResponse} file Updated file
 */
export const editFile = file => dispatch => {
  dispatch(editFileAction(file))
  dispatch(updateCurrentListAction())
  dispatch(updateTotalPagesAction())
}

/**
 * Set currently displayed page of results
 * @param {Number} index Index of results page to show
 */
export const setPage = index => (dispatch, getState) => {
  const { totalPages } = getState().library

  if (index >= 0 && index < totalPages) {
    dispatch(updateCurrentPageAction(index))
    dispatch(updateCurrentListAction())
  } else {
    console.error('Index out of range!')
  }
}

/**
 * Finds a file by UID in fileList
 * @param {Number} uid of file to find
 * @param {Function} getState redux-thunk getState method
 * @returns {FileResponse}
 */
const getFileByUID = (uid, getState) => {
  const file = getState().library.fileList.filter(e => e.uid === uid)[0]

  if (typeof file !== 'undefined') {
    return file
  } else {
    throw new Error('Invalid file UID!')
  }
}

/**
 * Finds a folder by UID in folderList
 * @param {Number} uid of folder to find
 * @param {Function} getState redux-thunk getState method
 * @returns {folderResponse}
 */
const getFolderByUID = (uid, getState) => {
  const folder = getState().library.folderList.filter(e => e.uid === uid)[0]

  if (typeof folder !== 'undefined') {
    return folder
  } else {
    // throw new Error('Invalid folder UID!')
    console.error('Invalid folder UID!')
    return null
  }
}

/**
 * Move a file to trashbin
 * @param {Number} uid UID of file to trashbin
 */
export const trashFile = uid => (dispatch, getState) => {
  const file = getFileByUID(uid, getState)
  dispatch(removeFile(file))
  LiveEndpoints.File.trashFile(uid).then(({ data }) => {
    dispatch(Trash.addFile(data))
  }).catch(err => {
    console.error(err)
    dispatch(addFiles([file]))
  })
}

/**
 * Move a folder to trashbin
 * @param {Number} uid UID of folder to trashbin
 */
export const trashFolder = uid => (dispatch, getState) => {
  const folder = getFolderByUID(uid, getState)
  dispatch(removeFolder(folder))
  LiveEndpoints.Folder.trashFolder(uid).then(({ data }) => {
    // dispatch(removeFolder(data))
    dispatch(Trash.addFolder(data))
  }).catch(err => {
    console.error(err)
    dispatch(addFolders([folder]))
  })
}

/**
 * Create a new folder and add it to the UI
 * @param {String} folderName Name for newly created folder
 */
export const createNewFolder = folderName => (dispatch, getState) =>
  LiveEndpoints.Folder.createFolder(folderName)
    .then(({ data }) => {
      dispatch(addFolders([data]))
    })

/**
 * Renames a file
 * @param {Number} uid UID of file to rename
 * @param {String} newName New name to assign to file
 */
export const renameFile = (uid, newName) => (dispatch, getState) =>
  LiveEndpoints.File.renameFile(uid, newName)
    .then(({ data }) => {
      dispatch(editFile(data))
      dispatch(Modals.setEditingFileAction(data))
    })

/**
 * Moves a file into a new directory
 * @param {Number} uid UID of file to rename
 * @param {Number} folderUid Destination to move folder to
 */
export const moveFile = (uid, folderUid) => (dispatch, getState) => {
  const { displayFolder } = getState().library
  LiveEndpoints.File.moveFile(uid, folderUid)
    .then(({ data }) => {
      dispatch(editFile(data))
      dispatch(removeFile(data))
      // Need editFolder method here
      // dispatch(setDisplayFolder(displayFolder))
      dispatch(Modals.setEditingFileAction(data))
    })
}

/**
 * Sets the currently displayed folder
 * @param {Number} folderUid Folder contents to display
 */
export const setDisplayFolder = (folderUid = null) => (dispatch, getState) => {
  if (folderUid) {
    const newDisplayFolder = getFolderByUID(folderUid, getState)
    dispatch(updateDisplayFolderAction(newDisplayFolder))
    dispatch(updateCurrentListAction())
    dispatch(updateTotalPagesAction())
  } else {
    dispatch(updateDisplayFolderAction())
    dispatch(updateCurrentListAction())
    dispatch(updateTotalPagesAction())
  }
  dispatch(checkBackPage())
}

/**
 * Navigates to the previous page of results, when a page is empty, if appropriate
 */
export const checkBackPage = () => (dispatch, getState) => {
  const { currentList, currentPage, displayFolder } = getState().library

  if (currentList.length === 0 && currentPage > 0) {
    dispatch(setPage(currentPage - 1))
  } else if (currentList.length === 0 && currentPage === 0 && displayFolder) {
    dispatch(setDisplayFolder())
  }
}
