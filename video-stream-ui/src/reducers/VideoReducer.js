import { combineReducers } from 'redux'
import * as ActionTypes from '../shared/actionTypes'

const initialState = {
  isFetching: false,
  error: null,
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
        error: action.error
      }
    default:
      return state;
  }
}