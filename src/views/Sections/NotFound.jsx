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
                    videoId="liB_ohf2HJ8"
                    opts={opts}
                    onReady={this._onReady}
                    onPlaybackRateChange={this._getPlaybackRate}
                />
            </div>
        );
    }

    _onReady(e) {
        e.target.setPlaybackRate(2)
    }
    
    _getPlaybackRate(e) {
        e.target.playVideo();
    }
}

export default NotFound