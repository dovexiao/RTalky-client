import { CountryInfo } from '@/auth/verificationLogin/utils';
import { Country, CountryListItem, SectionIndexMap } from '@/auth/verificationLogin/types';
import { ALPHABET } from '@/auth/verificationLogin/components/CountryAlphabetNavigator.tsx';

export interface FlashListData {
    data: CountryListItem[];
    sectionIndexMap: SectionIndexMap;
}

const generateCountrySectionData = (countries: CountryInfo[]): FlashListData => {
    const flatListData: CountryListItem[] = [];
    const sectionIndexMap: SectionIndexMap = {};
    const groups: { [key: string]: Country[] } = {};

    // 初始化分组
    ALPHABET.forEach(letter => {
        groups[letter] = [];
    });

    const letters = ALPHABET.join('').slice(0, -1);

    // 按字母分组国家数据
    countries.forEach(country => {
        const firstLetter = country.nameEn.charAt(0).toUpperCase();
        if (letters.includes(firstLetter)) {
            groups[firstLetter].push({
                countryId: country.cca2,
                sectionLetters: firstLetter,
                ...country,
            });
        } else {
            groups['#'].push({
                countryId: country.cca2,
                sectionLetters: '#',
                ...country,
            });
        }
    });

    // 生成扁平列表数据
    ALPHABET.forEach((letter) => {
        const sortedCountries = groups[letter].sort((a, b) => a.nameEn.localeCompare(b.nameEn));

        // 只有当该字母有数据时才添加header和countries
        if (sortedCountries.length > 0) {
            // 添加header项
            const headerIndex = flatListData.length;
            flatListData.push(letter);

            // 记录该字母在扁平列表中的索引位置
            sectionIndexMap[letter] = headerIndex;

            // 添加该字母下的所有国家
            flatListData.push(...sortedCountries);
        }
    });

    return {
        data: flatListData,
        sectionIndexMap: sectionIndexMap,
    };
};

export default generateCountrySectionData;
