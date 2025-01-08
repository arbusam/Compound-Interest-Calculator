"use client";

import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { ChartOptions } from 'chart.js/auto';
import { Frequency } from '@/types/frequency';
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

type GraphProps = {
  years: number;
  initialDeposit: number;
  regularDeposit: number;
  interestRate: number;
  inflationRate: number;
  regularDepositFrequency: Frequency;
  compoundFrequency: Frequency;
};

const Graph = ({ years, initialDeposit, regularDeposit, interestRate, inflationRate, regularDepositFrequency, compoundFrequency }: GraphProps) => {
  const deposits: number[] = [];
  const interests: number[] = [];
  const totals: number[] = [];
  const totalsAfterInflation: number[] = [];

  const currentDateTime = new Date();
  const labels: string[] = [];
  const depositsLabel: number[] = [];
  const interestsLabel: number[] = [];
  const totalsLabel: number[] = [];
  const totalsAfterInflationLabel: number[] = [];
  
  const days = years * 12 * 28;
  for (let i = 0; i < days; i++) {
    switch (regularDepositFrequency) {
      case Frequency.Daily:
        deposits.push(Number(initialDeposit) + Number(regularDeposit) * i);
        break;
      case Frequency.Weekly:
        if (i % 7 === 0) {
          deposits.push(Number(initialDeposit) + Number(regularDeposit) * i / 7);
        }
        else {
          deposits.push(deposits[i-1]);
        }
        break;
      case Frequency.Fortnightly:
        if (i % 14 === 0) {
          deposits.push(Number(initialDeposit) + Number(regularDeposit) * i / 14);
        }
        else {
          deposits.push(deposits[i-1]);
        }
        break;
      case Frequency.Monthly:
        if (i % 28 === 0) {
          deposits.push(Number(initialDeposit) + Number(regularDeposit) * i / 28);
        }
        else {
          deposits.push(deposits[i-1]);
        }
        break;
      case Frequency.Annually:
        if (i % (12*28) === 0) {
          deposits.push(Number(initialDeposit) + Number(regularDeposit) * i / (12*28));
        }
        else {
          deposits.push(deposits[i-1]);
        }
        break;
    }
    if (i === 0) {
      interests.push(0);
      totals.push(deposits[i]);
    }
    else {
      switch (compoundFrequency) {
        case Frequency.Daily:
          interests.push(
            totals[i-1] * (Number(interestRate) / 100 / 12 / 28) + interests[i-1]
          );
          break;
        case Frequency.Weekly:
          if (i % 7 === 0) {
            interests.push(
              totals[i-1] * (Number(interestRate) / 100 / 12 / 4) + interests[i-1]
            );
          }
          else {
            interests.push(interests[i-1]);
          }
          break;
        case Frequency.Fortnightly:
          if (i % 14 === 0) {
            interests.push(
              totals[i-1] * (Number(interestRate) / 100 / 12 / 2) + interests[i-1]
            );
          }
          else {
            interests.push(interests[i-1]);
          }
          break;
        case Frequency.Monthly:
          if (i % 28 === 0) {
            interests.push(
              totals[i-1] * (Number(interestRate) / 100 / 12) + interests[i-1]
            );
          }
          else {
            interests.push(interests[i-1]);
          }
          break;
        case Frequency.Annually:
          if (i % (12*28) === 0) {
            interests.push(
              totals[i-1] * (Number(interestRate) / 100) + interests[i-1]
            );
          }
          else {
            interests.push(interests[i-1]);
          }
          break;
      }
      totals.push(deposits[i] + interests[i]);
    }
    totalsAfterInflation.push(totals[i] / (1 + Number(inflationRate) / 100 / 12 / 28) ** i);
    if (i % 28 === 0) {
      const date = new Date(currentDateTime);
      date.setMonth(date.getMonth() + i / 28);
      labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
      depositsLabel.push(deposits[i]);
      interestsLabel.push(interests[i]);
      totalsLabel.push(totals[i]);
      totalsAfterInflationLabel.push(totalsAfterInflation[i]);
    }
    
  }
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Deposits",
        data: depositsLabel,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Interest",
        data: interestsLabel,
        fill: true,
        backgroundColor: "rgba(192, 75, 192, 0.2)",
        borderColor: "rgb(192, 75, 192)",
        tension: 0.1,
      },
      {
        label: "Total",
        data: totalsLabel,
        fill: true,
        backgroundColor: "rgba(192, 192, 75, 0.2)",
        borderColor: "rgb(192, 192, 75)",
        tension: 0.1,
      },
      {
        label: "Total Value After Inflation",
        data: totalsAfterInflationLabel,
        fill: true,
        backgroundColor: "rgba(192, 75, 75, 0.2)",
        borderColor: "rgb(192, 75, 75)",
        tension: 0.1,
      },
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