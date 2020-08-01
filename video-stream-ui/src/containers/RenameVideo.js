import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Form,
    Button
} from 'react-bootstrap';
import { renameVideo } from '../actions/VideoActions';

const RenameVideo = ({ id, renameVideo, onCloseModal }) => {
    const [newTitle, setNewTitle] = useState(null);
    const [password, setPassword] = useState(null);
    const [displayPasswordRequiredError, setDisplayPasswordRequiredError] = useState(false);
    const [displayTitleRequiredError, setDisplayTitleRequiredError] = useState(false);

    const submitUpdate = useCallback((event) => {
        event.preventDefault();
        if (password?.length > 0 && newTitle?.length > 0) {
            renameVideo(id, newTitle, password);
            setNewTitle(null);
            setDisplayPasswordRequiredError(false);
            setDisplayTitleRequiredError(false);
            onCloseModal();
        } else if (newTitle?.length > 0) {
            setDisplayPasswordRequiredError(true);
        } else {
            setDisplayTitleRequiredError(true);
        }
    }, [id, newTitle, password]);


    const handleTitleChange = useCallback((event) => {
        setNewTitle(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event) => {
        setPassword(event.target.value);
    }, []);

    return (
        <Form onSubmit={submitUpdate}>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={handleTitleChange} />
                {displayTitleRequiredError ? (
                    <Form.Text className="text-danger">
                        Title is required
                    </Form.Text>
                ) : (
                        <Form.Text className="text-muted">
                            Give this video a new title
                        </Form.Text>
                    )
                }
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onChange={handlePasswordChange} />
                {displayPasswordRequiredError ? (
                    <Form.Text className="text-danger">
                        Password is required
                    </Form.Text>
                ) : (
                        <Form.Text className="text-muted">
                            A password is needed to update videos
                        </Form.Text>
                    )
                }
            </Form.Group>
            <Button variant="secondary" className="m-1" onClick={onCloseModal}>
                Cancel
            </Button>
            <Button className="m-1" type='submit'>Save</Button>
        </Form>
    );
}

RenameVideo.propTypes = {
    onCloseModal: PropTypes.func.isRequired
}

export default connect(
    null,
    { renameVideo }
)(RenameVideo)