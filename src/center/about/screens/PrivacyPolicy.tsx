import React from 'react';
import { privacyContent } from '@/center/about/assets';
import { DocumentViewer } from '@/center/about/components';

const OpenSourceLicense: React.FC<{}> = () => {
    return (
        <DocumentViewer title={'隐私政策'} content={privacyContent} />
    );
};

export default OpenSourceLicense;
