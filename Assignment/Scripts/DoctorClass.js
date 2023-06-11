/*
    doctor class
    pass doctor object as 1st parameter
    2nd parameter is a doctor callback which received the doctor object and is optional
    if contact callback is not provided the contact button will not be rendered
*/
window.DoctorElement = class {
    #contactButton;

    constructor(doctorObj, contactCallback /*optional*/) {
        this.doctorObj = doctorObj;
        this.phones = this.extractPhones();
        this.contactCallback = typeof contactCallback === 'function' ? contactCallback : null;
        this.html = this.createHtml();
    }

    createHtml() {
        //containers
        const container = $('<div>').addClass('doctor-element');
        const nameContainer = $('<div>').addClass('doctor-element-name');
        const infoContainer = $('<div>').addClass('doctor-element-info');
        const contactContainer = $('<div>').addClass('doctor-element-contact');
        container.append(contactContainer, infoContainer, nameContainer);

        //right section (name and rank)
        const name = $('<h3>').html(this.doctorObj.fullName);
        const rankContainer = $('<div>').addClass('doctor-rank-container');
        const rankStarsEmpty = $('<img>').attr('src', '/Content/stars_stroke.png').addClass('doctor-rank-stars-empty');
        const rankStarsFull = $('<img>').attr('src', '/Content/stars_fill.png').addClass('doctor-rank-stars-full');
        //each star is 18.5px wide => move stars to the left to fill rank
        rankStarsFull.css('transform', `translateX(-${this.doctorObj.reviews.averageRating * 18.5}px)`);
        const rankNum = $('<span>').html(`(${this.doctorObj.reviews.averageRating}.0)`).addClass('doctor-rank-num');
        rankContainer.append(rankNum, rankStarsEmpty, rankStarsFull);
        nameContainer.append(name, rankContainer);

        //middle section (info)
        const info = $('<ul>');
        const lang = $('<li>').html(
            `<strong>נותן שירות בשפה:</strong> ${this.doctorObj.languageNames.length ? this.doctorObj.languageNames.join(', ') : ''}`
        );
        const article = $('<li>').html(`<strong>לרופא יש כתבה משוייכת:</strong> ${this.doctorObj.hasArticle ? 'כן' : 'לא'}`);
        info.append(lang, article);
        infoContainer.append(info);

        //left section (contact)
        //handle multiple phones or no phones at all
        if (this.phones.length) {
            this.phones.forEach((phone) => {
                const callButton = $('<button>').addClass('doctor-call-button').html(phone);
                contactContainer.append(callButton);
            });
        }
        if (this.contactCallback) {
            //save the handler to remove event listener in case element is removed
            this.#contactButton = $('<button>').addClass('doctor-contact-button').text('צור קשר');
            this.#contactButton.on('click', () => this.contactCallback(this.doctorObj));
            contactContainer.append(this.#contactButton);
        }
        return container;
    }

    extractPhones() {
        const phones = [];
        if (this.doctorObj.phones.length) {
            this.doctorObj.phones.forEach((phone) => {
                //to fix any issues with phone numbers => remove all non numeric chars using regex and add '-'
                const phoneNumeric = phone.number.replace(/\D/g, '');
                // 0 - landline , 1 - mobile
                const hyphenIndex = phone.phoneType == 0 ? 2 : 3;
                const phonefixed = phoneNumeric.substring(0, hyphenIndex) + '-' + phoneNumeric.substring(hyphenIndex);
                phones.push(phonefixed);
            });
        }
        return phones;
    }

    render(parent) {
        if (parent instanceof $) {
            parent.appendChild(this.html);
        }
    }

    remove() {
        //remove element from DOM and remove event listener
        this.#contactButton.off();
        this.html.remove();
    }
};
