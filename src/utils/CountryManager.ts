import countries, { Country } from 'world-countries';
import { parsePhoneNumberWithError, isValidPhoneNumber, CountryCode, getCountryCallingCode, isSupportedCountry } from 'libphonenumber-js';

export interface CountryInfo {
    flag: string;
    nameEn: string;
    nameZh: string;
    callingCode: string;
    cca2: string; // 国家代码
}

export interface PhoneValidationResult {
    isValid: boolean;
    formattedNumber?: string;
    errorMessage?: string;
}

class CountryManager {
    private countries: CountryInfo[] = [];
    private callingCodeMap: Map<string, CountryInfo> = new Map();

    constructor() {
        this.initializeCountries();
    }

    /**
     * 初始化国家数据
     */
    private initializeCountries(): void {
        this.countries = countries
            .filter((country: Country) => country.independent && country.idd?.root)
            .map(country => {
                let callingCode = '';
                // 获取国家区号
                try {
                    // 使用 libphonenumber-js 获取权威的国家区号
                    if (isSupportedCountry(country.cca2)) {
                        callingCode = `+${getCountryCallingCode(country.cca2 as CountryCode)}`;
                        console.log('callingCode(libphonenumber):', callingCode);
                    } else {
                        const root = country.idd.root || '';
                        const suffix = country.idd.suffixes?.[0] || '';
                        callingCode = `${root}${suffix}`.replace(/\s+/g, '');
                    }
                } catch (error) {
                    const root = country.idd.root || '';
                    const suffix = country.idd.suffixes?.[0] || '';
                    callingCode = `${root}${suffix}`.replace(/\s+/g, '');
                }

                const countryInfo: CountryInfo = {
                    flag: country.flag,
                    nameEn: country.name.common,
                    nameZh: this.getChineseName(country.cca2, country.translations?.zho?.common || country.translations?.zho?.official || country.name.common),
                    callingCode: callingCode,
                    cca2: country.cca2,
                };

                // 建立区号映射
                this.callingCodeMap.set(callingCode, countryInfo);

                return countryInfo;
            })
            .sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    }

    /**
     * 获取中文国家名称（带补充映射）
     */
    private getChineseName(countryCode: string, fallbackName: string): string {
        // 补充一些常见但可能缺失的中文名称映射
        const supplementMap: { [key: string]: string } = {
            'CN': '中国',
            'US': '美国',
            'JP': '日本',
            'KR': '韩国',
            'GB': '英国',
            'DE': '德国',
            'FR': '法国',
            'IT': '意大利',
            'ES': '西班牙',
            'RU': '俄罗斯',
            'IN': '印度',
            'BR': '巴西',
            'CA': '加拿大',
            'AU': '澳大利亚',
            'SG': '新加坡',
            'TH': '泰国',
            'VN': '越南',
            'MY': '马来西亚',
            'ID': '印度尼西亚',
            'PH': '菲律宾',
            'HK': '香港',
            'TW': '台湾',
            'MO': '澳门',
            'TR': '土耳其',
            'SA': '沙特阿拉伯',
            'AE': '阿联酋',
            'ZA': '南非',
            'EG': '埃及',
            'NG': '尼日利亚',
            'KE': '肯尼亚',
            'MX': '墨西哥',
            'AR': '阿根廷',
            'CL': '智利',
            'PE': '秘鲁',
            'CO': '哥伦比亚',
            'VE': '委内瑞拉',
            'NL': '荷兰',
            'BE': '比利时',
            'CH': '瑞士',
            'AT': '奥地利',
            'SE': '瑞典',
            'NO': '挪威',
            'DK': '丹麦',
            'FI': '芬兰',
            'PL': '波兰',
            'CZ': '捷克',
            'HU': '匈牙利',
            'RO': '罗马尼亚',
            'BG': '保加利亚',
            'GR': '希腊',
            'PT': '葡萄牙',
            'IE': '爱尔兰',
            'NZ': '新西兰',
            'IL': '以色列',
            'IR': '伊朗',
            'IQ': '伊拉克',
            'AF': '阿富汗',
            'PK': '巴基斯坦',
            'BD': '孟加拉国',
            'LK': '斯里兰卡',
            'NP': '尼泊尔',
            'MM': '缅甸',
            'KH': '柬埔寨',
            'LA': '老挝',
            'MN': '蒙古',
            'KZ': '哈萨克斯坦',
            'UZ': '乌兹别克斯坦',
            'KG': '吉尔吉斯斯坦',
            'TJ': '塔吉克斯坦',
            'TM': '土库曼斯坦',
            'AZ': '阿塞拜疆',
            'AM': '亚美尼亚',
            'GE': '格鲁吉亚',
            'UA': '乌克兰',
            'BY': '白俄罗斯',
            'LT': '立陶宛',
            'LV': '拉脱维亚',
            'EE': '爱沙尼亚',
            'MD': '摩尔多瓦',
            'SK': '斯洛伐克',
            'SI': '斯洛文尼亚',
            'HR': '克罗地亚',
            'BA': '波黑',
            'RS': '塞尔维亚',
            'ME': '黑山',
            'MK': '北马其顿',
            'AL': '阿尔巴尼亚',
            'XK': '科索沃',
            'CY': '塞浦路斯',
            'MT': '马耳他',
            'IS': '冰岛',
            'LU': '卢森堡',
            'LI': '列支敦士登',
            'MC': '摩纳哥',
            'SM': '圣马力诺',
            'VA': '梵蒂冈',
            'AD': '安道尔',
        };

        // 优先使用补充映射，然后使用fallback名称
        return supplementMap[countryCode] || fallbackName;
    }

