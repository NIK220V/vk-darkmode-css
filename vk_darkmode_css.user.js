// ==UserScript==
// @name         NightMode-Revamped for VK
// @run-at       document-start
// @version      2.0.6
// @description  Because you know you need it
// @author       https://vk.com/id71110013
// @homepage     https://github.com/NIK220V/vk-darkmode-css
// @updateURL    https://github.com/NIK220V/vk-darkmode-css/raw/master/vk_darkmode_css.meta.js
// @downloadURL  https://github.com/NIK220V/vk-darkmode-css/raw/master/vk_darkmode_css.user.js
// @match        *://*.vk.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

class NightModeSettings {

    constructor(){
        this.settings = GM_getValue("VKNSettings");
        if (this.settings === undefined)
            this.resetSettings();
    }

    resetSettings(){
        GM_setValue("VKNSettings", {enabled: false, noOnlineRequests: false, silentWriting: false, silentReading: false, silentVideo: false, noMessageDeletion: false});
    }

    isOnlineRequestingDisabled(){
        return this.settings.noOnlineRequests;
    }

    isSilentWriting(){
        return this.settings.silentWriting;
    }

    isSilentReading(){
        return this.settings.silentReading;
    }

    isSilentVideoWatching(){
        return this.settings.silentVideo;
    }

    isMessageDeletionBanned(){
        return this.settings.noMessageDeletion;
    }

    isEnabled(){
        return this.settings.enabled;
    }

    setEnabled(v){
        this.settings.enabled = v;
    }

    setOnlineRequestingDisabled(v){
        this.settings.noOnlineRequests = v;
    }

    setSilentWriting(v){
        this.settings.silentWriting = v;
    }

    setSilentReading(v){
        this.settings.silentReading = v;
    }

    setSilentVideoWatching(v){
        this.settings.silentVideo = v;
    }

    setMessageDeletionBanned(v){
        this.settings.noMessageDeletion = v;
    }

    save(){
        GM_setValue("VKNSettings", this.settings);
    }

}

class NightMode {

    constructor(){
        this.settings = new NightModeSettings();
        this.createSchemeElement();
        this.createSettingsElement();
        if (this.settings.isEnabled())
            this.appendStyles();
        this.appendSettings();
    }

