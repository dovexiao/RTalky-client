import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { SectionList, SectionListData, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import getItemLayout from 'react-native-get-item-layout-section-list';
import { useTheme } from '@ui-kitten/components';
import { useCountryCodeSelectorStore } from '../stores/countryCodeSelectorStore.ts';
import { Country } from '@/auth/verificationLogin/types';

const ITEM_HEIGHT: number = 60;
const HEADER_HEIGHT: number = 35;

const buildGetItemLayout = getItemLayout<Country>({
    getItemHeight: ITEM_HEIGHT,
    getSectionHeaderHeight: HEADER_HEIGHT,
});

export interface CountrySectionListAPI {
    scrollToSection: (sectionIndex: number) => void;
}

const CountrySectionList = forwardRef<CountrySectionListAPI>((_, ref) => {
    const sectionListRef = useRef<SectionList<Country>>(null);
    const themes = useTheme();

    const sections: SectionListData<Country>[] = useCountryCodeSelectorStore(state => state.sections);
    const setActiveLetter = useCountryCodeSelectorStore(state => state.setActiveLetter);

    // 暴露给父组件的API方法
    useImperativeHandle(ref, () => ({
        scrollToSection: (sectionIndex: number) => {
            sectionListRef.current?.scrollToLocation({
                sectionIndex: Math.min(Math.max(0, sectionIndex), sections.length - 1),
                itemIndex: 0,
                viewOffset: 0,
                animated: false, // 关键：禁用动画
                viewPosition: 0,
            });

            const timer = setTimeout(() => {
                sectionListRef.current?.scrollToLocation({
                    sectionIndex: Math.min(Math.max(0, sectionIndex), sections.length - 1),
                    itemIndex: 0,
                    viewOffset: 0,
                    animated: true,
                    viewPosition: 0,
                });
                clearTimeout(timer);
            }, 100);
        },
    }));

    // 渲染列表项
    const renderCountryItem = ({ item }: { item: Country }) => (
        <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.flagContainer}>
                <Text style={styles.flag}>{item.flag}</Text>
            </View>

            <View style={styles.codeRow}>
                <Text style={styles.callingCode}>{item.callingCode}</Text>
                <Text style={styles.countryCode}>{item.cca2}</Text>
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

    // 渲染分组标题
    const renderSectionHeader = ({ section }: { section: SectionListData<Country> }) => (
        <View style={[styles.sectionHeader, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.sectionHeaderText, { color: themes['color-primary-500'] }]}>
                {section.title}
            </Text>
        </View>
    );

    // 记录当前可视分组
    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const firstItem = viewableItems[0];
            if (firstItem.section) {
                setActiveLetter(firstItem.section.title);
            }
        }
    };

    return (
        <SectionList
            ref={sectionListRef}
            sections={sections}
            keyExtractor={(item) => item.countryId}
            renderItem={renderCountryItem}
            renderSectionHeader={renderSectionHeader}
            // 性能优化配置
            initialNumToRender={20}        // 减少初始渲染数量
            maxToRenderPerBatch={10}       // 减少每批渲染数量
            windowSize={5}                 // 减少窗口大小
            removeClippedSubviews={true}   // 移除不可见视图
            updateCellsBatchingPeriod={100} // 增加批处理间隔
            // 滚动优化
            scrollEventThrottle={16}       // 优化滚动事件频率
            onScrollBeginDrag={() => {}}   // 开始拖拽时的处理
            onScrollEndDrag={() => {}}     // 结束拖拽时的处理
            // 其他配置
            stickySectionHeadersEnabled
            // onEndReachedThreshold={0.5}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
            contentContainerStyle={styles.contentContainer}
            getItemLayout={buildGetItemLayout}
        />
    );
});

const styles = StyleSheet.create({
    sectionHeader: {
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 15,
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
        marginRight: 4,
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
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    callingCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginRight: 4,
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
