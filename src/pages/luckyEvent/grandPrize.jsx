import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/moleculs/layout";
import DataTable from "../../components/moleculs/table";

const GrandPrize = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get("/winners/?type=grandPrize");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 10,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = data.findIndex((row) => row.no_emp === params.row.no_emp);
        return <span>{index + 1}</span>;
      },
    },
    {
      field: "no_emp",
      headerName: "No Employee",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "nama",
      headerName: "Nama Karyawan",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "prize",
      headerName: "Hadiah",
      flex: 1,
      minWidth: 150,
      cellClassName: "capitalize-text",
    },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-semibold tracking-wide text-slate-800 mb-2 ">
        Data Pemenang Lucky Draw
      </h1>

      <DataTable rows={data} columns={columns} getRowId={(row) => row.no_emp} />
    </Layout>
  );
};

export default GrandPrize;
