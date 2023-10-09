import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export type ServiceNames = 'com.linkedin'|'com.facebook'|'com.instagram';
export interface _Account {
    service?: ServiceNames;
    handle?: string;
}

export const AccountDomain = new class _AccountDomain extends Elevated.Domain<Base.Parseable & _Account> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let service: undefined|ServiceNames = undefined;
                let handle:  undefined|string = undefined;
                let error:string|undefined = undefined;
                const match = 
                    /(instagram):\s*(\S+)/.exec(text) ||
                    /(ig):\s*(\S+)/.exec(text) ||
                    /(facebook):\s*(\S+)/.exec(text) ||
                    /(fb):\s*(\S+)/.exec(text) ||
                    /(linkedin):\s*(\S+)/.exec(text) ||
                    /(li):\s*(\S+)/.exec(text);

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
                        default:
                            error = `Expected format is ig:handle or fb:handle or li:handle`;
                            break;
                    }
                    handle = match[2].replace('^\@', match[2]);
                }
                return { service, handle, text, error }
            },
            to(value: Base.Parseable & _Account) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Account, b: Base.Parseable & _Account) {
        return undefined;
    }
};
