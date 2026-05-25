import { useEffect, useRef } from "react";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";

type LineChartProps = {
  data: ChartData;
  options?: ChartOptions;
};

const BarChart = ({ data, options }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const chartInstance = new Chart(chartRef.current as HTMLCanvasElement, {
      type: "bar",
      data: data,
      options: {
        indexAxis: "y",
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          x: {
            display: false,
          },
          y: {
            border: {
              display: false,
            },
            ticks: {
              color: "#6ee7b7",
              font: {
                family: "'Raleway', sans-serif",
                size: 15,
              },
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
    });

    return () => chartInstance.destroy();
  }, [data, options]);

  return <canvas ref={chartRef} />;
};

const chartData = {
  labels: ["Python", "C++", "JS/TS", "C", "Rust", "Java"],
  datasets: [
    {
      label: "Familiarity",
      data: [98, 90, 88, 70, 60, 54],
      fill: false,
      borderColor: "#6ee7b7",
      backgroundColor: "rgb(110, 231, 183, 0.3)",
      tension: 0.1,
    },
  ],
};

const LanguageChart = () => {
  return (
    <div className="w-full h-64">
      <BarChart data={chartData} />
    </div>
  );
};

export default LanguageChart;
