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
              color: "#d19a66",
              font: {
                family: "'Raleway', sans-serif",
                size: 18,
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
  labels: ["Python", "C++", "JavaScript/TypeScript", "C", "Rust", "Java"],
  datasets: [
    {
      label: "Familiarity",
      data: [98, 90, 88, 70, 60, 54],
      fill: false,
      borderColor: "#56B6C2",
      backgroundColor: "rgb(75, 192, 192, 0.3)",

      tension: 0.1,
    },
  ],
};

const LanguageChart = () => {
  return (
    <div className="w-1/2">
      <BarChart data={chartData} />
    </div>
  );
};

export default LanguageChart;