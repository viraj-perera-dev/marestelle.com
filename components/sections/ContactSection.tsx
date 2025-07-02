'use client';

import { useState } from 'react';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';

export default function Section6() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: 'morning',
    message: '',
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time: 'morning' | 'afternoon') => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setFormData((prev) => ({
      ...prev,
      date: newValue ? newValue.format('YYYY-MM-DD') : '',
    }));
  };

  const handleNext = () => {
    if (!selectedDate) {
      setErrors({ date: 'Please select a date to proceed.' });
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required.';
    if (!formData.date.trim()) newErrors.date = 'Date is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitted:', formData);
      alert('Booking submitted!');
    }
  };

  return (
    <section className="bg-blue-50 py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Prenota un appuntamento</h2>
        <p className="text-neutral-600 text-lg mt-2 mb-10">
          Prenota un appuntamento per un tour in barca
        </p>

        <div className="bg-white shadow-md rounded-3xl p-15 text-left">
          {step === 1 && (
            <div className="flex flex-col justify-center items-center text-center">
                <label className="block font-medium text-neutral-700 text-lg mb-10 uppercase">
                    Seleziona una data<span className="text-red-500"> *</span>
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
                className="bg-blue-600 text-white rounded-full w-1/2 py-4 hover:bg-blue-700 transition"
              >
                Prosegui
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Time Selector */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  Seleziona orario<span className="text-red-500"> *</span>
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTimeSelect('morning')}
                    className={`px-4 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === 'morning'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    Morning Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeSelect('afternoon')}
                    className={`px-4 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === 'afternoon'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    Afternoon Tour
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  Full Name<span className="text-red-500"> *</span>
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
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  Email Address<span className="text-red-500"> *</span>
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
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  Phone Number<span className="text-red-500"> *</span>
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

              {/* Optional Message */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  Message (Optional)
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
                onClick={handlePrev}
                className="mt-6 bg-gray-400 text-white rounded-full w-full py-4 hover:bg-gray-500 transition"
              >
                Indietro
              </button>
              <button
                type="submit"
                className="mt-6 bg-blue-600 text-white rounded-full w-full py-4 hover:bg-blue-800 transition"
              >
                Prenota Ora
              </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
