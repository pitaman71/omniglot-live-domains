import * as Elevated from '@pitaman71/omniglot-introspect';

export type ServiceNames = 'com.linkedin'|'com.facebook'|'com.instagram';
export interface _Account {
    service?: ServiceNames;
    handle?: string;
}

export interface _Parseable {
    text?: string;
    error?: any;
}

export const AccountDomain = new class _AccountDomain extends Elevated.Domain<_Parseable & _Account> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let service: undefined|ServiceNames = undefined;
                let handle:  undefined|string = undefined;
                const regex = new RegExp(/((instagram):\s*(\S+)|(ig):\s*(\S+)|(facebook):\s*(\S+)|(fb):\s*(\S+)|(linkedin):\s*(\S+)|(li):\s*(\S+))/);
                const match = regex.exec(text);
                if(match && match[1] && match[2]) {
                    switch(match[1].toLowerCase()) {
                        case 'instagram':
                        case 'ig':
                            service = 'com.instagram';
                            break;
                        case 'facbeook':
                        case 'fb':
                            service = 'com.facebook';
                            break;
                        case 'linkedin':
                        case 'li':
                            service = 'com.linkedin';
                            break;
                    }
                    handle = match[2].replace('^\@', match[2]);
                }
                return { service, handle, text }
            },
            to(value: _Parseable & _Account) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: _Parseable & _Account, b: _Parseable & _Account) {
        return undefined;
    }
};
