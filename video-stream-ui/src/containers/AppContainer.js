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
        <Row style={{ height: '100vh' }}>
            <Col xs={2} style={{ backgroundColor: 'gray' }}>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <h4 className="m-2">Available Videos</h4>
                </Row>
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
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <h4 className="m-2">Current Video Title</h4>
                </Row>
            </Col>
        </Row>
    </Container>
)

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