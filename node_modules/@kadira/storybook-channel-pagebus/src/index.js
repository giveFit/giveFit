import createBus from 'page-bus';
import Channel from '@kadira/storybook-channel';

export default function createChannel({ key }) {
  const transport = new PageBusTransport({ key });
  return new Channel({ transport });
}

export class PageBusTransport {
  constructor({ key }) {
    this._bus = null;
    this._bus = createBus({ key });
    this._bus.on('event', this._handleEvent.bind(this));
    this._handler = null;
  }

  setHandler(handler) {
    this._handler = handler;
  }

  send(event) {
    const data = JSON.stringify(event);
    this._bus.emit('event', data);
    return Promise.resolve(null);
  }

  _handleEvent(data) {
    const event = JSON.parse(data);
    this._handler(event);
  }
}
