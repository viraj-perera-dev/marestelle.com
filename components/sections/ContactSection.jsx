"use client";

import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { getMessages } from "@/lib/getMessages";
import { useLocale } from "next-intl";
import { supabase } from "@/utils/supabaseClient";

export default function Section6({ params }) {
  const [step, setStep] = useState(1);
  const locale = useLocale();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "morning",
    message: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [locale]);

  const t = (key) => messages?.BookingForm?.[key] ?? key;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setFormData((prev) => ({
      ...prev,
      date: newValue ? newValue.format("YYYY-MM-DD") : "",
    }));
  };

  const handleNext = () => {
    if (!selectedDate) {
      setErrors({ date: t("error") });
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("nameRequired");
    if (!formData.email.trim()) newErrors.email = t("emailRequired");
    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    if (!formData.date.trim()) newErrors.date = t("dateRequired");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .insert([formData]);

        if (error) {
          console.error("Supabase insert error:", error);
          alert(t("alertError") ?? "There was an error saving your booking.");
        } else {
          console.log("Booking saved:", data);

          // Send emails
          await fetch("/api/send-booking-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          setShowSuccessModal(true);
          // Optional: reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "morning",
            message: "",
          });
          setSelectedDate(null);
          setStep(1);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Unexpected error occurred.");
      }
    }
  };

  if (!messages) return;

  return (
    <section className="bg-blue-50 py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold">{t("title")}</h2>
        <p className="text-neutral-600 md:text-lg mt-2 mb-10">
          {t("subtitle")}
        </p>

        <div className="bg-white shadow-md rounded-3xl p-8 text-left">
          {step === 1 && (
            <div className="flex flex-col justify-center items-center text-center">
              <label className="block font-medium text-neutral-700 text-lg mb-10 uppercase">
                {t("label")}
                <span className="text-red-500"> *</span>
              </label>
              <div className="scale-110">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    disablePast
                  />
                </LocalizationProvider>
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mb-5">{errors.date}</p>
              )}
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white rounded-full w-1/2 py-4 hover:bg-blue-700 transition mt-8"
              >
                {t("nextButton")}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="md:space-y-6 space-y-4">
              {/* Time Selection */}
              <div>
                <label className="block font-medium text-neutral-700 text-md md:text-lg mb-2 uppercase">
                  {t("timeLabel")}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex md:gap-4 gap-2 text-sm md:text-md">
                  <button
                    type="button"
                    onClick={() => handleTimeSelect("morning")}
                    className={`md:px-4 px-2 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === "morning"
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {t("morning")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeSelect("afternoon")}
                    className={`md:px-4 px-2 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === "afternoon"
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {t("afternoon")}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-neutral-700 text-md md:text-lg mb-2 uppercase">
                  {t("nameLabel")}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium text-neutral-700 text-md md:text-lg mb-2 uppercase">
                  {t("emailLabel")}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium text-neutral-700 text-md md:text-lg mb-2 uppercase">
                  {t("phoneLabel")}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block font-medium text-neutral-700 text-md md:text-lg mb-2 uppercase">
                  {t("messageLabel")}
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Let us know anything else..."
                />
              </div>

              <div className="flex justify-between gap-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="mt-6 bg-gray-400 text-white rounded-full w-full py-4 hover:bg-gray-500 transition"
                >
                  {t("backButton")}
                </button>
                <button
                  type="submit"
                  className="mt-6 bg-blue-600 text-white rounded-full w-full py-4 hover:bg-blue-800 transition"
                >
                  {t("submitButton")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              {t("successTitle")}
            </h3>
            <p className="text-neutral-700 mb-6">{t("successMessage")}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-2 px-20 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
