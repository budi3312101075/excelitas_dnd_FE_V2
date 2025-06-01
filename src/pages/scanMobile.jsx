import React, { useEffect, useRef, useState } from "react";
import Html5QrcodePlugin from "../components/moleculs/Qrcode";
import ResultContainerPlugin from "../components/moleculs/ResultQrCode";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ScanMobile = () => {
  const [selectedFeature, setSelectedFeature] = useState("qrcode");
  const [registration, setRegistration] = useState([]);
  const [noEmp, setNoEmp] = useState("");
  const [actionRegist, setActionRegist] = React.useState("scanKedatangan");
  const isFirstRender = useRef(true);
  const [decodedResults, setDecodedResults] = useState([]);
  const inputRef = useRef(null);

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
        setNoEmp("");
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

  const onNewScanResult = (decodedText, decodedResult) => {
    setDecodedResults(decodedText);
  };

  const getData = async () => {
    try {
      const response = await axios.get(`/karyawan/${noEmp}`);
      setRegistration(response.data.data);
    } catch (error) {
      console.log("Something went wrong❗", error);
    }
  };

  const handleChange = (event) => {
    setActionRegist(event.target.value);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!noEmp.trim()) {
      return;
    }

    const delayDebounce = setTimeout(() => {
      getData();
    }, 1000); // 1 detik debounce

    return () => clearTimeout(delayDebounce);
  }, [noEmp]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="min-h-screen w-full flex justify-center items-start p-4 bg-gray-100">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="flex w-full max-w-xs items-center text-sm font-medium text-gray-700 rounded-full border border-gray-300 px-1 py-1 bg-white shadow-sm">
            <button
              onClick={() => setSelectedFeature("qrcode")}
              className={`w-1/2 px-3 py-2 rounded-full transition-all duration-200 text-center ${
                selectedFeature === "qrcode"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
              }`}
            >
              QrScan
            </button>
            <button
              onClick={() => setSelectedFeature("manual")}
              className={`w-1/2 px-3 py-2 rounded-full transition-all duration-200 text-center ${
                selectedFeature === "manual"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Konten Berdasarkan Fitur */}
        {selectedFeature === "qrcode" && (
          <>
            <Html5QrcodePlugin
              fps={10}
              qrbox={250}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
            <ResultContainerPlugin results={decodedResults} />
          </>
        )}

        {selectedFeature === "manual" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Aksi:
                </label>
                <FormControl fullWidth size="small">
                  <InputLabel
                    id="action-select-label"
                    sx={{ fontSize: "13px" }}
                  >
                    Aksi
                  </InputLabel>
                  <Select
                    labelId="action-select-label"
                    id="action-select"
                    value={actionRegist}
                    onChange={handleChange}
                    label="Aksi"
                    size="small"
                    sx={{ fontSize: "13px" }}
                  >
                    <MenuItem value="scanKedatangan">Registrasi Event</MenuItem>
                    <MenuItem value="scanSnackDewasa">
                      Registrasi Snack
                    </MenuItem>
                    <MenuItem value="scanDinner">Registrasi Dinner</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label
                  htmlFor="no-emp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Masukkan No. Emp Karyawan:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="no-emp"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={noEmp}
                  onChange={(e) => setNoEmp(e.target.value)}
                />
              </div>

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
                            <td className="py-2 px-3 font-medium bg-gray-50">
                              Nama
                            </td>
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
                            <td className="py-2 px-3">
                              {data?.jam_dinner ?? "-"}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end -mt-4">
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
    </div>
  );
};

export default ScanMobile;
