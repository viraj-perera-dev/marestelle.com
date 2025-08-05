"use client";

import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { getMessages } from "@/lib/getMessages";
import { useLocale } from "next-intl";
import { supabase } from "@/utils/supabaseClient";
import QuantityInput from "@/components/QuantityInput";
import { FaFilePdf } from "react-icons/fa";


export default async function Section6({ params }) {
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "morning",
    message: "",
    people: 1,
    children: 0,
    price: 0,
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const locale = useLocale();
  const messages = await getMessages(locale);
  const t = (key) => messages?.BookingForm?.[key] ?? key;


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "people" || name === "children") {
      const parsedValue = parseInt(value || 0);
  
      const totalPeople =
        name === "people"
          ? parsedValue + formData.children
          : formData.people + parsedValue;
  
      if (totalPeople > 14) {
        alert("You can't have more than 14 people");
        return;
      }
  
      // Build new formData with updated value
      const newData = {
        ...formData,
        [name]: parsedValue,
      };
  
      // Recalculate price based on updated people/children count
      newData.price = calculatePrice(
        newData.date,
        newData.people,
        newData.children
      );
  
      setFormData(newData);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleDateChange = (newValue) => {
    const dateStr = newValue ? newValue.format("YYYY-MM-DD") : "";
    setSelectedDate(newValue);
    const newData = {
      ...formData,
      date: dateStr,
      price: calculatePrice(dateStr, formData.people, formData.children),
    };
    setFormData(newData);
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
    setLoadingSubmit(true);

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
          setLoadingSubmit(false);
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

          setLoadingSubmit(false);

          setShowSuccessModal(true);
          // Optional: reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "morning",
            message: "",
            people: 1,
            children: 0,
            price: 0,
          });
          setSelectedDate(null);
          setStep(1);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setLoadingSubmit(false);
        alert("Unexpected error occurred.");
      }
    }
  };

  const reCalculatePrice = (tour) => {
    const date = new Date(formData.date);
    const month = date.getMonth() + 1; // 1-based month
    const day = date.getDate();
    let adultPrice = 0;
    let childPrice = 0;

    if (tour === "evening") {
      if (month === 5 || month === 6) {
        // May & June
        adultPrice = 50;
        childPrice = 40;
      } else if (month === 7) {
        // July
        adultPrice = 60;
        childPrice = 50;
      } else if (month === 8) {
        if (day >= 10 && day <= 17) {
          // 10–17 August
          adultPrice = 70;
          childPrice = 60;
        } else {
          // 1–9 or 18–31 August
          adultPrice = 60;
          childPrice = 50;
        }
      } else if (month === 9 || month === 10) {
        // September & October
        adultPrice = 50;
        childPrice = 40;
      }
    
      const newData = {
        ...formData,
        price: formData.people * adultPrice + formData.children * childPrice,
      };
      setFormData(newData);
      handleTimeSelect("evening")
    } else if (tour === "morning") {
      if (month === 7) {
        adultPrice = 45;
        childPrice = 35;
      } else if (month === 8) {
        if (day >= 10 && day <= 17) {
          adultPrice = 70;
          childPrice = 60;
        } else {
          adultPrice = 60;
          childPrice = 50;
        }
      } else if (month === 9 && day <= 10) {
        adultPrice = 45;
        childPrice = 35;
      }
      const newData = {
        ...formData,
        price: formData.people * adultPrice + formData.children * childPrice,
      };
      setFormData(newData);
      handleTimeSelect("morning")
    } else {
      if (month === 7) {
        adultPrice = 45;
        childPrice = 35;
      } else if (month === 8) {
        if (day >= 10 && day <= 17) {
          adultPrice = 70;
          childPrice = 60;
        } else {
          adultPrice = 60;
          childPrice = 50;
        }
      } else if (month === 9 && day <= 10) {
        adultPrice = 45;
        childPrice = 35;
      }
      const newData = {
        ...formData,
        price: formData.people * adultPrice + formData.children * childPrice,
      };
      setFormData(newData);
      handleTimeSelect("afternoon")
    }
  };
  

  const calculatePrice = (dateStr, people, children) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let adultPrice = 40;
    let childPrice = 30;

    if (month === 7) {
      adultPrice = 45;
      childPrice = 35;
    } else if (month === 8) {
      if (day >= 10 && day <= 17) {
        adultPrice = 70;
        childPrice = 60;
      } else {
        adultPrice = 60;
        childPrice = 50;
      }
    } else if (month === 9 && day <= 10) {
      adultPrice = 45;
      childPrice = 35;
    }

    return people * adultPrice + children * childPrice;
  };

  if (!messages) return;

  return (
    <section className="bg-blue-50 py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold">{t("title")}</h2>
        <p className="text-neutral-600  mt-2 mb-10">
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

              <div className="flex flex-col md:gap-4 gap-2">
                <QuantityInput
                  label="Adulti"
                  name="people"
                  value={formData.people}
                  onChange={handleChange}
                  min={1}
                  max={14}
                />

                <QuantityInput
                  label="Bambini"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  min={0}
                  max={14}
                />
              </div>

              {errors.date && (
                <p className="text-red-500 text-sm mb-5">{errors.date}</p>
              )}
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white rounded-full md:w-1/2 w-full py-4 hover:bg-blue-700 transition mt-8"
              >
                {t("nextButton")}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Time Selection */}
              <div>
                <label className="block font-medium text-neutral-700 text-md  mb-2 uppercase">
                  {t("timeLabel")}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex md:gap-4 gap-2 text-sm md:text-md">
                  <button
                    type="button"
                    onClick={() => reCalculatePrice("morning")}
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
                    onClick={() => reCalculatePrice("afternoon")}
                    className={`md:px-4 px-2 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === "afternoon"
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {t("afternoon")}
                  </button>
                  <button
                    type="button"
                    onClick={() => reCalculatePrice("evening")}
                    className={`md:px-4 px-2 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === "evening"
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {t("evening")}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-neutral-700 text-md  mb-2 uppercase">
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
                <label className="block font-medium text-neutral-700 text-md  mb-2 uppercase">
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
                <label className="block font-medium text-neutral-700 text-md  mb-2 uppercase">
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
                <label className="block font-medium text-neutral-700 text-md  mb-2 uppercase">
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

              <p className="text-sm text-neutral-600 mt-2"><span className="text-red-500">*</span> {t("requiredFields")}</p>

              <a
                  href={t("downloadButtonLink")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-semibold text-md md:text-xl border border-blue-500 text-blue-500 w-full py-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer m-0"
                >
                  {t("downloadButtonLabel")} <FaFilePdf className="text-red-800" size={20} />
                </a>

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
                  {loadingSubmit ? "Loading..." : <div className="flex flex-col md:flex-row items-center justify-center md:gap-2"><span>{t("submitButton")}</span> <span>( {t("priceLabel")}: {formData.price}€ )</span></div>} 
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
              {t("closeLabel")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
