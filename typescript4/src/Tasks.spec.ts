import * as Introspection from 'typescript-introspection';
import { Objects, Properties, Values } from '@pitaman71/omniglot-live-data';
import { StateDomain } from './Tasks';

const DirectionDomain = new Values.EnumerationDomain('unknown', 'invite', 'uninvite');

export const ConfigDomain = new Values.AggregateDomain('Tasks.Config', {
    owner: Objects.BindingDomain,
    direction: DirectionDomain,
    person: Objects.BindingDomain,
    project: Objects.BindingDomain,
    queued: new Values.ArrayDomain('Tasks.Config.queued', Objects.BindingDomain),
    done: new Values.ArrayDomain('Tasks.Config.done', Objects.BindingDomain)
}, ['person', 'project', 'queued', 'done']);

namespace HasState {
    export const Domain = StateDomain(`Tasks.StateDomain<${ConfigDomain.canonicalName}>`, ConfigDomain);
    export interface BindingType extends Objects.BindingType<string> { task: Objects.Binding<string> };
    export type ValueType = Introspection.getValueType<typeof Domain>;
    export const Descriptor = new Properties.Descriptor(
        'Tasks.InviteAll.HasState',
        builder => {
            builder.description('Property representing, for a task, the current state of that task');
            builder.symbol('task', 'a Task which has state');
            builder.scalar(Domain);
        }
    );
}

describe('HasState.asJSON.from', () => {
    const input = {
        "config": {
            "owner": {
                "status": "bound",
                "objectId": "admins.persons.1"
            },
            "direction": "invite",
            "person": {
                "status": "bound",
                "objectId": "425a24ef-280a-4e62-8893-5709f1d5a1dd"
            }
        },
        "descriptor": {
            "nonce": "f9762dde-0292-4bd8-9907-14cd921b3db2",
            "session": "?",
            "principal": "425a24ef-280a-4e62-8893-5709f1d5a1dd"
        },
        "progress": {}
    };
    it('parses ConfigDomain from a string', () => {
        const domain = ConfigDomain;
        const asJSON = domain.asJSON();
        expect(asJSON).toBeTruthy();
        const result = asJSON?.from(input.config, { onError: error => console.error(`Parsing JSON ${JSON.stringify(input.config)} causes ${JSON.stringify(error)}`) });
        expect(result).toBeTruthy();
        expect(result?.owner).toBeTruthy();
        expect(result?.direction).toBeTruthy();
        expect(result?.person).toBeTruthy();
        expect(result?.person?.objectId).toEqual("425a24ef-280a-4e62-8893-5709f1d5a1dd");
    });
    it('parses StateDomain from a string', () => {
        const result = HasState.Domain.asJSON()?.from(input);
        expect(result).toBeTruthy();
        expect(result?.config).toBeTruthy();
        expect(result?.config?.owner).toBeTruthy();
        expect(result?.config?.direction).toBeTruthy();
        expect(result?.config?.person).toBeTruthy();
        expect(result?.config?.person?.objectId).toEqual("425a24ef-280a-4e62-8893-5709f1d5a1dd");
    });

})
