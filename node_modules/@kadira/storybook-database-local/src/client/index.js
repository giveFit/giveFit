import Database from '@kadira/storybook-database';
import BundledPersister from './bundledPersister';
import DevServerPersister from './devServerPersister';

export default function createDatabase({ url, bundled }) {
  let persister = null;
  if (bundled) {
    persister = new BundledPersister({ url });
  } else {
    persister = new DevServerPersister({ url });
  }

  return new Database({ persister });
}
