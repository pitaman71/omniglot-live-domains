import * as Luxon from 'luxon';
import * as tzdata from 'tzdata';
import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

export const __moduleName__ = "omniglot-live-data.Domains.Temporal";

type JSDate = Date;

function random_choice<DataType>(...values: DataType[]) {
    const index = Math.floor(Math.random() * values.length);
    return values[index];
}

function _cmp<DataType>(a: DataType|undefined, b:DataType|undefined): -1 | 0 | 1 | undefined {
    if(a === undefined && b === undefined) {
        return undefined;
    }

    if(a === undefined || a == null || b === undefined || b == null) {
        if(b !== undefined && b !== null) {
            return -1;
        } else if(a !== undefined && a !== null) {
            return +1;
        } else {
            return 0;
        }
    }
    return (a < b) ? -1 : (a > b) ? +1 : 0;
}

export interface _Date {
    year?: number;
    month?: number;
    day?: number;
    luxon?: Luxon.DateTime;
}

export const DateDomain = new class _DateDomain extends Elevated.Domain<Base.Parseable & _Date> {
    asJSON() { return undefined }
    asString(format?: string) { return new class {
        from(text: string): Base.Parseable & _Date {
            const luxon = Luxon.DateTime.fromISO(text);
            if(!luxon.isValid) {
                return {
                    text, error: [ luxon.invalidReason, luxon.invalidExplanation ]
                }
            } else {
                return { 
                    text, 
                    year: luxon.year,
                    month: luxon.month,
                    day: luxon.day,
                    luxon 
                }
            }
        }
        to(value: Base.Parseable & _Date): string {
            if(value.text !== undefined) {
                return value.text;
            }
            if(value.luxon !== undefined) {
                return value.luxon.toISODate()
            }
            if(value.year !== undefined && value.month !== undefined && value.day !== undefined) {
                return `${value.year.toString()}-${value.month.toString()}-${value.day.toString()}`;
            }
            return '';
        }
    } }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return new class {
        getColumnNames(): string[] {
            return [ 'year', 'month', 'day' ];
        }
    } }

    cmp(a: _Date, b: _Date): -1|0|1|undefined { 
        if(a.luxon === undefined || b.luxon === undefined) 
            return _cmp(a.luxon, b.luxon);
        if(a.luxon.startOf('day') < b.luxon.startOf('day')) return -1;
        if(a.luxon.startOf('day') > b.luxon.startOf('day')) return +1;
        return 0;
    }

    toJSDate(value: Base.Parseable & _Date) { return value.luxon?.toJSDate() }
    toISOString(value: Base.Parseable & _Date) { return value.luxon?.toISODate() }

    fromBlank() { return {} }
    fromLuxon(luxon: Luxon.DateTime) { 
        return { 
            text: luxon.toISO(),
            year: luxon.year,
            month: luxon.month,
            day: luxon.day,
            luxon: luxon.startOf('day') 
        } 
    }
    
    fromISOString(text: string) { return this.fromLuxon(Luxon.DateTime.fromISO(text))}
    fromJSDate(date: globalThis.Date) { return this.fromLuxon(Luxon.DateTime.fromJSDate(date))}
    fromMerge(head: Base.Parseable & _Date, ...dates: Base.Parseable & _Date[]): Base.Parseable & _Date {
        if(dates.length === 0) return { 
            text: head.text,
            year: head.year,
            month: head.month,
            day: head.day,
            luxon: head.luxon
        };
        const year = dates[0].year !== undefined ? dates[0].year : head.year;
        const month = dates[0].month !== undefined ? dates[0].month : head.month;
        const day = dates[0].day !== undefined ? dates[0].day : head.day;
        const luxon = Luxon.DateTime.fromObject({ year, month, day });
        const text = luxon.toISO();
        return this.fromMerge({
            text, luxon, year, month, day
        }, ... dates.slice(1));
    }
}

export interface _Zone {
    luxon?: Luxon.Zone;
    name?: string;
    short?: string;
    long?: string;
    minutes?: number;
}

