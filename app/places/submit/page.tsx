'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function SubmitPlacePage() {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setMessage('')
    const form = new FormData(event.currentTarget)
    const body = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Submission failed')
      event.currentTarget.reset()
      setMessage('Thank you. Your Buddhist place has been submitted for review.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <p><Link href="/places">← Buddhist Places</Link></p>
      <h1>Submit a Buddhist Place</h1>
      <p>Help build the Canada-wide Buddhist directory. Submissions are reviewed before becoming verified public listings.</p>
      {message && <p role="status">{message}</p>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
        <label>Place name *<input name="name" required style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Address<input name="address" style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>City *<input name="city" required style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Province / Territory *<input name="province_territory" required style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Postal code<input name="postal_code" style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Phone<input name="phone" type="tel" style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Email<input name="email" type="email" style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Website<input name="website" type="url" style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <label>Description<textarea name="description" rows={5} style={{ display: 'block', width: '100%', padding: 10 }} /></label>
        <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit for review'}</button>
      </form>
    </main>
  )
}
