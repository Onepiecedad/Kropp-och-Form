import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Calendar,
    User,
    Phone,
    Mail,
    MessageSquare,
    Sparkles,
    Heart,
    Shield,
} from 'lucide-react';
import { supabase, getServices, getBusinessHours, type Service, type BusinessHours } from './supabaseClient';

/* ═══════════════════════════════
   HELPERS
   ═══════════════════════════════ */
const DAYS_SV = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
const DAYS_FULL_SV = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
const MONTHS_SV = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

function generateTimeSlots(open: string, close: string, durationMin: number): string[] {
    const slots: string[] = [];
    const [oh, om] = open.split(':').map(Number);
    const [ch, cm] = close.split(':').map(Number);
    let current = oh * 60 + om;
    const end = ch * 60 + cm;
    while (current + durationMin <= end) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        current += 30;
    }
    return slots;
}

function addMinutes(time: string, mins: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + mins;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/* ═══════════════════════════════
   CATEGORY ICONS
   ═══════════════════════════════ */
const categoryMeta: Record<string, { label: string; icon: React.ReactNode }> = {
    massage: { label: 'Massagebehandling', icon: <Sparkles size={18} /> },
    avslappning: { label: 'Avslappning & Välbefinnande', icon: <Heart size={18} /> },
};

/* ═══════════════════════════════
   BOOKING PAGE COMPONENT
   ═══════════════════════════════ */
const BookingPage = () => {
    const [step, setStep] = useState(0); // 0=service, 1=datetime, 2=details, 3=confirm
    const [services, setServices] = useState<Service[]>([]);
    const [hours, setHours] = useState<BusinessHours[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dateSliderOffset, setDateSliderOffset] = useState(0);
    const dateSliderRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // Scroll to top on step change
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [step]);

    // Fetch data
    useEffect(() => {
        getServices().then(setServices).catch(console.error);
        getBusinessHours().then(setHours).catch(console.error);
    }, []);

    // Fetch booked slots for selected date
    useEffect(() => {
        if (!selectedDate || !selectedService) return;
        const dateStr = selectedDate.toISOString().split('T')[0];
        supabase
            .from('bookings')
            .select('start_time')
            .eq('booking_date', dateStr)
            .neq('status', 'cancelled')
            .then(({ data }) => {
                setBookedSlots((data || []).map((b: any) => b.start_time?.substring(0, 5)));
            });
    }, [selectedDate, selectedService]);

    // Group services by category
    const servicesByCategory = useMemo(() => {
        const groups: Record<string, Service[]> = {};
        services.forEach(s => {
            const cat = s.category || 'other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(s);
        });
        return groups;
    }, [services]);

    // Generate upcoming dates (28 days)
    const upcomingDates = useMemo(() => {
        const dates: Date[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < 28; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    }, []);

    const isDateAvailable = useCallback((date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;
        const dow = date.getDay();
        const dayHours = hours.find(h => h.day_of_week === dow);
        return !!dayHours && !dayHours.is_closed;
    }, [hours]);

    const getAvailableTimes = useCallback((): string[] => {
        if (!selectedDate || !selectedService || hours.length === 0) return [];
        const dow = selectedDate.getDay();
        const dayHours = hours.find(h => h.day_of_week === dow);
        if (!dayHours || dayHours.is_closed || !dayHours.open_time || !dayHours.close_time) return [];
        const all = generateTimeSlots(dayHours.open_time, dayHours.close_time, selectedService.duration_minutes);
        return all.filter(t => !bookedSlots.includes(t));
    }, [selectedDate, selectedService, hours, bookedSlots]);

    const handleBook = async () => {
        if (!selectedService || !selectedDate || !selectedTime || !firstName || !phone) return;
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const endTime = addMinutes(selectedTime, selectedService.duration_minutes);
            const fullName = `${firstName} ${lastName}`.trim();

            // Upsert customer
            const { data: customers } = await supabase
                .from('customers')
                .upsert({ name: fullName, email: email || null, phone }, { onConflict: 'phone' })
                .select();
            const customer = customers?.[0];
            if (!customer) throw new Error('Kunde inte skapa kundprofil');

            // Get staff (first available)
            const { data: staffList } = await supabase.from('staff').select('id').eq('active', true).limit(1);
            const staffId = staffList?.[0]?.id;
            if (!staffId) throw new Error('Ingen personal tillgänglig');

            // Create booking
            const { error: bookErr } = await supabase.from('bookings').insert({
                customer_id: customer.id,
                service_id: selectedService.id,
                staff_id: staffId,
                booking_date: dateStr,
                start_time: selectedTime + ':00',
                end_time: endTime + ':00',
                price_sek: selectedService.price_sek,
                notes: notes || null,
                status: 'confirmed',
                booked_online: true,
            });
            if (bookErr) throw bookErr;

            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Något gick fel. Försök igen.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setNotes('');
        setError(null);
        setDateSliderOffset(0);
    };

    // Date slider navigation
    const visibleDates = upcomingDates.slice(dateSliderOffset, dateSliderOffset + 7);
    const canScrollLeft = dateSliderOffset > 0;
    const canScrollRight = dateSliderOffset + 7 < upcomingDates.length;

    const stepLabels = ['Välj behandling', 'Datum & Tid', 'Dina uppgifter', 'Bekräftelse'];

    return (
        <div className="bp" ref={topRef}>
            {/* Header */}
            <header className="bp__header">
                <div className="bp__header-inner">
                    <a href="#" className="bp__back-home" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
                        <ArrowLeft size={18} />
                        <span>Tillbaka</span>
                    </a>
                    <div className="bp__brand">Kropp & Form</div>
                    <div className="bp__header-subtitle">Online Bokning</div>
                </div>
            </header>

            {/* Progress bar */}
            <div className="bp__progress">
                <div className="bp__progress-inner">
                    {stepLabels.map((label, i) => (
                        <div
                            key={i}
                            className={`bp__progress-step ${step >= i ? 'bp__progress-step--active' : ''} ${step > i ? 'bp__progress-step--done' : ''}`}
                            onClick={() => { if (i < step) setStep(i); }}
                            role={i < step ? 'button' : undefined}
                            tabIndex={i < step ? 0 : undefined}
                        >
                            <div className="bp__progress-dot">
                                {step > i ? <Check size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
                            </div>
                            <span className="bp__progress-label">{label}</span>
                            {i < stepLabels.length - 1 && <div className="bp__progress-line" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bp__body">
                {/* ═══════════════════════════════
           STEP 0: SERVICE SELECTION
           ═══════════════════════════════ */}
                {step === 0 && (
                    <div className="bp__step bp__step--services">
                        <div className="bp__step-header">
                            <h1>Välj behandling</h1>
                            <p>Välj den behandling som passar dig bäst</p>
                        </div>

                        {services.length === 0 ? (
                            <div className="bp__loading">
                                <Loader2 size={24} className="bp__spinner" />
                                <span>Laddar behandlingar...</span>
                            </div>
                        ) : (
                            (Object.entries(servicesByCategory) as [string, Service[]][]).map(([cat, catServices]) => (
                                <div key={cat} className="bp__category">
                                    <div className="bp__category-header">
                                        {categoryMeta[cat]?.icon || <Sparkles size={18} />}
                                        <h2>{categoryMeta[cat]?.label || cat}</h2>
                                        <span className="bp__category-count">{catServices.length} {catServices.length === 1 ? 'behandling' : 'behandlingar'}</span>
                                    </div>
                                    <div className="bp__service-list">
                                        {catServices.map(s => (
                                            <div key={s.id} className="bp__service-card">
                                                <div className="bp__service-body">
                                                    <div className="bp__service-top">
                                                        <h3 className="bp__service-name">{s.name}</h3>
                                                        {s.is_wellness && (
                                                            <span className="bp__service-badge">
                                                                <Shield size={12} /> Friskvård
                                                            </span>
                                                        )}
                                                    </div>
                                                    {s.description && <p className="bp__service-desc">{s.description}</p>}
                                                    <div className="bp__service-meta">
                                                        <span className="bp__service-duration">
                                                            <Clock size={14} /> {s.duration_minutes} min
                                                        </span>
                                                        <span className="bp__service-price">{s.price_sek} kr</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="bp__service-book-btn"
                                                    onClick={() => { setSelectedService(s); setStep(1); }}
                                                >
                                                    Boka
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════
           STEP 1: DATE & TIME
           ═══════════════════════════════ */}
                {step === 1 && selectedService && (
                    <div className="bp__step bp__step--datetime">
                        <div className="bp__datetime-layout">
                            <div className="bp__datetime-main">
                                <button className="bp__step-back" onClick={() => { setStep(0); setSelectedDate(null); setSelectedTime(null); }}>
                                    <ChevronLeft size={16} /> Byt behandling
                                </button>

                                <div className="bp__step-header">
                                    <h1>Välj datum & tid</h1>
                                    <p>Välj ett datum som passar dig</p>
                                </div>

                                {/* Horizontal date slider */}
                                <div className="bp__date-slider">
                                    <button
                                        className="bp__date-arrow bp__date-arrow--left"
                                        onClick={() => setDateSliderOffset(Math.max(0, dateSliderOffset - 7))}
                                        disabled={!canScrollLeft}
                                        aria-label="Föregående vecka"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className="bp__date-track" ref={dateSliderRef}>
                                        {visibleDates.map(date => {
                                            const available = isDateAvailable(date);
                                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                                            const isToday = new Date().toDateString() === date.toDateString();
                                            return (
                                                <button
                                                    key={date.getTime()}
                                                    className={`bp__date-card ${available ? '' : 'bp__date-card--disabled'} ${isSelected ? 'bp__date-card--selected' : ''} ${isToday ? 'bp__date-card--today' : ''}`}
                                                    disabled={!available}
                                                    onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                                >
                                                    <span className="bp__date-day">{DAYS_SV[date.getDay()]}</span>
                                                    <span className="bp__date-num">{date.getDate()}</span>
                                                    <span className="bp__date-month">{MONTHS_SV[date.getMonth()].substring(0, 3)}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="bp__date-arrow bp__date-arrow--right"
                                        onClick={() => setDateSliderOffset(Math.min(upcomingDates.length - 7, dateSliderOffset + 7))}
                                        disabled={!canScrollRight}
                                        aria-label="Nästa vecka"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Time slots */}
                                {selectedDate && (
                                    <div className="bp__times">
                                        <h3 className="bp__times-title">
                                            Tillgängliga tider — {DAYS_FULL_SV[selectedDate.getDay()]} {selectedDate.getDate()} {MONTHS_SV[selectedDate.getMonth()]}
                                        </h3>
                                        <div className="bp__time-grid">
                                            {getAvailableTimes().length === 0 ? (
                                                <p className="bp__no-times">Inga lediga tider detta datum. Välj ett annat datum.</p>
                                            ) : (
                                                getAvailableTimes().map(t => (
                                                    <button
                                                        key={t}
                                                        className={`bp__time-slot ${selectedTime === t ? 'bp__time-slot--selected' : ''}`}
                                                        onClick={() => setSelectedTime(t)}
                                                    >
                                                        <span className="bp__time-value">{t}</span>
                                                        <span className="bp__time-price">{selectedService.price_sek} kr</span>
                                                    </button>
                                                ))
                                            )}
                                        </div>

                                        {selectedTime && (
                                            <button className="bp__continue-btn" onClick={() => setStep(2)}>
                                                Fortsätt till uppgifter <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sticky summary sidebar */}
                            <aside className="bp__summary-sidebar">
                                <div className="bp__summary-card">
                                    <h3>Din bokning</h3>
                                    <div className="bp__summary-item">
                                        <Sparkles size={14} />
                                        <div>
                                            <strong>{selectedService.name}</strong>
                                            <span>{selectedService.duration_minutes} min</span>
                                        </div>
                                    </div>
                                    {selectedDate && (
                                        <div className="bp__summary-item">
                                            <Calendar size={14} />
                                            <div>
                                                <strong>{DAYS_FULL_SV[selectedDate.getDay()]} {selectedDate.getDate()} {MONTHS_SV[selectedDate.getMonth()]}</strong>
                                                {selectedTime && <span>kl. {selectedTime} — {addMinutes(selectedTime, selectedService.duration_minutes)}</span>}
                                            </div>
                                        </div>
                                    )}
                                    <div className="bp__summary-divider" />
                                    <div className="bp__summary-total">
                                        <span>Totalt</span>
                                        <strong>{selectedService.price_sek} kr</strong>
                                    </div>
                                    {selectedService.is_wellness && (
                                        <div className="bp__summary-wellness">
                                            <Shield size={12} /> Godkänd som friskvård
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════
           STEP 2: CUSTOMER DETAILS
           ═══════════════════════════════ */}
                {step === 2 && selectedService && selectedDate && selectedTime && (
                    <div className="bp__step bp__step--details">
                        <div className="bp__details-layout">
                            <div className="bp__details-main">
                                <button className="bp__step-back" onClick={() => setStep(1)}>
                                    <ChevronLeft size={16} /> Ändra tid
                                </button>

                                <div className="bp__step-header">
                                    <h1>Dina uppgifter</h1>
                                    <p>Fyll i dina kontaktuppgifter för att slutföra bokningen</p>
                                </div>

                                <form className="bp__form" onSubmit={e => { e.preventDefault(); handleBook(); }}>
                                    <div className="bp__form-row">
                                        <div className="bp__field">
                                            <label htmlFor="bp-firstname">
                                                <User size={14} /> Förnamn <span className="bp__required">*</span>
                                            </label>
                                            <input
                                                id="bp-firstname"
                                                type="text"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                required
                                                placeholder="Anna"
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        <div className="bp__field">
                                            <label htmlFor="bp-lastname">
                                                <User size={14} /> Efternamn
                                            </label>
                                            <input
                                                id="bp-lastname"
                                                type="text"
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                placeholder="Svensson"
                                                autoComplete="family-name"
                                            />
                                        </div>
                                    </div>

                                    <div className="bp__field">
                                        <label htmlFor="bp-phone">
                                            <Phone size={14} /> Mobilnummer <span className="bp__required">*</span>
                                        </label>
                                        <input
                                            id="bp-phone"
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                            placeholder="07X-XXX XX XX"
                                            autoComplete="tel"
                                        />
                                    </div>

                                    <div className="bp__field">
                                        <label htmlFor="bp-email">
                                            <Mail size={14} /> E-postadress
                                        </label>
                                        <input
                                            id="bp-email"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="din@email.se"
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div className="bp__field">
                                        <label htmlFor="bp-notes">
                                            <MessageSquare size={14} /> Meddelande (valfritt)
                                        </label>
                                        <textarea
                                            id="bp-notes"
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            placeholder="Berätta gärna om du har några specifika önskemål eller behov"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="bp__policy">
                                        <p>Genom att boka godkänner du våra bokningsvillkor. Avbokning kan göras senast 24 timmar innan bokad tid utan kostnad.</p>
                                    </div>

                                    {error && <p className="bp__error">{error}</p>}

                                    <button
                                        className="bp__submit-btn"
                                        type="submit"
                                        disabled={loading || !firstName || !phone}
                                    >
                                        {loading ? (
                                            <><Loader2 size={18} className="bp__spinner" /> Bokar...</>
                                        ) : (
                                            <>Slutför bokning <Check size={18} /></>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Summary sidebar */}
                            <aside className="bp__summary-sidebar">
                                <div className="bp__summary-card">
                                    <h3>Bokningssammanfattning</h3>
                                    <div className="bp__summary-item">
                                        <Sparkles size={14} />
                                        <div>
                                            <strong>{selectedService.name}</strong>
                                            <span>{selectedService.duration_minutes} min</span>
                                        </div>
                                    </div>
                                    <div className="bp__summary-item">
                                        <Calendar size={14} />
                                        <div>
                                            <strong>{DAYS_FULL_SV[selectedDate.getDay()]} {selectedDate.getDate()} {MONTHS_SV[selectedDate.getMonth()]}</strong>
                                            <span>kl. {selectedTime} — {addMinutes(selectedTime, selectedService.duration_minutes)}</span>
                                        </div>
                                    </div>
                                    <div className="bp__summary-divider" />
                                    <div className="bp__summary-total">
                                        <span>Totalt</span>
                                        <strong>{selectedService.price_sek} kr</strong>
                                    </div>
                                    {selectedService.is_wellness && (
                                        <div className="bp__summary-wellness">
                                            <Shield size={12} /> Godkänd som friskvård
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════
           STEP 3: CONFIRMATION
           ═══════════════════════════════ */}
                {step === 3 && (
                    <div className="bp__step bp__step--confirm">
                        <div className="bp__confirm-container">
                            <div className="bp__confirm-icon">
                                <div className="bp__confirm-circle">
                                    <Check size={40} strokeWidth={2.5} />
                                </div>
                            </div>
                            <h1>Bokning bekräftad!</h1>
                            <p className="bp__confirm-thankyou">
                                Tack {firstName}! Din bokning är bekräftad och registrerad.
                            </p>

                            <div className="bp__confirm-details">
                                <div className="bp__confirm-row">
                                    <Sparkles size={16} />
                                    <div>
                                        <strong>{selectedService?.name}</strong>
                                        <span>{selectedService?.duration_minutes} min</span>
                                    </div>
                                </div>
                                {selectedDate && (
                                    <div className="bp__confirm-row">
                                        <Calendar size={16} />
                                        <div>
                                            <strong>{DAYS_FULL_SV[selectedDate.getDay()]} {selectedDate.getDate()} {MONTHS_SV[selectedDate.getMonth()]}</strong>
                                            <span>kl. {selectedTime}{selectedService ? ` — ${addMinutes(selectedTime!, selectedService.duration_minutes)}` : ''}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="bp__confirm-row">
                                    <span className="bp__confirm-price">{selectedService?.price_sek} kr</span>
                                </div>
                            </div>

                            <p className="bp__confirm-note">
                                En bekräftelse skickas till {phone}{email ? ` och ${email}` : ''}.
                            </p>

                            <div className="bp__confirm-actions">
                                <button className="bp__confirm-new" onClick={reset}>
                                    Boka ny behandling
                                </button>
                                <a
                                    href="#"
                                    className="bp__confirm-home"
                                    onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
                                >
                                    Tillbaka till startsidan
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bp__footer">
                <p>© 2026 Kropp & Form, Tyringe. Alla rättigheter förbehållna.</p>
            </footer>
        </div>
    );
};

export default BookingPage;
