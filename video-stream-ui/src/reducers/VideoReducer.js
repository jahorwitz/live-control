import { combineReducers } from 'redux'
import * as ActionTypes from '../shared/actionTypes'

const initialState = {
  isFetching: false,
  isUploading: false,
  isUpdating: false,
  fetchError: null,
  uploadError: null,
  updateError: null,
  videos: []
}

export default function videoReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_ALL_VIDEOS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.GET_ALL_VIDEOS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        videos: action.videos
      }
    case ActionTypes.GET_ALL_VIDEOS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchError: action.error
      }
    case ActionTypes.UPLOAD_VIDEO_REQUEST:
      return {
        ...state,
        isUploading: true
      }
    case ActionTypes.UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        isUploading: false,
        videos: action.videos
      }
    case ActionTypes.UPLOAD_VIDEO_ERROR:
      return {
        ...state,
        isUploading: false,
        uploadError: action.error
      }
    case ActionTypes.UPDATE_VIDEO_REQUEST:
      return {
        ...state,
        isUpdating: true
      }
    case ActionTypes.UPDATE_VIDEO_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        videos: action.videos
      }
    case ActionTypes.UPDATE_VIDEO_ERROR:
      return {
        ...state,
        isUpdating: false,
        updateError: action.error
      }
    default:
      return state;
  }
}