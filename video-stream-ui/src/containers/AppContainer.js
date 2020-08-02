import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, useParams } from "react-router-dom";
import {
    Container,
    Modal,
    Col,
    Row,
    Media,
    Button
} from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import FileUpload from './FileUpload';
import RenameVideo from './RenameVideo';
import VideoThumbnail from '../components/VideoThumbnail';
import ReactPlayer from 'react-player';

const AppContainer = ({ videos }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [showRename, setShowRename] = useState(false);
    const [currentResolution, setCurrentResolution] = useState('480p');

    const handleCloseUpload = () => setShowUpload(false);
    const handleShowUpload = () => setShowUpload(true);
    const handleCloseRename = () => setShowRename(false);
    const handleShowRename = () => setShowRename(true);

    const handleChangeResolution = (resolution) => {
        setCurrentResolution(resolution);
    }

    const { id: videoId } = useParams("/watch/:id");
    const currentVideo = videos.find(video => video.id === parseInt(videoId));

    return (
        <Container fluid>
            <Modal show={showUpload} onHide={handleCloseUpload}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload a video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FileUpload onCloseModal={handleCloseUpload} />
                </Modal.Body>
            </Modal>
            {currentVideo && (
                <Modal show={showRename} onHide={handleCloseRename}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update this video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RenameVideo id={currentVideo.id} onCloseModal={handleCloseRename} />
                    </Modal.Body>
                </Modal>
            )}
            <Row style={{ height: '100vh' }}>
                <Col xs={2} style={{ backgroundColor: 'gray', maxHeight: '100%', overflow: 'hidden', overflowY: 'scroll' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <h4 className="m-2 text-center">Available Videos</h4>
                    </Row>
                    {videos.map(video => (
                        <Row key={video.filename}>
                            <Media className="w-100">
                                <Link
                                    to={`/watch/${video.id}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'black',
                                        maxWidth: '100%'
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
                        <Button onClick={handleShowUpload}>Upload</Button>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {currentVideo ? (
                            <div>
                                <ReactPlayer
                                    url={`${process.env.REACT_APP_S3_OBJECT_BASE_URL}/${currentVideo.filename}-${currentResolution}`}
                                    controls={true}
                                />
                                {currentVideo.resolutions.map(resolution => (
                                    <Button className="m-1" onClick={() => handleChangeResolution(resolution)}>{resolution}</Button>
                                ))}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <FaEdit
                                        size="1.5em"
                                        onClick={handleShowRename}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <h4 className="m-2">{currentVideo.title}</h4>
                                </div>
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