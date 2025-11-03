"use client";

import { Tweet } from "react-tweet";
import "./tweet.css";

export function TweetComponent({ id }: { id: string }) {
  return (
    <div className="tweet my-6">
      <div className="flex justify-center">
        <Tweet id={id} />
      </div>
    </div>
  );
}