export const ZoneDomain = new class _ZoneDomain extends Elevated.Domain<Base.Parseable & _Zone> {
    asJSON() { return undefined }
    asString(format?: string) { 
        const domain = this;
        return new class {
            from(text: string): Base.Parseable & _Zone { return domain.getByName(text) }
            to(value: Base.Parseable & _Zone): string { return value.name || '' }
        };
    }
    asEnumeration(maxCount: number){ 
        const tzNames = Object.getOwnPropertyNames(tzdata.zones);
        const luxons = tzNames.map(tzName => Luxon.DateTime.local({ zone: tzName }));
        const domain = this;
        return new class {
            *forward(): Generator<Base.Parseable & _Zone> {
                luxons.sort((a,b) => a.offset < b.offset ? -1 : a.offset > b.offset ? +1 : 0);
                for(let luxon of luxons) {
                    yield domain.fromLuxon(luxon)
                }
            }
            *backward(): Generator<Base.Parseable & _Zone> {
                luxons.sort((a,b) => a.offset > b.offset ? -1 : a.offset < b.offset ? +1 : 0);
                for(let luxon of luxons) {
                    yield domain.fromLuxon(luxon)
                }
            }
        }
    }
    asColumns() { return new class {
        getColumnNames() { return [ 'name', 'short', 'long', 'minutes' ]}
    } }
    cmp(a: _Zone, b:_Zone): undefined|-1|0|1 {
        let code = _cmp(a.minutes, b.minutes);
        if(code !== 0) return code;
        code = _cmp(a.name, b.name);
        return code;
    }

    getLocal() {
        return this.fromLuxon(Luxon.DateTime.local());
    }
    getByName(name: string): Base.Parseable & _Zone {
        const luxon = Luxon.DateTime.local({ zone: name });
        return {
            name: luxon.zoneName,
            minutes: luxon.offset,
            short: luxon.offsetNameShort,
            long: luxon.offsetNameLong,
            luxon: luxon.zone
        }
    }
    fromLuxon(luxon: Luxon.DateTime): Base.Parseable & _Zone {
        return {
            name: luxon.zoneName,
            minutes: luxon.offset,
            short: luxon.offsetNameShort,
            long: luxon.offsetNameLong,
            luxon: luxon.zone
        }
    }
}

const tzNames = Object.getOwnPropertyNames(tzdata.zones);
export const AllZones = new Elevated.Samples<_Zone>(
    ...tzNames.map(tzName => ZoneDomain.getByName(tzName)) 
);

export interface _Time {
    hour?: number;
    minute?: number;
    second?: number;
    pm?: boolean;
    zone?: _Zone;
}