    createSchemeElement(){
        this.scheme = document.createElement('style');
        this.scheme.id = 'vknightmode';
        this.scheme.innerText = `
:root {
  --very_gray: rgba(17, 17, 17, 1);
  --slightly_gray: rgba(35, 35, 35, 1);
  --slightly_gray_1: rgba(36, 36, 36, 1);
  --slightly_gray_hovered: rgba(71, 71, 71, 1);
  --slighterer_gray_hovered: #5d5c5c;
  --okay_gray: rgba(136, 136, 136, 1);
  --unread_message: rgba(55, 55, 55, 1);
  --read_text: rgba(175, 175, 175, 1);
  --linked_gray: #828282;
  --linked_gray_light: #999999;
}
[scheme=vkcom_dark] {
  --accent: var(--okay_gray);
  --text_link: var(--linked_gray);
  --vkui--color_text_link: var(--linked_gray);
  --text_subhead: var(--read_text);
  --vkui--color_text_subhead: var(--read_text);
  --button_primary_background: var(--slightly_gray_hovered);
  --button_primary_foreground: var(--white);
  --background_page: var(--very_gray);
  --content_tint_background: var(--very_gray);
  --im_text_name: var(--read_text);
  --vkui--vkontakte_color_im_text_name: var(--read_text);
  --link_alternate: var(--white);
  --button_secondary_background: var(--very_gray);
  --vkui--color_background_secondary: var(--very_gray);
  --blue_400: var(--okay_gray);
  --vkui--color_icon_accent: var(--linked_gray_light);
  --vkui--color_background_accent: var(--okay_gray);
  --vkui--color_text_accent: var(--okay_gray);
}
[scheme=vkcom_dark] .FlatButton--primary, [scheme=vkcom_dark] .Button--primary {
  --vkui--color_text_contrast_themed: var(--white);
}
[scheme=vkcom_dark] #react_rootLeftMenuRoot > div > nav > ol {
  --text_primary: var(--okay_gray);
  --vkui--color_text_primary: var(--okay_gray);
  --vkui--color_icon_accent: var(--linked_gray_light);
}
[scheme=vkcom_dark] .nim-dialog_unread, [scheme=vkcom_dark] .nim-dialog_unread-out {
  --text_subhead: var(--white);
  --vkui--color_text_subhead: var(--white);
  --text_link: var(--white);
  --vkui--color_text_link: var(--white);
}
.image_cover, .photos_choose_row, #top_notify_wrap, .photos_container .photos_row {border-radius: 5px;}
.blocked_image, .groups_blocked_spamfight_img {filter: invert(0.861);}
.media_link__label, .media_link__media {border-radius: 0}
img[src^="/images/camera_"], img[src^="/images/deactivated_"], img[src^="/images/community_"] { filter: grayscale(1) invert(0.862); }
.redesigned-group-subscribed {color: var(--linked_gray_light);}
/* == SCREW DEFAULT API IMAGE == */
[dir=ltr] .wall_post_source_icon {background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABU1BMVEUAAAD///8REREZGRkAAAAEBAQEBAQAAAAZGRkREREjIyMAAAALCwsPDg0OBQMPDg0LCwsAAAAjIyMUFBRTUVHQsKrQsKpTUVEUFBQFBQXj4eHt8PD/5N3/VjP/5N7t8PDj4eEFBQUAAACenp5hcnZhcnaenp4AAAAAAABdX2AHl7gHl7hdX2AAAAAAAABDQkIraXgyPkEyPkEraXhDQkIAAAAVFRXHvbuopqWfoKCopqXHvbsVFRUAAAC8vr9wcHFwcXG9v78AAAAAAAAEBATZ2dnf39/Z2dkEBAQAAAAAAAAAAAABAQEqKioqKioBAQEAAAAAAABGRkZGRkZCQkKyurzEIgKyurxCQkJxcXFxcXGIiIh6fH11Y2B6fH2IiIh1dHQHJSwAAAAHJi11dHR4eHgsJiR4eHiQkJCQkJBDQ0NKSUlCQkJubm5ubm5DQ0P///8TfFsbAAAAUnRSTlMAAMb6LwICL/rG75yLoJygi5zvtPv///u0svr7+/v7+/qytP3///20m/z///ybH+z+///+7CDN/f////3NfPn+/vl8B779//2+BwELi+vriwsBriooAgAAAAFiS0dEAf8CLd4AAAAHdElNRQfhDBYUKBWK4cYoAAAAhUlEQVQI1wXBQwICAAAEwM22bdu2bduu/9+aAZFEBgVU0OgMMIcsNofL4wtGQojG4olkKp3J5nIoFkqVWqPV6ZcGGFcm83qztVh3Ntj3DufheHK5zx54fRd/4BoM3cIREKL3WDyRTD3SBCDzzOZe+cK7CKBU/lSqtW+9ATTRand+3V4fgz8s+hhKWwGqOQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMi0yMlQyMDo0MDoyMS0wNTowMAmNQVUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTItMjJUMjA6NDA6MjEtMDU6MDB40PnpAAAAAElFTkSuQmCC');}
a.im-mess-stack--lnk[href="/notqb"]::after{  content: '12345'; color: #1111; margin-left: 5px; margin-right: -22.5px; background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2012%2012%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m2.25%206.75%202.25%202.25%205.25-5.25%22%20fill%3D%22none%22%20stroke%3D%22%235c9ce6%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%2F%3E%3C%2Fsvg%3E") no-repeat 0;
`.replaceAll("\n", ' ');
    }

