import { initTheme } from './utils.js';
import { initLogoutButton } from './auth.js';
import { initBookingDisplay } from './booking-display.js';
import { initModals } from './modals.js';

// Initialize all modules when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing agenda page...");
    
    // Initialize theme first for consistent UI
    initTheme();
    
    // Initialize logout button and check user authorization
    initLogoutButton();
    
    // Initialize modals for driver selection
    initModals();
    
    // Initialize booking display
    initBookingDisplay();
    
    console.log("Agenda page initialization complete");
});