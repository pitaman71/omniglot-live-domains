import { Definitions } from '@pitaman71/omniglot-live-data';

import * as Contacts from './Contacts';
import * as Conversations from './Conversations';
import * as Identity from './Identity';
import * as Markup from './Markup';
import * as Profile from './Profile';

const directory = Definitions.Directory.from(Contacts.directory, Conversations.directory, Identity.directory, Markup.directory, Profile.directory);

export { directory, Conversations, Contacts, Identity, Markup, Profile }
