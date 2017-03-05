App({
    globalData: {
        g_isPlayingMusic: false,
        doubanBase: 'https://api.douban.com',
        wangyiBase: 'https://music.163.com/api/playlist/detail?'
    },
    onLaunch: function () {
        var that = this;
        wx.login()
        wx.getUserInfo({
            success: function (res) {
                var userInfo = res.userInfo;
                that.globalData.userInfo = userInfo;
            }
        })
    }
})


