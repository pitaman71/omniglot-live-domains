import * as faker from 'faker';

import * as Elevated from '@pitaman71/omniglot-introspect';
import { Objects, Properties, Stores } from '@pitaman71/omniglot-live-data';
import { _State, StateDomain } from './Tasks';
import * as Base from './Base';

namespace HasState {
    export enum Direction {
        Unknown = 'unknown',
        Invite = 'invite',
        Uninvite = 'uninvite'
    }

    export interface _Config {
        owner: Objects.Binding<string>,
        direction: Direction,
        person?: Objects.Binding<string>,
        project?: Objects.Binding<string>,
        queued?: Objects.Binding<string>[],
        done?: Objects.Binding<string>[]
    }
    export const Domain = StateDomain(new class extends Elevated.Domain<Base.Parseable<_Config>> {
        asJSON() {
            const domain = this;
            return {
                schema() { return { error: "string", owner: Objects.BindingDomain.asJSON().schema(), direction: "string", person: Objects.BindingDomain.asJSON().schema() } },
                from(json: any): Base.Parseable<_Config>|null {
                    const error: undefined|string = undefined;
                    const owner = Objects.Binding.from_bound(json.owner || "?");
                    const direction = 
                        json.direction === Direction.Unknown ? Direction.Unknown
                        : json.direction === Direction.Invite ? Direction.Invite
                        : json.direction === Direction.Uninvite ? Direction.Uninvite
                        : Direction.Unknown;
                    const person = json.person === undefined ? undefined : Objects.BindingDomain.asJSON().from(json.person) || undefined;
                    const project = json.project === undefined ? undefined : Objects.BindingDomain.asJSON().from(json.project) || undefined;
                    const queued = !Array.isArray(json.queued) ? undefined : json.queued.map((queued_: string) => Objects.BindingDomain.asJSON().from(queued_));
                    const done = !Array.isArray(json.done) ? undefined : json.done.map((done_: string) => Objects.BindingDomain.asJSON().from(done_));
                    return {
                        parsed: { owner, direction, person, project, queued, done },
                        error
                    }
                },
                to(value: Base.Parseable<_Config>) {
                    return value.parsed ? JSON.stringify(value.parsed) : value.text || "";
                }
            }
        }
        asString(format?: string) { 
            const domain = this;
            return {
                from(text: string): Base.Parseable<_Config> { 
                    try {
                        const parsed = JSON.parse(text);
                        return { text, ...domain.asJSON().from(parsed) };
                    } catch(e) {
                        return {
                            text,
                            error: 'unable to parse JSON as Tasks.Progress'
                        };
                    }
                },
                to(value: Base.Parseable<_Config>) { return domain.asJSON().to(value) }
            };
        }
        asEnumeration(maxCount: number) { return undefined }
        asColumns() { return undefined }
        cmp(a: Base.Parseable<_Config>, b: Base.Parseable<_Config>) {
            let code: -1|0|1|undefined = undefined;
            if(a.parsed === undefined || b.parsed === undefined) return undefined;
            code = Objects.Binding.cmp(a.parsed.owner, b.parsed.owner);
            if(code !== 0) return code;
            code = Objects.Binding.cmp(a.parsed.person, b.parsed.person);
            if(code !== 0) return code;
            code = Objects.Binding.cmp(a.parsed.project, b.parsed.project);
            if(code !== 0) return code;
            code = Objects.Binding.cmp<string>(a.parsed.queued, b.parsed.project);
        }    
    }());

    export type TypeParams = {
        Binding: { task: Objects.Binding<string> },
        Value: _State<_Config>,
        Domain: typeof Domain
    }
    export const Descriptor = new class _Descriptor extends Properties.Descriptor<TypeParams> {
        canonicalName = 'Tasks.InviteAll.HasState';
        build(builder: Properties.Builder<TypeParams>): void {
            builder.object('task');
            builder.measure(Domain);
            builder.scalar();
        }
    };
}

describe('HasState.asJSON.from', () => {
    it('computes the right result from a string', () => {
        const result = HasState.Domain.asJSON().from({"config":{"owner":{"status":"bound","objectId":"admins.persons.1"},"direction":"invite","person":{"status":"bound","objectId":"425a24ef-280a-4e62-8893-5709f1d5a1dd"}},"descriptor":{"nonce":"f9762dde-0292-4bd8-9907-14cd921b3db2","session":"?","principal":"425a24ef-280a-4e62-8893-5709f1d5a1dd"},"progress":{}})
        expect(result.parsed).not.toBeNull();
        expect(result.parsed?.config).not.toBeNull();
        expect(result.parsed?.config.owner).not.toBeNull();
        expect(result.parsed?.config.direction).not.toBeNull();
        expect(result.parsed?.config.person).not.toBeNull();
        expect(result.parsed?.config.person?.objectId).toEqual("425a24ef-280a-4e62-8893-5709f1d5a1dd");
    });

})
