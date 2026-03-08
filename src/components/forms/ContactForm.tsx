import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';

interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', data);
    setSubmitSuccess(true);
    setIsSubmitting(false);
    reset();
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark p-8 lg:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="John Doe"
              type="text"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="john@example.com"
              type="email"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Service Interested In
          </label>
          <select
            {...register('service', { required: 'Please select a service' })}
            className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <option value="">Select a service</option>
            <option value="general">General Checkup</option>
            <option value="whitening">Laser Teeth Whitening</option>
            <option value="implants">Dental Implants</option>
            <option value="orthodontics">Orthodontics</option>
          </select>
          {errors.service && (
            <p className="text-xs text-red-500">{errors.service.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Your Message
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder="Tell us how we can help..."
            rows={4}
          />
          {errors.message && (
            <p className="text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>
        {submitSuccess && (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-lg">
            Thank you! Your message has been sent successfully.
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};
