// https://github.com/cookpete/react-player/blob/master/examples/react/src/Duration.js
interface Props {
  className?: string;
  seconds: number;
}

export const Duration = (props: Props) => {
  const { className, seconds } = props;
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  );
};

function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(s: number) {
  return s.toString().padStart(2, "0");
}
