import * as Luxon from 'luxon';
import * as tzdata from 'tzdata';
import * as Introspection from 'typescript-introspection';
import { Definitions, Values } from '@pitaman71/omniglot-live-data';

const __moduleName__ = 'omniglot-live-domains.Temporal'
export const directory = new Definitions.Directory();

function _cmp<DataType>(a: DataType|undefined, b:DataType|undefined, comparator?: (a: DataType, b: DataType) => -1 | 0 | 1 | undefined): -1 | 0 | 1 | undefined {
    if(a === undefined || b === undefined) {
        if(a === undefined && b !== undefined) return -1;
        if(a !== undefined && b === undefined) return +1;
        return 0;
    }
    if(a === null || b === null) {
        if(a === null && b !== null) return -1;
        if(a !== null && b === null) return +1;
        return 0;
    }

    if(comparator) return comparator(a,b);
    return (a < b) ? -1 : (a > b) ? +1 : 0;
}

export interface _Date {
    year?: number;
    month?: number;
    day?: number;
}

/**
 * A calendar date
 */
export const DateDomain = new class _DateDomain extends Values.AggregateDomain<_Date> {
    constructor() {
        super(`${__moduleName__}.DateDomain`, {
            year: new Values.RangeDomain(`${__moduleName__}.Date.year`, 0, undefined, 1),
            month: new Values.RangeDomain(`${__moduleName__}.Date.month`, 1, 12, 1),
            day: new Values.RangeDomain(`${__moduleName__}.Date.day`,1, 31, 0)
        }, ['year', 'month', 'day' ])
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): null|Partial<_Date> {
                const luxon = Luxon.DateTime.fromISO(text);
                if(!luxon.isValid) {
                    return null;
                } else {
                    return {
                            year: luxon.year,
                            month: luxon.month,
                            day: luxon.day
                    }
                }
            },
            to(value: Partial<_Date>): string {
                return domain.asLuxon().to(value)?.toISODate() || '';
            }
        }
    }
    asLuxon() { return {
            from(luxon: Luxon.DateTime): _Date|null { 
                return { 
                    year: luxon.year,
                    month: luxon.month,
                    day: luxon.day
                } 
            },
            to(value: _Date): Luxon.DateTime {
                return Luxon.DateTime.fromObject({ year: value.year, month: value.month, day: value.day })
            }
        }
    }
    asJSDate() { 
        const domain = this;
        return {
            from(date: globalThis.Date) { return domain.asLuxon().from(Luxon.DateTime.fromJSDate(date))},
            to(value: _Date) { return domain.asLuxon().to(value)?.toJSDate() }
        }
    }
    fromBlank() { return {} }
    
}
directory.add(DateDomain);

export interface _Zone {
    name?: string;
    short?: string;
    long?: string;
    minutes?: number;
}

/**
 * A time zone
 */
export const ZoneDomain = new class _ZoneDomain extends Values.AggregateDomain<_Zone> {
    constructor() {
        super(`${__moduleName__}.ZoneDomain`,{
            name: Values.TheStringDomain,
            short: Values.TheStringDomain,
            long: Values.TheStringDomain,
            minutes: Values.TheNumberDomain
        })
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): Partial<_Zone> { return domain.getByName(text) },
            to(value: Partial<_Zone>): string { return value.name || '' }
        };
    }
    asEnumeration(maxCount: number) {
        const tzNames = Object.getOwnPropertyNames(tzdata.zones);
        const luxons = tzNames.map(tzName => Luxon.DateTime.local({ zone: tzName }));
        const domain = this;
        return new class {
            *forward(): Generator<_Zone> {
                luxons.sort((a,b) => a.offset < b.offset ? -1 : a.offset > b.offset ? +1 : 0);
                for(let luxon of luxons) {
                    yield domain.fromLuxon(luxon)
                }
            }
            *backward(): Generator<_Zone> {
                luxons.sort((a,b) => a.offset > b.offset ? -1 : a.offset < b.offset ? +1 : 0);
                for(let luxon of luxons) {
                    yield domain.fromLuxon(luxon)
                }
            }
        } 
    }
    cmp(a: _Zone, b:_Zone): undefined|-1|0|1 {
        let code = _cmp(a.minutes, b.minutes);
        if(code !== 0) return code;
        code = _cmp(a.name, b.name);
        return code;
    }

    getLocal() {
        return this.fromLuxon(Luxon.DateTime.local());
    }
    getByName(name: string): _Zone {
        const luxon = Luxon.DateTime.local({ zone: name });
        return {
            name: luxon.zoneName,
            minutes: luxon.offset,
            short: luxon.offsetNameShort,
            long: luxon.offsetNameLong
        }
    }
    fromLuxon(luxon: Luxon.DateTime): _Zone {
        return {
            name: luxon.zoneName,
            minutes: luxon.offset,
            short: luxon.offsetNameShort,
            long: luxon.offsetNameLong
        }
    }
}
directory.add(ZoneDomain);

