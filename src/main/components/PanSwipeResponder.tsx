import React, { useRef } from "react";
import { PanResponder, View } from "react-native";

interface PanSwipeResponderProps  {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
    minVelocity?: number;
    edgeThreshold?: number;
}

export const PanSwipeResponder = ({
    children,
    onSwipeLeft = () => {},
    onSwipeRight = () => {},
    threshold = 50,
    minVelocity = 0.5,
    edgeThreshold = 20,
}: PanSwipeResponderProps ) => {
    const panResponder = useRef(
        PanResponder.create({
            // 是否成为手势响应者
            onStartShouldSetPanResponderCapture: () => false,
            // // 从屏幕边缘开始捕获手势
            // onStartShouldSetPanResponderCapture: (evt) => {
            //     if (direction === "right") {
            //         return evt.nativeEvent.locationX <= edgeThreshold;
            //     } else {
            //         const { width } = evt.nativeEvent.layout;
            //         return evt.nativeEvent.locationX >= width - edgeThreshold;
            //     }
            // },
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 只响应水平滑动
                const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
                const isSignificant = Math.abs(gestureState.dx) > 10; // 初始阈值避免过于敏感
                return isHorizontal && isSignificant;
            },

            // 手势移动时
            onPanResponderMove: () => {},

            // 手势释放时
            onPanResponderRelease: (_, gestureState) => {
                const { dx, vx } = gestureState;

                // 判断是否为有效的滑动手势
                const isLeftSwipe = dx < -threshold;
                const isRightSwipe = dx > threshold;
                const hasMinVelocity = Math.abs(vx) > minVelocity;
                const isValidLeftSwipe = isLeftSwipe || (dx < 0 && hasMinVelocity);
                const isValidRightSwipe = isRightSwipe || (dx > 0 && hasMinVelocity);

                if (isValidLeftSwipe) {
                    onSwipeLeft();
                }

                if (isValidRightSwipe) {
                    onSwipeRight();
                }
            },

            // 手势被系统终止时
            onPanResponderTerminate: () => {},

            // 拒绝成为响应者
            onPanResponderReject: () => {},

            // 阻止系统终止手势
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {children}
        </View>
    );
};
