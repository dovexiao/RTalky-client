import React from 'react';
import { userAgreementContent } from '@/center/about/assets';
import { DocumentViewer } from '@/center/about/components';

const OpenSourceLicense: React.FC<{}> = () => {
    return (
        <DocumentViewer title={'用户协议'} content={userAgreementContent} />
    );
};

export default OpenSourceLicense;
