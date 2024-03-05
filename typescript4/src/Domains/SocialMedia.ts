import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export enum ServiceNames {
    FACEBOOK = 'com.facebook',
    INSTAGRAM = 'com.instagram',
    LINKEDIN = 'com.linkedin',
    SNAPCHAT = 'com.snapchat',
    TIKTOK = 'com.tiktok',
    TWITTER = 'com.twitter',
    WECHAT = 'com.wechat'
}

export interface _Service {
    standard?: ServiceNames
}

export const ServiceDomain = new class _ServiceDomain extends Elevated.Domain<Base.Parseable & _Service> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let standard: undefined|ServiceNames = undefined;
                let error:string|undefined = undefined;
                switch(text.toLowerCase()) {
                    case 'facbeook':
                    case 'fb':
                        standard = ServiceNames.FACEBOOK;
                        break;
                    case 'instagram':
                    case 'ig':
                        standard = ServiceNames.INSTAGRAM;
                        break;
                    case 'linkedin':
                    case 'li':
                        standard = ServiceNames.LINKEDIN;
                        break;
                    case 'snapchat':
                    case 'snap':
                        standard = ServiceNames.SNAPCHAT;
                        break;
                    case 'tiktok':
                    case 'tt':
                        standard = ServiceNames.TIKTOK;
                        break;
                    case 'twitter':
                    case 'x':
                        standard = ServiceNames.TWITTER;
                        break;
                    case 'wechat':
                    case 'wc':
                        standard = ServiceNames.TIKTOK;
                        break;
                    default:
                        error = `Expected format is ig:handle or fb:handle or li:handle`;
                        break;
                }
                return { standard, text, error }
            },
            to(value: Base.Parseable & _Service) { return value.text || (
                value.standard === ServiceNames.FACEBOOK ? 'facebook' :
                value.standard === ServiceNames.INSTAGRAM ? 'instagram' :
                value.standard === ServiceNames.LINKEDIN ? 'linkedin' :
                value.standard === ServiceNames.SNAPCHAT ? 'snap' :
                value.standard === ServiceNames.TWITTER ? 'x' :
                value.standard === ServiceNames.WECHAT ? 'wechat' : ''
            ) }
        };
    }
    asEnumeration(maxCount: number) {
        return new class {
            *forward(): Generator<Base.Parseable & _Service> {
                yield { standard: ServiceNames.FACEBOOK };
                yield { standard: ServiceNames.INSTAGRAM };
                yield { standard: ServiceNames.LINKEDIN };
                yield { standard: ServiceNames.SNAPCHAT };
                yield { standard: ServiceNames.TWITTER };
                yield { standard: ServiceNames.WECHAT };
            }
            *backward(): Generator<Base.Parseable & _Service> {
                yield { standard: ServiceNames.WECHAT };
                yield { standard: ServiceNames.TWITTER };
                yield { standard: ServiceNames.SNAPCHAT };
                yield { standard: ServiceNames.LINKEDIN };
                yield { standard: ServiceNames.INSTAGRAM };
                yield { standard: ServiceNames.FACEBOOK };
            }
        }    
    }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Service, b: Base.Parseable & _Service) {
        if(a.standard === undefined || b.standard === undefined) return undefined;
        return a.standard < b.standard ? -1 : a.standard > b.standard ? 1 : 0;
    }
};

export interface _Account {
    service?: Base.Parseable & _Service;
    handle?: string;
};

export const AccountDomain = new class _AccountDomain extends Elevated.Domain<Base.Parseable & _Account> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let service: undefined|(Base.Parseable & _Service) = undefined;
                let handle:  undefined|string = undefined;
                let error:string|undefined = undefined;
                const match = 
                    /(\S+):\s*(\S+)/.exec(text);

                if(match && match[1] && match[2]) {
                    service = ServiceDomain.asString().from(match[1]);
                    handle = match[2].replace('^\@', match[2]);
                }
                return { service, handle, text, error }
            },
            to(value: Base.Parseable & _Account) { return value.text || 
                `${value.service === undefined ? undefined : ServiceDomain.asString().to(value.service)}: ${value.handle}`;
            }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Account, b: Base.Parseable & _Account) {
        if(a.service === undefined || b.service === undefined)
            return undefined;
        let code:-1|1|0|undefined = ServiceDomain.cmp(a.service, b.service);
        if(code !== 0) return code;
        if(a.handle === undefined || b.handle === undefined) return undefined;
        if(a.handle < b.handle) return -1;
        if(a.handle > b.handle) return 1;
        return 0;
    }
};
