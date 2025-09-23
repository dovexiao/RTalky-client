import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, PanResponder, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withDelay,
    runOnJS, cancelAnimation, Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { CircularProgressBar } from '@ui-kitten/components';
import { useUnifiedTheme } from '@/contexts';

interface ShakeUnlockButtonProps {
    longPressDuration?: number;
    onShow?: () => void;
    onUnlock?: () => void;
    onLock?: () => void;
}

const ShakeUnlockButton: React.FC<ShakeUnlockButtonProps> = ({
    longPressDuration = 2000,
    onShow = () => {},
    onUnlock = () => {},
    onLock =  () => {},
}) => {
    const [isLocked, setIsLocked] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const shakeX = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const isAnimationRef = useRef(false);
    const isAnimationCancelled = useRef(false);
    const isLockedRef = useRef(true);

    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const { themeColors } = useUnifiedTheme();

    const bottomOffset = useSharedValue(-100);
    const triggerBottomOffset = useSharedValue(-20);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: shakeX.value },
                { scale: scale.value },
            ],
            opacity: opacity.value,
        };
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            bottom: bottomOffset.value,
        };
    });

    const triggerStyle = useAnimatedStyle(() => {
        return {
            bottom: triggerBottomOffset.value,
        };
    });

    // 开始计时
    const startTimer = () => {
        setIsUnlocking(true);
        setProgress(0);

        // 开始进度更新
        let currentProgress = 0;
        const updateInterval = 20; // 50fps
        const progressIncrement = updateInterval / longPressDuration;

        progressTimerRef.current = setInterval(() => {
            currentProgress += progressIncrement;
            if (currentProgress >= 1) {
                currentProgress = 1;
                setProgress(1);
                clearInterval(progressTimerRef.current!);
                // 计时结束，执行开锁
                runOnJS(handleUnlock)();
            } else {
                setProgress(currentProgress);
            }
        }, updateInterval);
    };

    // 停止计时
    const stopTimer = () => {
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
        }
        setProgress(0);
        setIsUnlocking(false);
    };

    // 开锁方法
    const handleUnlock = () => {
        setIsAnimating(true);
        isAnimationRef.current = true;
        isAnimationCancelled.current = false;

        // 摇晃动画（两下）
        shakeX.value = withSequence(
            withTiming(-15, { duration: 100 }), // 左摇
            withTiming(15, { duration: 100 }),  // 右摇
            withTiming(-12, { duration: 100 }), // 左摇
            withTiming(12, { duration: 100 }),  // 右摇
            withTiming(0, { duration: 100 })    // 回正
        );

        // 摇晃结束后切换图标
        const shakeXTimer = setTimeout(() => {
            if (isAnimationCancelled.current) {return;}
            // 放大效果
            scale.value = withSequence(
                withTiming(1.2, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );

            // 淡出淡入
            opacity.value = withSequence(
                withTiming(0.3, { duration: 100 }),
                withDelay(100, withTiming(1, { duration: 100 }))
            );

            // 延迟更新状态
            const unlockTimer = setTimeout(() => {
                clearInterval(unlockTimer);
                isAnimationRef.current = false;

                if (isAnimationCancelled.current) {return;}

                setIsLocked(false);
                setIsUnlocking(false);
                setIsAnimating(false);
                onUnlock();
                isLockedRef.current = false;
            }, 300);

            clearTimeout(shakeXTimer);
        }, 500); // 摇晃动画总时长
    };

    // 上锁方法
    const handleLock = () => {
        scale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        const timer = setTimeout(() => {
            setIsLocked(true);
            clearTimeout(timer);
        }, 200);
    };

    // 中断动画
    const interruptAnimation = () => {
        isAnimationCancelled.current = true;

        // 取消所有动画
        cancelAnimation(shakeX);
        cancelAnimation(scale);
        cancelAnimation(opacity);
        setIsAnimating(false);

        // 重置到初始状态
        shakeX.value = 0;
        scale.value = 1;
        opacity.value = 1;

        isAnimationRef.current = false;
    };

    const resetAllStatues = () => {
        onLock();

        stopTimer();

        if (isAnimationRef.current) {
            interruptAnimation();
        }

        if (!isLockedRef.current) {
            handleLock();
        }

        const timer = setTimeout(() => {
            clearTimeout(timer);
            hideUnlockButton();
        }, 800);
    };

    // 创建 PanResponder
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: () => {
            console.log('手势开始');
            startTimer();
        },

        onPanResponderMove: (event, gestureState) => {
            // 检查手势是否还在按钮区域内
            const { locationX, locationY } = event.nativeEvent;
            const buttonRadius: number = 40; // 按钮半径

            // 计算距离按钮中心的距离
            const distance = Math.sqrt(
                Math.pow(locationX - buttonRadius, 2) +
                Math.pow(locationY - buttonRadius, 2)
            );

            // 如果手势超出按钮区域，停止计时
            if (distance > buttonRadius) {
                resetAllStatues();
            }
        },

        onPanResponderRelease: () => {
            console.log('手势释放');
            resetAllStatues();
        },

        // 手势被其他组件拦截
        onPanResponderTerminate: () => {
            console.log('手势被终止');
            resetAllStatues();
        },

        // 手势被拒绝
        onPanResponderReject: () => {
            console.log('PanResponder: 手势被拒绝');
            resetAllStatues();
        },

        // 阻止系统终止手势
        onPanResponderTerminationRequest: () => false,
    });

    const showUnlockButton = () => {
        onShow();
        triggerBottomOffset.value = withSequence(
            withTiming(-15, {
                duration: 100,
                easing: Easing.out(Easing.cubic),
            }),
            withTiming(-60, {
                duration: 600,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }, (finished) => {
                if (finished) {
                    bottomOffset.value = withTiming(0, {
                        duration: 600,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                    });
                }
            })
        );
    };

    const hideUnlockButton = () => {
        bottomOffset.value = withTiming(-100, {
            duration: 600,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }, (finished) => {
            if (finished) {
                triggerBottomOffset.value = withTiming(-20, {
                    duration: 600,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });
            }
        });
    };

    const statusColorStyle = useMemo(() => {
        if (isAnimating) {
            return themeColors['color-danger-500'];
        } else if (isUnlocking) {
            return themeColors['color-warning-500'];
        } else if (!isLocked) {
            return themeColors['color-success-500'];
        }
        return themeColors['color-primary-600'];
    }, [isAnimating, isUnlocking, isLocked, themeColors]);

    const renderLockButton = () => {
        return (
            <Animated.View
                style={[
                    styles.button,
                    { backgroundColor: statusColorStyle },
                ]}
            >
                {/* 图标按钮 */}
                <Animated.View style={animatedStyle}>
                    <Icon
                        name={isLocked ? 'lock-outline' : 'lock-open'}
                        size={45}
                        color="#ffffff"
                    />
                </Animated.View>
            </Animated.View>
        );
    };

    return (
        <>
            <Animated.View
                style={[
                    styles.container,
                    containerStyle,
                ]}
            >
                <LinearGradient
                    colors={['rgb(0,0,0)', 'rgba(0,0,0,0.75)', 'rgba(0,0,0,0.5)']}
                    locations={[0, 0.05, 1]}
                    style={styles.gradientBg}
                >
                    <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={hideUnlockButton} />
                </LinearGradient>
                <Animated.View
                    style={styles.buttonContainer}
                    {...panResponder.panHandlers}
                >
                    <CircularProgressBar
                        progress={progress}
                        animating={true}
                        size="giant"
                        status="primary"
                        renderIcon={renderLockButton}
                        style={styles.progressBar}
                    />
                </Animated.View>
            </Animated.View>
            <Animated.View style={[
                styles.PressTrigger,
                triggerStyle,
                { backgroundColor: themeColors['color-primary-600'] },
            ]}>
                <TouchableOpacity onPress={showUnlockButton}>
                    <Icon
                        name={'screen-rotation'}
                        size={30}
                        color="#ffffff"
                    />
                </TouchableOpacity>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000,
    },
    PressTrigger: {
        position: 'absolute',
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 5,
        backgroundColor: 'red',
        zIndex: 1002,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
    },
    progressBar: {
        // position: 'absolute',
        // backgroundColor: '#4ecdc4',
    },
    button: {
        width: 65,
        height: 65,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 4,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 8,
        // elevation: 8,
    },
    buttonAnimating: {
        backgroundColor: '#ff6b6b',
    },
    buttonUnlocking: {
        backgroundColor: '#ffa500', // 橙色表示正在解锁
    },
});

export default ShakeUnlockButton;
