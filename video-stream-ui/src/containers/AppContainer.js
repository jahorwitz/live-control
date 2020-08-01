import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Container,
    Modal,
    Col,
    Row,
    Media,
    Button
} from 'react-bootstrap';
import FileUpload from './FileUpload';
import VideoThumbnail from '../components/VideoThumbnail';

const AppContainer = ({ videos }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Container fluid>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload a video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FileUpload onCloseModal={handleClose}/>
                </Modal.Body>
            </Modal>
            <Row style={{ height: '100vh' }}>
                <Col xs={2} style={{ backgroundColor: 'gray' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4 className="m-2 text-center">Available Videos</h4>
                    </Row>
                    {videos.map(video => (
                        <Row>
                            <Media className="w-100">
                                <VideoThumbnail
                                    title={video.title}
                                    imgSource={require("../shared/img/play-thumbnail.png")}
                                />
                            </Media>
                        </Row>
                    ))}
                </Col>
                <Col>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', margin: '1em' }}>
                        <Button onClick={handleShow}>Upload</Button>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4 className="m-2">Current Video Title</h4>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

AppContainer.propTypes = {
    videos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    })).isRequired
}

const mapStateToProps = state => ({
    videos: state.videoReducer.videos
});

export default connect(
    mapStateToProps
)(AppContainer)