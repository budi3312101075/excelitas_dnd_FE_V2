import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
} from "react-icons/fi";
import { capitalizeWords } from "../../utils/Utils";

const FormField = ({ label, htmlFor, children, error }) => (
  <div className="form-control w-full">
    <label htmlFor={htmlFor} className="label pb-1 pt-0">
      <span className="label-text text-sm font-medium text-gray-700">
        {label}
      </span>
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export const ModalDetailKaryawan = (props) => {
  const { idModal, currentData, getData } = props;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (currentData) {
      setValue("no_emp", currentData.no_emp || "");
      setValue("nama", currentData.nama || "");
      const joinDate = currentData.join_date
        ? new Date(currentData.join_date).toISOString().split("T")[0]
        : "";
      setValue("join_date", joinDate);
      setValue("email", currentData.email || "");
      setValue("no_hp", currentData.no_hp || "");
      setValue("transportasi", currentData.transportasi || "");
      setValue("jumlah_keluarga", currentData.jumlah_keluarga || 0);
      setValue("anak_bawah_umur", currentData.anak_bawah_umur || 0);
      setValue("anak_diatas_umur", currentData.anak_diatas_umur || 0);
      setValue("status_register", String(currentData.status_register || 0));
      setValue("status_kedatangan", String(currentData.status_kedatangan || 0));
      setValue("status_snack_anak", String(currentData.status_snack_anak || 0));
      setValue(
        "status_snack_dewasa",
        String(currentData.status_snack_dewasa || 0)
      );
      setValue("status_dinner", String(currentData.status_dinner || 0));
      setValue("jam_dinner", currentData.jam_dinner || "");
    } else {
      reset({
        no_emp: "",
        nama: "",
        join_date: "",
        email: "",
        no_hp: "",
        transportasi: "",
        jumlah_keluarga: 0,
        anak_bawah_umur: 0,
        anak_diatas_umur: 0,
        status_register: "0",
        status_kedatangan: "0",
        status_snack_anak: "0",
        status_snack_dewasa: "0",
        status_dinner: "0",
        jam_dinner: "",
      });
    }
  }, [currentData, setValue, reset]);

  const onSubmit = async (formData) => {
    const dataToSubmit = {
      ...formData,
      no_emp: currentData?.no_emp || formData.no_emp,
      status_register: parseInt(formData.status_register, 10),
      status_kedatangan: parseInt(formData.status_kedatangan, 10),
      status_snack_anak: parseInt(formData.status_snack_anak, 10),
      status_snack_dewasa: parseInt(formData.status_snack_dewasa, 10),
      status_dinner: parseInt(formData.status_dinner, 10),
      jumlah_keluarga: parseInt(formData.jumlah_keluarga, 10),
      anak_bawah_umur: parseInt(formData.anak_bawah_umur, 10),
      anak_diatas_umur: parseInt(formData.anak_diatas_umur, 10),
    };

    const result = await Swal.fire({
      title: "Konfirmasi Update",
      text: "Apakah Anda yakin ingin menyimpan perubahan data karyawan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`/karyawan/${currentData.no_emp}`, dataToSubmit);
        toast.success("Data karyawan berhasil diperbarui!");
        getData();
      } catch (error) {
        console.error("Error updating data:", error);
        toast.error(
          error.response?.data?.message || "Gagal memperbarui data karyawan."
        );
      }
    }
  };

  const booleanOptions = [
    { value: "1", label: "Ya" },
    { value: "0", label: "Tidak" },
  ];
  const kedatanganOptions = [
    { value: "1", label: "Sudah Datang" },
    { value: "0", label: "Belum Datang" },
  ];
  const perolehanOptions = [
    { value: "1", label: "Sudah Dapat" },
    { value: "0", label: "Belum Dapat" },
  ];

  return (
    <dialog id={idModal} className="modal">
      <div className="modal-box bg-white text-slate-800 max-w-2xl p-0">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-xl text-slate-700">
            {currentData?.no_emp
              ? `Detail Karyawan: ${currentData.nama} (${currentData.no_emp})`
              : "Detail Karyawan"}
          </h3>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 px-6 py-5 max-h-[70vh] overflow-y-auto"
        >
          {/* Informasi Dasar */}
          <section>
            <h4 className="text-md font-semibold text-blue-600 mb-3 border-b pb-1">
              Informasi Pribadi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="No. Karyawan"
                htmlFor="no_emp"
                error={errors.no_emp}
              >
                <input
                  id="no_emp"
                  {...register("no_emp")}
                  placeholder="Nomor Induk Karyawan"
                  className="input input-bordered w-full bg-transparent text-slate-700 border-slate-300"
                  readOnly
                />
              </FormField>
              <FormField
                label="Nama Lengkap"
                htmlFor="nama"
                error={errors.nama}
              >
                <input
                  id="nama"
                  {...register("nama", { required: "Nama wajib diisi" })}
                  placeholder="Nama Lengkap Karyawan"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField
                label="Tanggal Bergabung"
                htmlFor="join_date"
                error={errors.join_date}
              >
                <input
                  id="join_date"
                  type="date"
                  {...register("join_date")}
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField label="Email" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Format email tidak valid",
                    },
                  })}
                  placeholder="alamat@email.com"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField
                label="No. Handphone"
                htmlFor="no_hp"
                error={errors.no_hp}
              >
                <input
                  id="no_hp"
                  {...register("no_hp")}
                  placeholder="08xxxxxxxxxx"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField
                label="Transportasi"
                htmlFor="transportasi"
                error={errors.transportasi}
              >
                <select
                  id="transportasi"
                  {...register("transportasi")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  <option value="Personal">Personal</option>
                  <option value="Bus">Bus</option>
                </select>
              </FormField>
            </div>
          </section>

          <section>
            <h4 className="text-md font-semibold text-blue-600 mb-3 border-b pb-1">
              Informasi Keluarga
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Jumlah Keluarga"
                htmlFor="jumlah_keluarga"
                error={errors.jumlah_keluarga}
              >
                <input
                  id="jumlah_keluarga"
                  type="number"
                  {...register("jumlah_keluarga", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tidak boleh negatif" },
                  })}
                  placeholder="0"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField
                label="Anak (<12 Thn)"
                htmlFor="anak_bawah_umur"
                error={errors.anak_bawah_umur}
              >
                <input
                  id="anak_bawah_umur"
                  type="number"
                  {...register("anak_bawah_umur", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tidak boleh negatif" },
                  })}
                  placeholder="0"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
              <FormField
                label="Anak (>=12 Thn)"
                htmlFor="anak_diatas_umur"
                error={errors.anak_diatas_umur}
              >
                <input
                  id="anak_diatas_umur"
                  type="number"
                  {...register("anak_diatas_umur", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Tidak boleh negatif" },
                  })}
                  placeholder="0"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
            </div>
          </section>

          <section>
            <h4 className="text-md font-semibold text-blue-600 mb-3 border-b pb-1">
              Status Partisipasi Event
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                label="Status Registrasi"
                htmlFor="status_register"
                error={errors.status_register}
              >
                <select
                  id="status_register"
                  {...register("status_register")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  {booleanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Status Kedatangan"
                htmlFor="status_kedatangan"
                error={errors.status_kedatangan}
              >
                <select
                  id="status_kedatangan"
                  {...register("status_kedatangan")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  {kedatanganOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Snack Anak"
                htmlFor="status_snack_anak"
                error={errors.status_snack_anak}
              >
                <select
                  id="status_snack_anak"
                  {...register("status_snack_anak")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  {perolehanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Snack Dewasa"
                htmlFor="status_snack_dewasa"
                error={errors.status_snack_dewasa}
              >
                <select
                  id="status_snack_dewasa"
                  {...register("status_snack_dewasa")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  {perolehanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Dinner"
                htmlFor="status_dinner"
                error={errors.status_dinner}
              >
                <select
                  id="status_dinner"
                  {...register("status_dinner")}
                  className="select select-bordered w-full bg-transparent border-slate-300"
                >
                  {perolehanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label="Jam Dinner"
                htmlFor="jam_dinner"
                error={errors.jam_dinner}
              >
                <input
                  id="jam_dinner"
                  type="time"
                  {...register("jam_dinner")}
                  placeholder="Jam Pengambilan Dinner"
                  className="input input-bordered w-full bg-transparent border-slate-300"
                />
              </FormField>
            </div>
          </section>

          <div className="modal-action pt-4 mt-auto border-t border-slate-200 sticky -bottom-5 bg-white py-4 px-6 -mx-6">
            <button
              type="button"
              className="btn btn-ghost text-slate-700 bg-red-600 hover:bg-red-700"
              onClick={() => {
                document.getElementById(idModal).close();
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                document.getElementById(idModal).close();
              }}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          type="button"
          onClick={() => {
            document.getElementById(idModal).close();
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
};

export const ModalKeluargaKaryawan = (props) => {
  const { idModal, currentData, getData } = props;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currentData) {
      setValue("namaKeluarga", currentData.namaKeluarga || "");
      setValue(
        "statusKeluarga",
        capitalizeWords(currentData.status_keluarga) || ""
      );
      setValue("umur", currentData.umur || "");
      setValue("statusRegister", currentData.status_register || 0);
    }
  }, [currentData]);

  const onSubmit = async (data) => {
    const result = await Swal.fire({
      title: "Konfirmasi Update",
      text: "Apakah Anda yakin ingin menyimpan perubahan data karyawan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        await axios.patch(`/keluarga/${currentData.id}`, data);
        toast.success("Data karyawan berhasil diperbarui!");
        getData();
        document.getElementById(idModal).close();
        reset();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error?.response?.data?.message ||
            "Terjadi kesalahan saat menyimpan data.",
        });
      }
    }
  };

  return (
    <dialog id={idModal} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white text-slate-800 max-w-lg p-0 rounded-lg shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-700">
            Detail Anggota Keluarga
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            <div className="form-control">
              <label className="label font-medium">Nama Keluarga</label>
              <input
                type="text"
                className={`input input-bordered bg-transparent ${
                  errors.namaKeluarga ? "input-error" : ""
                }`}
                {...register("namaKeluarga", {
                  required: "Nama keluarga wajib diisi",
                })}
              />
              {errors.namaKeluarga && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.namaKeluarga.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label font-medium">Status Keluarga</label>
              <select
                className={`select select-bordered bg-transparent ${
                  errors.statusKeluarga ? "select-error" : ""
                }`}
                {...register("statusKeluarga", {
                  required: "Status keluarga wajib dipilih",
                })}
              >
                <option value="">Pilih Status</option>
                <option value="Suami">Suami</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
              </select>
              {errors.statusKeluarga && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.statusKeluarga.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label font-medium">Sudah Register?</label>
              <select
                className={`select select-bordered bg-transparent ${
                  errors.statusRegister ? "select-error" : ""
                }`}
                {...register("statusRegister", {
                  required: "Pilih status registrasi",
                })}
              >
                <option value={1}>Ya</option>
                <option value={0}>Tidak</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label font-medium">Umur</label>
              <input
                type="number"
                className={`input input-bordered bg-transparent ${
                  errors.umur ? "input-error" : ""
                }`}
                {...register("umur", {
                  required: "Umur wajib diisi",
                  min: { value: 0, message: "Umur tidak boleh negatif" },
                })}
              />
              {errors.umur && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.umur.message}
                </span>
              )}
            </div>
          </div>

          <div className="modal-action px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById(idModal).close();
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                document.getElementById(idModal).close();
              }}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export const ModalExcelKaryawan = (props) => {
  const { idModal, onUploadSuccess } = props; // Mengganti nama getData menjadi onUploadSuccess untuk kejelasan

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle', 'uploading', 'success', 'error'
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const fileInputRef = useRef(null);

  const closeModalAndReset = () => {
    const modalElement = document.getElementById(idModal);
    if (modalElement && typeof modalElement.close === "function") {
      modalElement.close();
    }
    setSelectedFile(null);
    setUploadStatus("idle");
    setFeedbackMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
        setUploadStatus("file-selected");
        setFeedbackMessage("");
      } else {
        setFeedbackMessage(
          "Format file tidak valid. Harap pilih file .xlsx atau .xls"
        );
        setSelectedFile(null);
        setUploadStatus("error-filetype");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setFeedbackMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  // Fungsi untuk Drag and Drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
        setUploadStatus("file-selected");
        setFeedbackMessage("");
      } else {
        setFeedbackMessage(
          "Format file tidak valid. Harap pilih file .xlsx atau .xls"
        );
        setSelectedFile(null);
        setUploadStatus("error-filetype");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFeedbackMessage("Silakan pilih file terlebih dahulu.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setFeedbackMessage("Sedang mengunggah dan memproses file...");

    const formData = new FormData();
    formData.append("file_excel", selectedFile);

    try {
      const response = await axios.post("/uploadKaryawan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("success");
      setFeedbackMessage(
        response.data.message ||
          "File berhasil diunggah dan data karyawan telah diperbarui!"
      );
      toast.success(response.data.message || "Data berhasil diupload!");
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      document.getElementById(idModal).close();
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      const apiErrorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengunggah file.";
      setFeedbackMessage(`Gagal: ${apiErrorMessage}`);
      toast.error(`Gagal: ${apiErrorMessage}`);
    }
  };

  return (
    <dialog id={idModal} className="modal modal-bottom sm:modal-middle">
      <div
        className={`modal-box bg-white text-slate-800 max-w-2xl p-0 rounded-lg shadow-xl transition-all duration-300 ease-in-out`}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-700 flex items-center">
            <FiUploadCloud className="mr-2 text-blue-600" size={24} /> Upload
            Data Karyawan (Excel)
          </h3>
          <button
            onClick={closeModalAndReset}
            className="btn btn-sm btn-circle btn-ghost text-slate-500 hover:bg-slate-100"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <section className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-800 space-y-2">
            <h4 className="font-semibold text-md flex items-center">
              <FiFileText className="mr-2" />
              Panduan Upload
            </h4>
            <p className="text-sm">
              1. Pastikan format file Excel Anda (<code>.xlsx</code> atau
              <code>.xls</code>) sesuai dengan template yang disediakan.
            </p>
            <p className="text-sm">
              2. Kolom yang wajib diisi adalah (contoh):
              <strong>No. Employee</strong>, <strong>Nama Karyawan</strong>,
              <strong>Tanggal Bergabung</strong>. Lihat template untuk detail.
            </p>
            <div>
              <a
                href={`${
                  import.meta.env.VITE_IP_URL
                }/template_data_karyawan.xlsx`}
                download
                className="btn btn-sm btn-outline border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white mt-1"
              >
                <FiDownload className="mr-2" /> Unduh Template Excel
              </a>
            </div>
          </section>

          <section>
            <label
              htmlFor="file-upload-input"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-48 border-2 
                         ${
                           isDragging
                             ? "border-blue-500 bg-blue-50"
                             : "border-slate-300 hover:border-slate-400"
                         } 
                         border-dashed rounded-lg cursor-pointer transition-colors`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUploadCloud
                  className={`w-10 h-10 mb-3 ${
                    isDragging ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                <p
                  className={`mb-2 text-sm ${
                    isDragging ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  <span className="font-semibold">Klik untuk memilih file</span>{" "}
                  atau seret file ke sini
                </p>
                <p className="text-xs text-slate-400">
                  XLSX atau XLS (MAX. 5MB)
                </p>
              </div>
              <input
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </label>
          </section>

          {selectedFile &&
            uploadStatus !== "uploading" &&
            uploadStatus !== "success" && (
              <section className="p-3 border rounded-md bg-slate-50 border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <FiFileText className="text-blue-600" />
                  <span>{selectedFile.name}</span>
                  <span className="text-xs text-slate-500">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Hapus file"
                >
                  <FiTrash2 size={18} />
                </button>
              </section>
            )}

          {feedbackMessage && (
            <div
              className={`p-3 rounded-md text-sm
              ${
                uploadStatus === "success"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : ""
              }
              ${
                uploadStatus === "error" || uploadStatus === "error-filetype"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : ""
              }
              ${
                uploadStatus === "uploading"
                  ? "bg-sky-50 border-sky-300 text-sky-700 flex items-center"
                  : ""
              }
            `}
            >
              {uploadStatus === "uploading" && (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              )}
              {uploadStatus === "success" && (
                <FiCheckCircle className="inline mr-2 mb-0.5" />
              )}
              {(uploadStatus === "error" ||
                uploadStatus === "error-filetype") && (
                <FiXCircle className="inline mr-2 mb-0.5" />
              )}
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Aksi Modal */}
        <div className="modal-action px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <button
            type="button"
            className="btn btn-ghost text-slate-700 hover:bg-slate-100"
            onClick={closeModalAndReset}
            disabled={uploadStatus === "uploading"}
          >
            {uploadStatus === "success" ? "Tutup" : "Batal"}
          </button>
          {uploadStatus !== "success" && (
            <button
              type="button"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus === "uploading"}
            >
              {uploadStatus === "uploading" ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Mengunggah...
                </>
              ) : (
                "Upload File"
              )}
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModalAndReset}>
          close
        </button>
      </form>
    </dialog>
  );
};

export const ModalExcelKeluarga = (props) => {
  const { idModal, onUploadSuccess } = props; // Mengganti nama getData menjadi onUploadSuccess untuk kejelasan

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle', 'uploading', 'success', 'error'
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const fileInputRef = useRef(null);

  const closeModalAndReset = () => {
    const modalElement = document.getElementById(idModal);
    if (modalElement && typeof modalElement.close === "function") {
      modalElement.close();
    }
    setSelectedFile(null);
    setUploadStatus("idle");
    setFeedbackMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
        setUploadStatus("file-selected");
        setFeedbackMessage("");
      } else {
        setFeedbackMessage(
          "Format file tidak valid. Harap pilih file .xlsx atau .xls"
        );
        setSelectedFile(null);
        setUploadStatus("error-filetype");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setFeedbackMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  // Fungsi untuk Drag and Drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file);
        setUploadStatus("file-selected");
        setFeedbackMessage("");
      } else {
        setFeedbackMessage(
          "Format file tidak valid. Harap pilih file .xlsx atau .xls"
        );
        setSelectedFile(null);
        setUploadStatus("error-filetype");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFeedbackMessage("Silakan pilih file terlebih dahulu.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setFeedbackMessage("Sedang mengunggah dan memproses file...");

    const formData = new FormData();
    formData.append("file_excel", selectedFile);

    try {
      const response = await axios.post("/uploadKeluarga", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus("success");
      setFeedbackMessage(
        response.data.message ||
          "File berhasil diunggah dan data karyawan telah diperbarui!"
      );
      toast.success(response.data.message || "Data berhasil diupload!");
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      document.getElementById(idModal).close();
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      const apiErrorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengunggah file.";
      setFeedbackMessage(`Gagal: ${apiErrorMessage}`);
      toast.error(`Gagal: ${apiErrorMessage}`);
    }
  };

  return (
    <dialog id={idModal} className="modal modal-bottom sm:modal-middle">
      <div
        className={`modal-box bg-white text-slate-800 max-w-2xl p-0 rounded-lg shadow-xl transition-all duration-300 ease-in-out`}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-700 flex items-center">
            <FiUploadCloud className="mr-2 text-blue-600" size={24} /> Upload
            Data Karyawan (Excel)
          </h3>
          <button
            onClick={closeModalAndReset}
            className="btn btn-sm btn-circle btn-ghost text-slate-500 hover:bg-slate-100"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          <section className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-800 space-y-2">
            <h4 className="font-semibold text-md flex items-center">
              <FiFileText className="mr-2" />
              Panduan Upload
            </h4>{" "}
            <p className="text-sm">
              1. Pastikan Anda sudah mengupload atau menambahkan data karyawan
              terlebih dahulu.
            </p>
            <p className="text-sm">
              2. Pastikan format file Excel Anda (<code>.xlsx</code> atau
              <code>.xls</code>) sesuai dengan template yang disediakan.
            </p>
            <p className="text-sm">
              3. Kolom yang wajib diisi adalah (contoh):
              <strong>No. Employee</strong>, <strong>Nama Keluarga</strong>,
              <strong>Status Hubungan Keluarga</strong>. Lihat template untuk
              detail.
            </p>
            <div>
              <a
                href={`${
                  import.meta.env.VITE_IP_URL
                }/template_data_keluarga.xlsx`}
                download
                className="btn btn-sm btn-outline border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white mt-1"
              >
                <FiDownload className="mr-2" /> Unduh Template Excel
              </a>
            </div>
          </section>

          <section>
            <label
              htmlFor="file-upload-input"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-48 border-2 
                         ${
                           isDragging
                             ? "border-blue-500 bg-blue-50"
                             : "border-slate-300 hover:border-slate-400"
                         } 
                         border-dashed rounded-lg cursor-pointer transition-colors`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUploadCloud
                  className={`w-10 h-10 mb-3 ${
                    isDragging ? "text-blue-600" : "text-slate-400"
                  }`}
                />
                <p
                  className={`mb-2 text-sm ${
                    isDragging ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  <span className="font-semibold">Klik untuk memilih file</span>{" "}
                  atau seret file ke sini
                </p>
                <p className="text-xs text-slate-400">
                  XLSX atau XLS (MAX. 5MB)
                </p>
              </div>
              <input
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </label>
          </section>

          {selectedFile &&
            uploadStatus !== "uploading" &&
            uploadStatus !== "success" && (
              <section className="p-3 border rounded-md bg-slate-50 border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <FiFileText className="text-blue-600" />
                  <span>{selectedFile.name}</span>
                  <span className="text-xs text-slate-500">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Hapus file"
                >
                  <FiTrash2 size={18} />
                </button>
              </section>
            )}

          {feedbackMessage && (
            <div
              className={`p-3 rounded-md text-sm
              ${
                uploadStatus === "success"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : ""
              }
              ${
                uploadStatus === "error" || uploadStatus === "error-filetype"
                  ? "bg-red-50 border-red-300 text-red-700"
                  : ""
              }
              ${
                uploadStatus === "uploading"
                  ? "bg-sky-50 border-sky-300 text-sky-700 flex items-center"
                  : ""
              }
            `}
            >
              {uploadStatus === "uploading" && (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              )}
              {uploadStatus === "success" && (
                <FiCheckCircle className="inline mr-2 mb-0.5" />
              )}
              {(uploadStatus === "error" ||
                uploadStatus === "error-filetype") && (
                <FiXCircle className="inline mr-2 mb-0.5" />
              )}
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Aksi Modal */}
        <div className="modal-action px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <button
            type="button"
            className="btn btn-ghost text-slate-700 hover:bg-slate-100"
            onClick={closeModalAndReset}
            disabled={uploadStatus === "uploading"}
          >
            {uploadStatus === "success" ? "Tutup" : "Batal"}
          </button>
          {uploadStatus !== "success" && (
            <button
              type="button"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus === "uploading"}
            >
              {uploadStatus === "uploading" ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Mengunggah...
                </>
              ) : (
                "Upload File"
              )}
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModalAndReset}>
          close
        </button>
      </form>
    </dialog>
  );
};
