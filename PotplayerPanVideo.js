// ==UserScript==
// @name         PotPlayer播放云盘视频
// @namespace    https://greasyfork.org/zh-CN/users/798733-bleu
// @version      1.0.5
// @description  支持🐱‍💻百度网盘(1080p)、🐱‍👤迅雷云盘(720p)、🐱‍🏍阿里云盘(1080p)👉右键👈导入播放信息到webdav网盘；支持劫持自定义网站的m3u文件导入webdav网盘。PotPlayer实现🥇倍速、🏆无边框、更换解码器、渲染器等功能。
// @author       bleu
// @compatible   edge Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Tampermonkey
// @license      MIT
// @match        https://pan.baidu.com/*
// @match        https://pan.xunlei.com/*
// @match        https://www.aliyundrive.com/*
// @icon         https://img.icons8.com/ios/50/000000/cloud-mail.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      *
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.all.min.js
// @require      https://cdn.jsdelivr.net/npm/bleutools@1.0.0/bleutools.min.js
// ==/UserScript==
(function () {
    'use strict';
    let bleuc,
        contextMenu,
        itemsInfo,
        arryIndex,
        tempPath,
        flag,Option,observer,
        isCheckWebdav = true,
        m3u8File = "#EXTM3U",
        flieTypeStr = ".wmv,.rmvb,.avi,.mp4,.mkv,.flv,.swf.mpeg4,.mpeg2,.3gp,.mpga,.qt,.rm,.wmz,.wmd,.wvx,.wmx,.wm,.mpg,.mpeg,mov,.asf,.m4v",
        tools = {
            runFunction(Function, attrval) {
                switch (document.domain) {
                    case 'pan.baidu.com':
                        return eval(`baidu.${Function}(attrval)`);
                    case 'xunlei.com':
                        return eval(`xunlei.${Function}(attrval)`);
                    case 'www.aliyundrive.com':
                        return eval(`aliyun.${Function}(attrval)`);
                    default:
                        return eval(`others.${Function}(attrval)`);
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
                if(flag!='baidu')return
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
                    bleu.swalInfo(`✅${name}`, 3000, 'center')
                }, () => bleu.swalInfo(`❌${name}`, 3000, 'center'))
            },
            checkConfig(){
                bleuc = JSON.parse(GM_getValue('bleuc')||null)||{cip:'',cun:'',cpw:'',cbdqs:'bd1080',cxlqs:'xl0',calqs:'FHD'}
                if(!(bleuc.cip!=''&&bleuc.cun!=''&&bleuc.cpw!='')){
                    bleu.swalInfo(`❗请先设置WEBDAV画质`, '', 'center')
                    return false
                }
                if(location.href.indexOf('/s/')>0){
                    bleu.swalInfo(`❗不支持此页面,请先保存到云盘`, '', 'center')
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
                    'calqs': document.querySelector('#calqs').value,
                }));
            },
            configHtml(){
                bleuc = JSON.parse(GM_getValue('bleuc')||null)||{cip:'',cun:'',cpw:'',cbdqs:'bd1080',cxlqs:'xl0',calqs:'FHD'}
                let html = `
                <div class="bleuc_config_item"><b>WEBDAV</b><p>
                <div><label>主机:</label><input type="text" class="bleuc_inp" id="cip" value="${bleuc.cip}"/></div>
                <div><label>用户:</label><input type="text" class="bleuc_inp" id="cun" value="${bleuc.cun}"/></div>
                <div><label>密码:</label><input type="text" class="bleuc_inp" id="cpw" value="${bleuc.cpw}"/></div></p></div>
                <div class="bleuc_config_item"><b>画质</b><p>
                <label>百度</label><select class="bleuc_sel" id="cbdqs">
                <option value="bd1080">1080p</option>
                <option value="bd720">720p</option>
                <option value="bd480">480p</option>
                <option value="bd360">360p</option></select>
                <label>迅雷</label><select class="bleuc_sel" id="cxlqs">
                <option value="xl0">从高到低</option>
                <option value="xl1">从低到高</option></select>
                <label>阿里</label><select class="bleuc_sel" id="calqs">
                <option value="FHD">1080p</option>
                <option value="HD">720p</option>
                <option value="SD">540p</option>
                <option value="LD">360p</option></select></p></div>
                `
                //bleuc.cbdqs?bleuc.cbdqs:bleuc.cbdqs='FHD';
                return html.replace(`${bleuc.cbdqs}\"`,`${bleuc.cbdqs}\" selected`)
                .replace(`${bleuc.cxlqs}\"`,`${bleuc.cxlqs}\" selected`)
                .replace(`${bleuc.calqs}\"`,`${bleuc.calqs}\" selected`)
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
            addTag(isnew) {
                if (contextMenu.firstChild.innerText.match(/转存播放信息|查看/)) return
                let ul = document.createElement('ul');
                isnew?ul.innerHTML = `<div id="bleuReSave" class="wp-ctx-menu__item cursor-p is-has-icon"><p><img src="https://img.icons8.com/ios-filled/15/000000/cloud-mail.png"/><span class="wp-ctx-menu__item-text">转存播放信息</span></p></div>`
                :ul.innerHTML = `<li id="bleuReSave"><em class="icon"><img src="https://img.icons8.com/ios-filled/15/000000/cloud-mail.png"/></em>转存播放信息</li>`;
                contextMenu.firstChild.prepend(ul.firstChild);
                main.addClickEvent();
            },
            getselectFilesInfo() {
                let temp = location.href.indexOf('/disk/main') > 0?
                document.querySelector('.nd-main-filelist.nd-main-list__table').__vue__.selectedList
                :require('system-core:context/context.js').instanceForSystem.list.getSelected();
                baidu._pushItem(temp);
            },
            async updateFile(item) {
                let streamUrl = `https://${location.host}/api/streaming?path=${encodeURIComponent(item.id)}&app_id=250528&clienttype=0&type=M3U8_AUTO_${bleuc.cbdqs.substring(2)}&vip=0&isplayer=0&check_blue=1`;
                await bleu.XHR('GET', streamUrl, undefined, {
                    withCredentials: true
                },'txt').then(async(res) => {
                    res.indexOf("#EXTM3U") < 0 ? bleu.swalInfo(`❌${item.name}`, 3000, 'center') :
                        await tools.putFileInWebdav(item.name, res);
                }, () => {
                    bleu.swalInfo("🔴💬获取文件信息出错", 3000, 'center')
                })
            },
            async openNextDir(item) {
                let listUrl = `https://${location.host}/api/list?order=name&desc=0&showempty=0&web=1&page=1&num=100&dir=${encodeURIComponent(item.id)}&channel=chunlei&web=1&app_id=250528&clienttype=0`;
                await bleu.XHR('GET', listUrl, undefined, {
                    withCredentials: true
                }).then((res) => {
                    arryIndex++;
                    baidu._pushItem(res.list);
                })
            },
            findContext(node) {
                if (location.href.indexOf('/disk/main') > 0) {
                    node = document.querySelector('.ctx-menu-container.nd-main-filelist__menu.nd-common-float-menu')
                    if (!node) return;
                    contextMenu = node;
                    baidu.addTag(true);
                }
                else if(node.className ==='context-menu'){
                    observer.disconnect();
                    contextMenu = node;
                    baidu.addTag(false);
                }
            },
            closeMenu(){
                if(location.href.indexOf('/disk/main') < 0)contextMenu.firstChild.style.display = "none"
                else contextMenu.style.display = "none"
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
                    if(res.error){bleu.swalInfo("🔴💬刷新页面，重新获取header", '', 'center')}
                    let temp=[];
                    res.medias.forEach((item)=>{
                        if (item.link != null) {
                            temp.push(item.media_name === '原始画质' ? res.web_content_link : item.link.url)}
                    })
                    url = bleuc.cxlqs === 'xl0'?temp[0]:temp[temp.length-1];
                    m3u8File=m3u8File.replace('#EXTM3U',`#EXTM3U\n#EXTINF:-1 ,${item.name}\n${url}`)
                }, () => {
                    bleu.swalInfo("🔴💬刷新页面，重新获取header", '', 'center')
                })
            },
            async openNextDir(item) {
                let url  = `https://api-pan.xunlei.com/drive/v1/files?limit=100&parent_id=${item.id}&filters={"phase":{"eq":"PHASE_TYPE_COMPLETE"},"trashed":{"eq":false}}&with_audit=true`;
                await bleu.XHR('GET', url, undefined,Option.header).then((res) => {
                    arryIndex++;
                    if(res.error){bleu.swalInfo("🔴💬刷新页面，重新获取header", '', 'center');return}
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
        aliyun = {
            hostname(){
                flag =  'aliyun'
            },
            addTag() {
                if (contextMenu.innerText.match(/转存播放信息|新建/)) return
                let ul = document.createElement('ul');
                ul.innerHTML = `<li id="bleuReSave" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem"><div class="outer-menu--ihDUR"><div data-confirm="false" class="menu-wrapper--1ZYh_" data-spm-anchor-id="aliyundrive.drive.0.i11.40516c75ahPUGN"><div class="menu-name--1F5vk" data-spm-anchor-id="aliyundrive.drive.0.i12.40516c75ahPUGN">转存播放信息</div></div></div></li>`;
                contextMenu.prepend(ul.firstChild);
                main.addClickEvent();
            },
            getselectFilesInfo() {
                let temp = document.querySelector('div.node-list-table-view--2qFqi');
                let selecteditem,dataSource;
                for(let attr in temp){
                    if(attr.indexOf('__reactFiber')==0){
                        selecteditem = temp[attr].return.pendingProps.value.selectedKeys;
                        dataSource = temp[attr].return.pendingProps.value.dataSource;
                        break;
                    }
                }
                dataSource.forEach((value)=>{
                    if(selecteditem.indexOf(value.fileId)>=0){
                        aliyun._pushItem(value);
                    }
                })
                
            },
            async updateFile(item) {
                let url = `https://api.aliyundrive.com/v2/file/get_video_preview_play_info`,
                    token = JSON.parse(localStorage.getItem('token')),
                    data = {
                        category: "live_transcoding",
                        'drive_id': token.default_drive_id,
                        'file_id': item.id,
                        'template_id': ""
                    },
                    header = {
                        'x-canary': 'client=web,app=adrive,version=v2.4.0',
                        'x-device-id': document.cookie.match(/cna=([^;]*)/)[1],
                        authorization: `${token.token_type} ${token.access_token}`
                    };
                await bleu.XHR('POST', url, JSON.stringify(data), header).then((res) => {
                    if (res.code) {bleu.swalInfo("🔴💬刷新页面，重新获取", '', 'center')}
                    let temp = res.video_preview_play_info.live_transcoding_task_list;
                    url =temp.find((item)=>item.template_id===bleuc.calqs)?temp.find((item)=>item.template_id===bleuc.calqs).url:temp[temp.length-1].url;
                    m3u8File+=`\n#EXTINF:-1 ,${item.name}\n#EXTVLCOPT:http-referrer=https://www.aliyundrive.com/\n${url}`;
                }, () => {
                    bleu.swalInfo("🔴💬刷新页面，重新获取", '', 'center')
                })
            },
            async openNextDir(item) {
                let url = `https://api.aliyundrive.com/adrive/v3/file/list?jsonmask=next_marker%2Citems(name%2Cfile_id%2Cdrive_id%2Ctype%2Csize%2Ccreated_at%2Cupdated_at%2Ccategory%2Cfile_extension%2Cparent_file_id%2Cmime_type%2Cstarred%2Cthumbnail%2Curl%2Cstreams_info%2Ccontent_hash%2Cuser_tags%2Ctrashed%2Cvideo_media_metadata%2Cvideo_preview_metadata)`,
                    token = JSON.parse(localStorage.getItem('token')),
                    data = {
                        'drive_id': token.default_drive_id,
                        'parent_file_id': item.id,
                        'limit': 100,
                    },
                    header = {
                        'x-canary': 'client=web,app=adrive,version=v2.4.0',
                        'x-device-id': document.cookie.match(/cna=([^;]*)/)[1],
                        authorization: `${token.token_type} ${token.access_token}`
                    };
                await bleu.XHR('POST', url, JSON.stringify(data),header).then((res) => {
                    arryIndex++;
                    if(res.code){bleu.swalInfo("🔴💬刷新页面，重新获取", '', 'center');return}
                    res.items.forEach((item)=>{
                        aliyun._pushItem(item);
                    })
                })
            },
            findContext(node) {
                node = document.querySelector('ul.ant-dropdown-menu');
                if (!node) return;
                //observer.disconnect();
                contextMenu = node;
                aliyun.addTag();
            },
            closeMenu(){
                contextMenu.parentNode.className='ant-dropdown dropdown-menu--1KRbu ant-dropdown-placement-bottomLeft  ant-dropdown-hidden';
                contextMenu.parentNode.style.left='-578px'; 
                contextMenu.parentNode.style.top='-646px';
            },
            _pushItem(temp) {
                if(!itemsInfo[arryIndex]) itemsInfo[arryIndex]= [];
                if (temp.type==='file'&&temp.category!="video") return
                let itemInfo = {
                    'id': temp.fileId||temp.file_id,
                    'isdir': temp.type === 'file' ? false : true,
                    'name': temp.name,
                };
                itemsInfo[arryIndex].push(itemInfo);
            },
            finallyFunc(){
                tools.putFileInWebdav('Playlist.m3u', m3u8File);
            }
        },
        others = {
            hostname() {
                flag = document.domain.replace('www.','');
                tempPath='';
                let oriXOpen = XMLHttpRequest.prototype.open;
                let oriXSend = XMLHttpRequest.prototype.send;
                function onReadyStateChangeReplacement() {
                    if (this.readyState == 4) {
                        if ((this.responseType === '' || this.responseType === 'text') && this.responseText.indexOf('#EXTM3U') === 0) {
                            console.log('bleu://' + this.responseURL);
                            this.responseURL.indexOf('https://')!=0?m3u8File = this.responseText:
                            m3u8File+=`\n#EXTINF:-1 ,${document.title}${Date.parse(new Date())}\n#EXTVLCOPT:http-referrer=${document.referrer}\n${this.responseURL}`;
                        }
                    }
                    if (this._onreadystatechange) {
                        return this._onreadystatechange.apply(this, arguments);
                    }
                }
                XMLHttpRequest.prototype.open = function (method, url, asncFlag, user, password) {
                    return oriXOpen.call(this, method, url, asncFlag, user, password);
                };
                XMLHttpRequest.prototype.send = function (data) {
                    if (this.onreadystatechange) {
                        this._onreadystatechange = this.onreadystatechange;
                    }
                    this.onreadystatechange = onReadyStateChangeReplacement;
                    return oriXSend.call(this, data);
                }
            },
            findContext(node) {
                observer.disconnect()
                bleu.sleep(1000);
                GM_registerMenuCommand('转存页面m3u文件', () => {
                    if(m3u8File==='#EXTM3U'){
                        bleu.swalInfo(`❌没有加载m3u文件,等一会再尝试!`, 3000, 'center')
                        return;
                    }
                    let type = m3u8File.indexOf('#EXTINF:-1')<0?'.mp4':'.m3u';
                    bleu.swalUI('转存页面m3u文件', others._getHtml(), '550px')
                    document.querySelector('#saveas').addEventListener('click', function () {
                        tools.putFileInWebdav(document.querySelector('#bleu_name').value + type, m3u8File);
                    })
                }, 'm');
            },
            _getHtml(){
                return`<div><input type="text" id="bleu_name" value="${document.title}" style="width: 400px;height: 18px;"/><label>.m3u</label><button id="saveas" style="margin-left: 10px;">转存</button></div>`
            }
        },
        main = {
            init() {
                observer = new MutationObserver(function (mutations) {
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
                    bleu.sleep(800);
                }
                tempPath = tempPath.substring(0, tempPath.lastIndexOf('/'));
            },
        };
    tools.runFunction('hostname');
    tools.checkConfig();
    bleu.addCssStyle(tools.cssStyle);
    GM_registerMenuCommand('配置WEBDAV画质', () => {
        bleu.swalUI('WEBDAV画质', tools.configHtml(), '400px').then(tools.saveConfig)
    },'w')
    main.init();
})();
