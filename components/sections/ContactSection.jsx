'use client';

import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { getMessages } from '@/lib/getMessages';

export default function Section6({ params }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: 'morning',
    message: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(params.locale);
      setMessages(messages);
    };
    fetchMessages();
  }, [params.locale]);

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
      date: newValue ? newValue.format('YYYY-MM-DD') : '',
    }));
  };

  const handleNext = () => {
    if (!selectedDate) {
      setErrors({ date: t('step1.error') });
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('step2.nameRequired');
    if (!formData.email.trim()) newErrors.email = t('step2.emailRequired');
    if (!formData.phone.trim()) newErrors.phone = t('step2.phoneRequired');
    if (!formData.date.trim()) newErrors.date = t('step2.dateRequired');

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Submitted:', formData);
      alert(t('alertSuccess'));
    }
  };

  return (
    <section className="bg-blue-50 py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold">{t('title')}</h2>
        <p className="text-neutral-600 md:text-lg mt-2 mb-10">{t('subtitle')}</p>

        <div className="bg-white shadow-md rounded-3xl p-8 text-left">
          {step === 1 && (
            <div className="flex flex-col justify-center items-center text-center">
              <label className="block font-medium text-neutral-700 text-lg mb-10 uppercase">
                {t('step1.label')}<span className="text-red-500"> *</span>
              </label>
              <div className="scale-110">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={selectedDate} onChange={handleDateChange} disablePast />
                </LocalizationProvider>
              </div>
              {errors.date && <p className="text-red-500 text-sm mb-5">{errors.date}</p>}
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white rounded-full w-1/2 py-4 hover:bg-blue-700 transition mt-8"
              >
                {t('step1.nextButton')}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Time Selection */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  {t('step2.timeLabel')}<span className="text-red-500"> *</span>
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTimeSelect('morning')}
                    className={`px-4 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === 'morning' ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
                  >
                    {t('step2.morning')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeSelect('afternoon')}
                    className={`px-4 py-2 rounded-full w-full border border-neutral-400 transition ${
                      formData.time === 'afternoon' ? 'bg-blue-600 text-white' : 'bg-white'
                    }`}
                  >
                    {t('step2.afternoon')}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  {t('step2.nameLabel')}<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  {t('step2.emailLabel')}<span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  {t('step2.phoneLabel')}<span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-neutral-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block font-medium text-neutral-700 text-lg mb-2 uppercase">
                  {t('step2.messageLabel')}
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
                  {t('step2.backButton')}
                </button>
                <button
                  type="submit"
                  className="mt-6 bg-blue-600 text-white rounded-full w-full py-4 hover:bg-blue-800 transition"
                >
                  {t('step2.submitButton')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
