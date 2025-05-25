import { useEffect, useState } from "react";
import Layout from "../components/moleculs/layout";
import axios from "axios";
import DataTable from "../components/moleculs/table";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  ModalExcelKeluarga,
  ModalKeluargaKaryawan,
} from "../components/atoms/modal";
import { FaPlusCircle } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const KeluargaKaryawan = () => {
  const [data, setData] = useState([]);
  const [cuurentData, setCurrentData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(`/allKeluarga`);
      setData(response.data.data);
    } catch (error) {
      console.log("Something went wrong❗", error);
    }
  };

  const deletedKeluarga = async (data) => {
    try {
      const response = await axios.delete(`/keluarga/${data.id}`);
      getData();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
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
      width: 60,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = data.findIndex((row) => row.id === params.row.id);
        return <span>{index + 1}</span>;
      },
    },
    {
      field: "no_emp",
      headerName: "No Employee",
      flex: 0.6,
      minWidth: 120,
    },
    {
      field: "namaKaryawan",
      headerName: "Nama Karyawan",
      flex: 1,
      minWidth: 160,
      cellClassName: "capitalize-text",
    },
    {
      field: "namaKeluarga",
      headerName: "Nama Keluarga",
      flex: 1,
      minWidth: 160,
      cellClassName: "capitalize-text",
    },
    {
      field: "status_keluarga",
      headerName: "Status Keluarga",
      flex: 0.7,
      minWidth: 100,
      cellClassName: "capitalize-text",
    },
    {
      field: "status_register",
      headerName: "Sudah Register?",
      flex: 0.5,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span>{params.value === 1 ? "Ya" : "Tidak"}</span>
      ),
    },
    {
      field: "umur",
      headerName: "Umur",
      flex: 0.3,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      cellClassName: "capitalize-text",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.7,
      minWidth: 150,
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
              document.getElementById("detailKeluargaKaryawan").showModal();
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
                  deletedKeluarga(params.row);
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
      <Layout>
        <h1 className="text-2xl font-semibold tracking-wide mb-3">
          Keluarga Karyawan
        </h1>
        <div className="flex justify-end items-center mb-2">
          <Button
            variant="contained"
            onClick={() => {
              document.getElementById("uploadDataKeluarga").showModal();
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
            Upload Data Keluarga
          </Button>
        </div>
        <DataTable rows={data} columns={columns} getRowId={(row) => row.id} />
      </Layout>

      <ModalKeluargaKaryawan
        idModal="detailKeluargaKaryawan"
        currentData={cuurentData}
        getData={getData}
      />

      <ModalExcelKeluarga
        idModal="uploadDataKeluarga"
        onUploadSuccess={getData}
      />
    </>
  );
};

export default KeluargaKaryawan;
