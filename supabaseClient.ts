import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ═══════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════ */

export interface Service {
    id: string;
    name: string;
    description: string | null;
    duration_minutes: number;
    price_sek: number;
    category: string;
    is_wellness: boolean;
    sort_order: number;
    active: boolean;
}

export interface Staff {
    id: string;
    name: string;
    title: string | null;
    bio: string | null;
    image_url: string | null;
    active: boolean;
}

export interface TimeSlot {
    id: string;
    staff_id: string;
    slot_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

export interface Booking {
    id: string;
    customer_id: string;
    service_id: string;
    staff_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    price_sek: number;
    notes: string | null;
    booked_online: boolean;
}

export interface BusinessHours {
    id: string;
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
}

/* ═══════════════════════════════
   API HELPERS
   ═══════════════════════════════ */

export async function getServices(): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('sort_order');
    if (error) throw error;
    return data || [];
}

export async function getStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('active', true);
    if (error) throw error;
    return data || [];
}

export async function getBusinessHours(): Promise<BusinessHours[]> {
    const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('day_of_week');
    if (error) throw error;
    return data || [];
}

export async function getAvailableSlots(date: string, staffId?: string): Promise<TimeSlot[]> {
    let query = supabase
        .from('time_slots')
        .select('*')
        .eq('slot_date', date)
        .eq('is_available', true)
        .order('start_time');
    if (staffId) query = query.eq('staff_id', staffId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function createBooking(booking: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_id: string;
    staff_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    price_sek: number;
    notes?: string;
}): Promise<Booking> {
    // 1. Upsert customer
    const { data: customer, error: custErr } = await supabase
        .from('customers')
        .upsert(
            { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone },
            { onConflict: 'email' }
        )
        .select()
        .single();
    if (custErr) throw custErr;

    // 2. Create booking  
    const { data: newBooking, error: bookErr } = await supabase
        .from('bookings')
        .insert({
            customer_id: customer.id,
            service_id: booking.service_id,
            staff_id: booking.staff_id,
            booking_date: booking.booking_date,
            start_time: booking.start_time,
            end_time: booking.end_time,
            price_sek: booking.price_sek,
            notes: booking.notes || null,
            status: 'confirmed',
            booked_online: true,
        })
        .select()
        .single();
    if (bookErr) throw bookErr;

    // 3. Mark time slot as unavailable
    await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('staff_id', booking.staff_id)
        .eq('slot_date', booking.booking_date)
        .eq('start_time', booking.start_time);

    return newBooking;
}
