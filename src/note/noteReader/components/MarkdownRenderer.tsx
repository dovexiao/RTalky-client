import React, {useMemo} from 'react';
import { StyleSheet, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useUnifiedTheme } from '@/contexts';

interface MarkdownRendererProps {
    content: string;
    style?: any;
    rules?: any;
}

// 提取图片渲染组件到外部
const MarkdownImage = ({ node }: { node: any }) => (
    <Image
        key={node.key}
        style={markdownStyles.image}
        source={{ uri: node.attributes.src }}
    />
);

// 提取默认渲染规则到外部
const defaultRenderRules = {
    image: (node: any, _children: any, _parent: any, _styles: any) => (
        <MarkdownImage node={node} />
    ),
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    style,
    rules,
}) => {
    const { themeColors } = useUnifiedTheme();


    // 合并样式
    const mergedStyle = useMemo(() => ({
        ...markdownStyles,
        body: {
            ...markdownStyles.body,
            backgroundColor: themeColors['bg-100'],
            color: themeColors['text-200'],
        },
        heading1: {
            ...markdownStyles.heading1,
            color: themeColors['text-100'],
        },
        heading2: {
            ...markdownStyles.heading2,
            color: themeColors['text-100'],
        },
        heading3: {
            ...markdownStyles.heading3,
            color: themeColors['text-100'],
        },
        paragraph: {
            ...markdownStyles.paragraph,
            color: themeColors['text-200'],
        },
        blockquote: {
            ...markdownStyles.blockquote,
            backgroundColor: themeColors['bg-200'],
            borderColor: themeColors['bg-300'],
        },
        bullet_list_icon: {
            ...markdownStyles.bullet_list_icon,
            color: themeColors['text-200'],
        },
        ordered_list_icon: {
            ...markdownStyles.ordered_list_icon,
            color: themeColors['text-200'],
        },
        code_inline: {
            ...markdownStyles.code_inline,
            backgroundColor: themeColors['bg-300'],
            borderColor: themeColors['bg-300'],
            color: themeColors['text-100'],
        },
        code_block: {
            ...markdownStyles.code_block,
            backgroundColor: themeColors['bg-200'],
            color: themeColors['text-100'],
        },
        fence: {
            ...markdownStyles.fence,
            backgroundColor: themeColors['bg-200'],
            color: themeColors['text-100'],
        },
        link: {
            ...markdownStyles.link,
            color: themeColors['primary-200'],
        },
        table: {
            ...markdownStyles.table,
            borderColor: themeColors['bg-300'],
        },
        th: {
            ...markdownStyles.th,
            backgroundColor: themeColors['bg-200'],
            color: themeColors['text-100'],
        },
        tr: {
            ...markdownStyles.tr,
            borderColor: themeColors['bg-300'],
        },
        td: {
            ...markdownStyles.td,
            color: themeColors['text-200'],
        },
        ...style,
    }), [style, themeColors]);

    return (
        <Markdown
            style={mergedStyle}
            rules={rules || defaultRenderRules}
        >
            {content ? content.trim() : '暂无内容'}
        </Markdown>
    );
};

const markdownStyles = StyleSheet.create({
    // 全局基础样式
    body: {
        fontSize: 16,
        lineHeight: 30,
        fontFamily: 'System',
    },

    // 标题优化
    heading1: {
        fontSize: 22,
        fontWeight: '800',
        // color: '#1a1a1a',
    },
    heading2: {
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 5,
        // color: '#222',
    },
    heading3: {
        fontSize: 18,
        fontWeight: '800',
        marginVertical: 5,
        // color: '#333',
    },

    // 段落与引用
    paragraph: {
        marginVertical: 5,
    },
    blockquote: {
        // backgroundColor: '#f2f2f2',
        borderLeftWidth: 4,
        // borderColor: '#CCC',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginVertical: 10,
        marginHorizontal: 8,
    },

    // 列表样式
    list_item: {
        flexDirection: 'row',
        marginVertical: 0,
    },
    bullet_list_icon: {
        marginRight: 10,
        fontSize: 16,
        // color: '#222',
    },
    ordered_list_icon: {
        marginRight: 10,
        fontSize: 16,
        // color: '#222',
    },

    // 代码块
    code_inline: {
        // backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 6,
        borderWidth: 1,
        // borderColor: '#cccccc',
    },
    code_block: {
        // backgroundColor: '#2d2d2d',
        // color: '#ffffff',
        padding: 15,
        borderRadius: 6,
        marginVertical: 14,
    },
    fence: {
        // backgroundColor: '#2d2d2d',
        // color: '#ffffff',
        padding: 15,
        borderRadius: 6,
        marginVertical: 14,
    },

    // 链接与图片
    link: {
        // color: '#2980b9',
        textDecorationLine: 'underline',
    },
    image: {
        resizeMode: 'contain',
        height: 200,
        marginVertical: 10,
        borderRadius: 4,
    },

    // 表格优化
    table: {
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        marginVertical: 12,
        marginHorizontal: 8,
    },
    th: {
        // backgroundColor: '#f8f8f8',
        fontWeight: '700',
        padding: 10,
    },
    tr: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        // borderColor: '#eee',
    },
    td: {
        flex: 1,
        padding: 10,
    },
});

export default MarkdownRenderer;