    createSettingsElement(){
        this.nightModeSettingsDiv = document.createElement('div');
        this.nightModeSettingsDiv.innerHTML = `<a id="top_nightmode_settings" class="TopNavBtn" onclick="return checkEvent(event);" aria-label="VKN Настройки" aria-haspopup="false" accesskey="5">
    <span class="blind_label">VKN Настройки</span>
    <div class="TopNavBtn__icon"><svg width="26" height="26" viewBox="0 2 28 28" preserveAspectRatio="xMidYMid meet" focusable="false" style="fill: var(--accent);pointer-events: none;display: block;width: 100%;height: 100%;"><g>
        <path d="M15.1480123,2.04074374 C15.5755544,2.10915048 15.9799903,2.27274253 16.3431401,2.56326238 C16.9380313,3.03917538 17.2213264,3.6390943 17.440285,4.51492875 C17.4963389,4.73914434 17.593329,5.00052458 17.7145515,5.25420891 C17.9926195,5.37242817 18.2646756,5.50383096 18.5298601,5.64789715 C18.7916136,5.58322866 19.0429929,5.49734188 19.2437275,5.40389237 C20.6559711,4.74643965 21.840713,4.78098291 22.810912,5.82743499 C22.8929739,5.9159466 22.941971,5.97458142 23.0485755,6.10622704 L23.6778959,6.883373 C23.8471459,7.09237932 23.9194483,7.18760885 24.0262155,7.36529764 C24.7180725,8.51673099 24.4482992,9.58908522 23.5738105,10.7510996 C23.4287142,10.9439025 23.2805641,11.1963043 23.1566296,11.4618362 C23.234813,11.7443748 23.2999255,12.0308759 23.3516777,12.3205887 C23.5744346,12.499037 23.8112044,12.6554046 24.020328,12.7621251 C24.8244599,13.1724917 25.3452754,13.5834783 25.6751694,14.2701797 C25.8765523,14.6893747 25.9449732,15.1202452 25.9154506,15.5522176 C25.8998459,15.7805458 25.8751715,15.9078085 25.8093791,16.1927867 L25.584428,17.1671567 C25.5186356,17.4521349 25.4850245,17.5773344 25.3989575,17.7893951 C25.236128,18.1905912 24.9857505,18.5478612 24.6209857,18.8363508 C24.0234489,19.3089379 23.3751784,19.4500197 22.4725365,19.4663465 C22.2442027,19.4704766 21.9713526,19.5054091 21.6999312,19.5651972 C21.523462,19.809022 21.3355319,20.0443479 21.1368338,20.2703621 C21.1402402,20.5445584 21.1674942,20.8140308 21.21419,21.0344025 C21.4013318,21.9175824 21.4096951,22.5809743 21.0836369,23.2695052 C20.8845955,23.6898172 20.592805,24.0141458 20.2385202,24.2630515 C20.0512554,24.3946159 19.9368256,24.4555293 19.6739515,24.5837416 L18.7751575,25.0221127 C18.5122834,25.150325 18.3938329,25.2029948 18.174867,25.2695623 C17.7606072,25.3955009 17.3253886,25.4257584 16.8716362,25.3238353 C16.1283249,25.1568707 15.6107139,24.7418555 15.0299746,24.0506458 C14.8764629,23.8679325 14.666696,23.6690715 14.4386231,23.4900155 C14.2928169,23.4966652 14.1465814,23.5 14,23.5 C13.8534186,23.5 13.7071831,23.4966652 13.5613769,23.4900155 C13.333304,23.6690715 13.1235371,23.8679325 12.9700254,24.0506458 C12.3892861,24.7418555 11.8716751,25.1568707 11.1283638,25.3238353 C10.6746114,25.4257584 10.2393928,25.3955009 9.82513296,25.2695623 C9.60616706,25.2029948 9.48771663,25.150325 9.22484252,25.0221127 L8.32604848,24.5837416 C8.24702677,24.5452709 8.19801021,24.5209844 8.14075277,24.4911677 C6.8292028,23.8081792 6.44471312,22.6441436 6.78581002,21.0344025 C6.83250579,20.8140308 6.85975979,20.5445584 6.86316617,20.2703621 C6.66446808,20.0443479 6.47653801,19.809022 6.30006883,19.5651972 C6.02864736,19.5054091 5.75579729,19.4704766 5.52746347,19.4663465 C4.62482163,19.4500197 3.97655107,19.3089379 3.37901428,18.8363508 C3.0142495,18.5478612 2.76387202,18.1905912 2.60104249,17.7893951 C2.51497546,17.5773344 2.48136436,17.4521349 2.41557197,17.1671567 L2.19062092,16.1927867 C2.12096477,15.8910728 2.09530369,15.7565206 2.08209042,15.5120465 C2.05732004,15.053741 2.14502416,14.5984123 2.3776563,14.1664301 C2.71660439,13.5370263 3.21830349,13.1506686 3.97967199,12.7621251 C4.18879563,12.6554046 4.42556542,12.499037 4.64832231,12.3205887 C4.70007448,12.0308759 4.76518695,11.7443748 4.84337042,11.4618362 C4.71943592,11.1963043 4.5712858,10.9439025 4.42618951,10.7510996 C3.5517008,9.58908522 3.28192751,8.51673099 3.97378453,7.36529764 C4.08055167,7.18760885 4.15285412,7.09237932 4.3221041,6.883373 L4.95142449,6.10622704 C5.05802901,5.97458142 5.10702613,5.9159466 5.18908804,5.82743499 C6.15928699,4.78098291 7.34402894,4.74643965 8.75627252,5.40389237 C8.95700705,5.49734188 9.20838638,5.58322866 9.47013989,5.64789715 C9.73532438,5.50383096 10.0073805,5.37242817 10.2854485,5.25420891 C10.406671,5.00052458 10.5036611,4.73914434 10.559715,4.51492875 C10.7786736,3.6390943 11.0619687,3.03917538 11.6568599,2.56326238 C12.0200097,2.27274253 12.4244456,2.10915048 12.8519877,2.04074374 C13.032777,2.01181746 13.1518478,2.00309724 13.3419913,2.0007662 L14.5,2 C14.7924742,2 14.9220257,2.00458589 15.1480123,2.04074374 Z M14.585691,4.00020354 L13.5,4 C13,4 12.75,4 12.5,5 C12.3612322,5.55507136 12.0684122,6.26419483 11.6642951,6.87084066 C11.0217099,7.08123793 10.4173658,7.37609281 9.86438385,7.74228441 C9.14762015,7.67166339 8.42429968,7.45545202 7.91218277,7.21704225 C6.97770671,6.78200835 6.82037661,6.97629484 6.50571641,7.36486782 L5.87639602,8.14201378 C5.56173583,8.53058676 5.40440573,8.72487325 6.02422159,9.54848014 C6.37307911,10.0120395 6.74535143,10.6983758 6.9612408,11.4045337 C6.74017617,12.0038451 6.59346671,12.6391528 6.53230345,13.2992655 C6.03068735,13.8335281 5.40134246,14.2819913 4.88878006,14.5435634 C3.97064776,15.012107 4.02688552,15.2556995 4.13936105,15.7428845 L4.3643121,16.7172546 C4.47678763,17.2044396 4.53302539,17.4480322 5.56363322,17.4666736 C6.13345667,17.4769805 6.88659564,17.6018356 7.56651129,17.8570989 C7.9118453,18.4318656 8.33202244,18.9565458 8.81356234,19.4176592 C8.90791525,20.1351985 8.86006774,20.8935264 8.74236787,21.4489883 C8.52869524,22.4573751 8.75339375,22.5669679 9.20279077,22.7861535 L10.1015848,23.2245246 C10.5509818,23.4437102 10.7756804,23.553303 11.43875,22.7641017 C11.8105483,22.3215785 12.3925558,21.8066745 13.0292334,21.4377508 C13.3470161,21.4788205 13.6710347,21.5 14,21.5 C14.3289653,21.5 14.6529839,21.4788205 14.9707666,21.4377508 C15.6074442,21.8066745 16.1894517,22.3215785 16.56125,22.7641017 C17.2243196,23.553303 17.4490182,23.4437102 17.8984152,23.2245246 L18.7972092,22.7861535 C19.2466063,22.5669679 19.4713048,22.4573751 19.2576321,21.4489883 C19.1399323,20.8935264 19.0920847,20.1351985 19.1864377,19.4176592 C19.6679776,18.9565458 20.0881547,18.4318656 20.4334887,17.8570989 C21.1134044,17.6018356 21.8665433,17.4769805 22.4363668,17.4666736 C23.4669746,17.4480322 23.5232124,17.2044396 23.6356879,16.7172546 L23.860639,15.7428845 C23.9731145,15.2556995 24.0293522,15.012107 23.1112199,14.5435634 C22.5986575,14.2819913 21.9693127,13.8335281 21.4676965,13.2992655 C21.4065333,12.6391528 21.2598238,12.0038451 21.0387592,11.4045337 C21.2546486,10.6983758 21.6269209,10.0120395 21.9757784,9.54848014 C22.5955943,8.72487325 22.4382642,8.53058676 22.123604,8.14201378 L21.4942836,7.36486782 C21.1796234,6.97629484 21.0222933,6.78200835 20.0878172,7.21704225 C19.5757003,7.45545202 18.8523799,7.67166339 18.1356162,7.74228441 C17.5826342,7.37609281 16.9782901,7.08123793 16.3357049,6.87084066 C15.9315878,6.26419483 15.6387678,5.55507136 15.5,5 C15.2647059,4.05882353 15.0294118,4.00346021 14.585691,4.00020354 Z M14,9.5 C16.4852814,9.5 18.5,11.5147186 18.5,14 C18.5,16.4852814 16.4852814,18.5 14,18.5 C11.5147186,18.5 9.5,16.4852814 9.5,14 C9.5,11.5147186 11.5147186,9.5 14,9.5 Z M14,11.5 C12.6192881,11.5 11.5,12.6192881 11.5,14 C11.5,15.3807119 12.6192881,16.5 14,16.5 C15.3807119,16.5 16.5,15.3807119 16.5,14 C16.5,12.6192881 15.3807119,11.5 14,11.5 Z" fill="currentColor"</path>
      </g></svg></div>
</a>`;
        this.nightModeSettingsDiv.querySelector('#top_nightmode_settings').onmousedown = () => this.showSettings();
    }

