import React from "react";
import LiveWaitTimesComponent from "./component";
export const metadata = {
  title: "QueueView - Live Wait Times",
  description: "Mock data of TSA-line wait times in real-time.",
  icons: {
    icon: "favicon.ico",
  },
};

export default function LiveWaitTimes() {
  return <LiveWaitTimesComponent />;
}
