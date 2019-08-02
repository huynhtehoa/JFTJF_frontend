import React from "react";
import YouTube from 'react-youtube';

import "assets/css/custom-style.css"

class NotFound extends React.Component {
    render() {
        const opts = {
            height: "100%",
            width: '100%',
            playerVars: {
                autoplay: 1,
                rel: 0,
            }
        };

        return (
            <div class="youtube">
                    <YouTube
                        videoId="Z8H-XDij7CI"
                        opts={opts}
                        onReady={this._onReady}
                    />
            </div>
        );
    }

    _onReady(event) {
        event.target.playVideo();
    }
}

export default NotFound