'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [referenceCode, setReferenceCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setReferenceCode(data.referenceCode);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div 
      className="min-h-screen py-16"
      style={{
        background: 'linear-gradient(to bottom, var(--text-block), var(--background))'
      }}
    >
      <Container size="md">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--btn-primary)' }}
              >
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Contact Us
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--secondary)' }}
            >
              Have feedback, suggestions, or just want to chat about anime? We'd love to hear from you!
            </p>
          </div>

          {/* Success Message */}
          {status === 'success' && (
            <div 
              className="mb-8 p-6 border-2 rounded-2xl"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--rating-art)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--rating-art)' }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Message Sent Successfully! 🎉
                  </h3>
                  <p 
                    className="mb-3"
                    style={{ color: 'var(--secondary)' }}
                  >
                    Your message has been received! We'll get back to you faster than Saitama can throw a punch! 💪
                  </p>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <p 
                      className="text-sm mb-1"
                      style={{ color: 'var(--muted)' }}
                    >
                      Your Reference Code:
                    </p>
                    <p 
                      className="text-2xl font-mono font-bold"
                      style={{ color: 'var(--rating-art)' }}
                    >
                      {referenceCode}
                    </p>
                    <p 
                      className="text-xs mt-2"
                      style={{ color: 'var(--muted)' }}
                    >
                      (Check your email for confirmation!)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div 
              className="mb-8 p-6 border-2 rounded-2xl"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--rating-story)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--rating-story)' }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Oops! Something went wrong 😅
                  </h3>
                  <p style={{ color: 'var(--secondary)' }}>
                    Looks like we hit a plot hole! Please try again or email us directly at theoneothree@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <form 
            onSubmit={handleSubmit} 
            className="rounded-2xl shadow-xl p-8 border"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Naruto Uzumaki"
                />
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="hokage@konoha.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label 
                  htmlFor="subject" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Feature Request / Bug Report / General Feedback"
                />
              </div>

              {/* Message */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border transition-all resize-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: status === 'sending' ? 'var(--muted)' : 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)'
                }}
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>

          {/* Direct Contact Info */}
          <div className="mt-8 text-center">
            <p 
              className="text-sm"
              style={{ color: 'var(--secondary)' }}
            >
              Or email us directly at{' '}
              <a 
                href="mailto:theoneothree@gmail.com" 
                className="hover:underline font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                theoneothree@gmail.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
