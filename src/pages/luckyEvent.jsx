import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import {
  FaTrophy,
  FaGift,
  FaUsers,
  FaRandom,
  FaSpinner,
  FaCog,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Rnd } from "react-rnd"; // Impor Rnd

// ... (kode dummyNamesForSpin, fetchAllPrizes, dll tetap sama) ...

// Komponen Modal untuk Pengaturan
const SettingsModal = ({
  isOpen,
  onClose,
  onApplySettings,
  prizes,
  isLoadingPrizes,
}) => {
  const [localActionGacha, setLocalActionGacha] = useState("LUCKY_DIP");
  const [localSelectedPrizeId, setLocalSelectedPrizeId] = useState("");
  const [localNumToDraw, setLocalNumToDraw] = useState(1);
  const [localSelectedLuckyDipPrizes, setLocalSelectedLuckyDipPrizes] =
    useState([]);

  // State untuk posisi dan ukuran modal Rnd
  const [rndState, setRndState] = useState({
    width: 600, // Lebar awal (sesuaikan dengan max-w-lg atau lebih besar)
    height: "auto", // Tinggi otomatis atau bisa juga angka
    x: (window.innerWidth - 600) / 2, // Posisi X awal (tengah)
    y: 100, // Posisi Y awal
  });

  const availablePrizesForSelection = prizes.filter((p) => p.available_qty > 0);

  const handlePrizeCheckboxChange = (prizeId) => {
    setLocalSelectedLuckyDipPrizes((prev) =>
      prev.includes(prizeId)
        ? prev.filter((id) => id !== prizeId)
        : [...prev, prizeId]
    );
  };

  const handleApply = () => {
    let settingsToApply = {
      actionGacha: localActionGacha,
      numToDraw: parseInt(localNumToDraw, 10) || 1,
    };
    if (localActionGacha === "LUCKY_DIP") {
      settingsToApply.selectedLuckyDipPrizeIds = localSelectedLuckyDipPrizes;
      settingsToApply.selectedPrizeId = null;
    } else {
      settingsToApply.selectedPrizeId = localSelectedPrizeId;
      settingsToApply.selectedLuckyDipPrizeIds = [];
    }
    onApplySettings(settingsToApply);
  };

  useEffect(() => {
    setLocalSelectedPrizeId("");
    setLocalNumToDraw(1);
    setLocalSelectedLuckyDipPrizes([]);
  }, [localActionGacha]);

  // Update posisi tengah jika window diresize (opsional)
  useEffect(() => {
    const handleResize = () => {
      setRndState((prev) => ({
        ...prev,
        x: (window.innerWidth - prev.width) / 2,
        // y: (window.innerHeight - prev.height) / 2 // jika height juga angka
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [rndState.width]);

  if (!isOpen) return null;

  return (
    // Backdrop tetap menggunakan fixed positioning untuk menutupi layar
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99] p-4 backdrop-blur-sm">
      <Rnd
        size={{ width: rndState.width, height: rndState.height }}
        position={{ x: rndState.x, y: rndState.y }}
        onDragStop={(e, d) => {
          setRndState((prev) => ({ ...prev, x: d.x, y: d.y }));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setRndState({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10), // atau 'auto' jika tidak ingin set height manual dari resize
            ...position,
          });
        }}
        minWidth={400} // Lebar minimum modal
        minHeight={450} // Tinggi minimum modal (sesuaikan dengan konten)
        bounds="parent" // Agar tidak bisa ditarik keluar dari backdrop (atau 'window')
        dragHandleClassName="modal-drag-handle" // Kelas untuk area drag (header modal)
        className="z-[100] flex" // Pastikan Rnd di atas backdrop
        enableResizing={{
          // Aktifkan handle resize yang diinginkan
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        {/* Konten Modal Anda */}
        <div className="bg-slate-800 rounded-xl shadow-2xl w-full h-full flex flex-col border border-slate-700 overflow-hidden">
          {" "}
          {/* h-full agar konten mengisi Rnd */}
          {/* Header Modal (Area untuk Drag) */}
          <div className="modal-drag-handle cursor-move px-6 py-4 md:px-8 md:py-5 flex justify-between items-center border-b border-slate-700 bg-slate-800 rounded-t-xl">
            <h2 className="text-xl font-bold text-white flex items-center select-none">
              {" "}
              {/* select-none agar teks tidak terseleksi saat drag */}
              <FaCog className="mr-2 text-pink-500" /> Pengaturan Undian
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          {/* Isi Form Modal (dibuat scrollable jika kontennya melebihi tinggi Rnd) */}
          <div className="space-y-5 p-6 md:p-8 overflow-y-auto flex-grow">
            {/* ... Isi form pengaturan Anda (Jenis Undian, Pilih Hadiah, dll.) ... */}
            {/* Contoh satu field: */}
            <div>
              <label
                htmlFor="actionGachaModal"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Jenis Undian
              </label>
              <select
                id="actionGachaModal"
                value={localActionGacha}
                onChange={(e) => setLocalActionGacha(e.target.value)}
                className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="LUCKY_DIP">
                  Lucky Dip (Acak Semua Hadiah Dipilih)
                </option>
                <option value="LUCKY_DRAW">
                  Lucky Draw (Pilih Hadiah Spesifik)
                </option>
                <option value="GRAND_PRIZE">
                  Grand Prize (Pilih Hadiah Spesifik)
                </option>
              </select>
            </div>

            {localActionGacha === "LUCKY_DIP" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pilih Hadiah untuk Lucky Dip:
                </label>
                {isLoadingPrizes ? (
                  <p className="text-slate-400">Memuat hadiah...</p>
                ) : availablePrizesForSelection.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-700 p-3 rounded-md border border-slate-600">
                    {availablePrizesForSelection.map((prize) => (
                      <label
                        key={prize.id}
                        className="flex items-center space-x-3 p-2 rounded hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-secondary"
                          checked={localSelectedLuckyDipPrizes.includes(
                            prize.id
                          )}
                          onChange={() => handlePrizeCheckboxChange(prize.id)}
                        />
                        <span className="text-slate-200 text-sm">
                          {prize.name} (Sisa: {prize.available_qty})
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">Tidak ada hadiah tersedia.</p>
                )}
              </div>
            )}

            {(localActionGacha === "LUCKY_DRAW" ||
              localActionGacha === "GRAND_PRIZE") && (
              <>
                <div>
                  <label
                    htmlFor="selectedPrizeIdModal"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Pilih Hadiah
                  </label>
                  {isLoadingPrizes ? (
                    <p className="text-slate-400">Memuat hadiah...</p>
                  ) : (
                    <select
                      id="selectedPrizeIdModal"
                      value={localSelectedPrizeId}
                      onChange={(e) => setLocalSelectedPrizeId(e.target.value)}
                      className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      disabled={availablePrizesForSelection.length === 0}
                    >
                      <option value="">
                        --{" "}
                        {availablePrizesForSelection.length === 0
                          ? "Tidak ada hadiah"
                          : "Pilih Hadiah"}{" "}
                        --
                      </option>
                      {availablePrizesForSelection.map((prize) => (
                        <option key={prize.id} value={prize.id}>
                          {prize.name} (Sisa: {prize.available_qty})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="numToDrawModal"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Jumlah Pemenang per Tarikan
                  </label>
                  <input
                    type="number"
                    id="numToDrawModal"
                    value={localNumToDraw}
                    onChange={(e) =>
                      setLocalNumToDraw(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    min="1"
                    className="w-full p-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </>
            )}
          </div>
          {/* Footer Modal dengan Tombol Aksi */}
          <div className="px-6 py-4 md:px-8 md:py-5 border-t border-slate-700 bg-slate-800 rounded-b-xl">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-ghost text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleApply}
                className="btn btn-primary bg-pink-600 hover:bg-pink-700 border-pink-600 hover:border-pink-700"
              >
                Terapkan Pengaturan
              </button>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

const LuckyEvent = () => {
  const [settings, setSettings] = useState({
    actionGacha: null,
    selectedPrizeId: null,
    numToDraw: 1,
    selectedLuckyDipPrizeIds: [],
    selectedPrizeInfo: null,
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [isLoadingPrizes, setIsLoadingPrizes] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spinningName, setSpinningName] = useState("SIAP-SIAP...");
  const [currentBatchWinners, setCurrentBatchWinners] = useState([]);
  const [displayedWinner, setDisplayedWinner] = useState(null);
  const [displayedWinnersBatchCards, setDisplayedWinnersBatchCards] = useState(
    []
  );
  const [allWinnersThisSession, setAllWinnersThisSession] = useState([]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const nameSpinIntervalRef = useRef(null);
  const dummyNamesForSpin = [
    "Andi Perkasa",
    "Bunga Lestari",
    "Cahaya Purnama",
    "Dharma Bakti",
    "Elang Samudra",
    "Fajar Mentari",
    "Gita Bahana",
    "Harum Melati",
    "Intan Permata",
    "Jaya Kusuma",
    "Kartika Senja",
    "Langit Biru",
    "Mega Sutera",
    "Nusantara Indah",
    "Ombak Bergulung",
    "Pelangi Senja",
    "Rembulan Malam",
    "Samudra Pasai",
    "Taufan Badai",
    "Untung Berjaya",
  ];

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchAllPrizes = useCallback(async () => {
    setIsLoadingPrizes(true);
    try {
      const response = await axios.get("/prizes");
      if (response.data.success) {
        setPrizes(response.data.prizes || []);
      } else {
        setErrorMessage(response.data.message || "Gagal memuat daftar hadiah.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan server saat memuat hadiah.");
    } finally {
      setIsLoadingPrizes(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPrizes();
  }, [fetchAllPrizes]);

  const handleApplySettings = (newSettings) => {
    const currentSelectedPrize = prizes.find(
      (p) => p.id === newSettings.selectedPrizeId
    );
    setSettings({
      ...newSettings,
      selectedPrizeInfo: currentSelectedPrize || null,
    });
    setIsSettingsModalOpen(false);
    setCurrentBatchWinners([]);
    setDisplayedWinner(null);
    setDisplayedWinnersBatchCards([]);
    // Selalu reset allWinnersThisSession saat pengaturan berubah agar daftar pemenang sesi ini fresh
    setAllWinnersThisSession([]);
    setErrorMessage("");
    setSuccessMessage("");
    setSpinningName("SIAP-SIAP...");
  };

  const startNameSpinAnimation = () => {
    if (nameSpinIntervalRef.current) clearInterval(nameSpinIntervalRef.current);
    setDisplayedWinner(null);
    nameSpinIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dummyNamesForSpin.length);
      setSpinningName(dummyNamesForSpin[randomIndex]);
    }, 70);
  };

  const stopNameSpinAnimation = () => {
    if (nameSpinIntervalRef.current) clearInterval(nameSpinIntervalRef.current);
  };

  const revealWinnersSequentially = async (winnersToReveal) => {
    setDisplayedWinnersBatchCards([]);

    for (let i = 0; i < winnersToReveal.length; i++) {
      const winnerData = winnersToReveal[i];

      setDisplayedWinner(null);
      startNameSpinAnimation();
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 + Math.random() * 1000)
      );

      stopNameSpinAnimation();
      const actualWinnerName = winnerData.nama_karyawan || winnerData.nama;
      setSpinningName(actualWinnerName);
      const prizeName =
        winnerData.nama_hadiah ||
        settings.selectedPrizeInfo?.name ||
        "Hadiah Spesial";

      setDisplayedWinner({
        nama: actualWinnerName,
        no_emp: winnerData.no_emp,
        hadiah: prizeName,
      });
      setDisplayedWinnersBatchCards((prev) => [
        ...prev,
        { ...winnerData, nama_hadiah_displayed: prizeName },
      ]);

      if (i < winnersToReveal.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    setIsDrawing(false);
    setSpinningName("UNDIAN BATCH SELESAI!");
    // Jangan langsung clear displayedWinner agar pemenang terakhir masih terlihat sebentar
    // setDisplayedWinner(null);
    fetchAllPrizes();

    // Tambahkan semua pemenang dari batch ini ke allWinnersThisSession untuk SEMUA TIPE UNDIAN
    // Jika Lucky Dip, ini akan menjadi daftar pemenang Lucky Dip untuk sesi tersebut.
    if (winnersToReveal.length > 0) {
      const processedBatchWinners = winnersToReveal.map((w) => ({
        ...w,
        // Pastikan ada field nama_hadiah_utama untuk konsistensi tampilan di list
        nama_hadiah_utama:
          w.nama_hadiah || settings.selectedPrizeInfo?.name || "Hadiah",
      }));

      if (settings.actionGacha === "LUCKY_DIP") {
        // Untuk Lucky Dip, allWinnersThisSession akan diisi dengan pemenang batch ini saja (tidak akumulatif antar klik "Mulai Undian" LD)
        // Jika ingin akumulatif untuk LD juga, gunakan: setAllWinnersThisSession(prev => [...prev, ...processedBatchWinners]);
        setAllWinnersThisSession(processedBatchWinners);
      } else {
        setAllWinnersThisSession((prev) => [...prev, ...processedBatchWinners]);
      }
    }
  };

  const handleStartDraw = async () => {
    if (!settings.actionGacha) {
      setErrorMessage("Pilih jenis undian dari pengaturan.");
      return;
    }
    if (
      settings.actionGacha === "LUCKY_DIP" &&
      (!settings.selectedLuckyDipPrizeIds ||
        settings.selectedLuckyDipPrizeIds.length === 0)
    ) {
      setErrorMessage("Pilih minimal satu hadiah untuk Lucky Dip.");
      return;
    }
    if (
      (settings.actionGacha === "LUCKY_DRAW" ||
        settings.actionGacha === "GRAND_PRIZE") &&
      !settings.selectedPrizeId
    ) {
      setErrorMessage("Pilih hadiah untuk diundi.");
      return;
    }

    setIsDrawing(true);
    setErrorMessage("");
    setSuccessMessage("");
    setCurrentBatchWinners([]);
    setDisplayedWinnersBatchCards([]); // Penting direset di sini
    setDisplayedWinner(null);

    let response;
    try {
      let payload;
      let endpoint;

      if (settings.actionGacha === "LUCKY_DIP") {
        endpoint = "/draw/luckydip"; // Pastikan / sudah benar
        payload = { prizeIdsForLuckyDip: settings.selectedLuckyDipPrizeIds };
      } else {
        endpoint = "/draw/standard"; // Pastikan / sudah benar
        payload = {
          prizeId: settings.selectedPrizeId,
          numToDraw: settings.numToDraw,
          drawType: settings.actionGacha,
        };
      }

      response = await axios.post(endpoint, payload);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        const winnersFromServer = response.data.winners || [];
        setCurrentBatchWinners(winnersFromServer);

        if (winnersFromServer.length > 0) {
          revealWinnersSequentially(winnersFromServer);
        } else {
          stopNameSpinAnimation();
          setSpinningName(
            settings.actionGacha === "LUCKY_DIP"
              ? "SEMUA HADIAH DIPILIH TELAH DIUNDI"
              : "TIDAK ADA PEMENANG ELIGIBLE"
          );
          setIsDrawing(false);
          fetchAllPrizes();
        }

        if (
          settings.actionGacha !== "LUCKY_DIP" &&
          response.data.newAvailableQty !== undefined
        ) {
          const updatedPrize = prizes.find(
            (p) => p.id === settings.selectedPrizeId
          );
          if (updatedPrize) {
            const newSelectedPrizeInfo = {
              ...updatedPrize,
              available_qty: response.data.newAvailableQty,
            };
            setSettings((prev) => ({
              ...prev,
              selectedPrizeInfo: newSelectedPrizeInfo,
            }));
            // Jika hadiah habis, refresh daftar hadiah dan reset pilihan jika perlu
            if (response.data.newAvailableQty === 0) {
              fetchAllPrizes();
              // Jika ingin otomatis reset pilihan hadiah yang habis:
              // if (settings.selectedPrizeId === newSelectedPrizeInfo.id) {
              //    setSettings(prev => ({...prev, selectedPrizeId: '', selectedPrizeInfo: null}));
              // }
            }
          }
        } else if (settings.actionGacha === "LUCKY_DIP") {
          if (winnersFromServer.length === 0) fetchAllPrizes();
        }
      } else {
        throw new Error(response.data.message || "Gagal melakukan undian.");
      }
    } catch (err) {
      console.error("Error starting draw:", err);
      setErrorMessage(
        err.message || err.response?.data?.message || "Terjadi kesalahan."
      );
      stopNameSpinAnimation();
      setSpinningName("GAGAL MENGUNDI");
      setIsDrawing(false);
    }
  };

  const getPrizeNameById = (id) =>
    prizes.find((p) => p.id === id)?.name || "Hadiah";

  return (
    <>
      {isDrawing && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={150}
          gravity={0.08}
          wind={0.01}
          tweenDuration={15000}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-800 to-slate-900 text-white p-4 md:p-8 flex flex-col items-center justify-start pt-10 md:pt-16">
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onApplySettings={handleApplySettings}
          prizes={prizes}
          isLoadingPrizes={isLoadingPrizes}
        />

        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg mb-3">
            🎉 Excelitas DND Event 🎉
          </h1>
        </header>

        {settings.actionGacha && (
          <div className="mb-6 md:mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl text-center text-sm md:text-base max-w-3xl w-full shadow-lg border border-white/20">
            Mode:{" "}
            <span className="font-bold text-yellow-300">
              {settings.actionGacha.replace("_", " ")}
            </span>
            {settings.actionGacha !== "LUCKY_DIP" &&
              settings.selectedPrizeInfo && (
                <>
                  <span className="mx-1 md:mx-2 text-slate-400">|</span>
                  Hadiah:{" "}
                  <span className="font-bold text-yellow-300">
                    {settings.selectedPrizeInfo.name}
                  </span>
                  <span className="mx-1 md:mx-2 text-slate-400">|</span>
                  Sisa:{" "}
                  <span className="font-bold text-yellow-300">
                    {settings.selectedPrizeInfo.available_qty}
                  </span>
                  <span className="mx-1 md:mx-2 text-slate-400">|</span>
                  Akan Diundi:{" "}
                  <span className="font-bold text-yellow-300">
                    {settings.numToDraw}
                  </span>
                </>
              )}
            {settings.actionGacha === "LUCKY_DIP" &&
              settings.selectedLuckyDipPrizeIds.length > 0 && (
                <p className="mt-1 text-xs text-slate-300">
                  ({settings.selectedLuckyDipPrizeIds.length} Jenis Hadiah Lucky
                  Dip Dipilih)
                </p>
              )}
          </div>
        )}

        <div className="w-full max-w-2xl min-h-[220px] md:min-h-[300px] bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center mb-8 border-2 border-purple-600 p-6 relative overflow-hidden">
          {displayedWinner ? (
            <div className="text-center animate-fade-in-up">
              <p className="text-lg md:text-xl text-yellow-300 drop-shadow-sm">
                Selamat Kepada
              </p>
              <FaTrophy className="text-5xl md:text-7xl mx-auto my-2 md:my-3 text-yellow-400 animate-bounce-trophy" />
              <p
                className="text-3xl md:text-5xl font-bold text-white my-1 md:my-2 break-words px-2"
                style={{ textShadow: "0 0 15px #f0f, 0 0 25px #0ff" }}
              >
                {displayedWinner.nama}
              </p>
              <p className="text-md md:text-xl text-slate-300 mb-2">
                ({displayedWinner.no_emp})
              </p>
              <div className="mt-2 md:mt-3 inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-md md:text-lg font-semibold shadow-md">
                <FaGift /> Mendapatkan: {displayedWinner.hadiah}
              </div>
            </div>
          ) : (
            <p
              className={`text-3xl md:text-5xl font-bold tracking-wider text-center transition-opacity duration-100 ease-in-out
                ${
                  isDrawing
                    ? "opacity-90 animate-pulse-text-random"
                    : "text-yellow-300"
                }
              `}
              style={{
                textShadow:
                  "0 0 8px rgba(255,255,255,0.7), 0 0 15px rgba(255,255,100,0.7)",
              }}
            >
              {spinningName}
            </p>
          )}
        </div>

        {!settings.actionGacha ? (
          <p className="text-xl text-yellow-400 text-center bg-white/5 p-4 rounded-lg">
            Silakan pilih <FaCog className="inline mb-1" /> Pengaturan Undian
            untuk memulai.
          </p>
        ) : (
          <button
            onClick={handleStartDraw}
            disabled={
              isDrawing ||
              (settings.actionGacha !== "LUCKY_DIP" &&
                (!settings.selectedPrizeId ||
                  (settings.selectedPrizeInfo?.available_qty || 0) === 0 ||
                  settings.numToDraw >
                    (settings.selectedPrizeInfo?.available_qty || 0))) ||
              (settings.actionGacha === "LUCKY_DIP" &&
                (settings.selectedLuckyDipPrizeIds.length === 0 ||
                  prizes
                    .filter(
                      (p) =>
                        settings.selectedLuckyDipPrizeIds.includes(p.id) &&
                        p.available_qty > 0
                    )
                    .reduce((sum, p) => sum + p.available_qty, 0) === 0))
            }
            className="btn btn-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 border-0 text-white font-bold py-4 px-10 rounded-lg shadow-xl transform transition-all duration-150 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-2xl flex items-center gap-3"
          >
            {isDrawing && !displayedWinner ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaRandom />
            )}
            {isDrawing && !displayedWinner
              ? "MENGUNDI..."
              : !isDrawing &&
                currentBatchWinners.length > 0 &&
                settings.actionGacha !== "LUCKY_DIP" &&
                (settings.selectedPrizeInfo?.available_qty || 0) > 0
              ? "UNDI LAGI HADIAH INI"
              : !isDrawing &&
                settings.actionGacha === "LUCKY_DIP" &&
                currentBatchWinners.length > 0
              ? "UNDIAN LUCKY DIP SELESAI"
              : "MULAI UNDIAN"}
          </button>
        )}

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-800/70 text-red-200 border border-red-600 rounded-lg text-center flex items-center justify-center gap-2 max-w-2xl w-full shadow-md">
            <FaExclamationTriangle /> {errorMessage}
          </div>
        )}
        {successMessage && !isDrawing && currentBatchWinners.length > 0 && (
          <div className="mt-6 p-4 bg-green-800/70 text-green-200 border border-green-600 rounded-lg text-center flex items-center justify-center gap-2 max-w-2xl w-full shadow-md">
            <FaCheckCircle /> {successMessage}
          </div>
        )}

        {/* Daftar Semua Pemenang Sesi Ini (Sekarang Tampil untuk SEMUA jenis undian) */}
        {allWinnersThisSession.length > 0 && (
          <div className="mt-12 w-full max-w-3xl">
            <h2 className="text-2xl font-semibold text-center text-white mb-4">
              <FaUsers className="inline mr-2 mb-1" />
              Semua Pemenang Sesi{" "}
              {settings.actionGacha === "LUCKY_DIP"
                ? "Lucky Dip Ini"
                : settings.selectedPrizeInfo?.name || "Ini"}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-inner_soft max-h-80 overflow-y-auto border border-white/20">
              <ul className="space-y-2">
                {allWinnersThisSession.map((winnerItem, index) => (
                  <li
                    key={`${winnerItem.no_emp}-${index}-session-${
                      winnerItem.id_prize || "prize_all"
                    }`}
                    className="text-slate-200 bg-slate-700/50 p-3 rounded-md shadow-sm flex justify-between items-center"
                  >
                    <span>
                      {index + 1}. {winnerItem.nama_karyawan || winnerItem.nama}{" "}
                      ({winnerItem.no_emp})
                    </span>
                    <span className="text-xs text-yellow-400">
                      {winnerItem.nama_hadiah_utama ||
                        winnerItem.nama_hadiah ||
                        settings.selectedPrizeInfo?.name ||
                        "Hadiah"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="absolute z-60 bottom-4 left-4"
        >
          <FaCog className="mr-2" />
        </button>
      </div>
    </>
  );
};

export default LuckyEvent;
