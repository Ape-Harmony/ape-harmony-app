import React from "react";

const TwitterFollowButton = ({ username }) => {
  const twitterAcc = "https://twitter.com/" + username;
  return (
    <div>
      <a href={twitterAcc} className="twitter-follow-button" data-size="large" data-show-count="false">
        <button className="btn btn-sm">Follow @{username}</button>
      </a>
      {/* <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script> */}
    </div>
  );
};

export default TwitterFollowButton;
