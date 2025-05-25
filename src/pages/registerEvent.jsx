import React from "react";
import background from "../images/backgroundForm.png"; // Pastikan path ini benar
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Pastikan Swal diimpor

const initialDefaultValues = {
  noEmp: "",
  email: "",
  noHp: "",
  transportasi: "",
  pasangan: {
    nama: "",
    usia: "",
    hadir: false,
  },
  anak: [],
};

const RegisterEvent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: initialDefaultValues,
  });

  const { fields: fieldsAnak, replace: replaceAnak } = useFieldArray({
    control,
    name: "anak",
  });

  const watchedNoEmp = useWatch({ control, name: "noEmp" });

  const [keluarga, setKeluarga] = useState(null);
  const [debouncedNoEmp, setDebouncedNoEmp] = useState("");
  const [isLoadingKeluarga, setIsLoadingKeluarga] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNoEmp(watchedNoEmp);
    }, 1000);
    return () => clearTimeout(timer);
  }, [watchedNoEmp]);

  useEffect(() => {
    if (!debouncedNoEmp) {
      setKeluarga(null);
      reset(initialDefaultValues);
      return;
    }
    const getKeluarga = async () => {
      setIsLoadingKeluarga(true);
      try {
        const response = await axios.get(`/keluarga/${debouncedNoEmp}`);
        setKeluarga(response.data.data || null);
      } catch (error) {
        console.error("Error fetching keluarga data:", error);
        setKeluarga(null);
      } finally {
        setIsLoadingKeluarga(false);
      }
    };
    getKeluarga();
  }, [debouncedNoEmp, reset]);

  useEffect(() => {
    if (keluarga) {
      if (
        keluarga.pasangan &&
        typeof keluarga.pasangan.nama === "string" &&
        keluarga.pasangan.nama.trim() !== ""
      ) {
        setValue("pasangan.nama", keluarga.pasangan.nama);
        setValue("pasangan.usia", keluarga.pasangan.usia || "");
        setValue(
          "pasangan.hadir",
          typeof keluarga.pasangan.hadir === "boolean"
            ? keluarga.pasangan.hadir
            : true
        );
      } else {
        setValue("pasangan.nama", initialDefaultValues.pasangan.nama);
        setValue("pasangan.usia", initialDefaultValues.pasangan.usia);
        setValue("pasangan.hadir", initialDefaultValues.pasangan.hadir);
      }

      const anakDataForForm = Array.isArray(keluarga.anak)
        ? keluarga.anak.map((anakFromApi) => ({
            nama: typeof anakFromApi.nama === "string" ? anakFromApi.nama : "",
            usia: anakFromApi.usia || "",
            hadir:
              typeof anakFromApi.hadir === "boolean" ? anakFromApi.hadir : true,
          }))
        : [];
      replaceAnak(anakDataForForm);
    } else {
      setValue("pasangan.nama", initialDefaultValues.pasangan.nama);
      setValue("pasangan.usia", initialDefaultValues.pasangan.usia);
      setValue("pasangan.hadir", initialDefaultValues.pasangan.hadir);
      replaceAnak(initialDefaultValues.anak);
    }
  }, [keluarga, setValue, replaceAnak]);

  const onSubmit = async (data) => {
    const { email, noHp, transportasi, pasangan, anak } = data;
    const keluargaUpdates = [];

    if (
      pasangan &&
      typeof pasangan.nama === "string" &&
      pasangan.nama.trim() !== "" &&
      pasangan.hadir === true
    ) {
      keluargaUpdates.push({
        nama: pasangan.nama,
        umur:
          typeof pasangan.usia === "number"
            ? pasangan.usia
            : parseInt(pasangan.usia, 10) || null,
        status_register: 1,
        status_keluarga: "Istri",
      });
    }

    if (Array.isArray(anak)) {
      anak.forEach((child) => {
        if (
          child &&
          typeof child.nama === "string" &&
          child.nama.trim() !== "" &&
          child.hadir === true
        ) {
          keluargaUpdates.push({
            nama: child.nama,
            umur:
              typeof child.usia === "number"
                ? child.usia
                : parseInt(child.usia, 10) || null,
            status_register: 1,
            status_keluarga: "Anak",
          });
        }
      });
    }

    const finalPayload = {
      email,
      noHp,
      transportasi,
      keluargaUpdates,
    };

    const isConfirmedResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengirimkan data registrasi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Submit!",
      cancelButtonText: "Batal",
    });

    if (isConfirmedResult.isConfirmed) {
      try {
        Swal.fire({
          title: "Memproses...",
          text: "Harap tunggu sebentar.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await axios.post(`/registerEvent/${watchedNoEmp}`, finalPayload);

        Swal.close();
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Anda sudah berhasil mendaftar event DND Excelitas, See you soon!",
        });

        reset(initialDefaultValues);
        setKeluarga(null);
      } catch (error) {
        Swal.close();
        console.error("Error saat submit:", error);
        Swal.fire({
          icon: "error",
          title: "Oops... Terjadi Kesalahan",
          text:
            error.response?.data?.message ||
            "Gagal melakukan registrasi. Silakan coba lagi.",
        });
      }
    }
  };

  return (
    // 1. Container utama: set tinggi layar penuh dan sembunyikan overflow utama
    <div className="flex h-screen w-screen overflow-hidden bg-[#E5E5E5]">
      {/* 2. Sisi Kiri (Background Gambar): tinggi penuh, tidak ada scroll */}
      <div
        className="hidden md:block md:w-1/3 h-full bg-no-repeat bg-left bg-cover" // h-full mengambil tinggi dari parent (h-screen)
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      {/* 3. Sisi Kanan (Form): tinggi penuh, overflow-y auto untuk scroll vertikal */}
      <div className="w-full md:w-2/3 h-full overflow-y-auto p-4 sm:p-8 md:p-12 text-slate-800 ">
        {/* Wrapper untuk konten form agar bisa diatur max-width dan centering */}
        <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-6 sm:p-8 mx-auto mt-14">
          {" "}
          {/* mx-auto untuk centering horizontal */}
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
            Register Event DND Excelitas
          </h1>
          <p className="text-sm text-slate-600 mb-8 text-center">
            Imagination is the only limit.
          </p>
          {isLoadingKeluarga && (
            <p className="text-center text-blue-600 mb-4">
              Memuat data keluarga...
            </p>
          )}
          {/* Form dan field-fieldnya */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            {/* Field No Employee */}
            <div>
              <label
                htmlFor="noEmp"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                No Employee
              </label>
              <input
                id="noEmp"
                type="text"
                placeholder="Masukkan No Employee Anda"
                {...register("noEmp", { required: "No Employee wajib diisi" })}
                className="bg-slate-50 text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.noEmp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.noEmp.message}
                </p>
              )}
            </div>

            {/* Field Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                  },
                })}
                className="bg-slate-50 text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Field Mobile Number */}
            <div>
              <label
                htmlFor="noHp"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Mobile Number
              </label>
              <input
                id="noHp"
                type="tel"
                placeholder="08xxxxxxxxxx"
                {...register("noHp", {
                  required: "Nomor HP wajib diisi",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Nomor HP hanya boleh berisi angka",
                  },
                })}
                className="bg-slate-50 text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.noHp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.noHp.message}
                </p>
              )}
            </div>

            {/* Field Transportasi */}
            <div>
              <label
                htmlFor="transportasi"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Pilihan Transportasi
              </label>
              <select
                id="transportasi"
                {...register("transportasi", {
                  required: "Transportasi wajib dipilih",
                })}
                className="bg-slate-50 text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Transportasi</option>
                <option value="Personal">Personal</option>
                <option value="Bus">Bus</option>
              </select>
              {errors.transportasi && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.transportasi.message}
                </p>
              )}
            </div>

            {/* Bagian Pasangan */}
            <div className="pt-4 border-t border-slate-200">
              <h2 className="text-lg font-medium text-slate-800 mb-3">
                Data Pasangan/Pendamping
              </h2>
              {isLoadingKeluarga ? (
                <p className="text-sm text-slate-500">
                  Memeriksa data pasangan...
                </p>
              ) : watch("pasangan.nama") &&
                watch("pasangan.nama").trim() !== "" ? (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="pasanganNamaDisplay"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Nama Pasangan
                    </label>
                    <input
                      id="pasanganNamaDisplay"
                      type="text"
                      {...register("pasangan.nama")}
                      className="bg-slate-100 text-slate-700 w-full p-3 rounded-md border border-slate-300 cursor-default"
                      readOnly
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pasanganUsia"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Usia Pasangan
                    </label>
                    <input
                      id="pasanganUsia"
                      type="number"
                      placeholder="Usia dalam tahun"
                      {...register("pasangan.usia", {
                        required: watch("pasangan.nama")
                          ? "Usia pasangan wajib diisi"
                          : false,
                        valueAsNumber: true,
                        min: { value: 0, message: "Usia tidak boleh negatif" },
                      })}
                      className="bg-slate-50 text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.pasangan?.usia && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pasangan.usia.message}
                      </p>
                    )}
                  </div>
                  <div className="pt-1">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("pasangan.hadir")}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2"
                      />
                      Pasangan akan hadir di acara
                    </label>
                  </div>
                </div>
              ) : (
                debouncedNoEmp &&
                !isLoadingKeluarga && (
                  <p className="text-sm text-slate-500">
                    Data pasangan tidak tersedia atau tidak ditemukan untuk No
                    Employee ini.
                  </p>
                )
              )}
            </div>

            {/* Bagian Anak-anak */}
            <div className="pt-4 border-t border-slate-200">
              <h2 className="text-lg font-medium text-slate-800 mb-3">
                Data Anak-anak
              </h2>
              {isLoadingKeluarga && fieldsAnak.length === 0 && (
                <p className="text-sm text-slate-500">Memeriksa data anak...</p>
              )}
              {fieldsAnak.length > 0
                ? fieldsAnak.map((field, index) => (
                    <div
                      key={field.id}
                      className="border border-slate-200 p-3 rounded-md mb-3 relative space-y-3 bg-slate-50/50"
                    >
                      <h3 className="font-medium text-slate-700 mb-1">
                        {field.nama || `Anak Ke-${index + 1}`}
                        <input
                          type="hidden"
                          {...register(`anak.${index}.nama`)}
                          defaultValue={field.nama}
                        />
                      </h3>
                      <div>
                        <label
                          htmlFor={`anakUsia${index}`}
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Usia Anak
                        </label>
                        <input
                          id={`anakUsia${index}`}
                          type="number"
                          placeholder="Usia dalam tahun"
                          {...register(`anak.${index}.usia`, {
                            required: "Usia anak wajib diisi",
                            valueAsNumber: true,
                            min: {
                              value: 0,
                              message: "Usia tidak boleh negatif",
                            },
                          })}
                          className="bg-white text-slate-800 placeholder-gray-400 w-full p-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.anak?.[index]?.usia && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.anak[index].usia.message}
                          </p>
                        )}
                      </div>
                      <div className="pt-1">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`anak.${index}.hadir`)}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mr-2"
                          />
                          Anak akan hadir di acara
                        </label>
                      </div>
                    </div>
                  ))
                : !isLoadingKeluarga &&
                  debouncedNoEmp && (
                    <p className="text-sm text-slate-500 text-center py-2">
                      Data anak tidak tersedia atau belum ada anak.
                    </p>
                  )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md transition duration-200 mt-6"
            >
              Submit Registrasi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