export const TimeDomain = new class _Domain extends Elevated.Domain<Base.Parseable & _Time> {
    asJSON() { return undefined }
    asString() {
        return new class {
            from(text: string): Base.Parseable & _Time { 
                let hour = 0;
                let minute = 0;
                let second: number|undefined;
                let pm: boolean|undefined;
                let zone: undefined|_Zone;
                const parsed = text.match(/^(\d+):(\d+)(:(\d+))?\s*(am|pm)?\s+(.+)?/i)
                let error: any;
                if(parsed) {
                    if(parsed[3] !== undefined) second = Number.parseInt(parsed[3]);
                    if(parsed[2] !== undefined) minute = Number.parseInt(parsed[2]);
                    if(parsed[1] !== undefined) hour = Number.parseInt(parsed[1]);
                    if(parsed[5] !== undefined) pm = parsed[5].match(/^pm$/i) !== null;
                    if(parsed[6] !== undefined && parsed[6] !== undefined) {
                        zone = ZoneDomain.getByName(parsed[6])
                    }
                } else {
                    error = `Parsing failed, expectd format HH:MM[:SS] [+|-]HH:MM [AM|PM]`
                }
                return { text, error, hour, minute, second, pm, zone };
            }
            to(value: Base.Parseable & _Time): string {
                if(value.text !== undefined) return value.text;
                const hour = value.hour;
                const minute = value.minute;
                if(hour !== undefined && minute !== undefined) {
                    let result = `${value.hour?.toString() || '00'}:${value.minute?.toString() || '00'}`;
                    if(value.pm === false) {
                        result += 'AM';
                    } else if(value.pm === true) {
                        result += 'PM';
                    }
                    if(value.zone !== undefined) {
                        result += ' ';
                        result += value.zone.name;
                    }
                    return result;        
                }
                return '';
            }
        };
    }

    asEnumeration(maxCount: number) { return undefined ; }
    asColumns() {
        return new class {
            getColumnNames(): string[] {
                return [ 'text', 'hour', 'minute', 'second', 'pm', 'zone.name', 'zone.offset', 'zone.short', 'zone.long' ];
            }
        }
    }

    cmp(a_: _Time, b_: _Time): -1|0|1|undefined { 
        const a = this.toSeconds(a_);
        const b = this.toSeconds(b_);
        return _cmp(a,b);
    }

    toSeconds(value: Base.Parseable & _Time) {
        if(value.hour === undefined || value.minute === undefined)
            return undefined;
        let seconds = 0;
        seconds += 3600 * value.hour;
        seconds += 60 * value.minute;
        if(value.pm) {
            seconds += 3600 * 12;
        }
        if(value.zone?.minutes !== undefined) {
            seconds += 60 * value.zone.minutes;
        }
        return seconds;
    }   
    fromBlank(): Base.Parseable & _Time {
        return {}
    }
    fromSeconds(seconds: number, pm?: boolean, utcOffset?: { hours: number, minutes: number, west: boolean }) {
        return {
            hour: Math.floor(seconds / 3600),
            minute: Math.floor((seconds % 3600) / 60),
            second: seconds % 60,
            pm,
            utcOffset 
        }
    }
    fromMerge(head: Base.Parseable & _Time, ...times: Base.Parseable & _Time[]): Base.Parseable & _Time {
        if(times.length === 0) return { 
            text: head.text,
            hour: head.hour,
            minute: head.minute,
            second: head.second,
            pm: head.pm,
            zone: head.zone
        };
        let hour = head.hour;
        let pm = head.pm;
        if(times[0].hour !== undefined) {
            hour = times[0].hour;
            pm = times[0].pm;
        }
        const minute = times[0].minute !== undefined ? times[0].minute : head.minute;
        const second = times[0].second !== undefined ? times[0].second : head.second;
        const zone = times[0].zone !== undefined ? times[0].zone : head.zone;
        const text = this.asString().to({ hour, minute, second, pm })
        return this.fromMerge({
            text, hour, minute, second, zone
        }, ... times.slice(1));
    }
}

export interface _DateTime {
    luxon?: luxon.DateTime;
    date: _Date;
    time: _Time;
}

