/* MathWorks Shared WinnerWindow Module v1.0
   One completion-window component for every lesson loaded through MathWorks.
   Lesson-specific data is supplied at runtime by index.html.
*/
(function(){
  'use strict';

  const DONATE_URL='https://www.paypal.com/donate/?hosted_button_id=DMMXW39SYGURC';
  let currentConfig=null;

  function injectStyles(){
    if(document.getElementById('mw-winner-window-styles')) return;
    const style=document.createElement('style');
    style.id='mw-winner-window-styles';
    style.textContent=`
      .mwWinnerOverlay{
        position:fixed;
        inset:0;
        z-index:2147483646;
        display:none;
        align-items:center;
        justify-content:center;
        padding:18px;
        background:rgba(15,23,42,.58);
      }
      .mwWinnerOverlay.show{display:flex}
      .mwWinnerCard{
        width:min(92vw,560px);
        max-height:92vh;
        overflow:auto;
        background:#fffbea;
        border:5px solid #facc15;
        border-radius:26px;
        padding:22px;
        box-shadow:0 22px 70px rgba(0,0,0,.42);
        text-align:center;
        font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }
      .mwWinnerCard h2{
        margin:0 0 8px;
        color:#172033;
        font-size:clamp(1.8rem,7vw,3rem);
      }
      .mwWinnerLesson{
        margin:0 0 10px;
        color:#475569;
        font-weight:900;
        font-size:clamp(1.15rem,4vw,1.4rem);
      }
      .mwWinnerQuestion{
        margin:0 0 18px;
        color:#334155;
        font-weight:800;
        font-size:clamp(1rem,4vw,1.25rem);
      }
      .mwWinnerOptions{
        margin:0 0 18px;
        padding:14px;
        border:3px solid #93c5fd;
        border-radius:18px;
        background:#eff6ff;
        text-align:left;
      }
      .mwWinnerOptions label{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin:8px 0;
        font-weight:900;
        color:#1e3a5f;
      }
      .mwWinnerOptions select{
        flex:1 1 190px;
        max-width:250px;
        padding:10px;
        border:2px solid #60a5fa;
        border-radius:12px;
        background:white;
        font-size:1rem;
      }
      .mwWinnerButton{
        display:block;
        width:100%;
        min-height:62px;
        border:0;
        border-radius:18px;
        color:white;
        font:900 clamp(18px,4.5vw,26px)/1.15 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        margin:0 0 13px;
        padding:14px 18px;
        text-decoration:none;
        box-sizing:border-box;
      }
      .mwWinnerSelect{background:#16a34a;box-shadow:0 8px 20px rgba(22,163,74,.34)}
      .mwWinnerSelect.selected{background:#15803d;box-shadow:none}
      .mwWinnerClose{background:#475569}
      .mwWinnerDonate{
        background:#f59e0b;
        border:3px solid #92400e;
        color:#172033;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .mwHidden{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function ensureWindow(){
    injectStyles();
    let overlay=document.getElementById('mwWinnerOverlay');
    if(overlay) return overlay;

    overlay=document.createElement('div');
    overlay.id='mwWinnerOverlay';
    overlay.className='mwWinnerOverlay';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`
      <div class="mwWinnerCard" role="dialog" aria-modal="true" aria-labelledby="mwWinnerTitle">
        <h2 id="mwWinnerTitle">🏆 Lesson Complete!</h2>
        <p id="mwWinnerLesson" class="mwWinnerLesson"></p>
        <p id="mwWinnerQuestion" class="mwWinnerQuestion"></p>

        <div id="mwTimesTableOptions" class="mwWinnerOptions mwHidden">
          <label>Times Table practice
            <select id="mwTimesMode">
              <option value="random">Random</option>
              <option value="rowOrder">By row in order</option>
              <option value="rowRandom">By row random</option>
              <option value="missingFactor">Missing factor</option>
            </select>
          </label>
          <label id="mwTimesRowLabel" class="mwHidden">Row
            <select id="mwTimesRow">
              <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
              <option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>
            </select>
          </label>
        </div>

        <button id="mwWinnerSelect" class="mwWinnerButton mwWinnerSelect">SELECT FOR LEARNING PATH</button>
        <button id="mwWinnerClose" class="mwWinnerButton mwWinnerClose">Preview Another Lesson</button>
        <a id="mwWinnerDonate" class="mwWinnerButton mwWinnerDonate" href="${DONATE_URL}" target="_blank" rel="noopener">❤️ Donate</a>
      </div>
    `;
    document.body.appendChild(overlay);

    const mode=document.getElementById('mwTimesMode');
    mode.addEventListener('change',updateRowVisibility);

    document.getElementById('mwWinnerSelect').addEventListener('click',function(){
      if(!currentConfig || typeof currentConfig.onSelect!=='function') return;
      currentConfig.onSelect(getLessonOptions());
    });

    document.getElementById('mwWinnerClose').addEventListener('click',function(){
      const callback=currentConfig&&currentConfig.onClose;
      hide();
      if(typeof callback==='function') callback();
    });

    return overlay;
  }

  function updateRowVisibility(){
    const mode=document.getElementById('mwTimesMode');
    const label=document.getElementById('mwTimesRowLabel');
    if(!mode||!label) return;
    label.classList.toggle('mwHidden',!(mode.value==='rowOrder'||mode.value==='rowRandom'));
  }

  function getLessonOptions(){
    if(!currentConfig || currentConfig.file!=='TimesTable.html') return null;
    return {
      mode:document.getElementById('mwTimesMode')?.value||'random',
      row:Number(document.getElementById('mwTimesRow')?.value||1)
    };
  }

  function setSelected(selected){
    const btn=document.getElementById('mwWinnerSelect');
    if(!btn) return;
    btn.textContent=selected?'✓ Added to Learning Path':'SELECT FOR LEARNING PATH';
    btn.disabled=!!selected;
    btn.classList.toggle('selected',!!selected);
  }

  function show(config){
    currentConfig=config||{};
    const overlay=ensureWindow();

    document.getElementById('mwWinnerLesson').textContent=currentConfig.title||'Lesson';
    const question=document.getElementById('mwWinnerQuestion');
    const selectBtn=document.getElementById('mwWinnerSelect');
    const closeBtn=document.getElementById('mwWinnerClose');
    const options=document.getElementById('mwTimesTableOptions');

    const isParent=currentConfig.mode==='parent-preview';
    question.textContent=isParent?'Add this lesson to the current Learning Path?':'';
    question.classList.toggle('mwHidden',!isParent);
    selectBtn.classList.toggle('mwHidden',!isParent);
    closeBtn.textContent=isParent?'Preview Another Lesson':'Continue';

    const isTimes=currentConfig.file==='TimesTable.html' && isParent;
    options.classList.toggle('mwHidden',!isTimes);

    if(isTimes){
      const saved=currentConfig.lessonOptions||{mode:'random',row:1};
      document.getElementById('mwTimesMode').value=saved.mode||'random';
      document.getElementById('mwTimesRow').value=String(saved.row||1);
      updateRowVisibility();
    }

    setSelected(!!currentConfig.selected);
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
  }

  function hide(){
    const overlay=document.getElementById('mwWinnerOverlay');
    if(overlay){
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden','true');
    }
  }

  window.MathWorksWinnerWindow={
    show,
    hide,
    setSelected,
    getLessonOptions
  };
})();
