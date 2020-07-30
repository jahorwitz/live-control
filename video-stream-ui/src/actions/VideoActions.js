import axios from 'axios';
import * as ActionTypes from '../shared/actionTypes';

export const getAllVideos = () => async (dispatch, getState) => {
    dispatch({type: ActionTypes.GET_ALL_VIDEOS_REQUEST});
    try {
        console.log(process.env.REACT_APP_API_BASE_URL);
        const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/videos`)
        dispatch({type: ActionTypes.GET_ALL_VIDEOS_SUCCESS, videos: result.data});
    } catch (err) {
        console.log(err);
        dispatch({type: ActionTypes.GET_ALL_VIDEOS_ERROR, error: err});
    }
}