export const DateTimeDomain = new class _DateTimeDomain extends Elevated.Domain<Base.Parseable & _DateTime> {
    asJSON() { return undefined }
    asString(format?: string) {
        const domain = this;
        return new class {
            from(text: string): Base.Parseable & _DateTime {
                return domain.fromISOString(text);
            }
            to(value: Base.Parseable & _DateTime) { 
                if(value.luxon) {
                    return value.luxon.toISO();
                } else if(value.text !== undefined) {
                    return value.text;
                }
                return '';
            }
        }
    };
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return new class {
        getColumnNames(): string[] {
            return [ ... DateDomain.asColumns()?.getColumnNames() || [], ...TimeDomain.asColumns()?.getColumnNames() || [] ]
        }
    } }

    cmp(a: _DateTime, b: _DateTime): -1|0|1|undefined { 
        if(a.luxon && b.luxon) {
            return a.luxon < b.luxon ? -1 : a.luxon > b.luxon ? +1 : 0;
        }
        let code;
        code = DateDomain.cmp(a.date, b.date);
        if(code != 0) return code;
        code = TimeDomain.cmp(a.time, b.time);
        if(code != 0) return code;
        return 0;
    }

    from(date: Base.Parseable & _Date, time: Base.Parseable & _Time): Base.Parseable & _DateTime {
        let text: string|undefined;
        let luxon: Luxon.DateTime|undefined;
        let error: any;
        if(date.year !== undefined && date.month !== undefined && date.day !== undefined && time.hour !== undefined && time.minute !== undefined) {
            luxon = Luxon.DateTime.fromObject({
                year: date.year,
                month: date.month,
                day: date.day,
                hour: time.hour + (time.pm === true ? 12 : 0),
                minute: time.minute,
                second: time.second,
            }, { zone: time.zone?.name })    
            if(!luxon.isValid) {
                error = [ luxon.invalidReason, luxon.invalidExplanation ];
                luxon = undefined;
            } else {
                text = luxon.toISO();
            }
        }

        return {
            text, error, date, time, luxon
        }
    }
    fromBlank(): _DateTime {
        return {
            date: DateDomain.fromBlank(),
            time: TimeDomain.fromBlank()
        };
    }
    fromLuxon(luxon: Luxon.DateTime): Base.Parseable & _DateTime { 
        return { 
            text: luxon.isValid ? luxon.toISO() : undefined,
            error: !luxon.isValid && [ luxon.invalidReason, luxon.invalidExplanation ],
            date: { luxon: luxon.startOf('day') },
            time: { hour: luxon.hour, minute: luxon.minute, second: luxon.second }
        };
    }
    fromISOString(text: string): Base.Parseable & _DateTime {
        return this.fromLuxon(Luxon.DateTime.fromISO(text));
    }
    fromJSDate(date: any): Base.Parseable & _DateTime {
        return this.fromLuxon(Luxon.DateTime.fromJSDate(date));
    }
    fromMerge(head: Base.Parseable & _DateTime, ...moments: Base.Parseable & _DateTime[]): Base.Parseable & _DateTime {
        return this.from(
            DateDomain.fromMerge(head.date, ...moments.map(moment => moment.date)),
            TimeDomain.fromMerge(head.time, ...moments.map(moment => moment.time))
        );
    }
}

export interface _Duration {
    days?: number,
    hours?: number,
    minutes?: number,
    seconds?: number
}

export const DurationDomain = new class _DurationDomain extends Elevated.Domain<Base.Parseable & _Duration> {   
    asJSON() { return undefined }
    asString(format?: string) { return new class {
        from(text: string): Base.Parseable & _Duration {
            const parsed = text.match(/^((\d+)d)?((\d+)h)?((\d+)m)?((\d+)s)?/i);
            let error: any;
            let days: number|undefined;
            let hours: number|undefined;
            let minutes: number|undefined;
            let seconds: number|undefined;
            if(parsed) {
                days = Number.parseInt(parsed[2]);
                hours = Number.parseInt(parsed[4]);
                minutes = Number.parseInt(parsed[6]);
                seconds = Number.parseInt(parsed[8]);
            } else {
                error = [
                    'Unable to parse time duration as string',
                    'Expected format is ##d##h##m##s'
                ];
            }
            return { text, error, days, hours, minutes, seconds };
        }
        to(value: Base.Parseable & _Duration): string {
            return value.text || [
                value.days === undefined ? '' : `${value.days.toString()}d`,
                value.hours === undefined ? '' : `${value.hours.toString()}h`,
                value.minutes === undefined ? '' : `${value.minutes.toString()}m`,
                value.seconds === undefined ? '' : `${value.seconds.toString()}s`
            ].join('');
        }
    } }
    asEnumeration(maxCount: number) { return undefined; }
    asColumns() { return new class {
        getColumnNames(): string[] {
            return ['days', 'hours', 'minutes', 'seconds' ];
        }
    } }
    cmp(a: _Duration, b:_Duration): undefined|-1|0|1 {
        return _cmp(this.toSeconds(a), this.toSeconds(b))
    }
    toLuxon(duration: Base.Parseable & _Duration): Luxon.Duration {
        return Luxon.Duration.fromObject(duration);
    }
    toSeconds(duration: Base.Parseable & _Duration): number {
        return (duration.seconds || 0) +
            (duration.minutes ? 60 * duration.minutes : 0) +
            (duration.hours ? 3600 * duration.hours : 0) + 
            (duration.days ? 24 * 3600 * duration.days : 0);
    }
    fromSeconds(seconds: number) {
        return {
            days: Math.floor(seconds / (24 * 3600)),
            hours: Math.floor(seconds / 3600) % 24,
            minutes: Math.floor(seconds / 60) % 60,
            seconds: Math.floor(seconds % 60)
        }
    }
}

