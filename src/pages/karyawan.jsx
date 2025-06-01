import Layout from "../components/moleculs/layout";
import axios from "axios";
import { useState, useEffect } from "react";
import DataTable from "../components/moleculs/table";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  ModalDetailKaryawan,
  ModalExcelKaryawan,
} from "../components/atoms/modal";
import { FaPlusCircle } from "react-icons/fa";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Karyawan = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState();

  const getData = async () => {
    try {
      const response = await axios.get(`/karyawan`);
      setData(response.data.data || []);
    } catch (error) {
      console.log("Something went wrong❗", error);
      setData([]);
    }
  };

  const deletedKaryawan = async (data) => {
    try {
      const response = await axios.delete(`/karyawan/${data.no_emp}`);
      getData();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Karyawan tidak dapat dihapus karena pemenang prize");
      console.log("Something went wrong❗", error);
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
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "nama",
      headerName: "Nama Karyawan",
      flex: 0.7,
      minWidth: 150,
    },
    {
      field: "join_date",
      headerName: "Join Date",
      flex: 0.4,
      minWidth: 120,
      cellClassName: "capitalize-text",
      renderCell: (params) => {
        if (!params.value) return "-";
        const date = dayjs(params.value);
        if (!date.isValid()) return "-";
        return date.format("YYYY-MM-DD");
      },
    },
    {
      field: "status_register",
      headerName: "Sudah register?",
      flex: 0.1,
      minWidth: 130,
      cellClassName: "capitalize-text",
      renderCell: (params) => {
        return <span>{params.value === 1 ? "Ya" : "Tidak"}</span>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.3,
      minWidth: 50,
      cellClassName: "capitalize-text",
    },
    {
      field: "no_hp",
      headerName: "No HP",
      flex: 0.6,
      minWidth: 100,
      cellClassName: "capitalize-text",
    },
    {
      field: "transportasi",
      headerName: "Transportasi",
      flex: 0.6,
      minWidth: 100,
      cellClassName: "capitalize-text",
    },

    {
      field: "jumlah_keluarga",
      headerName: "Jumlah Keluarga?",
      flex: 0.1,
      minWidth: 150,
      cellClassName: "capitalize-text",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => {
              document.getElementById("detailData").showModal();
              setCurrentData(params.row);
            }}
            sx={{
              textTransform: "none",
              backgroundColor: "#239f52",
              fontSize: "12px",
            }}
          >
            Detail
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => {
              Swal.fire({
                title: "Anda yakin?",
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
              }).then((result) => {
                if (result.isConfirmed) {
                  deletedKaryawan(params.row);
                }
              });
            }}
            sx={{
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Layout className="pb-28">
        <h1 className="text-2xl font-semibold tracking-wide text-slate-800 mb-2 ">
          Data Karyawan
        </h1>
        <div className="flex justify-end items-center mb-2">
          <Button
            variant="contained"
            onClick={() => {
              document.getElementById("uploadData").showModal();
            }}
            endIcon={<FaPlusCircle size={14} />}
            sx={{
              backgroundColor: "#1d4ed8",
              color: "#ffffff",
              padding: "8px 16px",
              fontSize: "13px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1e40af",
              },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              letterSpacing: "0.8px",
            }}
          >
            Upload Data Karyawan
          </Button>
        </div>

        <DataTable
          rows={data}
          columns={columns}
          getRowId={(row) => row.no_emp}
        />
      </Layout>

      <ModalDetailKaryawan
        idModal={"detailData"}
        currentData={currentData}
        getData={getData}
      />

      <ModalExcelKaryawan idModal={"uploadData"} onUploadSuccess={getData} />
    </>
  );
};

export default Karyawan;
