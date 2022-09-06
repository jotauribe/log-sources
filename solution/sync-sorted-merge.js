"use strict";

const { Heap } = require("heap-js");
const dateComparator = (a, b) => a.log.date - b.log.date;

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const heap = new Heap(dateComparator);
  logSources.forEach((source, index) => {
    if (!source.drained) {
      heap.push({ log: source.pop(), logSourceKey: index });
    }
  });

  while (!heap.isEmpty()) {
    const { log, logSourceKey } = heap.pop();
    const source = logSources[logSourceKey];

    printer.print(log);

    const nextLog = source.pop();
    if (nextLog) heap.push({ log: nextLog, logSourceKey });
  }

  printer.done();
  return console.log("Sync sort complete.");
};
