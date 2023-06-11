window.ContactModalControl = class {
    constructor() {
        this.getHtml();
        this.addEventListeners();
        this.errors = {};
    }

    //assign private html vars and assign exit event listener
    getHtml() {
        this.background = $('#modal-background');
        this.form = $('#modal-form');
        this.exitButton = $('#modal-exit-button');
        this.inputs = {
            name: this.form.find('[name=name]'),
            phone: this.form.find('[name=phone]'),
            email: this.form.find('[name=email]'),
        };
        //change submit btn text
        const submitButton = $('#modal-submit');
        if (submitButton) submitButton.val('שלח');
        this.title = $('#contact-modal-title');
    }

    addEventListeners() {
        this.exitButton.on('click', () => {
            this.hide();
        });
        this.form.on('submit', async (event) => {
            this.errors = {};
            event.preventDefault();
            //validate name => must be longer than 2 chars
            if (this.inputs.name.val().length < 2) {
                this.errors.name = 'אנא מלא את שמך';
            }
            //validate phone => regex - country code is optional
            if (!this.inputs.phone.val()) {
                this.errors.phone = 'אנא הזן מספר טלפון';
            } else {
                const phoneRegex = /^(?:(?:\+972|972)|0)?[ -]?((?:[23489]|5[02458]|7[23489])(?:[ -]?\d){7})$/;
                if (!phoneRegex.test(this.inputs.phone.val())) {
                    this.errors.phone = 'מספר הטלפון שהזנת אינו תקין';
                }
            }
            //validate email => must be a valid email
            if (!this.inputs.email.val()) {
                this.errors.email = 'אנא הזן כתובת מייל';
            } else {
                const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!mailRegex.test(this.inputs.email.val())) {
                    this.errors.email = 'כתובת המייל שהזנת איננה תקינה';
                }
            }
            //remove old errors
            this.clearErrors();
            //add new errors if needed
            if (Object.keys(this.errors).length > 0) {
                for (const [inputName, errorText] of Object.entries(this.errors)) {
                    const error = $('<p>').addClass('contact-modal-error').html(errorText);
                    this.inputs[inputName].after(error);
                }
            } else {
                try {
                    const response = await $.ajax({
                        url: '/doctors/contact',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            name: this.inputs.name.val(),
                            phone: this.inputs.phone.val(),
                            email: this.inputs.email.val(),
                            doctorId: this.doctorId,
                        }),
                    });
                } catch (err) {
                    console.log(err);
                }
                this.hide();
            }
        });
    }

    clearErrors() {
        this.form.find('.contact-modal-error').remove();
    }

    show(doctorId, doctorName) {
        this.doctorId = doctorId;
        this.background.addClass('active');
        this.title.html(doctorName);
    }

    hide() {
        this.background.removeClass('active');
        for (const input of Object.values(this.inputs)) {
            //clear inputs
            input.val('');
        }
        this.clearErrors();
    }
};
