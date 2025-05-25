import Layout from "../components/moleculs/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Dashboard() {
  const [register, setRegister] = useState([]);
  const [kedatangan, setKedatangan] = useState([]);
  const [snackDewasa, setSnackDewasa] = useState([]);
  const [dinner, setDinner] = useState([]);

  const getDataPieChart = async () => {
    try {
      const response = await axios.get("/pieChart");
      const { register, kedatangan, snackDewasa, dinner } = response.data.data;
      setRegister(register);
      setKedatangan(kedatangan);
      setSnackDewasa(snackDewasa);
      setDinner(dinner);
    } catch (error) {
      console.error("Something went wrong❗", error);
    }
  };

  useEffect(() => {
    getDataPieChart();
  }, []);

  const createChartOptions = (title, data) => ({
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      animation: true,
    },
    title: {
      text: "",
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> peserta ({point.percentage:.1f}%)",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        colors: ["#00b894", "#d63031"], // soft green & red
        dataLabels: {
          enabled: true,
          format:
            "<b>{point.name}</b>: {point.y} peserta<br>({point.percentage:.1f}%)",
          style: {
            color: "#2d3436",
            fontSize: "13px",
          },
        },
      },
    },
    series: [
      {
        name: title,
        colorByPoint: true,
        data: data.map((item) => ({
          name: item.label,
          y: item.value,
        })),
      },
    ],
    credits: {
      enabled: false,
    },
  });

  const chartCards = [
    { title: "Sudah Melakukan Registrasi", data: register },
    { title: "Sudah Scan Kedatangan", data: kedatangan },
    { title: "Sudah Scan Snack Dewasa", data: snackDewasa },
    { title: "Sudah Scan Dinner", data: dinner },
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Statistik Aktivitas Karyawan
        </h1>
        <p className="text-gray-600 mb-6">
          Visualisasi status aktivitas berdasarkan hasil scan dan registrasi
          peserta.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {chartCards.map((chart, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                {chart.title}
              </h2>
              <HighchartsReact
                highcharts={Highcharts}
                options={createChartOptions(chart.title, chart.data)}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
