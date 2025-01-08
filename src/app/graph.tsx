"use client";

import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ChartOptions } from 'chart.js/auto';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

type GraphProps = {
  months: number;
  initialDeposit: number;
  regularDeposit: number;
  interestRate: number;
};

const Graph = ({ months, initialDeposit, regularDeposit, interestRate }: GraphProps) => {
  // TODO: Add support for different frequencies
  const currentDateTime = new Date();
  const labels: string[] = [];
  const deposits: number[] = [];
  const interests: number[] = [];
  const totals: number[] = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(currentDateTime);
    date.setMonth(date.getMonth() + i);
    labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    deposits.push(Number(initialDeposit) + Number(regularDeposit) * i);
    if (i === 0) {
      interests.push(0);
      totals.push(deposits[i]);
    }
    else {
      interests.push(
        totals[i-1] * (Number(interestRate) / 100 / 12) + interests[i-1]
      );
      totals.push(deposits[i] + interests[i]);
    }
  }
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Deposits",
        data: deposits,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Interest",
        data: interests,
        fill: true,
        backgroundColor: "rgba(192, 75, 192, 0.2)",
        borderColor: "rgb(192, 75, 192)",
        tension: 0.1,
      },
      {
        label: "Total",
        data: totals,
        fill: true,
        backgroundColor: "rgba(192, 192, 75, 0.2)",
        borderColor: "rgb(192, 192, 75)",
        tension: 0.1,
      }
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            return label;
          },
        }
      }
    }
  };

  return (
    <Line data={data} options={options} />
  );
};
export default Graph;