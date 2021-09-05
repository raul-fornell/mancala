const events = [];

export function addEventListener(event, callback) {
  events.push({ event, callback })
}

export function dispatchEvent(event, value) {
  events.filter(item => item.event === event)
        .forEach(item => item.callback(value));
}

