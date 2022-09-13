// const request = require('request');
const axios = require('axios')
const crypto = require('crypto');
async function run() {
    const secret = "SEC14b6750100c9521267e7fd8d438268ab44bebc943f1c1504c13565e498a3122d";               // secret
    let url = "https://oapi.dingtalk.com/robot/send?access_token=e60661958ee8f4f8960167281cbf30d87587aa67d05e5fc01d4a31b7013fbd5b";
    var time = Date.now();
    var time2 = new Date()
    const love_time_start = time2.getTime() - new Date('2021-06-13').getTime()
    const love_time_day = Math.floor(new Date(love_time_start) / (1000*60*60*24))
    const love_time_hours = Math.floor(new Date(love_time_start) / (1000*60*60))
    const love_time_mins = Math.floor(new Date(love_time_start) / (1000*60))
    const love_time_second = love_time_start / 1000
    var date = `${time2.getFullYear()+'-' + (time2.getMonth()+1) +'-'+time2.getDay()}`
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var day = time2.getDay();
    var week = weeks[day];
    // 生日
    let userList = [
        {
            name: "冯月正",
            birthday: "1997-10-27",
            template: ''
        },
        {
            name: "王培瑶",
            birthday: "1999-11-23",
            template: ''
        }
    ]
    let birthday_text = ''
    userList.map(item=>{
        let year = null
        let birTime = new Date(item.birthday)
        if (time2.getMonth() <= birTime.getMonth()) {
            year = time2.getFullYear()
        } else {
            year = time2.getFullYear() + 1
        }
        birTime.setFullYear(year)
        item.template = `距离${item.name}的生日还有${Math.ceil(((birTime.getTime()-time2.getTime()) / (1000*3600*24)))}天`
        birthday_text  += item.template + '\n'
    })

    const weather = await axios.get("https://devapi.qweather.com/v7/weather/3d?key=4d23ff80a7504f6b803baa826244a0a3&location=101120101")
    const { textDay: text, tempMin, tempMax, windDirDay: windDir } = weather.data.daily[0]
    const jinshan = await axios.get("http://open.iciba.com/dsapi/")
    const { note, content } = jinshan.data

    var data = {
        "msgtype": "text",
        "text": {
            "content":
                `${date} ${week}\n` +
                `地区：济南市\n` +
                `天气：${text}\n`+
                `气温：${tempMin + '-' + tempMax}℃\n`+
                `风向：${windDir}\n`+
                `我们恋爱了${love_time_day}天\n`+
                `${love_time_hours}小时 \n${love_time_mins}分钟 \n${love_time_second}秒 \n`+
                `${birthday_text}\n`+
                `\n${note}\n${content}`
        },
        "at": {
            "atMobiles": [],                             // @(at) someone
            "isAtAll": false                              // @(at) all
        }
    };

    var stringToSign = time + "\n" + secret;
    var base = crypto.createHmac('sha256', secret).update(stringToSign).digest('base64');
    var sign = encodeURIComponent(base);
    url = url + `&timestamp=${time}&sign=${sign}`;

    await axios.post(url,data).then(res=>{})
}

run()