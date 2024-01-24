import * as Elevated from '@pitaman71/omniglot-introspect';
import * as Base from './Base';

function _cmp<T>(a: undefined|T, b: undefined|T): -1|0|1|undefined {
    if(a === undefined || b === undefined) return undefined;
    if(a === null || b === null) return undefined;
    if(a < b) return -1;
    if(a > b) return +1;
    return 0;
}

export enum Status {
    Unknown = 'unknown',
    Configuring = 'configuring',
    Waiting = 'waiting',
    Ready = 'ready',
    Running = 'running',
    Finishing = 'finishing',
    Done = 'done',
    Canceled = 'canceled'
};

export interface _Descriptor {
    session: string;
    principal: string;
    nonce: string;
};

export const DescriptorDomain = new class _DescriptorDomain extends Elevated.Domain<Base.Parseable<_Descriptor>> {
    asJSON() {
        return {
            from(json: any): Base.Parseable<_Descriptor> {
                const error = (json.session === undefined || json.principal === undefined || json.nonce === undefined ) ? 
                    'Expected JSON to contain properties { session, principal, nonce }' : undefined;
                return {
                    parsed: !!error ? undefined : {
                        session: json.session,
                        principal: json.principal,
                        nonce: json.nonce
                    },
                    error
                }
            },
            to(value: Base.Parseable<_Descriptor>) {
                return value.parsed ? JSON.stringify(value.parsed) : value.text || "";
            }
        }
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): Base.Parseable<_Descriptor> { 
                try {
                    const descriptor = JSON.parse(text);
                    return { text, ...domain.asJSON().from(descriptor) };
                } catch(e) {
                    return {
                        text,
                        error: 'unable to parse JSON as Tasks.Descriptor'
                    };
                }
            },
            to(value: Base.Parseable<_Descriptor>) { return domain.asJSON().to(value) }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable<_Descriptor>, b: Base.Parseable<_Descriptor>) {
        let code: -1|0|1|undefined = undefined;
        if(a.parsed === undefined || b.parsed === undefined) return undefined;
        code = _cmp(a.parsed.session, b.parsed.session);
        if(code !== 0) return code;
        code = _cmp(a.parsed.principal, b.parsed.principal);
        if(code !== 0) return code;
        code = _cmp(a.parsed.nonce, b.parsed.nonce);
        return code;
    }
};

export interface _Progress {
    units?: {
        expected: number;
        processing: number;
        completed: number;        
    }
};

export const ProgressDomain = new class _ProgressDomain extends Elevated.Domain<Base.Parseable<_Progress>> {
    asJSON() {
        return {
            from(json: any): Base.Parseable<_Progress> {
                const error = 
                    !!json.units && (!json.units.expected || !json.units.processing || !json.units.completed)
                    ? 'Expected JSON to contain properties { units?: { expected, completed } }'
                    : undefined;
                return {
                    parsed: {
                        units: !!error || !json.units ? undefined : {
                            expected: json.units.expected,
                            processing: json.units.processing,
                            completed: json.units.completed
                        }
                    },
                    error
                }
            },
            to(value: Base.Parseable<_Progress>) {
                return value.parsed ? JSON.stringify(value.parsed) : value.text || "";
            }
        }
    }
    asString(format?: string) { 
        const domain = this;
        return {
            from(text: string): Base.Parseable<_Progress> { 
                try {
                    const descriptor = JSON.parse(text);
                    return { text, ...domain.asJSON().from(descriptor) };
                } catch(e) {
                    return {
                        text,
                        error: 'unable to parse JSON as Tasks.Progress'
                    };
                }
            },
            to(value: Base.Parseable<_Progress>) { return domain.asJSON().to(value) }
        };
    }
    asEnumeration(maxCount: number) { return undefined }
    asColumns() { return undefined }
    cmp(a: Base.Parseable<_Progress>, b: Base.Parseable<_Progress>) {
        let code: -1|0|1|undefined = undefined;
        if(a.parsed === undefined || b.parsed === undefined) return undefined;
        if(a.parsed?.units && b.parsed?.units) {
            code = _cmp(a.parsed.units.expected, b.parsed.units.expected);
            if(code !== 0) return code;
            code = _cmp(a.parsed.units.processing, b.parsed.units.processing);
            if(code !== 0) return code;
            code = _cmp(a.parsed.units.completed, b.parsed.units.completed);
            if(code !== 0) return code;
        }
        return 0;
    }
};

export interface _State<ConfigType> {
    config: ConfigType,
    descriptor: _Descriptor,
    progress: _Progress
};

export function StateDomain<ConfigType>(configDomain: Elevated.Domain<Base.Parseable<ConfigType>>) {
    return new class _StateDomain extends Elevated.Domain<Base.Parseable<_State<ConfigType>>> {
        asJSON() {
            return {
                from(json: any): Base.Parseable<_State<ConfigType>> {
                    let error = (!json.config || !json.descriptor || !json.progress) ?
                        'Expected JSON to contain properties { config, descriptor, progress }' : undefined;

                    if(!error) {
                        const config = configDomain.asJSON()?.from(json.config);
                        const descriptor = DescriptorDomain.asJSON().from(json.descriptor);
                        const progress = ProgressDomain.asJSON().from(json.progress);
                        const errors = [ config?.error || "", descriptor.error || "", progress.error || ""].filter(item => item !== "");
                        error = errors.length === 0 ? undefined : errors.join(' and ');
                        return {
                            parsed: config?.parsed && descriptor.parsed && progress.parsed ? {
                                config: config?.parsed,
                                descriptor: descriptor.parsed,
                                progress: progress.parsed
                            } : undefined,
                            error
                        }
                    }
                    return { error, text: JSON.stringify(json) }
                },
                to(value: Base.Parseable<_State<ConfigType>>) {
                    return value.parsed ? JSON.stringify(value.parsed) : value.text || "";
                }
            }
        }
        asString(format?: string) { 
            const domain = this;
            return {
                from(text: string): Base.Parseable<_State<ConfigType>> { 
                    try {
                        const descriptor = JSON.parse(text);
                        return { text, ...domain.asJSON().from(descriptor) };
                    } catch(e) {
                        return {
                            text,
                            error: 'unable to parse JSON as Tasks.State'
                        };
                    }
                },
                to(value: Base.Parseable<_State<ConfigType>>) { return domain.asJSON().to(value) }
            };
        }
        asEnumeration(maxCount: number) { return undefined }
        asColumns() { return undefined }
        cmp(a: Base.Parseable<_State<ConfigType>>, b: Base.Parseable<_State<ConfigType>>) {
            let code: -1|0|1|undefined = undefined;
            if(a.parsed === undefined || b.parsed === undefined) return undefined;
            code = configDomain.cmp({ parsed: a.parsed.config }, { parsed: b.parsed.config });
            if(code !== 0) return code;
            code = DescriptorDomain.cmp({ parsed: a.parsed.descriptor }, { parsed: b.parsed.descriptor });
            if(code !== 0) return code;
            code = ProgressDomain.cmp({ parsed: a.parsed.progress }, { parsed: b.parsed.progress });
            return code;
        }
    };
}

