import React, { useState } from 'react';
import {
    Platform,
    TextInput,
    View,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TextInputProps,
    Text,
    Dimensions,
} from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const { width } = Dimensions.get('window');

// 默认尺寸配置
const DEFAULT_DIMENSIONS = {
    4: { width: 55, height: 55, margin: 10 },
    5: { width: 55, height: 55, margin: 7 },
    6: { width: 50, height: 50, margin: 4 },
    7: { width: 45, height: 45, margin: 2 },
};

// 类型定义
type CellCount = 4 | 5 | 6 | 7;

interface VerificationCodeInputProps {
    /** 验证码位数（4-7位） */
    cellCount: CellCount;
    /** 输入完成回调函数 */
    onFinish: (code: string) => void;
    /** 光标闪烁延迟（毫秒），默认500 */
    cursorDelay?: number;
    /** 光标符号，默认'|' */
    cursorSymbol?: string;
    /** 自定义单元格宽度 */
    cellWidth?: number;
    /** 自定义单元格高度 */
    cellHeight?: number;
    /** 自定义单元格间距 */
    cellMargin?: number;
    /** 容器样式 */
    containerStyle?: ViewStyle;
    /** 单元格样式 */
    cellStyle?: ViewStyle;
    /** 文本样式 */
    textStyle?: TextStyle;
    /** 激活状态边框颜色 */
    activeColor?: string;
    /** 非激活状态边框颜色 */
    inactiveColor?: string;
    /** 是否可编辑，默认true */
    editable?: boolean;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
    cellCount,
    onFinish,
    cursorDelay = 500,
    cursorSymbol = '|',
    cellWidth,
    cellHeight,
    cellMargin,
    containerStyle,
    cellStyle,
    textStyle,
    activeColor = '#4285F4',
    inactiveColor = '#E8E8E8',
    editable = true,
}) => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount }) as React.RefObject<TextInput>;
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    // 获取最终尺寸值
    const dimensions = DEFAULT_DIMENSIONS[cellCount];
    const finalWidth = cellWidth ?? dimensions.width;
    const finalHeight = cellHeight ?? dimensions.height;
    const finalMargin = cellMargin ?? dimensions.margin;

    // 处理输入变化
    const handleChange = (newValue: string) => {
        setValue(newValue);
        if (newValue.length === cellCount) {
            onFinish(newValue);
        }
    };

    // 自动完成设置
    const autoComplete = Platform.select<TextInputProps['autoComplete']>({
        android: 'sms-otp',
        default: 'one-time-code',
    });

    return (
        <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={handleChange}
            cellCount={cellCount}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={autoComplete}
            RootComponent={View}
            rootStyle={[styles.codeFieldRoot, containerStyle]}
            renderCell={({ index, symbol, isFocused }) => (
                <View
                    key={index}
                    style={[
                        styles.cell,
                        {
                            width: finalWidth,
                            height: finalHeight,
                            marginHorizontal: finalMargin,
                            borderColor: isFocused ? activeColor : inactiveColor,
                        },
                        cellStyle,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                >
                    <Text style={[styles.cellText, textStyle]}>
                        {symbol || (isFocused && <Cursor delay={cursorDelay} cursorSymbol={cursorSymbol} />)}
                    </Text>
                </View>
            )}
            disableFullscreenUI={true}
            editable={editable}
        />
    );
};

// 基础样式
const styles = StyleSheet.create({
    codeFieldRoot: {
        justifyContent: 'center',
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#F7F7F7',
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
        color: '#000',
    },
});
