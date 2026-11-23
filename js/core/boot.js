/* boot.js - last script: restore state, seed, start clock, first render */
(function(){
  const had=restore();
  if(!had||!S.notifs.length)seedNotifs();
  runEvents();
  if(!location.hash||location.hash==='#')location.hash=S.signedIn?'#'+HOME_ROUTE[S.role]:'#signin';
  startClock();render();
})();
