"use client";

import dynamic from 'next/dynamic';
import 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
const data = {
  labels: [
    "Month 1","Month 2","Month 3","Month 4","Month 5","Month 6","Month 7","Month 8","Month 9","Month 10",
    "Month 11","Month 12","Month 13","Month 14","Month 15","Month 16","Month 17","Month 18","Month 19",
    "Month 20","Month 21","Month 22","Month 23","Month 24"
  ],
  datasets: [
    {
      label: "Regular Deposits",
      data: [
        10,20,30,40,50,60,70,80,90,100,
        110,120,130,140,150,160,170,180,190,
        200,210,220,230,240
      ],
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "Interest",
      data: [
        1,3,6,10,15,21,28,36,45,55,
        66,78,91,105,120,136,153,171,190,
        210,231,253,276,300
      ],
      fill: true,
      backgroundColor: "rgba(192, 75, 192, 0.2)",
      borderColor: "rgb(192, 75, 192)",
      tension: 0.1,
    },
    {
      label: "Total",
      data: [
        11,23,36,50,65,81,98,116,135,155,
        176,198,221,245,270,296,323,351,380,
        410,441,473,506,540
      ],
      fill: true,
      backgroundColor: "rgba(192, 192, 75, 0.2)",
      borderColor: "rgb(192, 192, 75)",
      tension: 0.1,
    }
  ],
};
const Graph = () => {
  return (
    <Line data={data} />
  );
};
export default Graph;