/**
 * AM/PM indicator, if needed
 */
export const MeridianDomain = new Values.EnumerationDomain(`${__moduleName__}.MeridianDomain`, 'am', 'pm');
directory.add(MeridianDomain);

export interface _Time {
    hour?: number;
    minute?: number;
    second?: number;
    meridian?: Introspection.getValueType<typeof MeridianDomain>;
    zone?: _Zone;
}

/**
 * Time of day
 */
export const TimeDomain = new class _Domain extends Values.AggregateDomain<_Time> {
    constructor() {
        super(`${__moduleName__}.TimeDomain`,{
            hour: new Values.RangeDomain(`${__moduleName__}.Time.hour`, 0, 23, 1),
            minute: new Values.RangeDomain(`${__moduleName__}.Time.minute`,0, 59, 1),
            second: new Values.RangeDomain(`${__moduleName__}.Time.second`,0, 59, 1),
            meridian: MeridianDomain,
            zone: ZoneDomain
        })
    }
    asString() {
        return new class {
            from(text: string): null|_Time { 
                let hour = 0;
                let minute = 0;
                let second: number|undefined;
                let meridian: _Time['meridian']|undefined;
                let zone: undefined|_Zone;
                const parsed = text.match(/^(\d+):(\d+)(:(\d+))?\s*(am|pm)?\s+(.+)?/i)
                if(parsed) {
                    if(parsed[3] !== undefined) second = Number.parseInt(parsed[3]);
                    if(parsed[2] !== undefined) minute = Number.parseInt(parsed[2]);
                    if(parsed[1] !== undefined) hour = Number.parseInt(parsed[1]);
                    if(parsed[5] !== undefined) meridian = MeridianDomain.asString()?.from(parsed[5]) || undefined;
                    if(parsed[6] !== undefined && parsed[6] !== undefined) {
                        zone = ZoneDomain.getByName(parsed[6])
                    }
                } else {
                    // error = `Parsing failed, expectd format HH:MM[:SS] [+|-]HH:MM [AM|PM]`
                    return null;
                }
                return { hour, minute, second, meridian, zone };
            }
            to(value: _Time): string {
                const hour = value.hour;
                const minute = value.minute;
                if(hour === undefined || minute === undefined) return '';
                let result = `${hour.toString() || '00'}:${minute.toString() || '00'}${!value.meridian ? '' : value.meridian.toString().toUpperCase()}`;
                if(value.zone !== undefined) {
                    result += ' ';
                    result += value.zone.name;
                }
                return result;        
            }
        };
    }

    toSeconds(value: _Time) {
        if(value.hour === undefined || value.minute === undefined)
            return undefined;
        let seconds = 0;
        seconds += 3600 * (value.meridian === 'am' ? value.hour % 12 : value.meridian === 'pm' ? value.hour - 12 : value.hour);
        seconds += 60 * value.minute;
        if(value.zone?.minutes !== undefined) {
            seconds += 60 * value.zone.minutes;
        }
        return seconds;
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
}
directory.add(TimeDomain);

export interface _DateTime {
    date?: _Date;
    time?: _Time;
}

/**
 * Calendar date and time of day
 */
export const DateTimeDomain = new class _DateTimeDomain extends Values.AggregateDomain<_DateTime> {
    constructor() {
        super(`${__moduleName__}.DateTimeDomain`,{
            date: DateDomain,
            time: TimeDomain
        })
    }
    asString(format?: string) {
        const domain = this;
        return new class {
            from(text: string): null|_DateTime {
                return domain.fromISOString(text);
            }
            to(value: _DateTime) { 
                return domain.asLuxon().to(value).toISO();
            }
        }
    };

    asLuxon() { 
        const domain = this;
        return {
            from(luxon: Luxon.DateTime): _DateTime|null { 
                return { date: {
                    year: luxon.year, 
                    month: luxon.month, 
                    day: luxon.day
                 }, time: {
                    hour: luxon.hour,
                    minute: luxon.minute,
                    second: luxon.second
                 } };
            }, to(value: _DateTime): Luxon.DateTime {
                return Luxon.DateTime.fromObject({
                    year: value.date?.year,
                    month: value.date?.month,
                    day: value.date?.day,
                    hour: value.time?.hour,
                    minute: value.time?.minute,
                    second: value.time?.second
                })
            }
        };
    }
    fromISOString(text: string): null|_DateTime {
        return this.asLuxon().from(Luxon.DateTime.fromISO(text));
    }
    fromJSDate(date: Date): null|_DateTime {
        return this.asLuxon().from(Luxon.DateTime.fromJSDate(date));
    }
}
directory.add(DateTimeDomain);

export interface _Duration {
    days?: number,
    hours?: number,
    minutes?: number,
    seconds?: number
}

/**
 * Measurement between two moments in time.
 */
export const DurationDomain = new class _DurationDomain extends Values.AggregateDomain<_Duration> {
    constructor() {
        super(`${__moduleName__}.DurationDomain`,{
            days: Values.TheNumberDomain,
            hours: Values.TheNumberDomain,
            minutes: Values.TheNumberDomain,
            seconds: Values.TheNumberDomain
        })
    }
    asString(format?: string) { return new class {
        from(text: string): null|_Duration {
            const parsed = text.match(/^((\d+)d)?((\d+)h)?((\d+)m)?((\d+)s)?/i);
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
                return null;
            }
            return { days, hours, minutes, seconds };
        }
        to(value: _Duration): string {
            return [
                value.days === undefined ? '' : `${value.days.toString()}d`,
                value.hours === undefined ? '' : `${value.hours.toString()}h`,
                value.minutes === undefined ? '' : `${value.minutes.toString()}m`,
                value.seconds === undefined ? '' : `${value.seconds.toString()}s`
            ].join('');
        }
    } }
    cmp(a: _Duration, b:_Duration): undefined|-1|0|1 {
        return _cmp(this.toSeconds(a), this.toSeconds(b))
    }
    toLuxon(duration: _Duration): Luxon.Duration {
        return Luxon.Duration.fromObject(duration);
    }
    toSeconds(duration: _Duration): number {
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
directory.add(DurationDomain);

export interface _Interval {
    start?: _DateTime,
    end?: _DateTime,
    duration?: _Duration
}

/**
 * A pair of points in time denoting every moment between those two
 * points, inclusive of both endpoints.
 */
export const IntervalDomain = new class _IntervalDomain extends Values.AggregateDomain<_Interval> {
    constructor() {
        super(`${__moduleName__}.IntervalDomain`,{
            start: DateTimeDomain,
            end: DateTimeDomain,
            duration: DurationDomain
        });
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): null|_Interval {
                let luxon: Luxon.Interval|undefined;
                luxon = Luxon.Interval.fromISO(text);
                if(!luxon.isValid) {
                    return null;
                }
                const start = DateTimeDomain.asLuxon().from(luxon.start) || undefined;
                const end = DateTimeDomain.asLuxon().from(luxon.end) || undefined;
                if(!start || !end) return null;
                return domain.from(start, end)
            },
            to(value: _Interval): string {
                const luxon = domain.asLuxon().to(value);
                if(!luxon) return '';
                return luxon.toISO();
            }
        } 
    }
    asEnumeration(maxCount: number) { return undefined; }
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

    from(start: _DateTime|undefined|null, end: _DateTime|undefined|null, duration?: _Duration|null): null|_Interval {
        let text: string|undefined;
        let luxon: Luxon.Interval|undefined;
        if(!start) {
            // skip
        } else if(!end && !!duration) {
            end = DateTimeDomain.asLuxon().from(DateTimeDomain.asLuxon().to(start)?.plus(DurationDomain.toLuxon(duration))) || undefined;
        } else if(!!end  && !duration) {
            const s = DateTimeDomain.asLuxon().to(start);
            const e = DateTimeDomain.asLuxon().to(end);
            duration = s && e ? e.diff(s) : undefined;
        }
        return {
            start: start || undefined, duration: duration || undefined, end: end || undefined
        }
    }

    asLuxon() {
        const domain = this;
        return {
            from(luxon: Luxon.Interval) { 
                const start = DateTimeDomain.asLuxon().from(luxon.start);
                const end = DateTimeDomain.asLuxon().from(luxon.end);
                return { start, end };
            },
            to(value: _Interval) {
                if(!value.start || !value.end) return null;
                return Luxon.Interval.fromDateTimes(
                    DateTimeDomain.asLuxon().to(value.start), 
                    DateTimeDomain.asLuxon().to(value.end)
                );
            }
        }
    }
}
directory.add(IntervalDomain);

