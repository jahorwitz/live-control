import React from 'react';
import {
    Container,
    Row
} from 'react-bootstrap';

const VideoThumbnail = ({ title, imgSource }) => {

    return (
        <Container fluid>
            <Row className="p-2">
                <img
                    src={imgSource}
                    style={{
                        maxWidth: '100%'
                    }}
                />
            </Row>
            <Row className="p-2">
                <p
                    style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }}
                >{title}</p>
            </Row>
        </Container>
    );
}

export default VideoThumbnail;