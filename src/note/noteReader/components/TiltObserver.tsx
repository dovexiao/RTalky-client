import {useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useState} from 'react';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';

interface TiltObserverProps {
    initialFrequency?: number;      // 初始频率 (ms)
    maxFrequency?: number;          // 最大频率 (ms)
    acceleration?: number;          // 加速度 (ms/update)
    tiltThreshold?: number;         // 倾斜阈值 (度)
    stableTimeout?: number;         // 稳定超时 (ms)
    onLeftTilt?: () => void;
    onRightTilt?: () => void;
    onNoTilt?: () => void;
    onStart?: () => void;
    onStop?: () => void;
}

export interface TiltObserverAPI {
    start: () => void;
    stop: () => void;
}

const TiltObserver = forwardRef<TiltObserverAPI, TiltObserverProps>((props, ref) => {
    const {
        initialFrequency = 200,
        maxFrequency = 50,
        acceleration = 10,
        tiltThreshold = 1.5,
        stableTimeout = 1000,
        onLeftTilt = () => {},
        onRightTilt = () => {},
        onNoTilt = () => {},
        onStart = () => {},
        onStop = () => {},
    } = props;

    // 状态管理
    const [currentFrequency, setCurrentFrequency] = useState(0);
    const isActiveRef = useRef(false);
    const stableTimerRef = useRef<NodeJS.Timeout | null>(null);
    const frequencyTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 传感器只创建一次
    const gravity = useAnimatedSensor(SensorType.GRAVITY, {
        interval: Math.max(16, maxFrequency),
    });

    // 启动方法
    const start = useCallback(() => {
        console.log('TiltObserver: start');
        isActiveRef.current = true;
        setCurrentFrequency(initialFrequency);
        onStart();
    }, [initialFrequency, onStart]);

    // 终止方法
    const stop = useCallback(() => {
        console.log('TiltObserver: stop');
        isActiveRef.current = false;
        setCurrentFrequency(0);
        if (stableTimerRef.current) {
            clearTimeout(stableTimerRef.current);
            stableTimerRef.current = null;
        }
        onStop();
    }, [onStop]);

    // 倾斜检测逻辑
    const handleTiltDetection = useCallback((x: number, y: number, z: number) => {
        if (!isActiveRef.current || z > 0) {return;}

        console.log('TiltObserver: 开始处理倾斜检测');

        const tiltValue  = x;
        const absValue = Math.abs(tiltValue);

        console.log('TiltObserver: 倾斜结果', absValue, tiltValue, x, y, z);

        if (absValue > tiltThreshold) {
            // 有倾斜，加速频率

            setCurrentFrequency(prev => Math.max(maxFrequency, prev - acceleration));

            // 清除稳定计时器
            if (stableTimerRef.current) {
                clearTimeout(stableTimerRef.current);
                stableTimerRef.current = null;
            }

            // 执行倾斜回调
            if (tiltValue < 0) {
                console.log('TiltObserver: 倾斜向左');
                onLeftTilt();
            } else {
                console.log('TiltObserver: 倾斜向右');
                onRightTilt();
            }
        } else {
            // 无倾斜，开始稳定计时
            console.log('TiltObserver: 倾斜无');
            if (!stableTimerRef.current) {
                stableTimerRef.current = setTimeout(() => {
                    console.log('TiltObserver: 倾斜无计时完，恢复频率');
                    if (isActiveRef.current) {
                        setCurrentFrequency(initialFrequency);
                    }
                }, stableTimeout);
            }
            onNoTilt();
        }
    }, [tiltThreshold, maxFrequency, currentFrequency, acceleration, onLeftTilt, onRightTilt, onNoTilt, stableTimeout, stop, initialFrequency]);

    // 暴露控制方法
    useImperativeHandle(ref, () => ({
        start,
        stop,
    }));

    // 传感器监听
    useEffect(() => {
        if (!isActiveRef.current) {return;}

        if (frequencyTimerRef.current) {
            clearTimeout(frequencyTimerRef.current);
            frequencyTimerRef.current = null;
        }

        frequencyTimerRef.current = setInterval(() => {
            const { x, y, z } = gravity.sensor.value;
            handleTiltDetection(x, y, z);
        }, currentFrequency);

        return () => {
            if (frequencyTimerRef.current) {
                clearTimeout(frequencyTimerRef.current);
                frequencyTimerRef.current = null;
            }
        };
    }, [currentFrequency]);

    return null;
});

export default TiltObserver;