    showSettings(){
        if (document.getElementById('vknsettings'))
            return;
        let box = showFastBox('Настройки', `<div class="box_body" style="display: block; padding: 0px;">
        <div style="padding: 10px 25px;">
            <h4 class="subheader">Управление отправкой данных</h4>
            <div style="padding: 5px;">
                <div class="checkbox" id="nightmode_setting_1" role="checkbox" tabindex="0">
                    Не отправлять данные об онлайне
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="checkbox" id="nightmode_setting_2" role="checkbox" tabindex="0">
                    Не показывать, что вы пишете сообщение
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="checkbox" id="nightmode_setting_3" role="checkbox" tabindex="0">
                    Не помечать сообщения прочитанными
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="checkbox" id="nightmode_setting_4" role="checkbox" tabindex="0">
                    Не показывать, что вы просмотрели видео
                </div>
            </div>
            <div style="padding: 5px;">
                <div class="checkbox" id="nightmode_setting_5" role="checkbox" tabindex="0">
                    Оставлять удаленные навсегда сообщения
                </div>
            </div>
        </div>
    </div>`);
        let nightmode = this.settings;
        let setting1 = box.bodyNode.querySelector('#nightmode_setting_1');
        setting1.onclick = () => {
            checkbox(setting1);
            nightmode.setOnlineRequestingDisabled(isChecked(setting1));
            nightmode.save();
        };
        if (nightmode.isOnlineRequestingDisabled())
            setting1.classList.add('on');
        let setting2 = box.bodyNode.querySelector('#nightmode_setting_2');
        setting2.onclick = () => {
            checkbox(setting2);
            nightmode.setSilentWriting(isChecked(setting2));
            nightmode.save();
        };
        if (nightmode.isSilentWriting())
            setting2.classList.add('on');
        let setting3 = box.bodyNode.querySelector('#nightmode_setting_3');
        setting3.onclick = () => {
            checkbox(setting3);
            nightmode.setSilentReading(isChecked(setting3));
            nightmode.save();
        };
        if (nightmode.isSilentReading())
            setting3.classList.add('on');
        let setting4 = box.bodyNode.querySelector('#nightmode_setting_4');
        setting4.onclick = () => {
            checkbox(setting4);
            nightmode.setSilentVideoWatching(isChecked(setting4));
            nightmode.save();
        };
        if (nightmode.isSilentVideoWatching())
            setting4.classList.add('on');
        let setting5 = box.bodyNode.querySelector('#nightmode_setting_5');
        setting5.onclick = () => {
            checkbox(setting5);
            nightmode.setMessageDeletionBanned(isChecked(setting5));
            nightmode.save();
        };
        if (nightmode.isMessageDeletionBanned())
            setting5.classList.add('on');
    }

