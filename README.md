# PotplayerPanVideo

|百度网盘| 迅雷云盘|阿里云盘|
|:---|:----|:---|
|🌕720p|🌔720p|🌕1080p|
|🌔需配置potplayer|🌕可配置potplayer|🌕可配置potplayer|
|🌔链接时间限制|🌕链接时间限制|🌒链接时间限制|
|🌕nplayer|🌕nplayer|🌑nplayer|

## 前排提醒

1.百度网盘，普通用户不支持1080p（会员暂时没测试），请选择720p观看。

2.迅雷云盘和阿里云盘用户可跳转到新脚本，体验更好[PotPlayer云盘-专供版](https://github.com/Bleu404/PotplayerPanVideoSV/)

3.没有网盘，或是不想用网盘，只想在线看视频，跳转到[Github_PotplayerM3U8](https://github.com/Bleu404/PotplayerM3U8)

## 📢使用前，准备事项📢

<div style="background-color:#12c2e9">1.注册附带webdav的网盘（坚果云、TeraCLOUD等），</div>
<div style="background-color:#c471ed">2.安装PotPlayer 或者其他的带有webdav功能的播放器(手机端推荐nplayer)</div>
<div style="background-color:#f64f59">3.百度网盘支持新旧版,违规资源不能播放</div>
<pre style="font-size: 14px;">
1️⃣、<a href="https://teracloud.jp/en/">TeraCLOUD</a>原始10g空间，用我的推荐码：<strong style="color:red;font-size: 30px;">DDGYA</strong>，可额外获得5g
2️⃣、配置中的密码不是登陆密码，是授权第三方应用的密码，坚果云的 <a href="https://help.jianguoyun.com/?p=2064" rel="nofollow">开启方法</a>;
<a href="https://teracloud.jp/en/modules/mypage/usage/">TeraClOUD的mypage</a>，中找到Apps Connection，保存好密码，不然下一次要重置
3️⃣、PotPlayer下载<a href="https://bleu.lanzoue.com/iFZgu07w69vg">蓝奏云： https://bleu.lanzoue.com/iFZgu07w69vg</a> 密码:3mk7
    nPlayer安卓破解版<a href="https://bleu.lanzoue.com/ioczh01n0hqd">蓝奏云：https://bleu.lanzoue.com/ioczh01n0hqd</a>  密码:705r
</pre>

## 📖视频使用教程📖

[ACFUN-PotPlayer播放云盘视频](https://www.acfun.cn/v/ac34091426)

## ⚙配置脚本⚙

<img src='https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/ppv/webdav配置.png' width="300px" height="230px" /><br>
***上图是以坚果云为例，填写的脚本WEBDAV画质配置***  

## ⚙配置PotPlayer专辑⚙

**<div style="background-color:#12c2e9">====👇百度网盘👇====</div>**
>***1.画质尽量选择1080p或者720p***  
***2.选择Wbdav协议，其他复制脚本配置即可,如果使用TeraCLOUD,勾选ssl选项***  
***3.选择PanPlaylist文件夹，就可以看到baidu***  
<img src='https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/ppv/百度专辑配置.png' width="400px" height="500px" /><img src='https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/ppv/百度专辑配置-ssl.png' width="400px" height="500px"/>

**<div style="background-color:#12c2e9">====👇迅雷云盘👇====</div>**
>***网页版迅雷云盘对有些视频解码不到位。所以用webdav协议，很多视频不能观看  
改成下面的用法：***
>>1️⃣、首先新建.dpl文件，内容为：  
>>>DAUMPLAYLIST  
>>>playname=  
>>>playtime=  
>>>topindex=  
>>>extplaylist=<https://用户:密码@主机/PanPlaylist/xunlei/Playlist.m3u>  

>>2️⃣、上面链接`用户`、`密码`、`主机`，都以可以在脚本配置中找到  
**注意:用户中`@`应改为`%40` 其他的@不用改=**

>>3️⃣、设置potplayer专辑，选择**外部播放列表**,选择之前新建的.dpl文件

**<div style="background-color:#12c2e9">====👇阿里云盘👇====</div>**
>***与迅雷云盘的设置类似,.dpl文件的链接将`xunlei`改为`aliyun`***

**<div style="background-color:#12c2e9">====👇自定义网站👇====</div>**
><b style="background-color:#c471ed">主要是解决小型网站的播放器不太好用的问题</b>
>可以在脚本设置页面，添加自定义网站，如下图，记得加`*`  
<img src = 'https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/ppv/自定义匹配.png' width="800px" height="500px" />  
<b style="background-color:#c471ed">如果嫌麻烦，也可以添加全匹配，代码中加  `// @match        *://*/*`</b>  

>**1️⃣、脚本管理器有‘转存页面m3u文件’按钮**  
<img src = 'https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/ppv/转存页面m3u文件.png' width="300px" height="200px" />  

>**2️⃣、webdav会生成一个.m3u文件用法：**  
>>
>>- 1.先打开`此电脑`，  
>>- 2.在上方选择`添加一个网络位置`，  
>>- 3.一直点击`下一页`，  
>>- 4.再输入地址：`https://用户:密码@主机/PanPlaylist/`（参考迅雷云盘），  
>>- 5.打开文件夹，找到.m3u文件用potplayer播放或其它播放器

<h2>🍜喜欢此脚本，可以给个好评或收藏。</h2>
