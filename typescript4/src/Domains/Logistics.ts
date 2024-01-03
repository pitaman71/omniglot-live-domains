import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export interface _GeoPoint {
    asString?: { lat: string, lng: string }, 
    asNumber?: { lat: number, lng: number }
}

export interface _Where {
    googlePlaceId?: string;
    address?: {
        addressLine1?: string;
        addressLine2?: string;
        postalCode?: string;
        city?: string;
        country?: string;
    };
    geo?: { 
        point?: _GeoPoint; 
        cloud?: _GeoPoint[];
    };
}

export const WhereDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Where> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _Where { return { text } },
            to(value: Base.Parseable & _Where) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Where, b: Base.Parseable & _Where) {
        return undefined;
    }
};

export interface _Radius {
    sense: 'inside'|'outside';
    miles?: number;
    kilometers?: number;
}

export const RadiusDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Radius> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _Radius { 
                let sense:'inside'|'outside' = 'outside';
                let miles: number|undefined;
                let kilometers: number|undefined;
                let error: string|undefined;
                const match = text.match(/([+-]?)(\d+)\s*(\w+)/);
                if(match) {
                    if(match[1] == '-') sense = 'inside';
                    if(match[3] == 'mi' || match[3] == 'miles') miles = parseInt(match[2]);
                    if(match[3] == 'km' || match[3] == 'kilometers') kilometers = parseInt(match[2]);
                } else {
                    error = `Expected format: [+-]##[mi|km]`
                }
                return { text, error, sense, miles, kilometers }
            },
            to(value: Base.Parseable & _Radius) { 
                if(value.text !== undefined) return value.text; 
                if(value.miles === undefined && value.kilometers === undefined) return "";
                return `${value.sense == 'inside' ? '-' : '+'}${value.miles || value.kilometers}${!!value.miles ? 'mi' : !!value.kilometers ? 'km' : ''}`
            }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Radius, b: Base.Parseable & _Radius) {
        return undefined;
    }
};

export interface _TimeOfDay {
    hours?: number,
    minutes?: number
};

export const TimeOfDayDomain = new class _TimeOfDayDomain extends Elevated.Domain<Base.Parseable & _TimeOfDay> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _TimeOfDay { 
                const match = new RegExp(/(\d+):(\d+)(am|pm|AM|PM)?/).exec(text);
                if(!match) {
                    return {
                        text,
                        error: 'Format error. Expected ##:##(am|pm}'
                    }
                } else {
                    try {
                        let hours = Number.parseInt(match[1]);
                        let minutes = Number.parseInt(match[2]);
                        let error: undefined|string;
                        if(match[3] === 'am' || match[3] === 'AM') {
                            if(hours === 12) hours = 0;
                        } else if(match[3] === 'pm' || match[3] === 'PM') {
                            if(hours !== 12) hours += 12;
                        } 
                        if(hours < 0 || hours > 23) {
                            error = `Format error: expected hours (${hours}) to be in the range 0-23 or 1-12[am|pm]`;
                        } else if(minutes < 0 || minutes > 59) {
                            error = `Format error: expected minutes (${minutes}) to be in the range 0-59`;
                        }
                        return {
                            text, error, hours, minutes
                        }
                    } catch(e) {
                        return {
                            text,
                            error: 'Format error. Expected ##:##(am|pm}'
                        }
                    }
                }                            
            },
            to(value: Base.Parseable & _TimeOfDayDomain) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _TimeOfDay, b: Base.Parseable & _TimeOfDay) {
        if(a.hours === undefined || b.hours === undefined) {
            if(a.hours === undefined && b.hours !== undefined) return -1;
            if(a.hours !== undefined && b.hours === undefined) return 1;
            return 0;
        }
        if(a.hours < b.hours) return -1;
        if(a.hours > b.hours) return 1;
        if(a.minutes === undefined || b.minutes === undefined) {
            if(a.minutes === undefined && b.minutes !== undefined) return -1;
            if(a.minutes !== undefined && b.minutes === undefined) return 1;
            return 0;
        }
        if(a.minutes < b.minutes) return -1;
        if(a.minutes > b.minutes) return 1;
        return 0;
    }
};

