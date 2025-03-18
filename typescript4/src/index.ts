import { Definitions } from '@pitaman71/omniglot-live-data';

import * as Currency from './Currency';
import * as Financial from './Financial';
import * as Geo from './Geo';
import * as Logistics from './Logistics';
import * as Media from './Media';
import * as Social from './Social';
import * as Tasks from './Tasks';
import * as Temporal from './Temporal';

const directory = Definitions.Directory.from(
    Currency.directory,
    Financial.directory,
    Geo.directory,
    Logistics.directory,
    Media.directory,
    Social.directory,
    Tasks.directory,
    Temporal.directory
);

export { Currency, Financial, Geo, Logistics, Media, Social, Tasks, Temporal, directory };
