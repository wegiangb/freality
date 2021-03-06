/**
 * A Turing Machine.
 *
 * @author Pablo Mayrgundter <pablo.mayrgundter@gmail.com>
 */

var state;
/**
 * Javascript conveniently allows for overflow and underflow of
 * arrays, so while an initial size of 10 is allocated, min/max bounds
 * are recorded as the tape is visited, and the invariant of initial
 * zero values is always maintained.
 */
var tapeNdx, minIndex, maxIndex;
var instCount;
var hasRun;
var tape = new Array(10);

function init() {

  state = 'start';
  minIndex = tapeNdx = 0;
  maxIndex = 10;
  instCount = 0;
  hasRun = false;

  // Set tape vals to 0.
  for (var i = 0; i < maxIndex; i++) {
    tape[i] = 0;
  }

  elt('log').innerHTML = '';
  elt('tape').innerHTML = '';

  logTape('INITIAL TAPE:\n  ...,'+ tape +',...\n');
}

function run(programId) {

  if (hasRun) {
    init();
  }

  // A few lines to make debugging output useful.
  var e = elt(programId);
  var txt = e.value;
  var prog = eval(txt);

  /* Will this loop ever break? */
  while (true) {
    instCount++;
    // Parse instructions.
    logTape(instCount + ': before operation the tape is:\n    '+ tape);
    var inst = prog[state];
    if (inst == 'stop') {
      break;
    }
    if (!inst) {
      log('At state ' + state +
                  ', no instruction found' + inst);
    }
    var val = tape[tapeNdx];
    log('read tape['+ tapeNdx +'], got: ' + val);

    var write = null;
    var shift = null;
    var newState = null;

    if (inst.write) {
      write = inst.write;
      if (inst.shift)
        shift = inst.shift;
      if (inst.newState)
        newState = inst.newState;
    } else if (inst.read) {
      var obj = inst.read;
      var op = obj[val];
      if (!op) {
        log('At state ' + state +
                    ', unhandled input: ' + val);
      }
      if (op.write)
        write = op.write;
      if (op.shift)
        shift = op.shift;
      if (op.newState)
        newState = op.newState;
    } else if (inst.newState) {
      newState = inst.newState;
    }

    // Apply instructions.
    if (write)
      tape[tapeNdx] = write;

    if (shift) {
      if (shift == 'left') {
        tapeNdx--;
        log('moving left, new index: ' + tapeNdx);
        if (tapeNdx < minIndex) {
          tap[tapeNdx] = 0;
          minIndex = tapeNdx;
        }
      } else if (shift == 'right') {
        tapeNdx++;
        log('moving right, new index: ' + tapeNdx);
        if (tapeNdx > maxIndex) {
          tap[tapeNdx] = 0;
          maxIndex = tapeNdx;
        }
      }
    }

    if (newState) {
      log('change state from "'+ state +'" to "' + newState + '"');
      state = newState;
    }

    logTape('  after operation it is:\n    '+ tape +'\n');
  }
  log('stop');
  logTape('\nFINAL TAPE:\n  ...,' + tape +',...');

  hasRun = true;
}

// Helpers.
function elt(id) {
  return document.getElementById(id);
}

function log(msg) {
  elt('log').innerHTML += msg + '\n';
}

function logTape(msg) {
  elt('tape').innerHTML += msg + '\n';
}
