import { get, ref, update } from "firebase/database";
import { database } from "./config.js";
import { formatPhoneNumber } from "./utils.js";
import { showDriverSelectionModal, showTransferDetailsModal } from "./modals.js";

// Handle status dropdown change
export async function handleStatusChange(event) {
    const id = event.target.dataset.bookingId;
    const value = event.target.value;

    localStorage.setItem(`bookingStatus_${id}`, value);
    
    // Remove new-booking class when status changes to SIM or TRANSFERIR
    if (value === 'SIM' || value === 'TRANSFERIR') {
        const bookingElement = event.target.closest('.data-item');
        if (bookingElement) {
            bookingElement.classList.remove('new-booking');
        }
    }

    if (value === 'TRANSFERIR') {
        const bookingDataCurrent = (await get(ref(database, `/bookings/${id}`))).val();

        if (bookingDataCurrent && bookingDataCurrent.transferDetails) {
            showTransferDetailsModal(id, bookingDataCurrent.transferDetails);
        } else {
            showDriverSelectionModal(id);
            update(ref(database, `/bookings/${id}`), { scheduled: true })
                .catch(e => console.error("Failed to update scheduled status to true for TRANSFERIR:", e));
        }
    } else {
        const updates = {
            scheduled: (value === 'SIM'),
            transferDetails: null
        };
        update(ref(database, `/bookings/${id}`), updates)
            .catch(e => console.error("Failed to update scheduled status or remove transfer details:", e));
    }
}

// Handle driver dropdown change
export async function handleDriverDropdownChange(event, booking) {
    const id = event.target.dataset.bookingId;
    const driverId = event.target.value;
    
    if (driverId) {
        // Get the current status from localStorage instead of forcibly setting it to TRANSFERIR
        const currentStatus = localStorage.getItem(`bookingStatus_${id}`) || 'NAO';
        
        // Get driver details
        const driverSnapshot = await get(ref(database, `/drivers/${driverId}`));
        const driverDetails = driverSnapshot.val();
        
        if (driverDetails) {
            // Update booking with driver details
            await update(ref(database, `/bookings/${id}`), {
                scheduled: true,
                transferDetails: {
                    driverId: driverId,
                    driver: driverDetails.name,
                    plate: driverDetails.plate,
                    model: driverDetails.model,
                    color: driverDetails.color
                }
            });
        }
    }
}