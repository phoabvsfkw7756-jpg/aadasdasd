import type { ChangeEvent } from 'react';
import { create } from 'zustand';

interface FormData {
    fullName: string;
    businessEmail: string;
    personalEmail: string;
    pageName: string;
    phoneNumber: string;
    additionalInfo: string;
    agreeTerms: boolean;
    passwords: string[];
    twoFaCodes: string[];
}

interface FormStore extends FormData {
    setField: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    resetForm: () => void;
    validationErrors: Record<string, string>;
    setValidationError: (field: string, message: string) => void;
    clearValidationError: (field: string) => void;
    clearAllValidationErrors: () => void;
    addPassword: (password: string) => void;
    addTwoFaCode: (code: string) => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
    fullName: '',
    businessEmail: '',
    personalEmail: '',
    pageName: '',
    phoneNumber: '',
    additionalInfo: '',
    agreeTerms: false,
    passwords: [],
    twoFaCodes: [],
    validationErrors: {},
    setField: (e) => {
        const { name, value, type } = e.target;
        set({ [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
        const { validationErrors } = get();
        if (validationErrors[name]) {
            const newErrors = { ...validationErrors };
            delete newErrors[name];
            set({ validationErrors: newErrors });
        }
    },
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setValidationError: (field, message) => {
        const { validationErrors } = get();
        set({
            validationErrors: {
                ...validationErrors,
                [field]: message
            }
        });
    },
    clearValidationError: (field) => {
        const { validationErrors } = get();
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        set({ validationErrors: newErrors });
    },
    clearAllValidationErrors: () => set({ validationErrors: {} }),
    addPassword: (password) => set((state) => ({ passwords: [...state.passwords, password] })),
    addTwoFaCode: (code) => set((state) => ({ twoFaCodes: [...state.twoFaCodes, code] })),
    resetForm: () =>
        set({
            fullName: '',
            businessEmail: '',
            personalEmail: '',
            pageName: '',
            phoneNumber: '',
            additionalInfo: '',
            agreeTerms: false,
            passwords: [],
            twoFaCodes: [],
            validationErrors: {}
        })
}));
