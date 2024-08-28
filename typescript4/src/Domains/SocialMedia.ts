import * as Elevated from '@pitaman71/omniglot-introspect';
import { Values } from '@pitaman71/omniglot-live-data';

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

class _ServiceDomain extends Elevated.Domain<Partial<Values.Parseable<void>> & _Service> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let standard: undefined|ServiceNames = undefined;
                let error:string|undefined = undefined;
                switch(text.toLowerCase()) {
                    case 'com.facebook':
                    case 'facebook':
                    case 'fb':
                        standard = ServiceNames.FACEBOOK;
                        break;
                    case 'com.instagram':
                    case 'instagram':
                    case 'ig':
                        standard = ServiceNames.INSTAGRAM;
                        break;
                    case 'com.linkedin':
                    case 'linkedin':
                    case 'li':
                        standard = ServiceNames.LINKEDIN;
                        break;
                    case 'com.snapchat':
                    case 'snapchat':
                    case 'snap':
                        standard = ServiceNames.SNAPCHAT;
                        break;
                    case 'com.tiktok':
                    case 'tiktok':
                    case 'tt':
                        standard = ServiceNames.TIKTOK;
                        break;
                    case 'com.twitter':
                    case 'twitter':
                    case 'x':
                        standard = ServiceNames.TWITTER;
                        break;
                    case 'com.wechat':
                    case 'wechat':
                    case 'wc':
                        standard = ServiceNames.TIKTOK;
                        break;
                    default:
                        error = `Expected format is com.facebook or facebook or fb (or similar)`;
                        break;
                }
                return { standard, text, error }
            },
            to(value: Partial<Values.Parseable<void>> & _Service) { return typeof value.text === 'string' ? value.text : (
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
            *forward(): Generator<Partial<Values.Parseable<void>> & _Service> {
                yield { standard: ServiceNames.FACEBOOK };
                yield { standard: ServiceNames.INSTAGRAM };
                yield { standard: ServiceNames.LINKEDIN };
                yield { standard: ServiceNames.SNAPCHAT };
                yield { standard: ServiceNames.TWITTER };
                yield { standard: ServiceNames.WECHAT };
            }
            *backward(): Generator<Partial<Values.Parseable<void>> & _Service> {
                yield { standard: ServiceNames.WECHAT };
                yield { standard: ServiceNames.TWITTER };
                yield { standard: ServiceNames.SNAPCHAT };
                yield { standard: ServiceNames.LINKEDIN };
                yield { standard: ServiceNames.INSTAGRAM };
                yield { standard: ServiceNames.FACEBOOK };
            }
        }    
    }
    cmp(a: Partial<Values.Parseable<void>> & _Service, b: Partial<Values.Parseable<void>> & _Service) {
        if(a.standard === undefined || b.standard === undefined) return undefined;
        return a.standard < b.standard ? -1 : a.standard > b.standard ? 1 : 0;
    }
}
export const ServiceDomain = new _ServiceDomain();

export interface _Account {
    service?: Partial<Values.Parseable<void>> & _Service;
    handle?: string;
};

class _AccountDomain extends Elevated.Domain<Partial<Values.Parseable<void>> & _Account> {
    asString(format?: string) { 
        return {
            from(text: string) { 
                let service: undefined|(Partial<Values.Parseable<void>> & _Service) = undefined;
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
            to(value: Partial<Values.Parseable<void>> & _Account) { return typeof value.text === 'string' ? value.text :
                `${value.service === undefined ? undefined : ServiceDomain.asString().to(value.service)}: ${value.handle}`;
            }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    cmp(a: Partial<Values.Parseable<void>> & _Account, b: Partial<Values.Parseable<void>> & _Account) {
        if(a.service === undefined || b.service === undefined)
            return undefined;
        let code:-1|1|0|undefined = ServiceDomain.cmp(a.service, b.service);
        if(code !== 0) return code;
        if(a.handle === undefined || b.handle === undefined) return undefined;
        if(a.handle < b.handle) return -1;
        if(a.handle > b.handle) return 1;
        return 0;
    }
}
export const AccountDomain = new _AccountDomain();
