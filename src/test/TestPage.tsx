import React, { useState, useRef } from 'react';
import {View, Text, StyleSheet, Alert, Button, ScrollView} from 'react-native';
import LongPressWrapper from '@root/src/note/noteReader/components/LongPressWrapper';

const LongPressWrapperTest: React.FC = () => {
    // 测试状态
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [longPressCount, setLongPressCount] = useState(0);
    const [endCount, setEndCount] = useState(0);
    const [testLog, setTestLog] = useState<string[]>([]);

    // 计时器引用，用于测试
    const testTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [testTime, setTestTime] = useState(0);

    // 添加日志
    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        setTestLog(prev => [...prev.slice(-9), logMessage]); // 只保留最近10条日志
        console.log(logMessage);
    };

    // 长按开始回调
    const handleLongPressStart = () => {
        addLog('✅ 开始测试计时');
        setIsLongPressing(true);
        setLongPressCount(prev => prev + 1);
        startTestTimer();
        // 显示提示
        console.log('长按开始', '长按时间到了，开始执行操作！');
    };

    // 长按结束回调
    const handleLongPressEnd = () => {
        addLog('❌ 长按结束回调被触发');
        setIsLongPressing(false);
        setEndCount(prev => prev + 1);
        stopTestTimer();
        // 显示提示
        console.log('长按结束', '手势释放，停止执行操作！');
    };

    // 开始测试计时
    const startTestTimer = () => {
        if (testTimerRef.current) {
            clearInterval(testTimerRef.current);
        }
        setTestTime(0);
        testTimerRef.current = setInterval(() => {
            setTestTime(prev => prev + 0.1);
        }, 100);
    };

    // 停止测试计时
    const stopTestTimer = () => {
        if (testTimerRef.current) {
            clearInterval(testTimerRef.current);
            testTimerRef.current = null;
        }
    };

    // 重置测试
    const resetTest = () => {
        setIsLongPressing(false);
        setLongPressCount(0);
        setEndCount(0);
        setTestLog([]);
        setTestTime(0);
        stopTestTimer();
        addLog('🔄 测试已重置');
    };

    // 清理计时器
    React.useEffect(() => {
        return () => {
            if (testTimerRef.current) {
                clearInterval(testTimerRef.current);
            }
        };
    }, []);

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>LongPressWrapper 测试</Text>

            {/* 测试状态显示 */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    长按状态: {isLongPressing ? '🟢 进行中' : '⚪ 未进行'}
                </Text>
                <Text style={styles.statusText}>
                    长按开始次数: {longPressCount}
                </Text>
                <Text style={styles.statusText}>
                    长按结束次数: {endCount}
                </Text>
                <Text style={styles.statusText}>
                    测试时间: {testTime.toFixed(1)}s
                </Text>
            </View>

            {/* 测试按钮 */}
            <View style={styles.buttonContainer}>
                <Button title="重置测试" onPress={resetTest} />
            </View>

            {/* 长按测试区域 */}
            <View style={styles.testArea}>
                <Text style={styles.instructionText}>
                    长按下面的区域 2 秒测试长按功能
                </Text>

                <View style={styles.longPressArea}>
                    <LongPressWrapper
                        minDurationMs={2000} // 2秒长按
                        onLongPressStart={handleLongPressStart}
                        onLongPressEnd={handleLongPressEnd}
                        // style={styles.longPressArea}
                    >
                        <View style={[
                            styles.longPressBox,
                            isLongPressing && styles.longPressBoxActive,
                        ]}>
                            <Text style={styles.longPressText}>
                                {isLongPressing ? '长按中...' : '长按我 2 秒'}
                            </Text>
                            {isLongPressing && (
                                <Text style={styles.timerText}>
                                    {testTime.toFixed(1)}s
                                </Text>
                            )}
                        </View>
                    </LongPressWrapper>
                </View>
            </View>

            {/* 日志显示 */}
            <View style={styles.logContainer}>
                <Text style={styles.logTitle}>测试日志:</Text>
                {testLog.map((log, index) => (
                    <Text key={index} style={styles.logText}>
                        {log}
                    </Text>
                ))}
            </View>

            {/* 测试说明 */}
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>测试说明:</Text>
                <Text style={styles.instructionItem}>
                    1. 长按红色区域 2 秒，观察状态变化
                </Text>
                <Text style={styles.instructionItem}>
                    2. 松开手指，观察长按结束回调
                </Text>
                <Text style={styles.instructionItem}>
                    3. 检查外部组件状态是否正确更新
                </Text>
                <Text style={styles.instructionItem}>
                    4. 查看控制台日志输出
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    statusContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    testArea: {
        alignItems: 'center',
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    longPressArea: {
        width: 200,
        height: 200,
    },
    longPressBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ff6b6b',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    longPressBoxActive: {
        backgroundColor: '#4ecdc4',
        transform: [{ scale: 1.05 }],
    },
    longPressText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    timerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    logContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        maxHeight: 200,
    },
    logTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    logText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        fontFamily: 'monospace',
    },
    instructionContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    instructionItem: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
});

export default LongPressWrapperTest;
