import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useTheme } from '@ui-kitten/components';
import { useCountryCodeSelectorStore, useVerificationLoginStore } from '@/auth/verificationLogin/stores';
import { CountryListItem } from '@/auth/verificationLogin/types';

const ITEM_HEIGHT: number = 60;
const HEADER_HEIGHT: number = 45;

export interface CountrySectionListAPI {
    scrollToSection: (letter: string) => void;
}

const CountrySectionList = forwardRef<CountrySectionListAPI>((_, ref) => {
    const flashListRef = useRef<FlashListRef<CountryListItem>>(null);
    const themes = useTheme();

    const flashListData = useCountryCodeSelectorStore(state => state.flashListData);
    const sectionIndexMap = useCountryCodeSelectorStore(state => state.sectionIndexMap);
    const selectedCallingCode = useVerificationLoginStore(state => state.selectedCallingCode);
    const selectedCCA2 = useVerificationLoginStore(state => state.selectedCCA2);
    const { setActiveLetter } = useCountryCodeSelectorStore.getState();
    const { onSelectedCallingCode } = useVerificationLoginStore.getState();


    // 暴露给父组件的API方法
    useImperativeHandle(ref, () => ({
        scrollToSection: (letter: string) => {
            const targetIndex = sectionIndexMap[letter];
            if (targetIndex !== undefined && flashListRef.current) {
                flashListRef.current.scrollToIndex({
                    index: targetIndex,
                    animated: true,
                    viewPosition: 0,
                });
            }
        },
    }));

    // 渲染列表项
    const renderItem = ({ item }: { item: CountryListItem }) => {
        if (typeof item === 'string') {
            // 渲染分组标题
            return (
                <View style={styles.sectionHeader}>
                    <Text style={[
                        styles.sectionHeaderText,
                        { color: themes['color-primary-500'] },
                    ]}>
                        {item}
                    </Text>
                </View>
            );
        } else {
            // 检查是否为选中项
            const isSelected = item.callingCode === selectedCallingCode && item.cca2 === selectedCCA2;

            return (
                <TouchableOpacity
                    style={[
                        styles.itemContainer,
                        isSelected && { backgroundColor: themes['color-primary-100'] },
                    ]}
                    onPress={() => {
                        onSelectedCallingCode(item.callingCode, item.cca2, item.sectionLetters);
                    }}
                >
                    <View style={styles.flagContainer}>
                        <Text style={styles.flag}>{item.flag}</Text>
                    </View>

                    <View style={styles.codeRow}>
                        <Text style={styles.callingCode}>{item.callingCode}</Text>
                        <Text style={[
                            styles.countryCode,
                            isSelected && { color: themes['color-primary-500'], backgroundColor: themes['color-primary-200'] },
                        ]}>
                            {item.cca2}
                        </Text>
                    </View>

                    <View style={styles.countryInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.countryNameZh} numberOfLines={1}>
                                {item.nameZh}
                            </Text>
                            <Text style={styles.countryNameEn} numberOfLines={1}>
                                {item.nameEn}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    // 记录当前可视分组
    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const viewableItem = viewableItems[0];
            const item = viewableItem.item as CountryListItem;
            if (typeof item === 'string') {
                setActiveLetter(item);
            } else {
                setActiveLetter(item.sectionLetters);
            }
        }
    };

    const stickyHeaderIndices = flashListData
        .map((item, index) => {
            if (typeof item === 'string') {
                return index;
            } else {
                return null;
            }
        })
        .filter((item) => item !== null) as number[];

    return (
        <FlashList
            ref={flashListRef}
            data={flashListData}
            keyExtractor={(item, index) => index.toString()}
            initialScrollIndex={0}
            renderItem={renderItem}
            // getItemType={(item: CountryListItem) => typeof item === 'string' ? 'sectionHeader' : 'row'}
            // 性能优化配置
            maxItemsInRecyclePool={20}
            removeClippedSubviews={true}
            // 滚动优化
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {}}
            onScrollEndDrag={() => {}}
            // 其他配置
            stickyHeaderIndices={stickyHeaderIndices}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
            contentContainerStyle={styles.contentContainer}
            // overrideItemLayout={(layout, item) => {
            //     layout.span = item.span;
            // }}
        />
    );
});

const styles = StyleSheet.create({
    sectionHeader: {
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: '#FFF',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    flagContainer: {
        width: 40,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    flag: {
        fontSize: 24,
    },
    countryInfo: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    nameRow: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 15,
    },
    countryNameZh: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginRight: 8,
    },
    countryNameEn: {
        fontSize: 14,
        color: '#666666',
    },
    codeRow: {
        minWidth: 47,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    callingCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    countryCode: {
        fontSize: 12,
        color: '#999999',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});

export default CountrySectionList;