    getMenuElement(){
        return document.querySelector('#top_nav > li.HeaderNav__item.HeaderNav__btns');
    }

    toggle(){
        this.settings.setEnabled(!this.settings.isEnabled());
        this.settings.save();
        this.apply();
    }

    apply(){
        let head = document.head || document.getElementsByTagName("head")[0];
        let nightmode = this;
        if (this.settings.isEnabled()) {
            if (!this.appended)
                head.appendChild(this.scheme);
            this.intervalTask = setInterval(function(){
                if (head.lastChild.id != nightmode.scheme.id)
                    nightmode.swapElements(nightmode.scheme, head.lastChild);
            }, 250);
        } else {
            if (this.intervalTask >= 0)
                clearInterval(this.intervalTask);
            this.appended = false;
            head.removeChild(this.scheme);
        }
    }

    appendStyles(){
        let head = document.head || document.getElementsByTagName("head")[0];
        if (!head){
            setTimeout(this.appendStyles, 10);
            return;
        }
        let nightmode = this;
        head.appendChild(this.scheme);
        this.appended = true;
        this.intervalTask = setInterval(function(){
            if (nightmode.settings.isEnabled() && head.lastChild.id != nightmode.scheme.id)
                nightmode.swapElements(nightmode.scheme, head.lastChild);
        }, 250);
    }

