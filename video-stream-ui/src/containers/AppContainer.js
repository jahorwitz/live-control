import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    Container,
    Col,
    Row,
    Media
} from 'react-bootstrap';

const AppContainer = ({ videos }) => (
    <Container fluid>
        <Col xs={2}>
            {videos.map(video => (
                <Row>
                    <Media>
                        <img
                            width={64}
                            height={64}
                            className="m2-3"
                            src={video.url}
                            alt={video.title}
                        />
                    </Media>
                </Row>
            ))}
        </Col>
        <Col>
            <div>
                Video Player goes here
            </div>
        </Col>
    </Container>
)

AppContainer.propTypes = {
    videos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    })).isRequired,
    addNewNote: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    videos: state.videoReducer.videos
});

export default connect(
    mapStateToProps
)(AppContainer)