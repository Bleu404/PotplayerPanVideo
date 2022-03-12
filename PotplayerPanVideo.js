// ==UserScript==
// @name         PotPlayer播放云盘视频
// @namespace    https://greasyfork.org/zh-CN/users/798733-bleu
// @version      v1.0.1
// @description  支持🐱‍💻百度网盘(1080p)、🐱‍👤迅雷云盘(720p)👉右键导入播放信息到webdav网盘，PotPlayer实现🥇倍速、🏆无边框、🎬更换解码器、📺渲染器等功能。
// @author       bleu
// @compatible   edge Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @license      MIT
// @match        https://pan.baidu.com/*
// @match        https://pan.xunlei.com/*
// @icon         https://img.icons8.com/ios/50/000000/cloud-mail.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.all.min.js
// @require      https://greasyfork.org/scripts/441249-bleutools/code/bleutools.js?version=1027311
// ==/UserScript==

(function () {
    'use strict';
    let bleuc,
        contextMenu,
        itemsInfo,
        arryIndex,
        tempPath,
        flag,Option,
        isCheckWebdav = true,
        m3u8File = "#EXTM3U\n",
        flieTypeStr = ".wmv,.rmvb,.avi,.mp4,.mkv,.flv,.swf.mpeg4,.mpeg2,.3gp,.mpga,.qt,.rm,.wmz,.wmd,.wvx,.wmx,.wm,.mpg,.mpeg,mov,.asf,.m4v",
        tools = {
            runFunction(Function, attrval) {
                switch (document.domain) {
                    case 'pan.baidu.com':
                        return eval(`baidu.${Function}(attrval)`);
                    case 'xunlei.com':
                        return eval(`xunlei.${Function}(attrval)`);
                    default:
                        break;
                }
            },
            checkFileType(name) {
                let type = name.substring(name.lastIndexOf('.'))||"bleu"
                return flieTypeStr.indexOf(`${type},`) > 0 ? true : false
            },
            async addDavDir(){
                let header = {
                    "authorization": `Basic ${btoa(`${bleuc.cun}:${bleuc.cpw}`)}`
                }
                if(flag==='xunlei')return
                await tools.checkPath();
                await bleu.XHR('MKCOL', `https://${bleuc.cip}/PanPlaylist/${flag}${tempPath}`, undefined, header, 'xml')
            },
            async checkPath(){
                let url = `https://${bleuc.cip}/PanPlaylist/${flag}/`,
                    header = {
                        "authorization": `Basic ${btoa(`${bleuc.cun}:${bleuc.cpw}`)}`
                    }
                if (isCheckWebdav) {
                    isCheckWebdav = false;
                    return await bleu.XHR('PROPFIND', url, undefined, header, 'xml').then(async(res) => {
                        if (res.indexOf('HTTP/1.1 200 OK') < 0) {
                            url = `https://${bleuc.cip}/PanPlaylist/`
                            await bleu.XHR('MKCOL', url, undefined, header, 'xml')
                            url = `https://${bleuc.cip}/PanPlaylist/${flag}/`
                            await bleu.XHR('MKCOL', url, undefined, header, 'xml')
                        }
                    })
                }
            },
            async putFileInWebdav(name, info) {
                let header = {
                    "authorization": `Basic ${btoa(`${bleuc.cun}:${bleuc.cpw}`)}`
                }
                if(info === '#EXTM3U')return
                await tools.checkPath();
                await bleu.XHR('PUT', `https://${bleuc.cip}/PanPlaylist/${flag}${tempPath}/${name}`, info, header, 'xml').then(() => {
                    bleu.swalInfo(`✅${name}`, 3000, 'top-end')
                }, () => bleu.swalInfo(`❌${name}`, 3000, 'top-end'))
            },
            checkConfig(){
                bleuc = JSON.parse(GM_getValue('bleuc')||null)||{cip:'',cun:'',cpw:'',cbdqs:'bd1080',cxlqs:'xl0'}
                if(!(bleuc.cip!=''&&bleuc.cun!=''&&bleuc.cpw!='')){
                    bleu.swalInfo(`❗请先设置WEBDAV画质`, '', 'top-end')
                    return false
                }
                if(location.href.indexOf('/s/')>0){
                    bleu.swalInfo(`❗不支持此页面,请先保存到云盘`, '', 'top-end')
                    return false
                }
                if(location.href.indexOf('/disk/main')>0){
                    bleu.swalInfo(`❗不支持此页面,请回到旧版页面`, '', 'center')
                    return false
                }
                return true
            },
            saveConfig(){
                let temp =document.querySelector('#cip').value.trim()
                temp = temp.charAt(temp.length-1)==='/'?temp.substring(0,temp.length-1):temp
                temp = temp.indexOf('https://')<0?temp:temp.replace('https://','')
                GM_setValue("bleuc", JSON.stringify({
                    'cip': temp,
                    'cun': document.querySelector('#cun').value.trim(),
                    'cpw': document.querySelector('#cpw').value.trim(),
                    'cbdqs': document.querySelector('#cbdqs').value,
                    'cxlqs': document.querySelector('#cxlqs').value,
                }));
            },
            configHtml(){
                bleuc = JSON.parse(GM_getValue('bleuc')||null)||{cip:'',cun:'',cpw:'',cbdqs:'bd1080',cxlqs:'xl0'}
                let html = `
                <div class="bleuc_config_item"><b>WEBDAV</b><p>
                <div><label>主机:</label><input type="text" class="bleuc_inp" id="cip" value="${bleuc.cip}"/></div>
                <div><label>用户:</label><input type="text" class="bleuc_inp" id="cun" value="${bleuc.cun}"/></div>
                <div><label>密码:</label><input type="text" class="bleuc_inp" id="cpw" value="${bleuc.cpw}"/></div></p></div>
                <div class="bleuc_config_item"><b>画质</b><p>
                <label>百度</label><select class="bleuc_sel" id="cbdqs">
                <option value="bd1080">1080</option>
                <option value="bd720">720</option>
                <option value="bd480">480</option>
                <option value="bd360">360</option></select>
                <label>迅雷</label><select class="bleuc_sel" id="cxlqs">
                <option value="xl0">从高到低</option>
                <option value="xl1">从低到高</option></select></p></div>
                `
                return html.replace(`${bleuc.cbdqs}\"`,`${bleuc.cbdqs}\" selected`)
                .replace(`${bleuc.cxlqs}\"`,`${bleuc.cxlqs}\" selected`)
            },
            cssStyle:`
            .bleuc_config_item{border-radius: 10px;font-size: 20px;margin: 12px 50px;color: #fff;background: linear-gradient(45deg,#12c2e9, #c471ed, #f64f59);box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);}
            .bleuc_config_item label{font-size: 15px}
            .bleuc_config_item input.bleuc_inp{margin: 0px 10px;font-size: 15px;background: linear-gradient(45deg,#12c2e9, #c471ed, #f64f59);border-style:none;color:black}
            .bleuc_config_item p{text-align: left;margin: 0px 20px;}
            .bleuc_sel{margin: 0px 10px;background: linear-gradient(45deg,#12c2e9, #c471ed, #f64f59);font-size: 15px;border: none;color:black}`,

        },
        baidu = {
            hostname(){
                flag =  'baidu';
            },
            addTag() {
                if (contextMenu.firstChild.innerText.match(/查看.*/)) return
                let ul = document.createElement('ul');
                ul.innerHTML = `<li id="bleuReSave"><em class="icon"><img src="https://img.icons8.com/ios-filled/15/000000/cloud-mail.png"/></em>转存播放信息</li>`;
                contextMenu.firstChild.prepend(ul.firstChild);
            },
            getselectFilesInfo() {
                let temp = require('system-core:context/context.js').instanceForSystem.list.getSelected();
                baidu._pushItem(temp);
            },
            async updateFile(item) {
                let BAIDUID = btoa(document.cookie.match(/BAIDUID[^;]*/)[0]),adtoken,
                    streamUrl = `https://${location.host}/api/streaming?path=${encodeURIComponent(item.id)}&app_id=250528&clienttype=0&type=M3U8_AUTO_${bleuc.cbdqs.substring(2)}&vip=0&jsToken=${unsafeWindow.jsToken}&nom3u8=1&channel=chunlei&web=1&app_id=250528&bdstoken=${locals.get('bdstoken')}&logid=${BAIDUID}&clienttype=0`;
                await bleu.XHR('GET', streamUrl, undefined, {
                    withCredentials: true
                }).then((res) => {
                    adtoken = res.adToken
                }, () => {
                    bleu.swalInfo("🔴💬获取文件信息出错", 3000, 'top-end')
                })
                streamUrl = `https://${location.host}/api/streaming?path=${encodeURIComponent(item.id)}&app_id=250528&clienttype=0&type=M3U8_AUTO_${bleuc.cbdqs.substring(2)}&vip=0&jsToken=${unsafeWindow.jsToken}&isplayer=0&check_blue=1&adToken=${adtoken}`;
                await bleu.XHR('GET', streamUrl, undefined, {
                    withCredentials: true
                },'txt').then(async(res) => {
                    res.indexOf("#EXTM3U") < 0 ? bleu.swalInfo(`❌${item.name}`, 3000, 'top-end') :
                        await tools.putFileInWebdav(item.name, res);
                }, () => {
                    bleu.swalInfo("🔴💬获取文件信息出错", 3000, 'top-end')
                })
            },
            async openNextDir(item) {
                let BAIDUID = btoa(document.cookie.match(/BAIDUID[^;]*/)[0]),
                    listUrl = `https://${location.host}/api/list?order=name&desc=0&showempty=0&web=1&page=1&num=100&dir=${encodeURIComponent(item.id)}&channel=chunlei&web=1&app_id=250528&bdstoken=${locals.get('bdstoken')}&logid=${BAIDUID}&clienttype=0`;
                await bleu.XHR('GET', listUrl, undefined, {
                    withCredentials: true
                }).then((res) => {
                    arryIndex++;
                    baidu._pushItem(res.list);
                })
            },
            findContext(node) {
                if (node.className === 'context-menu') {
                    contextMenu = node;
                    baidu.addTag();
                    main.addClickEvent();
                }
            },
            closeMenu(){
                contextMenu.firstChild.style.display = "none";
            },
            _pushItem(temp) {
                itemsInfo[arryIndex] = [];
                temp.forEach(item => {
                    if (item.isdir === 0 && !tools.checkFileType(item.server_filename)) return
                    let itemInfo = {
                        'id': item.path,
                        'isdir': item.isdir === 1 ? true : false,
                        'name': item.server_filename,
                    };
                    itemsInfo[arryIndex].push(itemInfo);
                });
            },
            finallyFunc(){}
        },
        xunlei = {
            hostname(){
                let temp
                flag =  'xunlei',Option={},Option.header={};
                Option.header.withCredentials=false;
                Option.header['content-type']='application/json';
                for (let key in localStorage) {
                    temp = localStorage.getItem(key)
                    if(key.indexOf('credentials')===0){
                        Option.header.Authorization = JSON.parse(temp).token_type+' '+JSON.parse(temp).access_token;
                        Option.clientid = key.substring(key.indexOf('_')+1);
                    }
                    if(key.indexOf('captcha')===0)
                    Option.header['x-captcha-token']=JSON.parse(temp).token
                    if(key==='deviceid')
                    Option.header['x-device-id'] = temp.substring(temp.indexOf('.')+1,32+temp.indexOf('.')+1)
                }
            },
            addTag() {
                if (contextMenu.innerText.indexOf('转存')===0) return
                let ul = document.createElement('ul');
                ul.innerHTML = `<a id="bleuReSave" class="pan-dropdown-menu-item">转存播放信息</a>`;
                contextMenu.firstChild.prepend(ul.firstChild);
                main.addClickEvent();
            },
            getselectFilesInfo() {
                let temp = document.querySelectorAll('.pan-list-item');
                temp.forEach((item)=>{
                    item.__vue__.checked?xunlei._pushItem(item.__vue__.info):item;
                })
            },
            async updateFile(item) {
                let url = `https://api-pan.xunlei.com/drive/v1/files/${item.id}`;
                await bleu.XHR('GET', url, undefined,Option.header).then((res) => {
                    if(res.error){bleu.swalInfo("🔴💬刷新页面，重新获取header", '', 'top-end')}
                    let temp=[];
                    res.medias.forEach((item)=>{
                        if (item.link != null) {
                            temp.push(item.media_name === '原始画质' ? res.web_content_link : item.link.url)}
                    })
                    url = bleuc.cxlqs === 'xl0'?temp[0]:temp[temp.length-1];
                    m3u8File=m3u8File.replace('#EXTM3U',`#EXTM3U\n#EXTINF:-1 ,${item.name}\n${url}`)
                }, () => {
                    bleu.swalInfo("🔴💬刷新页面，重新获取header", '', 'top-end')
                })
            },
            async openNextDir(item) {
                let url  = `https://api-pan.xunlei.com/drive/v1/files?limit=100&parent_id=${item.id}&filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}&with_audit=true`;
                await bleu.XHR('GET', url, undefined,Option.header).then((res) => {
                    arryIndex++;
                    res.files.forEach((item)=>{
                        xunlei._pushItem(item);
                    })
                })
            },
            findContext(node) {
                if (node.className === 'pan-content') {
                    node = node.querySelector('div.pan-dropdown-menu.context-menu');
                    if(!node)return;
                    contextMenu = node;
                    xunlei.addTag();
                }
            },
            closeMenu(){
            },
            _pushItem(temp) {
                if(!itemsInfo[arryIndex]) itemsInfo[arryIndex]= [];
                if (temp.kind === 'drive#file' && !tools.checkFileType(temp.name)) return
                let itemInfo = {
                    'id': temp.id,
                    'isdir': temp.kind === 'drive#file' ? false : true,
                    'name': temp.name,
                };
                itemsInfo[arryIndex].push(itemInfo);
            },
            finallyFunc(){
                tools.putFileInWebdav('Playlist.m3u', m3u8File);
            }
        },
        main = {
            init() {
                let observer = new MutationObserver(function (mutations) {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            tools.runFunction('findContext',mutation.target);
                        }
                    }
                });
                observer.observe(document.body, {
                    'childList': true,
                    'subtree': true
                });
            },
            addClickEvent() {
                let bleuButton = document.getElementById('bleuReSave');
                bleuButton.addEventListener('click', async function () {
                    itemsInfo = [[]];
                    arryIndex = 0;
                    tempPath='';
                    m3u8File = "#EXTM3U";
                    if(!tools.checkConfig())return;
                    tools.runFunction('closeMenu');
                    tools.runFunction('getselectFilesInfo');
                    await main.updateAllFiles(itemsInfo[arryIndex]);
                    tools.runFunction('finallyFunc');
                })
            },
            async updateAllFiles(loopArry) {
                for (let index = 0; index < loopArry.length; index++) {
                    if (!loopArry[index].isdir) {
                        await tools.runFunction('updateFile', loopArry[index]);
                    } else {
                        tempPath += `/${loopArry[index].name}`;
                        await tools.addDavDir();
                        await tools.runFunction('openNextDir', loopArry[index]);
                        await main.updateAllFiles(itemsInfo[arryIndex]);
                    }
                }
                tempPath = tempPath.substring(0, tempPath.lastIndexOf('/'));
            },
        };
    tools.runFunction('hostname');
    tools.checkConfig();
    bleu.addCssStyle(tools.cssStyle);
    GM_registerMenuCommand('配置WEBDAV画质', () => {
        bleu.swalUI('WEBDAV画质', tools.configHtml(), '400px').then(tools.saveConfig)
    })
    main.init();
})();
