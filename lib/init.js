/**
 * Created by DFH on 13-12-24.
 */

db.createCollection("users");
db.createCollection("posts");
db.posts.insert({
    "name" : "iyueyao",
    "uuid" : "otwvr9gzp8h17slq1223",
    "time" : {
        "date" : ISODate("2013-12-23T02:22:47.329Z"),
        "year" : 2013,
        "month" : "2013-12",
        "day" : "2013-12-23",
        "minute" : "2013-12-23 10:22"
    },
    "title" : "测试",
    "post" : "测试啊测试测试啊测试测试啊测试测试啊测试测试啊测试测试啊测试测试啊测试测试啊测试",
    "desc" : "测试啊测试",
    "type" : "topic",
    "img" : "",
    "homeRecom" : false,
    "tags" : [],
    "comments" : [],
    "pv" : 0
});
db.users.insert({
    "name" : "iyueyao",
    "password" : "e10adc3949ba59abbe56e057f20f883e",
    "email" : "409355439@qq.com"
});
