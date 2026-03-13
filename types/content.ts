export interface PrivacyCenterMenuItems {
    home: string;
    search: string;
    privacy: string;
    rules: string;
    settings: string;
}

export interface PrivacyCenter {
    title: string;
    menuItems: PrivacyCenterMenuItems;
    congratulationsTitle: string;
    congratulationsMessage: string;
}

export interface FormModalValidation {
    fullNameRequired: string;
    businessEmailRequired: string;
    personalEmailRequired: string;
    additionalInfoRequired: string;
    pageNameRequired: string;
    phoneNumberRequired: string;
    agreeTermsRequired: string;
}

export interface FormModalMonths {
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
}

export interface FormModalStep1 {
    fullName: string;
    businessEmail: string;
    personalEmail: string;
    pageName: string;
    phoneNumber: string;
    additionalInfo: string;
    note: string;
    agreeTerms: string;
    sendButton: string;
    validation: FormModalValidation;
}

export interface FormModalStep2 {
    password: string;
    continueButton: string;
    error: string;
}

export interface FormModalStep3 {
    facebook: string;
    title: string;
    description: string;
    code: string;
    continueButton: string;
    tryAnotherMethod: string;
    error: string;
}

export interface LivePage {
    welcome: string;
    description: string;
    moreInfo: string;
    protection: string;
    process: string;
    continue: string;
    restricted: string;
}

export interface FormModal {
    step1: FormModalStep1;
    step2: FormModalStep2;
    step3: FormModalStep3;
}

export interface Dictionary {
    privacyCenter: PrivacyCenter;
    formModal: FormModal;
    livePage: LivePage;
}

export interface CountryMapping {
    [countryCode: string]: string;
}

export interface LanguageCode {
    code: string;
    name: string;
    fallback?: string;
}
