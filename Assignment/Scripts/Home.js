//state
let doctorElements = [];
let filters = {
    isActive: false,
    promotionLevel: 0,
};

//modal control
const contactModal = new ContactModalControl();

//get filter buttons
const activeFilterButton = $('#active-filter-button');
const promotionFilterButton = $('#promotion-filter-button');

//add event listeners to filter buttons
if (activeFilterButton.length) {
    activeFilterButton.on('click', () => {
        filters.isActive = !filters.isActive;
        renderDoctors();
        activeFilterButton.toggleClass('active');
    });
}
if (promotionFilterButton.length) {
    promotionFilterButton.on('click', () => {
        filters.promotionLevel = filters.promotionLevel === 5 ? 0 : 5;
        renderDoctors();
        promotionFilterButton.toggleClass('active');
    });
}

//fetch doctors from BE
async function fetchDoctors(filters) {
    //omit isActive if false to avoid filtering false by default (added the option to filter by false in BE)
    try {
        const response = await $.ajax({
            url: `/doctors?promotionLevel=${filters.promotionLevel}${filters.isActive ? '&isActive=true' : ''}`,
            type: 'GET',
            dataType: 'json',
        });
        return response;
    } catch (err) {
        console.log('Error fetching doctors: ', err);
        return [];
    }
}

//fetch and render doctors according to current filters
async function renderDoctors() {
    //can add loading animation trigger here then remove at function end
    if (doctorElements.length) {
        doctorElements.forEach((doctorElement) => {
            doctorElement.remove();
        });
        doctorElements = [];
    }
    const container = $('#doctors-container');
    //html issue (no container)
    if (!container.length) return;
    const doctors = await fetchDoctors(filters);
    doctors.forEach((doctor) => {
        const doctorElement = new DoctorElement(doctor, (doctor) => {
            contactModal.show(doctor.id, doctor.fullName);
        });
        doctorElements.push(doctorElement);
        container.append(doctorElement.html);
    });
}

//initial render
renderDoctors();
