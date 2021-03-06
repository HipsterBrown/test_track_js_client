import $ from 'jquery';
import Session from './session';

var TestTrack = new Session().getPublicAPI(),
  notifyListener = function() {
    window.dispatchEvent(
      new CustomEvent('tt:lib:loaded', {
        detail: {
          TestTrack: TestTrack
        }
      })
    );
  };

try {
  // Add class to body of page after body is loaded to enable chrome extension support
  $(document).ready(function() {
    $(document.body).addClass('_tt');
    try {
      window.dispatchEvent(new CustomEvent('tt:class:added'));
    } catch (e) {
      // ignore
    }
  });
  // **** The order of these two lines is important, they support 2 different cases:
  // in the case where there is already code listening for 'tt:lib:loaded', trigger it immediately
  // in the case where there is not yet code listening for 'tt:lib:loaded', listen for 'tt:listener:ready' and then trigger 'tt:lib:loaded'
  notifyListener();
  window.addEventListener('tt:listener:ready', notifyListener);
} catch (e) {
  // ignore
}

export default TestTrack;
