import React, { useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { LinearTransition, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export interface ToastAPI {
    show: (content?: string, options?: ToastOptions) => void;
    active: () => void;
    hideAll: () => void;
}

interface ToastOptions {
    position?: 'top' | 'bottom';
    duration?: number;
    type?: 'success' | 'warning' | 'info' | 'danger' | string;
    contentConfig?: any;
    render?: React.ComponentType<any>;
    dismissible?: boolean;
}

interface ToastMessage {
    id: string;
    content?: string;
    position: 'top' | 'bottom';
    duration: number;
    timestamp: number;
    type?: string;
    contentConfig?: any;
    render?: React.ComponentType<any>;
    dismissible?: boolean;
}

interface ToastContainerProps {
    maxListSize?: number;
    typeTemplates?: Record<string, React.ComponentType<any>>;
}

const ToastContainer = React.forwardRef<ToastAPI, ToastContainerProps>(({
    maxListSize = 5,
    typeTemplates,
}, ref) => {
    // 展示队列
    const [topList, setTopList] = useState<ToastMessage[]>([]);
    const [bottomList, setBottomList] = useState<ToastMessage[]>([]);

    // 等待队列
    const [topWaitingQueue, setTopWaitingQueue] = useState<ToastMessage[]>([]);
    const [bottomWaitingQueue, setBottomWaitingQueue] = useState<ToastMessage[]>([]);

    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const [enabled, setEnabled] = useState<boolean>(false);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        show: (content: string = '', options: ToastOptions = {}) => {
            const { position = 'top', duration = 1500, type, contentConfig, render, dismissible = false } = options;

            const message: ToastMessage = {
                id: `toast_${Date.now()}_${Math.random()}`,
                content,
                position,
                duration,
                timestamp: Date.now(),
                type: type,
                contentConfig: contentConfig,
                render: render,
                dismissible: dismissible,
            };

            // 先加入等待队列
            if (position === 'top') {
                setTopWaitingQueue(prev => [...prev, message]);
            } else {
                setBottomWaitingQueue(prev => [...prev, message]);
            }
        },
        active: () => setEnabled(true),
        hideAll: () => {
            // 清除所有定时器
            timersRef.current.forEach(timer => clearTimeout(timer));
            timersRef.current.clear();

            // 清空所有队列
            setTopList([]);
            setBottomList([]);
            setTopWaitingQueue([]);
            setBottomWaitingQueue([]);
        },
    }));

    // 隐藏单个消息
    const hideMessage = (messageId: string) => {
        // 清除定时器
        const timer = timersRef.current.get(messageId);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(messageId);
        }

        // 从展示队列中移除
        setTopList(prev => prev.filter(msg => msg.id !== messageId));
        setBottomList(prev => prev.filter(msg => msg.id !== messageId));
    };

    // 将等待队列的消息移动到展示队列
    const moveWaitingToDisplay = useCallback((position: 'top' | 'bottom') => {
        if (position === 'top') {
            const topListLength = topList.length;
            if (topListLength >= maxListSize) return;
            const availableSlots = maxListSize - topListLength;
            const messagesToMove = topWaitingQueue.slice(0, availableSlots);

            messagesToMove.forEach(message => {
                const timer = setTimeout(() => {
                    hideMessage(message.id);
                }, message.duration);
                timersRef.current.set(message.id, timer);
            });

            setTopWaitingQueue(waiting => waiting.slice(availableSlots));
            setTopList(prev => [...prev, ...messagesToMove]);
        } else {
            const bottomListLength = bottomList.length;
            if (bottomListLength >= maxListSize) return;

            const availableSlots = maxListSize - bottomListLength;
            const messagesToMove = bottomWaitingQueue.slice(0, availableSlots);

            messagesToMove.forEach(message => {
                const timer = setTimeout(() => {
                    hideMessage(message.id);
                }, message.duration);
                timersRef.current.set(message.id, timer);
            });

            setBottomWaitingQueue(waiting => waiting.slice(availableSlots));
            setBottomList(prev => [...prev, ...messagesToMove]);
        }
    }, [maxListSize, topList, topWaitingQueue, bottomList, bottomWaitingQueue]);

    // 监听顶部队列变化，自动补充等待队列
    useEffect(() => {
        if (enabled && topList.length < maxListSize && topWaitingQueue.length > 0) {
            moveWaitingToDisplay('top');
        }
    }, [topList, topWaitingQueue, maxListSize, enabled]);

    // 监听底部队列变化，自动补充等待队列
    useEffect(() => {
        if (enabled && bottomList.length < maxListSize && bottomWaitingQueue.length > 0) {
            moveWaitingToDisplay('bottom');
        }
    }, [bottomList, bottomWaitingQueue, maxListSize, enabled]);

    // 清理定时器
    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach(timer => clearTimeout(timer));
            timers.clear();
        };
    }, []);

    // 组合动画：从上方滑入 + 淡入 + 缩放
    const EnteringAnimation = () => {
        'worklet';
        return {
            initialValues: {
                opacity: 0,
                transform: [
                    { translateY: -10 },
                    { scale: 0.8 },
                ],
            },
            animations: {
                opacity: withTiming(1, { duration: 300 }),
                transform: [
                    { translateY: withTiming(0, { duration: 300 }) },
                    { scale: withTiming(1, { duration: 300 }) },
                ],
            },
        };
    };

    // 组合动画：向上滑出 + 淡出 + 缩放
    const ExitingAnimation = () => {
        'worklet';
        return {
            initialValues: {
                opacity: 1,
                transform: [
                    { translateY: 0 },
                    { scale: 1 },
                ],
            },
            animations: {
                opacity: withTiming(0, { duration: 200 }),
                transform: [
                    { translateY: withTiming(-10, { duration: 200 }) },
                    { scale: withTiming(0.8, { duration: 200 }) },
                ],
            },
        };
    };

    const defaultTemplates: { [key: string]: React.FC<any>} = {
        'success': ({ text }) => (
            <View style={[styles.templateContainer, { backgroundColor: '#71E85F' }]}>
                <Text style={styles.templateText}>{text}</Text>
            </View>
        ),
        'info': ({ text }) => (
            <View style={[styles.templateContainer, { backgroundColor: '#909399' }]}>
                <Text style={styles.templateText}>{text}</Text>
            </View>
        ),
        'warning': ({ text }) => (
            <View style={[styles.templateContainer, { backgroundColor: '#F9CC36' }]}>
                <Text style={styles.templateText}>{text}</Text>
            </View>
        ),
        'danger': ({ text }) => (
            <View style={[styles.templateContainer, { backgroundColor: '#FF5956' }]}>
                <Text style={styles.templateText}>{text}</Text>
            </View>
        ),
    };

    // 合并内置模板和自定义模板
    const getTemplate = (type: string) => {
        if (typeTemplates?.[type]) {
            return typeTemplates[type];
        }
        return defaultTemplates[type] || defaultTemplates.info;
    };

    const renderContent = (message: ToastMessage) => {
        // 优先使用 render
        if (message.render) {
            const RenderComponent = message.render;
            return <RenderComponent {...message.contentConfig} />;
        }

        // 使用 type 模板
        if (message.type) {
            const TemplateComponent = getTemplate(message.type);
            const props = { text: message.content, ...message.contentConfig };
            return <TemplateComponent { ...props } />;
        }

        // 默认样式
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{message.content}</Text>
            </View>
        );
    };

    // 处理点击隐藏
    const handleMessagePress = (message: ToastMessage) => {
        if (message.dismissible !== false) { // 默认可点击隐藏
            hideMessage(message.id); // 隐藏消息
        }
    };

    // 渲染单个消息
    const renderMessage = (message: ToastMessage) => {
        const content = renderContent(message);

        return (
            <Animated.View
                key={message.id}
                layout={LinearTransition}
                entering={EnteringAnimation}
                exiting={ExitingAnimation}
                style={styles.messageWrapper}
            >
                <Pressable onPress={() => handleMessagePress(message)}>
                    {content}
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* 顶部队列 */}
            <View style={styles.topList}>
                {topList.map(renderMessage)}
            </View>

            {/* 底部队列 */}
            <View style={styles.bottomList}>
                {bottomList.map(renderMessage)}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // pointerEvents: 'none',
    },
    topList: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        alignItems: 'center',
        gap: 5,
    },
    bottomList: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        alignItems: 'center',
        gap: 5,
    },
    messageWrapper: {
        maxWidth: width * 0.8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    messageContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    templateContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    templateText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default ToastContainer;
