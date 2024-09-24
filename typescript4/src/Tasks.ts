import * as Introspection from 'typescript-introspection'; 
import { Values } from '@pitaman71/omniglot-live-data';
import { TheNumberDomain } from '@pitaman71/omniglot-live-data/lib/Values';

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

export const DescriptorDomain = new Values.AggregateDomain({
    session: Values.TheStringDomain,
    principal: Values.TheStringDomain,
    nonce: Values.TheStringDomain
});

export const UnitsDomain = new Values.AggregateDomain({
    expected: TheNumberDomain,
    processing: TheNumberDomain,
    completed: TheNumberDomain
});

export const ProgressDomain = new Values.AggregateDomain({
    units: UnitsDomain
});

export function StateDomain<ConfigType>(configDomain: Introspection.Domain<ConfigType>) {
    return new Values.AggregateDomain({
        config: configDomain,
        descriptor: DescriptorDomain,
        progress: ProgressDomain
    }, ['descriptor', 'progress']);
}
