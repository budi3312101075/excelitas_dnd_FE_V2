import React, { Children, useEffect, useState } from "react";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";

const ResultContainer = ({ results }) => {
  const qrScan = results;
  const [registration, setRegistration] = useState([]);
  const [lastDecodedText, setLastDecodedText] = useState("");
  const [actionRegist, setActionRegist] = React.useState("scanKedatangan");

  const handleRegist = async (noEmp) => {
    const isConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to submit this registration.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Submit",
    });

    if (isConfirmed.isConfirmed) {
      try {
        const response = await axios.patch(
          `/scan/?type=${actionRegist}&noEmp=${noEmp}`
        );
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        setRegistration([]);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Something went wrong during registration.",
        });
      }
    }
  };

  useEffect(() => {
    if (qrScan.length === 0) return;

    if (qrScan !== lastDecodedText) {
      const getData = async () => {
        try {
          const response = await axios.get(`/karyawan/${qrScan}`);
          setRegistration(response.data.data);
          setLastDecodedText(qrScan);
        } catch (error) {
          console.log("Something went wrong❗", error);
        }
      };

      getData();
    }
  }, [qrScan]);

  const handleChange = (event) => {
    setActionRegist(event.target.value);
  };

  return (
    <div className="w-full mx-auto mt-6 px-4">
      <div className="flex justify-end mb-4 -mt-7">
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel
            id="demo-simple-select-autowidth-label"
            sx={{ fontSize: "12px" }}
          >
            Action
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={actionRegist}
            onChange={handleChange}
            autoWidth
            label="actionRegist"
            size="small"
            sx={{ fontSize: "12px", height: "32px" }}
          >
            <MenuItem value="scanKedatangan">Registrasi Event</MenuItem>
            <MenuItem value="scanSnackDewasa">Registrasi Snack</MenuItem>
            <MenuItem value="scanDinner">Registrasi Dinner</MenuItem>
          </Select>
        </FormControl>
      </div>
      <h1 className="text-xl font-semibold text-center sm:text-2xl my-auto mb-4">
        Scanned Results
      </h1>
      {registration.length === 0 ? (
        <p className="text-center text-gray-500 pt-4">
          Data karyawan tidak ditemukan.
        </p>
      ) : (
        <div className="pt-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Detail Karyawan
          </h3>
          <table className="w-full text-sm text-left text-gray-700 border rounded-md overflow-hidden">
            <tbody>
              {registration.map((data, index) => (
                <React.Fragment key={index}>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium bg-gray-50 w-1/3">
                      No. Emp
                    </td>
                    <td className="py-2 px-3">{data?.no_emp ?? "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium bg-gray-50">Nama</td>
                    <td className="py-2 px-3">{data?.nama ?? "-"}</td>
                  </tr>

                  {/* conditional rendering */}
                  <tr
                    className={`${
                      actionRegist === "scanKedatangan" ? "" : "hidden"
                    }`}
                  >
                    <td className="py-2 px-3 font-medium bg-gray-50">
                      Anak Bawah Umur
                    </td>
                    <td className="py-2 px-3">
                      {data?.anak_bawah_umur ?? "-"}
                    </td>
                  </tr>
                  <tr
                    className={`${
                      actionRegist === "scanSnackDewasa" ? "" : "hidden"
                    }`}
                  >
                    <td className="py-2 px-3 font-medium bg-gray-50">
                      Anak diatas Umur
                    </td>
                    <td className="py-2 px-3">
                      {data?.anak_diatas_umur ?? "-"}
                    </td>
                  </tr>

                  <tr
                    className={`${
                      actionRegist === "scanDinner" ? "" : "hidden"
                    }`}
                  >
                    <td className="py-2 px-3 font-medium bg-gray-50">
                      Jumlah Keluarga
                    </td>
                    <td className="py-2 px-3">
                      {data?.jumlah_keluarga ?? "-"}
                    </td>
                  </tr>
                  <tr
                    className={`${
                      actionRegist === "scanDinner" ? "" : "hidden"
                    }`}
                  >
                    <td className="py-2 px-3 font-medium bg-gray-50">
                      Jam Dinner
                    </td>
                    <td className="py-2 px-3">{data?.jam_dinner ?? "-"}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            registration.length === 0 ? "hidden" : "block"
          }`}
          onClick={() => {
            handleRegist(registration[0].no_emp);
          }}
        >
          Registrasi
        </button>
      </div>
    </div>
  );
};

export default ResultContainer;