export interface _Interval {
    luxon?: Luxon.Interval,
    start?: _DateTime,
    end?: _DateTime,
    duration?: _Duration
}

export const IntervalDomain = new class _IntervalDomain extends Elevated.Domain<Base.Parseable & _Interval> {
    asJSON() { return undefined }
    asString(format?: string) { return new class {
        from(text: string): Base.Parseable & _Interval {
            let error: any;
            let luxon: Luxon.Interval|undefined;
            luxon = Luxon.Interval.fromISO(text);
            if(!luxon.isValid) {
                error = [ luxon.invalidReason, luxon.invalidExplanation ];
                luxon = undefined;
            }
            return { text, error }
        }
        to(value: Base.Parseable & _Interval): string {
            if(value.luxon) {
                return value.luxon.toISO();
            } else if(value.text !== undefined) {
                return value.text;
            }
            return '';
        }
    } }
    asEnumeration(maxCount: number) { return undefined; }
    asColumns() { return new class {
        getColumnNames(): string[] {
            return [ 
                ...DateTimeDomain.asColumns()?.getColumnNames().map(columnName => `start.${columnName}`) || [], 
                ...DateTimeDomain.asColumns()?.getColumnNames().map(columnName => `end.${columnName}`) || [], 
                ...DurationDomain.asColumns()?.getColumnNames().map(columnName => `duration.${columnName}`) || []
            ];
        }
    } }
    cmp(a: _Interval, b:_Interval): undefined|-1|0|1 {
        let code;
        if(a.start === undefined || b.start === undefined) {
            return _cmp(a.start, b.start);
        }
        if(a.end === undefined || b.end === undefined) {
            return _cmp(a.end, b.end);
        }
        code = DateTimeDomain.cmp(a.start, b.start);
        if(code != 0) return code;
        code = DateTimeDomain.cmp(a.end, b.end);
        return code;    
    }

    toISOString(interval: Base.Parseable & _Interval) { return interval.luxon?.toISO() }

    from(start: _DateTime, end?: _DateTime, duration?: _Duration) {
        let text: string|undefined;
        let luxon: Luxon.Interval|undefined;
        if(start.luxon === undefined) {                
            // skip
        } else if(end === undefined && duration !== undefined) {
            end = DateTimeDomain.fromLuxon(start.luxon.plus(DurationDomain.toLuxon(duration)));
        } else if(end !== undefined && duration === undefined) {
            duration = start.luxon && end.luxon ? end.luxon.diff(start.luxon) : undefined;
        }
        if(start.luxon && end?.luxon) {
            luxon = Luxon.Interval.fromDateTimes(start.luxon, end.luxon);
            text = luxon.toISO();
        }
        return {
            text, start, duration, end
        }
    }

    fromLuxon(luxon_: Luxon.Interval) { 
        const text = luxon_.toISO();
        const luxon = Luxon.Interval.fromISO(text)
        const start = DateTimeDomain.fromLuxon(luxon.start);
        const end = DateTimeDomain.fromLuxon(luxon.end);
        return { text, luxon, start, end };
    }

    fromISOString(text: string) { 
        return this.fromLuxon(Luxon.Interval.fromISO(text))
    }
}

export function Appointments(): Base.Parseable & _Interval { 
    const now = Luxon.DateTime.now();
    const days = Math.floor(Math.random() * 30);
    const when = now.plus({ days });
    const duration: _Duration = {
        days: 0,
        hours: Math.floor(Math.random() * 8),
        minutes: random_choice<number>(
            5, 15, 30, 45, 60, 90
        )
    }
    return { start: { luxon: when, date: {}, time: {} }, duration };
}
