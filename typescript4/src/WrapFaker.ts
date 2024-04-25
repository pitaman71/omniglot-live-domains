import * as Elevated from '@pitaman71/omniglot-introspect';
import { Temporal } from './Domains';

export function OfString(classSpec: string, maker: () => string) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<string> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return text; }
                to(value: string) { return value }
            }
        }
        asEnumeration(maxCount: number) { return undefined }
        asColumns() { return undefined; }
    
        cmp(a: string, b:string) { return a < b ? -1 : a > b ? +1 : 0 }
        make() { return maker() }
        enumerable(maxCount: number) { return false }
        *enumerate(maxCount: number, ascending: boolean) { }
        random(...history: string[]) { 
            return maker();
        }
    }());
}

export function OfJSON<ObjectType extends {}>(classSpec: string, maker: () => ObjectType) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<ObjectType> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return JSON.parse(text); }
                to(value: ObjectType) { return JSON.stringify(value); }
            }
        }
        asEnumeration(maxCount: number) { return undefined }
        asColumns() { return undefined; }
    
        cmp(a: ObjectType, b:ObjectType) { 
            // shallow comparison
            if(Object.keys(a) < Object.keys(b)) return -1;
            if(Object.keys(a) > Object.keys(b)) return +1;
            for(const key in Object.keys(a)) {
                const aVal: any = a[key as keyof(ObjectType)];
                const bVal: any = b[key as keyof(ObjectType)]
                if(aVal < bVal) return -1;
                if(aVal > bVal) return -1;
            }
            return 0;
        }
        make() { return maker() }
        enumerable(maxCount: number) { return false }
        *enumerate(maxCount: number, ascending: boolean) { }
        random(...history: string[]) { 
            return maker();
        }
    }());
}

export function OfOpenEnumeration(classSpec: string, defaultValues: string[]) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<string> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return text; }
                to(value: string) { return value }
            }
        }
        asEnumeration(maxCount: number) { return new class {
            *forward(): Generator<string> { 
                for(let i=0;i < maxCount && i < defaultValues.length; i++) 
                    yield defaultValues[i]; 
            }
            *backward(): Generator<string> { 
                for(let i=0;i < maxCount && i < defaultValues.length; i++) 
                    yield defaultValues[defaultValues.length - 1 - i]; 
            }
        } }
        asColumns() { return undefined; }
    
        cmp(a: string, b:string) { return a < b ? -1 : a > b ? +1 : 0 }
        make() { return defaultValues[Math.floor(Math.random() * defaultValues.length)] }
        enumerable(maxCount: number) { return false }
        *enumerate(maxCount: number, ascending: boolean) { }
        random(...history: string[]) { return defaultValues[Math.floor(Math.random() * defaultValues.length)] }
    }());
}

export function OfURL(classSpec: string, maker: () => URL) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<URL> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return new URL(text); }
                to(value: URL) { return value.toString() }
            }
        }
        asEnumeration(maxCount: number) { return undefined }
        asColumns() { return undefined; }
    
        cmp(a: URL, b:URL) { return a < b ? -1 : a > b ? +1 : 0 }
        make() { return maker() }
        enumerable(maxCount: number) { return false }
        *enumerate(maxCount: number, ascending: boolean) { }
        random(...history: URL[]) { 
            return maker();
        }
    }());
}

export interface CountableRange<ValueType> {
    min: ValueType;
    max: ValueType;
    unit: ValueType;
}

export function OfInteger(classSpec: string, maker: () => number, range: CountableRange<number>) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<number> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return range.unit * Math.floor(parseInt(text) / range.unit); }
                to(value: number) { return value.toString() }
            }
        }
        asEnumeration(maxCount: number) { 
            if(Math.floor((range.max - range.min) / range.unit) > maxCount) return undefined;
            return new class {
                *forward(): Generator<number> {
                    let count = 0;
                    for(let value = range.min; value < range.max; value += range.unit) {
                        yield value;
                        ++count;
                        if(count >= maxCount) return;
                    }    
                }
                *backward(): Generator<number> {
                    let count = 0;
                    for(let value = range.max; value <= range.min; value -= range.unit) {
                        yield value;
                        ++count;
                        if(count >= maxCount) return;
                    }    
                }
            }
        }
        asColumns() { return undefined; }
    
        cmp(a: number, b:number) { return a < b ? -1 : a > b ? +1 : 0 }
        make() { return maker() % range.unit }
        random(...history: number[]) { 
            return maker();
        }
    }());
}

export function OfFloat(classSpec: string, maker: () => number, range: CountableRange<number>) {
    return Elevated.makeValueClass(classSpec, new class extends Elevated.Domain<number> {
        asString() {
            const target=this;
            return new class {
                from(text: string) { return parseFloat(text) % range.unit; }
                to(value: number) { return value.toString() }
            }
        }
        asEnumeration(maxCount: number) { 
            if(Math.floor((range.max - range.min) / range.unit) > maxCount) return undefined;
            return new class {
                *forward(): Generator<number> {
                    let count = 0;
                    for(let value = range.min; value < range.max; value += range.unit) {
                        yield value;
                        ++count;
                        if(count >= maxCount) return;
                    }    
                }
                *backward(): Generator<number> {
                    let count = 0;
                    for(let value = range.max; value <= range.min; value -= range.unit) {
                        yield value;
                        ++count;
                        if(count >= maxCount) return;
                    }    
                }
            }
        }
        asColumns() { return undefined; }

        cmp(a: number, b:number) { return a < b ? -1 : a > b ? +1 : 0 }
        make() { return maker() % range.unit }
        random(...history: number[]) { 
            return maker();
        }
    }());
}

export function OfTime(classSpec: string, maker: () => Temporal._Time) {
    return Elevated.makeValueClass(classSpec, Temporal.TimeDomain);
}

export function OfDate(classSpec: string, maker: () => Temporal._Date) {
    return Elevated.makeValueClass(classSpec, Temporal.DateDomain);
}

export function OfDateTime(classSpec: string, maker: () => Temporal._DateTime) {
    return Elevated.makeValueClass(classSpec, Temporal.DateTimeDomain);
}

export function OfInterval(
    classSpec: string, 
    maker: () => Temporal._Interval
) {
    return Elevated.makeValueClass(classSpec, Temporal.IntervalDomain);
}
