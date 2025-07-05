// Supabase configuration
const SUPABASE_URL = 'https://nitmyysukscyscazoloa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdG15eXN1a3NjeXNjYXpvbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTc3NDksImV4cCI6MjA2NTQ5Mzc0OX0.scY1HG3VIUGE7OMJHmUs7qq4dBzbTHklx13_jVBTTqs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase; 