export const DateRangeDomain = new Values.AggregateDomain(`${__moduleName__}.DateRangeDomain`,{
    from: DateDomain,
    to: DateDomain
});
directory.add(DateRangeDomain);

export type _DateRange = Introspection.getValueType<typeof DateRangeDomain>;
export const TimeRangeDomain = new Values.AggregateDomain(`${__moduleName__}.TimeRangeDomain`,{
    from: TimeDomain,
    to: TimeDomain
});
directory.add(TimeRangeDomain);
export type _TimeRange = Introspection.getValueType<typeof TimeRangeDomain>;
export interface _When {
    at?: _Date,
    dates?: _DateRange,
    times?: _TimeRange
}
class _WhenDomain extends Values.AggregateDomain<_When> {
    constructor() {
        super(`${__moduleName__}.WhenDomain`,{
            at: DateDomain,
            dates: DateRangeDomain,
            times: TimeRangeDomain,
        }, ['at', 'dates', 'times'])
    }
    expand(a: _When, b: Partial<_When>) {
        if(!a.dates?.from || !a.dates?.to) return b;
        if(!b.dates?.from || !b.dates?.to) return a;
        let from = DateDomain.cmp(b.dates.from, a.dates.from);
        let to = DateDomain.cmp(b.dates.to, a.dates.to);
        // incomparable
        if(from === undefined || to === undefined) return undefined;

        // a subsumes b
        if(from >= 0 && to <= 0) return a;

        // b subsumes a
        if(from <= 0 && to >= 0) return b;
        
        // union
        return this.asJSON().from({
            from : from >= 0 ? DateDomain.asJSON().to(a.dates.from) : DateDomain.asJSON().to(b.dates.from),
            to : to <= 0 ? DateDomain.asJSON().to(a.dates.to) : DateDomain.asJSON().to(b.dates.to)
        })
    }
};
/**
 * A flexible representation of when an event may happen, is happening, or has happened.
 */

export const WhenDomain = new _WhenDomain();
directory.add(WhenDomain);