export interface _Date {
    iso8601: string
};

export const DateDomain = new class _DateDomain extends Elevated.Domain<Base.Parseable & _Date> {
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _Date { 
                try {
                    const asDate = new Date(text);
                    return { text: asDate.toLocaleDateString(), iso8601: asDate.toISOString() }
                } catch(e: any) {
                    return { text, error: e.toString(), iso8601: "" }
                }
            },
            to(value: Base.Parseable & _Date) { 
                try {
                    return value.text || new Date(value.iso8601).toLocaleDateString() 
                } catch(e: any) {
                    return "";
                }
            }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Date, b: Base.Parseable & _Date) {
        if(a.iso8601 < b.iso8601)  return -1;
        if(a.iso8601 > b.iso8601)  return 1;
        return 0;
    }
};

export interface _When {
    at?: _Date;
    dates?: {
        from: _Date & Base.Parseable;
        to: _Date & Base.Parseable;
    }, times?: { 
        from: _TimeOfDay & Base.Parseable, 
        to: _TimeOfDay & Base.Parseable
    }
};

export const WhenDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _When> {
    asTimes() {
        return {
            from(text_: { from: string, to: string }, basis: _When = {}): Base.Parseable & _When {            
                const from = TimeOfDayDomain.asString().from(text_.from);
                const to = TimeOfDayDomain.asString().from(text_.to);
                const text = `${text_.from} - ${text_.to}` + (basis?.dates === undefined ? '' : ` ${basis.dates.from.text} - ${basis.dates.to.text}`);
                const error = TimeOfDayDomain.cmp(from, to) <= 0 ? undefined : `WhenDomain.asTimes: 'from' time must occur before 'to' time`;
                return { ...basis, text, error, times: { from, to } };
            },
            to(value: Base.Parseable & _When) { return { from: value.times?.from.text, to: value.times?.to.text } }
        };
    }
    asDates() {
        return {
            from(text_: { from: string, to: string }, basis: _When = {}): Base.Parseable & _When { 
                const from = DateDomain.asString().from(text_.from);
                const to = DateDomain.asString().from(text_.to);
                const text = (basis?.times === undefined ? '' : `${basis.times.from.text} - ${basis.times.to.text} `) + `${text_.from} - ${text_.to}`;
                let error: string|undefined;
                try {
                    error = new Date(from.iso8601) <= new Date(to.iso8601) ? undefined : `WhenDomain.asDates: 'from' date must occur before 'to' date`;
                } catch(e: any) {
                    error = e.toString();
                }
                return { ...basis, text, error, dates: { from, to } };
            },
            to(value: Base.Parseable & _When) { return { from: value.dates?.from.iso8601, to: value.dates?.to.iso8601 } }
        };
    }
    asString(format?: string) { 
        return {
            from(text: string): Base.Parseable & _When { return { text } },
            to(value: Base.Parseable & _When) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _When, b: Base.Parseable & _When) {
        return undefined;
    }
    expand(a: Base.Parseable & _When, b: Base.Parseable & _When) {
        return (
            a.dates === undefined ? b : b.dates === undefined ? a : 
            DateDomain.cmp(b.dates.from, a.dates.from) >= 0 && DateDomain.cmp(b.dates.to, a.dates.to) <= 0 ? a :
            DateDomain.cmp(a.dates.from, b.dates.from) >= 0 && DateDomain.cmp(a.dates.to, b.dates.to) <= 0 ? b : this.asDates().from({
                from : DateDomain.cmp(a.dates.from, b.dates.from) <= 0 ? a.dates.from.iso8601 : b.dates.from.iso8601,
                to : DateDomain.cmp(a.dates.to, b.dates.to) >= 0 ? a.dates.to.iso8601 : b.dates.to.iso8601
            })
        );
    }
};

export interface _Event {
    where?: _Where;
    radius?: _Radius;
    when?: _When;
}

export const EventDomain = new class _EventDomain extends Elevated.Domain<Base.Parseable & _Event> {
    asString(format?: string) { 
        return {
            from(text: string) { return { text } },
            to(value: Base.Parseable & _Event) { return value.text || "" }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable & _Event, b: Base.Parseable & _Event) {
        return undefined;
    }
};
