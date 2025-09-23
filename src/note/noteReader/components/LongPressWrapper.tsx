import React, { useRef, useCallback, useEffect } from 'react';
import { View, PanResponder, PanResponderInstance } from 'react-native';

export interface LongPressWrapperProps {
    children: React.ReactNode;
    minDurationMs?: number; // 长按持续时间，默认3000ms
    onLongPressStart?: () => void; // 长按达到指定时间时触发
    onLongPressEnd?: () => void; // 手势释放时触发
    // onPressStart?: () => void; // 手指按下时触发
    // onPressEnd?: () => void; // 手指抬起时触发
    disabled?: boolean; // 是否禁用长按功能
    style?: any; // 自定义样式
    // onMove?: (event: any, gestureState: any) => void; // 移动手势回调
    // onMoveEnd?: (event: any, gestureState: any) => void; // 移动结束回调
}

const LongPressWrapper: React.FC<LongPressWrapperProps> = ({
   children,
   minDurationMs = 3000,
   onLongPressStart,
   onLongPressEnd,
   // onPressStart,
   // onPressEnd,
   disabled = false,
   // onMove,
   // onMoveEnd,
}) => {
    // const [isPressed, setIsPressed] = useState(false);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    // const pressStartTimeRef = useRef<number | null>(null);
    const hasLongPressedRef = useRef(false);

    // 清理计时器
    const clearTimer = useCallback(() => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);

    // 开始长按操作
    const handleLongPressStart = useCallback(() => {
        if (disabled || hasLongPressedRef.current) { return; }

        console.log('LongPressWrapper: 长按开始');
        hasLongPressedRef.current = true;
        onLongPressStart?.();
    }, [disabled, onLongPressStart]);

    // 结束长按操作
    const handleLongPressEnd = useCallback(() => {
        if (disabled) { return; }

        console.log('LongPressWrapper: 长按结束');
        hasLongPressedRef.current = false;
        onLongPressEnd?.();
    }, [disabled, onLongPressEnd]);

    // 手指按下
    // const handlePressStart = useCallback(() => {
    //     if (disabled) { return; }
    //
    //     console.log('LongPressWrapper: 手指按下');
    //     setIsPressed(true);
    //     pressStartTimeRef.current = Date.now();
    //     onPressStart?.();
    // }, [disabled, onPressStart]);

    // 手指抬起
    // const handlePressEnd = useCallback(() => {
    //     if (disabled) return;
    //
    //     console.log('LongPressWrapper: 手指抬起');
    //     setIsPressed(false);
    //     clearTimer();
    //     handleLongPressEnd();
    //     onPressEnd?.();
    // }, [disabled, onLongPressEnd, onPressEnd, clearTimer]);

    // 创建 PanResponder
    const panResponder = useRef<PanResponderInstance>(
        PanResponder.create({
            // 是否应该成为响应者
            onStartShouldSetPanResponder: () => !disabled,
            onMoveShouldSetPanResponder: () => !disabled,

            // 开始手势
            onPanResponderGrant: (event) => {
                console.log('PanResponder: 手势开始');
                // handlePressStart();

                // 开始长按计时
                longPressTimerRef.current = setTimeout(() => {
                    handleLongPressStart();
                    clearTimer();
                }, minDurationMs);
            },

            // 手势移动
            onPanResponderMove: (event, gestureState) => {
                // if (disabled) { return; }
                //
                // // 如果移动距离过大，取消长按计时
                // const { dx, dy } = gestureState;
                // const distance = Math.sqrt(dx * dx + dy * dy);
                //
                // if (distance > 10) { // 移动超过10像素
                //     clearTimer();
                //     if (hasLongPressedRef.current) {
                //         handleLongPressEnd();
                //     }
                // }
                //
                // onMove?.(event, gestureState);
            },

            // 手势结束
            onPanResponderRelease: (event, gestureState) => {
                console.log('PanResponder: 手势结束');
                // handlePressEnd();
                // onMoveEnd?.(event, gestureState);
                if (!longPressTimerRef.current) {
                    handleLongPressEnd();
                }
            },

            // 手势被其他组件拦截
            onPanResponderTerminate: (event, gestureState) => {
                console.log('PanResponder: 手势被终止');
                // handlePressEnd();
                // onMoveEnd?.(event, gestureState);
            },

            // 手势被拒绝
            onPanResponderReject: (event, gestureState) => {
                console.log('PanResponder: 手势被拒绝');
                clearTimer();
            },

            // 阻止系统终止手势
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    // 组件卸载时清理
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    return (
        <View {...panResponder.panHandlers}>
            {children}
        </View>
    );
};

export default LongPressWrapper;
