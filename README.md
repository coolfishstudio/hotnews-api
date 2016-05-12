# hotnews-api

个人项目请勿商用

## Introduction

* Description : 这是一个今日热点的新闻api，通过对百度风云榜的数据抓取，获得新闻关键词，再在搜索引擎进行搜索，得到链接，通过接口获取文章内容，从而实现内容的抓取，数据每一小时一更新
* Engineer : Yves <461836324@qq.com>
* CreateTime : 2016-05-12

## Installation
```
    $ git clone https://github.com/coolfishstudio/hotnews-api.git
    $ cd hotnews-api
    $ cp config/config.default.js config/config_current.js
    $ npm install
```
## Run
```
    $ node app.js
```
## Api
```
    /ping                           //检测接口是否正常
    /v1/hotnews                     //获取热门新闻关键词
    /v1/hotnews/keyword             //根据新闻关键词获取内容
```
## 使用说明
### 检测接口是否正常
```
http://api.hotnews.coolfishstudio.com/ping
```
返回值为
```
ok
```
### 获取热门新闻关键词
```
http://api.hotnews.coolfishstudio.com/v1/hotnews
```
返回值为
```
{"status":1,"content":[{"keyword":"驻日美军起降训练","searches":6281,"changeRate":247,"isNew":"1","trend":"rise","gentime":"2016-05-12 19:48:32"},{"keyword":"林青霞继女登封面","searches":139412,"changeRate":143,"isNew":"1","trend":"rise"},{"keyword":"9名向导登顶珠峰","searches":13143,"changeRate":90,"isNew":"1","trend":"rise"},{"keyword":"宋仲基吃货体情书","searches":119669,"changeRate":111,"isNew":"","trend":"rise"},{"keyword":"鸵鸟被野蛮抓捕亡","searches":22930,"changeRate":9,"isNew":"1","trend":"rise"},{"keyword":"女子点煤气自杀","searches":35062,"changeRate":51,"isNew":"1","trend":"rise"},{"keyword":"聚焦男护士群体","searches":207528,"changeRate":939,"isNew":"1","trend":"rise"},{"keyword":"曝三里屯突发火灾","searches":189928,"changeRate":1306,"isNew":"1","trend":"rise"},{"keyword":"同学会定恋人关系","searches":114435,"changeRate":-23,"isNew":"1","trend":"fall"},{"keyword":"张馨予拥吻男制片","searches":80287,"changeRate":-44,"isNew":"1","trend":"fall"},{"keyword":"周冬雨泳装遭吐槽","searches":78335,"changeRate":-16,"isNew":"","trend":"fall"},{"keyword":"不孕公告走红网络","searches":51266,"changeRate":-35,"isNew":"1","trend":"fall"},{"keyword":"华西医院院长跳楼","searches":56116,"changeRate":-47,"isNew":"","trend":"fall"},{"keyword":"王思聪带美女买车","searches":38796,"changeRate":-60,"isNew":"1","trend":"fall"},{"keyword":"孟非怒斥颜值说","searches":11684,"changeRate":-65,"isNew":"1","trend":"fall"},{"keyword":"校花朝天蹬走红","searches":7747,"changeRate":-65,"isNew":"","trend":"fall"},{"keyword":"高考报名人数减少","searches":14194,"changeRate":-53,"isNew":"","trend":"fall"},{"keyword":"高圆圆录节目哽咽","searches":5550,"changeRate":-62,"isNew":"1","trend":"fall"},{"keyword":"镜面蛋糕走红网络","searches":53873,"changeRate":208,"isNew":"1","trend":"rise"},{"keyword":"失联女孩尸体发现","searches":11182,"changeRate":-22,"isNew":"","trend":"fall"},{"keyword":"浙江台州飞机坠毁","searches":8106,"changeRate":-38,"isNew":"","trend":"fall"},{"keyword":"周杰伦模仿星爷","searches":4281,"changeRate":-10,"isNew":"1","trend":"fall"},{"keyword":"白领欠车费被开除","searches":12936,"changeRate":-24,"isNew":"","trend":"fall"},{"keyword":"72岁老太生子","searches":6470,"changeRate":-21,"isNew":"","trend":"fall"},{"keyword":"汶川地震八周年","searches":24625,"changeRate":-20,"isNew":"","trend":"fall"},{"keyword":"18岁父亲求捐钱","searches":6821,"changeRate":-30,"isNew":"1","trend":"fall"},{"keyword":"北大强制跳短裙操","searches":8962,"changeRate":2,"isNew":"","trend":"rise"},{"keyword":"体育老师骚扰女生","searches":6851,"changeRate":2,"isNew":"","trend":"rise"},{"keyword":"超级高铁首测","searches":9463,"changeRate":-20,"isNew":"","trend":"fall"},{"keyword":"景甜现身台湾夜市","searches":3469,"changeRate":-59,"isNew":"1","trend":"fall"},{"keyword":"江苏武汉比赛冲突","searches":29928,"changeRate":-16,"isNew":"","trend":"fall"},{"keyword":"疑张子萱已怀男孩","searches":8312,"changeRate":-41,"isNew":"","trend":"fall"},{"keyword":"荣耀V8百度预约","searches":3917,"changeRate":4,"isNew":"","trend":"rise"},{"keyword":"中国第一金库曝光","searches":10486,"changeRate":135,"isNew":"1","trend":"rise"},{"keyword":"黑客入侵多家网站","searches":3620,"changeRate":-10,"isNew":"1","trend":"fall"},{"keyword":"南充3岁女童被抢","searches":41777,"changeRate":411,"isNew":"1","trend":"rise"},{"keyword":"长三角城市群规划","searches":3581,"changeRate":-41,"isNew":"","trend":"fall"},{"keyword":"闯红灯被查脱衣","searches":3594,"changeRate":-11,"isNew":"","trend":"fall"},{"keyword":"曹云金江若琳恋情","searches":13033,"changeRate":-23,"isNew":"","trend":"fall"},{"keyword":"旅客飞机如厕生子","searches":4039,"changeRate":32,"isNew":"1","trend":"rise"},{"keyword":"2016戛纳电影节","searches":18294,"changeRate":-3,"isNew":"","trend":"fall"},{"keyword":"龙口叫停石化项目","searches":3158,"changeRate":-31,"isNew":"","trend":"fall"},{"keyword":"李小鹏老婆诞二胎","searches":5320,"changeRate":-24,"isNew":"","trend":"fall"},{"keyword":"小米max发布会","searches":13539,"changeRate":-20,"isNew":"","trend":"fall"},{"keyword":"台湾附近6级地震","searches":8608,"changeRate":-46,"isNew":"1","trend":"fall"},{"keyword":"刘源捐赠上将军服","searches":3234,"changeRate":-45,"isNew":"","trend":"fall"},{"keyword":"警方通报雷洋案","searches":99066,"changeRate":-28,"isNew":"","trend":"fall"},{"keyword":"2016CES展","searches":5404,"changeRate":-5,"isNew":"","trend":"fall"}]}
```
### 获取内容
```
http://api.hotnews.coolfishstudio.com/v1/hotnews/白领欠车费被开除
```
返回值为
```
{"status":1,"content":{"nid":"5896597269703103086","sourcets":"1462974120000","ts":"1462974120000","title":"女白领欠36元打车费被司机找上门 单位将其开除","url":"http://news.china.com/socialgd/10000169/20160511/22629308.html","imageurls":[],"site":"中华网","isvideo":"0","type":"searchnews","abs":"","content":[{"type":"text","data":"原标题：<b>女白领</b>欠36元车费被开除","keywords":["白领"]},{"type":"text","data":"本报讯 （记者 白羽）拖欠36元出租车费，被出租车司机“人肉”找到单位，涉事女白领因此被开除。最近，这件职场小事在申城HR圈内热传。有人为这个女白领鸣不平，但职场专家指出，职场诚信无小事，即便是私人事件，也可能影响职场发展。“说好下车付36元车费，但是一直没等到。”专车司机吴师傅告诉记者，前一阵，他曾搭载一名年轻女白领回公司，车程不远，开到目的地之后，女孩说下车后用手机付款，谁知道等了又等，直到第二天也没有收到车费。其间，师傅打了好几次女孩叫车时候使用的手机，就是没人接听。","keywords":["白领","职场","HR","手机"]},{"type":"text","data":"因为36元并不算多，又联系不到本人，吴师傅本以为钱收不回来。巧的是第二天，又有人叫了他的车，目的地正是此前那个女孩的公司，于是吴师傅心里越想越气，索性找到公司前台，拿着手机号找这个女白领。","keywords":["手机","白领"]},{"type":"text","data":"据了解，前台一开始并不答应凭借一个手机号找人，吴师傅一不做二不休的坚决态度倒是引来了公司的负责人，HR经理接待后，真的通过手机号找到了那位没付车费的女员工。车费补交后，事情的另一个结果出乎吴师傅的意料，女白领马上被HR开除了。","keywords":["手机","HR","白领"]},{"type":"text","data":"这件事情随后在申城HR圈内热传，还有人在论坛上发帖讲述，引发了不少关注。有网友评论，“36元车费小到可以说是忘记，大到可以上升到本质是一个贪小便宜的人。”但也有人为这个年轻女白领鸣不平，30多元车“钱对打车的人来说，根本不算一笔大数目。何况，难道一个白领会故意不付一笔小小的打车费？”“职场诚信无小事，各种细节体现的正是职业操守。”前程无忧首席人力资源专家冯丽娟指出，绝大部分企业对职业诚信的要求非常高，特别是研发、财务、管理等特殊岗位，更加谨慎，员工工作过程中的诸多细节都在考察范围之内。“简历造假、公私不分、不守时、不注意保密等，往往是一件微妙的小事，就会影响职场的发展。职场人切不可因一些‘无心之过’，而登上诚信黑名单。”","keywords":["HR","白领","职场","人力资源"]}],"keyword":"白领欠车费被开除"}}
```