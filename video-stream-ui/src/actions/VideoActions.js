import axios from 'axios';
import * as ActionTypes from '../shared/actionTypes';

export const getAllVideos = () => async (dispatch) => {
    dispatch({ type: ActionTypes.GET_ALL_VIDEOS_REQUEST });
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/videos`)
        dispatch({ type: ActionTypes.GET_ALL_VIDEOS_SUCCESS, videos: result.data });
    } catch (err) {
        dispatch({ type: ActionTypes.GET_ALL_VIDEOS_ERROR, error: err });
    }
}

export const uploadNewVideo = (file, password) => async (dispatch) => {
    dispatch({ type: ActionTypes.UPLOAD_VIDEO_REQUEST });
    const formData = new FormData();
    formData.append('password', password);
    formData.append('file', file[0]);
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/videos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        dispatch({type: ActionTypes.UPLOAD_VIDEO_SUCCESS, videos: response.data.videos});
    }).catch(error => {
        dispatch({type: ActionTypes.UPLOAD_VIDEO_ERROR, error});
    });
}