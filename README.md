# PotplayerPanVideo
<h3>📢使用前，准备事项📢</h3>
        <div class="bleucolor">1.注册附带webdav的网盘（坚果云、TeraCLOUD等），</div><br />
        <div class="bleucolor">2.安装PotPlayer</div>
        <pre class="bleucolor" style="font-size: 14px;">
            1️⃣、<a href="https://teracloud.jp/en/">TeraCLOUD</a>原始10g空间，用我的推荐码：<strong style="color:red;font-size: 30px;">DDGYA</strong>，可额外获得5g

            2️⃣、配置中的密码不是登陆密码，是授权第三方应用的密码，坚果云的 <a href="https://help.jianguoyun.com/?p=2064" rel="nofollow">开启方法</a>;

                <a href="https://teracloud.jp/en/modules/mypage/usage/">TeraClOUD的mypage</a>，中找到Apps Connection，保存好密码，不然下一次要重置

            3️⃣、PotPlayer下载<a href="https://bleu.lanzouj.com/iWdnrz59yha">蓝奏云： https://bleu.lanzouj.com/iWdnrz59yha</a> 密码:4xke
        </pre>
        <h3>⚙配置脚本⚙</h3>
        <img src='https://s3.bmp.ovh/imgs/2022/03/5350a1d8a6029b4e.png' width="300px" height="230px" />
        <div class="bleucolor">上图是以坚果云为例，填写的脚本WEBDAV画质配置</div>
        <h3>⚙配置PotPlayer专辑⚙</h3>
        <div class="bleucolor">====百度网盘如下图====</div><br />
        <div class="bleucolor">选择Wbdav协议，其他复制脚本配置即可</div><br />
        <div class="bleucolor">选择<b>PanPlaylist</b>文件夹，就可以看到baidu</div><br />
        <img src='https://s3.bmp.ovh/imgs/2022/03/fa8aa0ec5b55f629.png' width="400px"
            height="500px" /><br /><br /><br />

        <div class="bleucolor">====迅雷云盘====</div><br />
        <div class="bleucolor">网页版迅雷云盘对有些视频解码不到位。所以用webdav协议，很多视频不能观看</div><br />
        <div class="bleucolor">改成下面的用法：</div>
        <pre class="bleucolor" style="font-size: 14px;">
                1️⃣、首先新建.dpl文件，内容为：
                    DAUMPLAYLIST
                    playname=
                    playtime=
                    topindex=
                    extplaylist=https://用户:密码@主机/PanPlaylist/xunlei/Playlist.m3u

                2️⃣、上面链接<code>用户</code>、<code>密码</code>、<code>主机</code>，都以可以在脚本配置中找到
                    <strong>注意:用户中<code>@</code>应改为<code>%40</code> 其他的@不用改</strong>

                3️⃣、设置potplayer专辑，选择<b>外部播放列表</b>,选择之前新建的.dpl文件
            </pre>
        <h2>🍜喜欢此脚本，可以给个好评或收藏。</h2>
