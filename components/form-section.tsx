'use client';

import { Button } from "@/components/ui/button"

import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AnimatedButton from '@/components/animated-button';
import AnimatedSelect from '@/components/animated-select';
import ScrollReveal from '@/components/scroll-reveal';
import { supabase } from '@/lib/supabase';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';

export default function FormSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    serviceType: '',
    budget: '',
    studyLevel: '',
    email: '',
    whatsapp: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate all fields
      if (!formData.fullName || !formData.serviceType || !formData.budget || !formData.studyLevel || !formData.email || !formData.whatsapp || !formData.message) {
        setError('Veuillez remplir tous les champs du formulaire.');
        setIsSubmitting(false);
        return;
      }

      // Check if email or whatsapp already exists
      const { data: existing, error: checkError } = await supabase
        .from('candidates')
        .select('id, email, whatsapp')
        .or(`email.eq.${formData.email},whatsapp.eq.${formData.whatsapp.trim()}`)
        .maybeSingle();

      if (checkError) {
        console.error('Check error:', checkError);
      }

      if (existing) {
        if (existing.email === formData.email) {
          setError('Cet email est déjà utilisé pour une demande.');
        } else {
          setError('Ce numéro de téléphone est déjà utilisé pour une demande.');
        }
        setIsSubmitting(false);
        return;
      }

      const { error: submitError } = await supabase.from('candidates').insert([
        {
          full_name: formData.fullName,
          service_type: formData.serviceType,
          budget: formData.budget,
          study_level: formData.studyLevel,
          email: formData.email,
          whatsapp: formData.whatsapp || null,
          message: formData.message,
        },
      ]);

      if (submitError) {
        console.error('Supabase error:', submitError);
        setError('Une erreur est survenue. Veuillez réessayer.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          fullName: '',
          serviceType: '',
          budget: '',
          studyLevel: '',
          email: '',
          whatsapp: '',
          message: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="w-full py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-background/95 border-t border-border/50">
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          {/* Form Title */}
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4 text-balance text-center">
            Demande
            <br />
            d'accompagnement
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* Form Intro */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-center">
            Les demandes sérieuses sont étudiées rapidement. Les places sont limitées.
          </p>
        </ScrollReveal>

        {submitted ? (
          <motion.div
            className="p-8 bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-2xl text-center backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="inline-block p-3 rounded-full bg-accent/10 mb-4"
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-6 h-6 text-accent" weight="fill" />
            </motion.div>
            <p className="text-lg font-semibold text-foreground">
              Demande reçue
            </p>
            <p className="text-muted-foreground mt-2">
              Nous évaluons votre profil et vous répondrons sous 48 heures.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} viewport={{ once: true }}>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground"
              >
                Nom & Prénom
              </label>
              <motion.input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Votre nom complet"
                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            {/* Service Type */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} viewport={{ once: true }}>
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-foreground"
              >
                Type de service
              </label>
              <AnimatedSelect
                options={[
                  { value: 'web', label: 'Développement Web / Application Mobile' },
                  { value: 'writing', label: 'Rédaction académique' },
                ]}
                value={formData.serviceType}
                onChange={(value) => {
                  // Automatically set budget based on service type
                  const budgetMap: Record<string, string> = {
                    'web': '25000-50000',
                    'writing': '5000-10000',
                  };
                  setFormData((prev) => ({
                    ...prev,
                    serviceType: value,
                    budget: budgetMap[value] || ''
                  }));
                }}
                placeholder="Sélectionner un service"
              />
            </motion.div>

            {/* Price Display (based on service type) */}
            {formData.serviceType && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-foreground">
                  Tarif
                </label>
                <div className="w-full px-5 py-3.5 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl backdrop-blur-sm">
                  <p className="text-lg font-semibold text-accent">
                    {formData.serviceType === 'web' ? '25 000 – 50 000 DA' : '5 000 – 10 000 DA'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.serviceType === 'web'
                      ? 'Accompagnement complet pour votre projet web ou mobile'
                      : 'Rédaction et accompagnement académique personnalisé'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Study Level */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} viewport={{ once: true }}>
              <label
                htmlFor="studyLevel"
                className="block text-sm font-medium text-foreground"
              >
                Niveau d'étude
              </label>
              <AnimatedSelect
                options={[
                  { value: 'licence', label: 'Licence' },
                  { value: 'master', label: 'Master' },
                ]}
                value={formData.studyLevel}
                onChange={(value) => setFormData((prev) => ({ ...prev, studyLevel: value }))}
                placeholder="Sélectionner un niveau"
              />
            </motion.div>

            {/* Email */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} viewport={{ once: true }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            {/* WhatsApp */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} viewport={{ once: true }}>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-foreground"
              >
                Numéro téléphone / WhatsApp
              </label>
              <motion.input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+213 XXX XXXXXX"
                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            {/* Message */}
            <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} viewport={{ once: true }}>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground"
              >
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Décrivez brièvement votre projet (2–3 lignes)"
                rows={4}
                className="w-full px-5 py-3.5 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border resize-none"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} viewport={{ once: true }}>
              <AnimatedButton
                onClick={() => handleSubmit({ preventDefault: () => { } } as any)}
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <CircleNotch className="animate-spin h-5 w-5" weight="bold" />
                    Envoi en cours...
                  </span>
                ) : (
                  'Soumettre la demande'
                )}
              </AnimatedButton>
            </motion.div>

            {/* Info Text */}
            <motion.p
              className="text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              viewport={{ once: true }}
            >
              Nous répondons aux demandes sérieuses dans les 48 heures.
            </motion.p>
          </form>
        )}
      </div>
    </section>
  );
}