    appendSettings(){
        let nightmode = this;
        setTimeout(function(){
            let v = nightmode.getMenuElement();
            if (!v)
                return;
            v.appendChild(nightmode.nightModeSettingsDiv.firstChild);
        }, 5000);
    }

    swapElements(obj1, obj2) {
        if (obj1.id == obj2.id)
            return;
        var temp = document.createElement("div");
        obj1.parentNode.insertBefore(temp, obj1);
        obj2.parentNode.insertBefore(obj1, obj2);
        temp.parentNode.insertBefore(obj2, temp);
        temp.parentNode.removeChild(temp);
    }

}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

let nightmode = new NightMode();
unsafeWindow.nightmodeRevamped = nightmode;

XMLHttpRequest.prototype.realXMLRequestSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(vData) {
    if (vData && typeof(vData) == 'string'){
        if (
            (vData.includes('a_mark_read') && nightmode.settings.isSilentReading()) || // Read
            ((vData.includes('a_activity') || vData.includes('a_block_release')) && !vData.includes('a_activity_history_box') && nightmode.settings.isSilentWriting()) || // Write
            (vData.includes('a_online') && nightmode.settings.isOnlineRequestingDisabled()) || // Online
            ((vData.includes('event=load') || vData.includes('videocat') || vData.includes('track_player_events') || vData.includes('seek_durations') || vData.includes('inc_view_counter')) && nightmode.settings.isSilentVideoWatching()) // Video
        ){
            this.onreadystatechange = function(){};
            this.abort();
            return;
        }
        if (vData.includes('a_start') && vData.includes('block')) // Silent community message reading
            vData = vData.replace('block=true', 'block=false');
        if (vData.includes('al=1') && vData.includes('hash=') && vData.includes('mode=') && (vData.includes('=dark') || vData.includes('=light'))){
            nightmode.settings.setEnabled(vData.includes('mode=dark'));  // Native vk nightmode change
            nightmode.settings.save();
            nightmode.apply();
        }
    }
    // Этот костыль запрещает удалять сообщения
    if (nightmode.settings.isMessageDeletionBanned() && !this.onprogress) this.onprogress = () => {
        try {
            let json = JSON.parse(this.responseText), edited = false;
            if (json.ts && json.updates){
                for (let update of json.updates) {
                    if (update[0] == 2 && update[2] == 131200) {
                        let msg = document.querySelector('[data-msgid="'+update[1]+'"]');
                        if (msg && msg.querySelector('._im_log_body'))
                            msg.querySelector('._im_log_body').innerHTML += ' <span class="im-mess--lbl-was-edited _im_edit_time" data-time="'+Math.round(+new Date()/1000)+'">(удалено)</span>';
                        update[2] = 1;
                        edited = true;
                    }
                }
                if (edited) {
                    Object.defineProperty(this, 'responseText', {
                        writable: true
                    });
                    this.responseText = JSON.stringify(json);
                }
            }
        } catch(e){}
    };
    this.realXMLRequestSend(vData);
};
