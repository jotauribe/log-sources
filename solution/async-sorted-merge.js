"use strict";

const { Heap } = require("heap-js");
const dateComparator = (a, b) => a.log.date - b.log.date;

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const heap = new Heap(dateComparator);
  await Promise.all(
    logSources.map(async (source, index) => {
      if (!source.drained) {
        heap.push({ log: await source.popAsync(), logSourceKey: index });
      }
    })
  );

  while (!heap.isEmpty()) {
    const head = heap.pop();
    const { log, logSourceKey } = head;
    const source = logSources[logSourceKey];

    printer.print(log);

    const nextLog = await source.popAsync();
    if (nextLog) heap.push({ log: nextLog, logSourceKey });
  }

  printer.done();
  return console.log("Async sort complete.");
};
