"use client"

import * as React from "react"
import { useTranslations } from 'next-intl'

interface ContactFormTranslations {
    formSuccessTitle: string
    formSuccessMessage: string
    formSendAnother: string
    formName: string
    formNamePlaceholder: string
    formEmail: string
    formEmailPlaceholder: string
    formSubject: string
    formSubjectPlaceholder: string
    formMessage: string
    formMessagePlaceholder: string
    formSending: string
    formSend: string
    formRequired: string
}

export const ContactForm: React.FC<{
    translations?: ContactFormTranslations;
    locale?: string;
}> = ({
    translations: propTranslations,
    locale,
}) => {
        // Try to use passed translations first, fallback to useTranslations hook
        let t: (key: string) => string

        if (propTranslations) {
            t = (key: string) => propTranslations[key as keyof ContactFormTranslations] || key
        } else {
            try {
                t = useTranslations('Contact')
            } catch (error) {
                // Fallback translations based on locale
                t = (key: string) => {
                    const fallbacks: { [key: string]: string } = {
                        'formSuccessTitle': locale === 'fr' ? 'Message Envoyé avec Succès !' : 'Message Sent Successfully!',
                        'formSuccessMessage': locale === 'fr' ? 'Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.' : 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
                        'formSendAnother': locale === 'fr' ? 'Envoyer un Autre Message' : 'Send Another Message',
                        'formName': locale === 'fr' ? 'Nom' : 'Name',
                        'formNamePlaceholder': locale === 'fr' ? 'Votre nom complet' : 'Your full name',
                        'formEmail': locale === 'fr' ? 'Courriel' : 'Email',
                        'formEmailPlaceholder': locale === 'fr' ? 'votre@courriel.com' : 'your@email.com',
                        'formSubject': locale === 'fr' ? 'Sujet' : 'Subject',
                        'formSubjectPlaceholder': locale === 'fr' ? 'Comment pouvons-nous vous aider ?' : 'What can we help you with?',
                        'formMessage': locale === 'fr' ? 'Message' : 'Message',
                        'formMessagePlaceholder': locale === 'fr' ? 'Parlez-nous davantage de votre demande...' : 'Tell us more about your inquiry...',
                        'formSending': locale === 'fr' ? 'Envoi en cours...' : 'Sending...',
                        'formSend': locale === 'fr' ? 'Envoyer le Message' : 'Send Message',
                        'formRequired': locale === 'fr' ? 'Champs obligatoires' : 'Required fields'
                    }
                    return fallbacks[key] || key
                }
            }
        }
        const [formData, setFormData] = React.useState({
            name: '',
            email: '',
            subject: '',
            message: ''
        })
        const [isSubmitting, setIsSubmitting] = React.useState(false)
        const [isSubmitted, setIsSubmitted] = React.useState(false)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setIsSubmitting(true)

            // Simulate form submission
            setTimeout(() => {
                setIsSubmitting(false)
                setIsSubmitted(true)
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                })
            }, 1000)
        }

        if (isSubmitted) {
            return (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="font-cinzel font-normal text-lg mb-2">{t('formSuccessTitle')}</h3>
                    <p className="text-gray-600 mb-6">{t('formSuccessMessage')}</p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                    >
                        {t('formSendAnother')}
                    </button>
                </div>
            )
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            {t('formName')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 focus:border-nxl-gold focus:ring-1 focus:ring-nxl-gold outline-none transition-colors"
                            placeholder={t('formNamePlaceholder')}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            {t('formEmail')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 focus:border-nxl-gold focus:ring-1 focus:ring-nxl-gold outline-none transition-colors"
                            placeholder={t('formEmailPlaceholder')}
                        />
                    </div>
                </div>

                {/* Subject Field */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        {t('formSubject')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:border-nxl-gold focus:ring-1 focus:ring-nxl-gold outline-none transition-colors"
                        placeholder={t('formSubjectPlaceholder')}
                    />
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                        {t('formMessage')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-nxl-gold focus:ring-1 focus:ring-nxl-gold outline-none transition-colors resize-vertical"
                        placeholder={t('formMessagePlaceholder')}
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-black text-white font-semibold px-12 py-4 hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 tracking-widest uppercase"
                    >
                        {isSubmitting ? t('formSending') : t('formSend')}
                    </button>
                </div>

                <p className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> {t('formRequired')}
                </p>
            </form>
        )
    } 