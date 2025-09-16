import React from 'react';
import { licenseContent } from '@/center/about/assets';
import { DocumentViewer } from '@/center/about/components';

const OpenSourceLicense: React.FC<{}> = () => {
    return (
        <DocumentViewer title={'开源软件声明'} content={licenseContent} />
    );
};

export default OpenSourceLicense;
