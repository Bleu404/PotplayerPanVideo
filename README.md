# PotplayerPanVideo
📢使用前，准备事项📢
1.注册附带webdav的网盘（坚果云、TeraCLOUD等），

2.安装PotPlayer
            1️⃣、TeraCLOUD原始10g空间，用我的推荐码：DDGYA，可额外获得5g

            2️⃣、配置中的密码不是登陆密码，是授权第三方应用的密码，坚果云的 开启方法;

                TeraClOUD的mypage，中找到Apps Connection，保存好密码，不然下一次要重置

            3️⃣、PotPlayer下载蓝奏云： https://bleu.lanzouj.com/iWdnrz59yha 密码:4xke
        
⚙配置脚本⚙

上图是以坚果云为例，填写的脚本WEBDAV画质配置
⚙配置PotPlayer专辑⚙
====百度网盘如下图====

选择Wbdav协议，其他复制脚本配置即可

选择PanPlaylist文件夹，就可以看到baidu




====迅雷云盘====

网页版迅雷云盘对有些视频解码不到位。所以用webdav协议，很多视频不能观看

改成下面的用法：
                1️⃣、首先新建.dpl文件，内容为：
                    DAUMPLAYLIST
                    playname=
                    playtime=
                    topindex=
                    extplaylist=https://用户:密码@主机/PanPlaylist/xunlei/Playlist.m3u

                2️⃣、上面链接用户、密码、主机，都以可以在脚本配置中找到
                    注意:用户中@应改为%40 其他的@不用改

                3️⃣、设置potplayer专辑，选择外部播放列表,选择之前新建的.dpl文件
            
🍜喜欢此脚本，可以给个好评或收藏。
