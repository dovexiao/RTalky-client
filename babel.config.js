module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'react-native-reanimated/plugin',
        ],
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.md'],
                alias: {
                    '@contexts': './src/contexts',
                    '@global': './src/global',
                    '@components': './src/components',
                    '@assets': './src/assets',
                    '@utils': './src/utils',
                    '@screens': './src/screens',
                    '@services': './src/services',
                    '@hooks': './src/hooks',
                    '@stores': './src/stores',
                    '@types': './src/types',
                    '@navigation': './src/navigation',
                    '@': './src',
                    '@root': '.',
                },
            },
        ],
    ],
};
