import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../common/Button';

interface NewsletterFormData {
  email: string;
}

export const NewsletterForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>();

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter subscription:', data);
    setSubmitSuccess(true);
    setIsSubmitting(false);
    reset();
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full md:w-auto flex-col sm:flex-row gap-3"
    >
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        className="px-5 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary min-w-[300px]"
        placeholder="Tu correo electrónico"
        type="email"
      />
      {errors.email && (
        <p className="text-xs text-red-500 sm:hidden">{errors.email.message}</p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="px-8 py-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
      >
        {isSubmitting ? 'Suscribiendo...' : 'Suscribirme'}
      </Button>
      {submitSuccess && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-lg sm:col-span-2">
          ¡Gracias! Te has suscrito exitosamente.
        </div>
      )}
    </form>
  );
};
