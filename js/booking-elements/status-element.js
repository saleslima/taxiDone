/**
 * Status-related element creation functions
 */
import { handleStatusChange } from "../booking-handlers.js";

// Create status dropdown element
export async function createStatusElement(bookingId, booking) {
    const statusContainer = document.createElement('div');
    statusContainer.classList.add('status-select-container');

    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'AGENDADO:';
    statusContainer.appendChild(statusLabel);

    const statusSelect = document.createElement('select');
    statusSelect.dataset.bookingId = bookingId;

    const optionNo = document.createElement('option');
    optionNo.value = 'NAO';
    optionNo.textContent = 'NÃO';
    statusSelect.appendChild(optionNo);

    const optionYes = document.createElement('option');
    optionYes.value = 'SIM';
    optionYes.textContent = 'SIM';
    statusSelect.appendChild(optionYes);

    const optionTransfer = document.createElement('option');
    optionTransfer.value = 'TRANSFERIR';
    optionTransfer.textContent = 'TRANSFERIR';
    statusSelect.appendChild(optionTransfer);

    let firebaseStatus = 'NAO';
    if (booking.scheduled === true && !booking.transferDetails) {
        firebaseStatus = 'SIM';
    } else if (booking.transferDetails) {
        firebaseStatus = 'TRANSFERIR';
    }

    const savedStatus = localStorage.getItem(`bookingStatus_${bookingId}`) || firebaseStatus;
    statusSelect.value = savedStatus;

    statusSelect.addEventListener('change', async (event) => {
        await handleStatusChange(event);
    });

    statusContainer.appendChild(statusSelect);
    return statusContainer;
}

