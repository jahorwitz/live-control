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
import { Link, useParams } from "react-router-dom";
import FileUpload from './FileUpload';
import VideoThumbnail from '../components/VideoThumbnail';
import ReactPlayer from 'react-player';

const AppContainer = ({ videos }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { id: videoId } = useParams("/watch/:id");
    const currentVideo = videos.find(video => video.id === parseInt(videoId));
    console.log(currentVideo);

    return (
        <Container fluid>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload a video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FileUpload onCloseModal={handleClose} />
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
                                <Link
                                    to={`/watch/${video.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'black'
                                    }}
                                >
                                    <VideoThumbnail
                                        title={video.title}
                                        imgSource={require("../shared/img/play-thumbnail.png")}
                                    />
                                </Link>
                            </Media>
                        </Row>
                    ))}
                </Col>
                <Col>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', margin: '1em' }}>
                        <Button onClick={handleShow}>Upload</Button>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {currentVideo ? (
                            <div>
                                <ReactPlayer
                                    url={currentVideo.url}
                                    controls={true}
                                />
                                <h4 className="m-2">{currentVideo.title}</h4>
                            </div>
                        ) : (
                                <h4 className="m-2">Select a video from the sidebar</h4>
                            )
                        }
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