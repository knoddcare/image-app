import { Line } from "rc-progress";

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="progress-bar">
      <Line
        percent={progress * 100}
        strokeWidth={3}
        trailWidth={3}
        strokeColor="#ffffff"
        trailColor="#ffffff20"
      />
    </div>
  );
}

export default ProgressBar;
