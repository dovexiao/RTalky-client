import { CountryInfo } from '@utils/CountryManager.ts';
import { SectionListData } from 'react-native';
import { Country } from '@/auth/verificationLogin/types';
import { ALPHABET } from '@/auth/verificationLogin/components/CountryAlphabetNavigator.tsx';

const generateCountrySectionData = (countries: CountryInfo[]): SectionListData<Country>[] => {
    const sectionListData: SectionListData<Country>[] = [];
    const groups: { [key: string]: Country[] } = {};
    ALPHABET.forEach(letter => {
        groups[letter] = [];
    });
    const letters = ALPHABET.join('').slice(0, -1);
    countries.forEach(country => {
        const firstLetter = country.nameEn.charAt(0).toUpperCase();
        if (letters.includes(firstLetter)) {
            groups[firstLetter].push({
                countryId: country.cca2,
                ...country,
            });
        } else {
            groups['#'].push({
                countryId: country.cca2,
                ...country,
            });
        }
    });

    ALPHABET.forEach(letter => {
        sectionListData.push({
            title: letter,
            data: groups[letter].sort((a, b) => a.nameEn.localeCompare(b.nameEn)),
        });
    });

    return sectionListData;
};

export default generateCountrySectionData;