    /**
     * 获取所有国家信息
     */
    getAllCountries(): CountryInfo[] {
        return [...this.countries];
    }

    /**
     * 根据区号进行手机号格式校验
     */
    validatePhoneNumber(callingCode: string, phoneNumber: string): PhoneValidationResult {
        try {
            // 移除区号前缀的+号
            const cleanCallingCode = callingCode.replace('+', '');
            const countryInfo = this.callingCodeMap.get(cleanCallingCode);

            if (!countryInfo) {
                return {
                    isValid: false,
                    errorMessage: '无效的国家区号',
                };
            }

            // 移除所有非数字字符
            const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

            // 基本长度校验
            if (cleanPhoneNumber.length < 4 || cleanPhoneNumber.length > 15) {
                return {
                    isValid: false,
                    errorMessage: '手机号长度无效',
                };
            }

            // 构建完整的国际号码
            const fullNumber = `+${cleanCallingCode}${cleanPhoneNumber}`;

            // 使用 libphonenumber-js 进行验证
            try {
                const phoneNumberObj = parsePhoneNumberWithError(fullNumber);

                if (phoneNumberObj && phoneNumberObj.isValid()) {
                    return {
                        isValid: true,
                        formattedNumber: phoneNumberObj.formatInternational(),
                    };
                }
            } catch (parseError) {
                // 如果解析失败，尝试使用国家代码进行验证
                const countryCode = countryInfo.cca2;
                if (isValidPhoneNumber(fullNumber, countryCode as any)) {
                    try {
                        const parsedNumber = parsePhoneNumberWithError(fullNumber, countryCode as any);
                        return {
                            isValid: true,
                            formattedNumber: parsedNumber?.formatInternational() || fullNumber,
                        };
                    } catch (countryParseError) {
                        // 继续到错误处理
                    }
                }
            }

            return {
                isValid: false,
                errorMessage: this.getValidationErrorMessage(countryInfo.nameZh, cleanPhoneNumber),
            };
        } catch (error) {
            return {
                isValid: false,
                errorMessage: '手机号格式无效',
            };
        }
    }

    /**
     * 获取验证错误信息
     */
    private getValidationErrorMessage(countryName: string, phoneNumber: string): string {
        // 根据手机号长度提供更具体的错误信息
        if (phoneNumber.length < 7) {
            return `${countryName}手机号过短，请检查输入`;
        } else if (phoneNumber.length > 15) {
            return `${countryName}手机号过长，请检查输入`;
        } else if (!/^\d+$/.test(phoneNumber)) {
            return `${countryName}手机号只能包含数字`;
        } else {
            return `${countryName}手机号格式无效，请检查输入`;
        }
    }

    /**
     * 模糊匹配国家信息
     */
    searchCountries(query: string): CountryInfo[] {
        if (!query || query.trim().length === 0) {
            return this.getAllCountries();
        }

        const lowerQuery = query.toLowerCase().trim();

        return this.countries.filter(country =>
            country.nameEn.toLowerCase().includes(lowerQuery) ||
            country.nameZh.includes(query) ||
            country.callingCode.includes(query) ||
            country.cca2.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * 根据区号获取国家信息
     */
    getCountryByCallingCode(callingCode: string): CountryInfo | null {
        const cleanCallingCode = callingCode.replace('+', '');
        return this.callingCodeMap.get(cleanCallingCode) || null;
    }

    /**
     * 根据国家代码获取国家信息
     */
    getCountryByCode(countryCode: string): CountryInfo | null {
        return this.countries.find(country =>
            country.cca2.toLowerCase() === countryCode.toLowerCase()
        ) || null;
    }

    /**
     * 格式化手机号（使用 libphonenumber-js）
     */
    formatPhoneNumber(callingCode: string, phoneNumber: string, format: 'INTERNATIONAL' | 'NATIONAL' | 'E164' = 'INTERNATIONAL'): string | null {
        try {
            const cleanCallingCode = callingCode.replace('+', '');
            const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
            const fullNumber = `+${cleanCallingCode}${cleanPhoneNumber}`;

            const phoneNumberObj = parsePhoneNumberWithError(fullNumber);
            if (phoneNumberObj && phoneNumberObj.isValid()) {
                switch (format) {
                    case 'INTERNATIONAL':
                        return phoneNumberObj.formatInternational();
                    case 'NATIONAL':
                        return phoneNumberObj.formatNational();
                    case 'E164':
                        return phoneNumberObj.format('E.164');
                    default:
                        return phoneNumberObj.formatInternational();
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * 获取手机号的国家信息（通过解析手机号）
     */
    getCountryFromPhoneNumber(phoneNumber: string): CountryInfo | null {
        try {
            const phoneNumberObj = parsePhoneNumberWithError(phoneNumber);
            if (phoneNumberObj && phoneNumberObj.isValid()) {
                const countryCode = phoneNumberObj.country;
                if (countryCode) {
                    return this.getCountryByCode(countryCode);
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * 检查手机号是否为有效格式（简化版本）
     */
    isValidPhoneNumber(phoneNumber: string, countryCode?: string): boolean {
        try {
            if (countryCode) {
                return isValidPhoneNumber(phoneNumber, countryCode as any);
            } else {
                return isValidPhoneNumber(phoneNumber);
            }
        } catch (error) {
            return false;
        }
    }
}

// 导出单例实例
export const countryManager = new CountryManager();
export default countryManager;
