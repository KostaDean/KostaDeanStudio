/* MathWorksSounds.js — shared transition cue */
(function(w){
"use strict"; let ctx;
function tone(c,f,t,d,v){const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.04)}
function transition(){const AC=w.AudioContext||w.webkitAudioContext;if(!AC)return;if(!ctx)ctx=new AC();if(ctx.state==="suspended")ctx.resume().catch(()=>{});const t=ctx.currentTime+.01;tone(ctx,261.63,t,.14,.10);tone(ctx,329.63,t+.15,.14,.10);tone(ctx,392,t+.30,.23,.11)}
w.MathWorksSounds={transition};
})(window);