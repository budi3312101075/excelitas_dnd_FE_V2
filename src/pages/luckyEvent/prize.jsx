import Layout from "../../components/moleculs/layout";
import { useState } from "react";
import { useEffect } from "react";
import DataTable from "../../components/moleculs/table";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ModalUpdatedPrize } from "../../components/atoms/modal";

const Prize = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get("/prizes");
      setData(response.data.prizes);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const deletedPrize = async (data) => {
    try {
      const response = await axios.delete(`/prizes/${data.id}`);
      getData();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Prize ini memiliki pemenang");
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
        const index = data.findIndex((row) => row.id === params.row.id);
        return <span>{index + 1}</span>;
      },
    },
    {
      field: "name",
      headerName: "Hadiah",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "initial_qty",
      headerName: "Jumlah Hadiah",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "available_qty",
      headerName: "Hadiah Available",
      flex: 1,
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
            startIcon={<EditIcon sx={{ fontSize: "1rem" }} />}
            onClick={() => {
              document.getElementById("updatedPrize").showModal();
              setCurrentData(params.row);
            }}
            sx={{
              textTransform: "none",
              backgroundColor: "#f59e0b", // Warna kuning/amber (Tailwind amber-500)
              color: "#ffffff", // Teks putih kontras baik dengan amber ini
              // Jika ingin teks hitam: color: 'rgba(0, 0, 0, 0.87)',
              fontSize: "12px",
              padding: "4px 10px",
              "&:hover": {
                backgroundColor: "#d97706", // Amber yang lebih gelap (Tailwind amber-600)
              },
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
            }}
          >
            Ubah
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
                  deletedPrize(params.row);
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
    <Layout>
      <h1 className="text-2xl font-semibold tracking-wide text-slate-800 mb-2 ">
        Data Hadiah
      </h1>
      <DataTable rows={data} columns={columns} getRowId={(row) => row.id} />
      <ModalUpdatedPrize
        idModal="updatedPrize"
        currentData={currentData}
        onUpdateSuccess={getData}
      />
    </Layout>
  );
};

export default Prize;
