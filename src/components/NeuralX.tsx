import { useId } from "react";

const points = [
  [60, 40],
  [115, 55],
  [172, 92],
  [225, 55],
  [280, 35],
  [260, 100],
  [240, 152],
  [270, 208],
  [288, 270],
  [224, 250],
  [174, 212],
  [115, 250],
  [52, 270],
  [77, 207],
  [95, 152],
  [74, 97],
  [130, 117],
  [175, 139],
  [215, 116],
  [218, 187],
  [175, 169],
  [132, 188],
  [175, 71],
  [175, 241],
];
const edges = [
  [0, 1],
  [0, 15],
  [0, 16],
  [0, 17],
  [1, 2],
  [1, 15],
  [1, 16],
  [2, 3],
  [2, 16],
  [2, 17],
  [2, 18],
  [3, 4],
  [3, 5],
  [3, 18],
  [4, 5],
  [4, 17],
  [4, 18],
  [5, 6],
  [5, 18],
  [6, 7],
  [6, 18],
  [6, 19],
  [6, 20],
  [7, 8],
  [7, 19],
  [8, 9],
  [8, 19],
  [8, 20],
  [9, 10],
  [9, 19],
  [9, 23],
  [10, 11],
  [10, 19],
  [10, 20],
  [10, 21],
  [11, 12],
  [11, 13],
  [11, 21],
  [11, 23],
  [12, 13],
  [12, 20],
  [12, 21],
  [13, 14],
  [13, 21],
  [14, 15],
  [14, 16],
  [14, 20],
  [14, 21],
  [15, 16],
  [16, 17],
  [16, 20],
  [16, 21],
  [17, 18],
  [17, 20],
  [18, 19],
  [18, 20],
  [19, 20],
  [20, 21],
  [1, 22],
  [3, 22],
  [2, 22],
  [2, 20],
  [10, 23],
  [16, 18],
  [19, 21],
];
export function NeuralX({ small = false }: { small?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={small ? "neural-mark" : "neural-x"}
      viewBox="0 0 340 310"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`g${id}`}
          x1="50"
          y1="40"
          x2="290"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#50f5ff" />
          <stop offset=".5" stopColor="#00daff" />
          <stop offset="1" stopColor="#007dff" />
        </linearGradient>
        <filter id={`b${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <radialGradient id={`r${id}`}>
          <stop stopColor="#04d7ff" stopOpacity=".24" />
          <stop offset="1" stopColor="#005c95" stopOpacity="0" />
        </radialGradient>
      </defs>
      {!small && (
        <ellipse cx="170" cy="156" rx="166" ry="150" fill={`url(#r${id})`} />
      )}
      <g stroke={`url(#g${id})`} strokeWidth={small ? 1.7 : 0.9} opacity=".86">
        {edges.map(([a, b], i) => (
          <path key={i} d={`M${points[a].join(",")} L${points[b].join(",")}`} />
        ))}
      </g>
      {!small && (
        <g filter={`url(#b${id})`} fill="#16e4ff">
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 17 || i === 20 ? 5 : 2.6} />
          ))}
        </g>
      )}
      <g fill="#91faff">
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={small ? 2 : i === 17 || i === 20 ? 2.6 : 1.7}
          />
        ))}
      </g>
    </svg>
  );
}
