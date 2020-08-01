import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Form,
    Button
} from 'react-bootstrap';
import { uploadNewVideo } from '../actions/VideoActions';

const FileUpload = ({ uploadNewVideo, onCloseModal }) => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState(null);
    const [displayPasswordRequiredError, setDisplayPasswordRequiredError] = useState(false);
    const [displayFileRequiredError, setDisplayFileRequiredError] = useState(false);

    const submitFile = useCallback((event) => {
        event.preventDefault();
        if (password?.length && file) {
            uploadNewVideo(file, password);
            setFile(null);
            setDisplayPasswordRequiredError(false);
            setDisplayFileRequiredError(false);
            onCloseModal();
        } else if (file) {
            setDisplayPasswordRequiredError(true);
        } else {
            setDisplayFileRequiredError(true);
        }
    }, [file, password]);


    const handleFileUpload = useCallback((event) => {
        setFile(event.target.files);
    }, []);

    return (
        <Form onSubmit={submitFile}>
            <Form.Group>
                <Form.Label>File Selection</Form.Label>
                <Form.Control type="file" onChange={handleFileUpload} />
                {displayFileRequiredError ? (
                    <Form.Text className="text-danger">
                        File is required
                    </Form.Text>
                ) : (
                        <Form.Text className="text-muted">
                            Select the file you would like to upload
                        </Form.Text>
                    )
                }
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onChange={setPassword} />
                {displayPasswordRequiredError ? (
                    <Form.Text className="text-danger">
                        Password is required
                    </Form.Text>
                ) : (
                        <Form.Text className="text-muted">
                            A password is needed to upload files
                        </Form.Text>
                    )
                }
            </Form.Group>
            <Button variant="secondary" className="m-1" onClick={onCloseModal}>
                Cancel
            </Button>
            <Button className="m-1" type='submit'>Upload</Button>
        </Form>
    );
}

FileUpload.propTypes = {
    onCloseModal: PropTypes.func.isRequired
}

export default connect(
    null,
    { uploadNewVideo }
)(FileUpload)