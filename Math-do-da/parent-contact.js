/* MathWorks Parent Contact Module v1.0
   Purpose: private parent communication without accounts or a server.
   The parent completes this form; their normal mail app sends the message.
   Attachments are added in the mail app, so Kosta can reply directly to the sender.
*/
(function(){
  'use strict';

  const CONTACT_EMAIL = 'info@KostaDean.studio';

  function esc(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function lessonOptions(){
    let rows = '<option value="General / Math Playground">General / Math Playground</option>';
    try{
      if(Array.isArray(LESSONS)){
        rows += LESSONS
          .slice()
          .sort((a,b)=>String(a.title).localeCompare(String(b.title)))
          .map(l=>'<option value="'+esc(l.title)+'">'+esc(l.title)+'</option>')
          .join('');
      }
    }catch(e){}
    return rows;
  }

  function currentLessonTitle(){
    try{
      if(typeof currentPreviewLesson !== 'undefined' && currentPreviewLesson && currentPreviewLesson.title){
        return currentPreviewLesson.title;
      }
    }catch(e){}
    return '';
  }

  function openParentContact(){
    const current = currentLessonTitle();

    const content = `
      <div class="instructionsTop">
        <h2>📧 Contact Kosta Dean</h2>
        <button class="secondary" onclick="closeModal()">Close</button>
      </div>

      <div class="pcIntro">
        <p>Send a question, suggestion, lesson problem, teaching idea, or success story privately to <b>${CONTACT_EMAIL}</b>.</p>
        <p><b>Attachments:</b> after you tap <i>Prepare Email</i>, your normal email app opens. Add screenshots, photos, or files there before sending.</p>
        <p><b>Replies:</b> because the message is sent from your own email account, Kosta Dean can reply directly to you using the normal Reply button.</p>
      </div>

      <div class="pcForm">
        <label><b>What is this about?</b>
          <select id="pcTopic">
            <option>Question</option>
            <option>Suggestion</option>
            <option>Lesson problem / bug</option>
            <option>Teaching idea</option>
            <option>Success story</option>
            <option>Other</option>
          </select>
        </label>

        <label><b>Lesson</b>
          <select id="pcLesson">${lessonOptions()}</select>
        </label>

        <label><b>Your message</b>
          <textarea id="pcMessage" placeholder="Please describe your question, idea, or what happened."></textarea>
        </label>

        <fieldset class="pcShare">
          <legend><b>May this information be shared with other parents?</b></legend>
          <label><input type="radio" name="pcPermission" value="Private — do not publish" checked> Keep this message private.</label>
          <label><input type="radio" name="pcPermission" value="May be shared anonymously"> You may share my comments anonymously.</label>
          <label><input type="radio" name="pcPermission" value="May be shared with the name I provide"> You may share my comments with the name I provide below.</label>
        </fieldset>

        <label><b>Name for public credit (optional)</b>
          <input id="pcDisplayName" type="text" placeholder="Leave blank if not needed">
        </label>

        <label class="pcCheck">
          <input id="pcReplyRequested" type="checkbox" checked>
          <span>Please reply if a response would be helpful.</span>
        </label>

        <div class="pcPrivacy">
          Please do not include a child's full name, address, school, photograph, or other identifying information unless it is genuinely necessary for a private support question.
        </div>

        <div class="modalBtns">
          <button class="secondary" onclick="closeModal()">Cancel</button>
          <button class="good" onclick="prepareParentEmail()">Prepare Email</button>
        </div>
      </div>
    `;

    if(typeof openModal === 'function'){
      openModal(content);
      const lesson = document.getElementById('pcLesson');
      if(current && lesson){
        [...lesson.options].some(opt=>{
          if(opt.value===current){ lesson.value=current; return true; }
          return false;
        });
      }
    }else{
      alert('The Parent Contact form could not open.');
    }
  }

  function prepareParentEmail(){
    const topic = document.getElementById('pcTopic')?.value || 'Parent message';
    const lesson = document.getElementById('pcLesson')?.value || 'General / Math Playground';
    const message = document.getElementById('pcMessage')?.value.trim() || '';
    const permission = document.querySelector('input[name="pcPermission"]:checked')?.value || 'Private — do not publish';
    const displayName = document.getElementById('pcDisplayName')?.value.trim() || '';
    const replyRequested = document.getElementById('pcReplyRequested')?.checked ? 'Yes' : 'No';

    if(!message){
      alert('Please enter your message first.');
      document.getElementById('pcMessage')?.focus();
      return;
    }

    const subject = `Math Playground — ${topic} — ${lesson}`;
    const body = [
      'Math Playground Parent Message',
      '',
      `Topic: ${topic}`,
      `Lesson: ${lesson}`,
      `Sharing permission: ${permission}`,
      `Public credit name: ${displayName || 'None provided'}`,
      `Reply requested: ${replyRequested}`,
      '',
      'Message:',
      message,
      '',
      'Attachments:',
      'If needed, I will attach screenshots, photos, or files to this email before sending.',
      '',
      'Sent from the Math Playground Parent Contact form.'
    ].join('\n');

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // A direct navigation is the most compatible way to invoke Mail on iPhone/iPad.
    window.location.href = mailto;
  }

  // Module-specific styles. Keeping them here avoids growing the main index stylesheet.
  const style = document.createElement('style');
  style.id = 'mw-parent-contact-styles';
  style.textContent = `
    .pcIntro{
      background:#eff6ff;
      border:3px solid #93c5fd;
      border-radius:18px;
      padding:14px 16px;
      margin:10px 0 16px;
      color:#334155;
      line-height:1.5;
    }
    .pcIntro p{margin:7px 0}
    .pcForm label{display:block;margin:14px 0;color:#172033}
    .pcForm select,.pcForm input[type="text"],.pcForm textarea{
      width:100%;
      border:2px solid #bfdbfe;
      border-radius:14px;
      padding:12px;
      font:inherit;
      background:white;
      margin-top:7px;
    }
    .pcForm textarea{min-height:180px;line-height:1.45;resize:vertical}
    .pcShare{
      border:3px solid #dbeafe;
      border-radius:18px;
      padding:12px 14px;
      margin:16px 0;
      background:#f8fbff;
    }
    .pcShare label{
      display:flex;
      gap:10px;
      align-items:flex-start;
      margin:10px 0;
      line-height:1.35;
    }
    .pcShare input,.pcCheck input{width:auto!important;transform:scale(1.25);margin-top:3px}
    .pcCheck{display:flex!important;gap:10px;align-items:flex-start}
    .pcPrivacy{
      background:#fff7ed;
      border:2px solid #fdba74;
      border-radius:14px;
      padding:12px;
      color:#7c2d12;
      font-weight:700;
      line-height:1.4;
      margin:14px 0;
    }
  `;
  document.head.appendChild(style);

  window.openParentContact = openParentContact;
  window.prepareParentEmail = prepareParentEmail;
})();
