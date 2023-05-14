var contextarray = [];

var defaults = {
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />)
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks
    linkify: true,         // autoconvert URL-like texts to links
    linkTarget: '',           // set target to open link in
    typographer: true,         // Enable smartypants and other sweet transforms
    _highlight: true,
    _strict: false,
    _view: 'html'
};
defaults.highlight = function (str, lang) {
    if (!defaults._highlight || !window.hljs) { return ''; }

    var hljs = window.hljs;
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(lang, str).value;
        } catch (__) { }
    }

    try {
        return hljs.highlightAuto(str).value;
    } catch (__) { }

    return '';
};
mdHtml = new window.Remarkable('full', defaults);

mdHtml.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
};

mdHtml.renderer.rules.paragraph_open = function (tokens, idx) {
    var line;
    if (tokens[idx].lines && tokens[idx].level === 0) {
        line = tokens[idx].lines[0];
        return '<p class="line" data-line="' + line + '">';
    }
    return '<p>';
};

mdHtml.renderer.rules.heading_open = function (tokens, idx) {
    var line;
    if (tokens[idx].lines && tokens[idx].level === 0) {
        line = tokens[idx].lines[0];
        return '<h' + tokens[idx].hLevel + ' class="line" data-line="' + line + '">';
    }
    return '<h' + tokens[idx].hLevel + '>';
};
function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

function isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['iphone', 'ipod', 'ipad', 'android', 'windows phone', 'blackberry', 'nokia', 'opera mini', 'mobile'];
    for (let i = 0; i < mobileKeywords.length; i++) {
        if (userAgent.indexOf(mobileKeywords[i]) !== -1) {
            return true;
        }
    }
    return false;
}

function insertPresetText() {
    $("#kw-target").val($('#preset-text').val());
    autoresize();
}

var aiSource = "default";
var aiSourceWork = {
    keepEnable: true,
    webEnable: true
};

function switchAiSource() {
    aiSource = $('#aiSource').val();
    if (aiSource === 'source1') {
        aiSourceWork.keepEnable = true;
        aiSourceWork.webEnable = false;
    } else if (aiSource === 'source2') {
        aiSourceWork.keepEnable = false;
        aiSourceWork.webEnable = false;
    } else {
        aiSourceWork.keepEnable = true;
        aiSourceWork.webEnable = true;
    }
    $("#keep").get(0).checked = aiSourceWork.keepEnable ? $("#keep").get(0).checked : false
    $("#web").get(0).checked = aiSourceWork.webEnable ? $("#web").get(0).checked : false
    localStorage.setItem('keepStatus', $("#keep").get(0).checked);
    localStorage.setItem('webStatus', $("#web").get(0).checked);
    var name = $('#aiSource').get(0).options[$('#aiSource').get(0).selectedIndex].getAttribute('name')
    layer.msg("切换" + name + "成功", { icon: 6 });
}

function initcode() {
    $("#key").val(localStorage.getItem("key"));
    console['\x6c\x6f\x67']("\u672c\u7ad9\u4ee3\u7801\u4fee\u6539\u81ea\x68\x74\x74\x70\x3a\x2f\x2f\x67\x69\x74\x68\x75\x62\x2e\x63\x6f\x6d\x2f\x64\x69\x72\x6b\x31\x39\x38\x33\x2f\x63\x68\x61\x74\x67\x70\x74");
}

function copyToClipboard(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

function copycode(obj) {
    copyToClipboard($(obj).closest('code').clone().children('button').remove().end().text());
    layer.msg("复制完成！");
}

function autoresize() {
    var textarea = $('#kw-target');
    var width = textarea.width();
    var content = (textarea.val() + "a").replace(/\\n/g, '<br>');
    var div = $('<div>').css({
        'position': 'absolute',
        'top': '-99999px',
        'border': '1px solid red',
        'width': width,
        'font-size': '15px',
        'line-height': '20px',
        'white-space': 'pre-wrap'
    }).html(content).appendTo('body');
    var height = div.height();
    var rows = Math.ceil(height / 20);
    div.remove();
    textarea.attr('rows', rows);
    $("#article-wrapper").height(parseInt($(window).height()) - parseInt($("#fixed-block").height()) - parseInt($(".layout-header").height()) - 80);
}


document.addEventListener("DOMContentLoaded", function () {
    // 添加监听事件
    $("#keep").on('click', function () {
        if (!aiSourceWork.keepEnable) {
            $("#keep").get(0).checked = false;
            layer.msg("当前线路不支持开启连续对话,请切换线路", { icon: 5 });
        }
        localStorage.setItem('keepStatus', $("#keep").get(0).checked);
    });
    $("#web").on('click', function () {
        if (!aiSourceWork.webEnable) {
            $("#web").get(0).checked = false;
            layer.msg("当前线路不支持开启联网查询,请切换线路", { icon: 5 });
        }
        localStorage.setItem('webStatus', $("#web").get(0).checked);
    });

    const keepStatus = localStorage.getItem('keepStatus');
    const webStatus = localStorage.getItem('webStatus');
    // 如果 localStorage 中存了 rememberMe 的值，则将 checkbox 设置为对应状态
    if (keepStatus !== null) {
        $("#keep").get(0).checked = (keepStatus === 'true');
    }
    if (webStatus !== null) {
        $("#web").get(0).checked = (webStatus === 'true');
    }

    // 初始化线路aiSource和线路工作aiSourceWork
    aiSource = $('#aiSource').val();
    if (aiSource === 'source1') {
        aiSourceWork.keepEnable = true;
        aiSourceWork.webEnable = false;
    } else if (aiSource === 'source2') {
        aiSourceWork.keepEnable = false;
        aiSourceWork.webEnable = false;
    } else {
        aiSourceWork.keepEnable = true;
        aiSourceWork.webEnable = true;
    }
    $("#keep").get(0).checked = aiSourceWork.keepEnable ? $("#keep").get(0).checked : false
    $("#web").get(0).checked = aiSourceWork.webEnable ? $("#web").get(0).checked : false
    localStorage.setItem('keepStatus', $("#keep").get(0).checked);
    localStorage.setItem('webStatus', $("#web").get(0).checked);

});

$(document).ready(function () {
    initcode();
    autoresize();

    $("#kw-target").on('keypress', function (event) {
        if ((event.shiftKey || event.ctrlKey) && event.keyCode == 13) {
            // 换行
            $("#kw-target").val($("#kw-target").val() + '\n');
            $("#kw-target").off('keydown');
            return false;
        } else if (event.keyCode == 13 && !isMobile()) {
            if (!chating) {
                // 发送
                send_post();
            }
            return false;
        }
    });


    $(window).resize(function () {
        autoresize();
    });

    $('#kw-target').on('input', function () {
        autoresize();
    });

    $("#ai-btn").click(function () {
        // if ($("#kw-target").is(':disabled')) {
        if (chating) {
            // clearInterval(timer);
            // $("#kw-target").val("");
            // $("#kw-target").attr("disabled", false);
            // autoresize();
            // $("#ai-btn").html('<i class="iconfont icon-wuguan"></i>发送');
            // if (!isMobile()) $("#kw-target").focus();
            stopChating();
        } else {
            send_post();
        }
        return false;
    });

    $("#clean").click(function () {
        $("#article-wrapper").html("");
        contextarray = [];
        layer.msg("清理完毕！");
        return false;
    });

    $("#showlog").click(function () {
        let btnArry = ['已阅'];
        layer.open({ type: 1, title: '全部对话日志', area: ['80%', '80%'], shade: 0.5, scrollbar: true, offset: [($(window).height() * 0.1), ($(window).width() * 0.1)], content: '<iframe src="chat.txt?' + new Date().getTime() + '" style="width: 100%; height: 100%;"></iframe>', btn: btnArry });
        return false;
    });

    function stopChating() {
        chating = false;
        clearInterval(timer);
        autoresize();
        $("#ai-btn").html('<i class="iconfont icon-wuguan"></i>发送');
        if (!isMobile()) $("#kw-target").focus();
    }

    function startChating() {
        chating = true;
        $("#ai-btn").html('<i class="iconfont icon-wuguan"></i>发送中...').attr("onclick", null);
    }

    var chating = false;

    var sessionId = "";

    function send_post() {

        // if (($('#key').length) && ($('#key').val().length != 51)) {
        //     layer.msg("请输入正确的API-KEY", { icon: 5 });
        //     return;
        // }
        var key = ($("#key").length) ? ($("#key").val()) : '';

        if (key == "") {
            layer.msg("请输入邀请码", { icon: 5 });
            return;
        }

        var prompt = $("#kw-target").val();

        if (prompt == "") {
            layer.msg("请输入您的问题", { icon: 5 });
            return;
        }

        startChating();

        var answer;

        // var loading = layer.msg('正在组织语言，请稍等片刻...', {
        //     icon: 16,
        //     shade: 0.4,
        //     time: false //取消自动关闭
        // });

        // 这里才是发出请求
        function streaming() {


            // var context = (!($("#keep").length) || ($("#keep").prop("checked"))) ? JSON.stringify(contextarray) : '[]';
            // context = JSON.parse((context || "[]") || []);
            // var messages = [];
            // if (context.length > 0) {
            //     var lastFiveMessages = context.slice(-5);
            //     for (var i = 0; i < lastFiveMessages.length; i++) {
            //         messages.push({ 'role': 'user', 'content': lastFiveMessages[i][0].replace(/\n/g, "\\n") });
            //         messages.push({ 'role': 'assistant', 'content': lastFiveMessages[i][1].replace(/\n/g, "\\n") });
            //     }
            // }

            // messages.push({ 'role': 'user', 'content': prompt });
            // var payload = {
            //     model: 'gpt-3.5-turbo',
            //     temperature: 0,
            //     stream: true,
            //     messages: messages
            // };

            // var OPENAI_API_KEY = ($("#key").length) ? ($("#key").val()) : 'sk-replace_with_your_api_key_dude';
            // var headers = {
            //     'Authorization': 'Bearer ' + OPENAI_API_KEY,
            //     'Accept': 'text/event-stream',
            //     'Content-Type': 'application/json'
            // };


            // console.log(context + "iyzs")
            // console.log(messages + "iyzs")


            // function getFormBody(data) {
            //     var formBody = new URLSearchParams();
            //     for (var key in data) {
            //         formBody.append(key, data[key]);
            //     }
            //     return formBody.toString();
            // }

            // console.log(JSON.stringify(payload))

            // 这里是发出请求
            console.log(sessionId)

            // const worker = new SharedWorker('js/worker.js');

            // worker.port.postMessage({ type: 1, sessionId: encodeURIComponent(sessionId) });

            var es = new EventSource("http://43.138.141.112:3355/chatgpt/call?sessionId=" + encodeURIComponent(sessionId));

            var isstarted = true;
            var alltext = "";
            var isalltext = false;

            es.onerror = function (event) {
                console.log(event)
                // layer.close(loading);
                var errcode = getCookie("errcode");
                hasError = true;
                switch (errcode) {
                    case "invalid_api_key":
                        layer.msg("API-KEY不合法");
                        break;
                    case "context_length_exceeded":
                        layer.msg("问题和上下文长度超限，请重新提问");
                        break;
                    case "rate_limit_reached":
                        layer.msg("同时访问用户过多，请稍后再试");
                        break;
                    case "access_terminated":
                        layer.msg("违规使用，API-KEY被封禁");
                        break;
                    case "no_api_key":
                        layer.msg("未提供API-KEY");
                        break;
                    case "insufficient_quota":
                        layer.msg("API-KEY余额不足");
                        break;
                    case "account_deactivated":
                        layer.msg("账户已禁用");
                        break;
                    case "model_overloaded":
                        layer.msg("OpenAI模型超负荷，请重新发起请求");
                        break;
                    case null:
                        layer.msg("OpenAI服务器访问超时或未知类型错误");
                        break;
                    default:
                        layer.msg("OpenAI服务器故障，错误类型：" + errcode);
                }
                es.close();
                if (!isMobile()) $("#kw-target").focus();
                stopChating();
                return;
            }
            es.onmessage = function (event) {
                // console.log(event.data)
                if (isstarted) {
                    // layer.close(loading);
                    layer.msg("处理成功！");
                    isstarted = false;
                    let str_ = '';
                    let i = 0;
                    timer = setInterval(() => {
                        let newalltext = alltext;
                        let islastletter = false;
                        //有时服务器错误地返回\\n作为换行符，尤其是包含上下文的提问时，这行代码可以处理一下。
                        if (newalltext.split("\n\n").length == newalltext.split("\n").length) {
                            newalltext = newalltext.replace(/\\n/g, '\n');
                        }
                        if (str_.length < newalltext.length) {
                            str_ += newalltext[i++];
                            strforcode = str_ + "_";
                            if ((str_.split("```").length % 2) == 0) strforcode += "\n```\n";
                        } else {
                            if (isalltext) {
                                clearInterval(timer);
                                strforcode = str_;
                                islastletter = true;
                                stopChating();
                                // $("#kw-target").val("");
                                // $("#kw-target").attr("disabled", false);
                                // autoresize();
                                // $("#ai-btn").html('<i class="iconfont icon-wuguan"></i>发送');
                                if (!isMobile()) $("#kw-target").focus();
                            }
                        }
                        //let arr = strforcode.split("```");
                        //for (var j = 0; j <= arr.length; j++) {
                        //    if (j % 2 == 0) {
                        //        arr[j] = arr[j].replace(/\n\n/g, '\n');
                        //        arr[j] = arr[j].replace(/\n/g, '\n\n');
                        //        arr[j] = arr[j].replace(/\t/g, '\\t');
                        //        arr[j] = arr[j].replace(/\n {4}/g, '\n\\t');
                        //        arr[j] = $("<div>").text(arr[j]).html();
                        //    }
                        //}

                        //var converter = new showdown.Converter();
                        //newalltext = converter.makeHtml(arr.join("```"));
                        newalltext = mdHtml.render(strforcode);
                        //newalltext = newalltext.replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
                        $("#" + answer).html(newalltext);
                        if (islastletter) MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                        //if (document.querySelector("[id='" + answer + "']" + " pre code")) document.querySelectorAll("[id='" + answer + "']" + " pre code").forEach(el => { hljs.highlightElement(el); });
                        $("#" + answer + " pre code").each(function () {
                            $(this).html("<button onclick='copycode(this);' class='codebutton'>复制</button>" + $(this).html());
                        });
                        document.getElementById("article-wrapper").scrollTop = 100000;
                    }, 30);
                }
                if (event.data == "[DONE]") {
                    isalltext = true;
                    if (kepp && !hasError) {
                        contextarray.push([prompt, alltext]);
                    }
                    // contextarray = contextarray.slice(-5); //只保留最近5次对话作为上下文，以免超过最大tokens限制
                    // worker.terminate();
                    // worker.port.postMessage({ type: 2 });
                    es.close();
                    return;
                }
                var json = eval("(" + event.data + ")");
                if (json.choices[0].delta.hasOwnProperty("content")) {
                    if (alltext == "") {
                        alltext = json.choices[0].delta.content.replace(/^\n+/, ''); //去掉回复消息中偶尔开头就存在的连续换行符
                    } else {
                        alltext += json.choices[0].delta.content;
                    }
                }
            }
        }

        // var kepp = (!($("#keep").length) || ($("#keep").prop("checked")));
        var kepp = $("#keep").get(0).checked;
        var hasError = false;

        $.ajax({
            cache: true,
            type: "POST",
            url: "http://43.138.141.112:3355/chatgpt/setSession",
            data: JSON.stringify({
                message: prompt,
                context: kepp ? JSON.stringify(contextarray) : '[]',
                web: (!($("#web").length) || ($("#web").prop("checked"))) ? true : false,
                key: key,
                keep: kepp,
                sessionId: sessionId,
                aiSource: aiSource
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (results) {
                if (results.errorCode == 0) {
                    localStorage.setItem('key', key);
                    sessionId = results.sessionId;
                } else {
                    layer.msg(results.msg, { icon: 5 });
                    if (results.errorCode == 100) {
                        localStorage.removeItem('key');
                    }
                    stopChating();
                    return;
                }
                $("#kw-target").val("");
                // $("#kw-target").val("请耐心等待AI把话说完……");
                // $("#kw-target").attr("disabled", true);
                autoresize();
                $("#ai-btn").html('<i class="iconfont icon-wuguan"></i>中止');
                answer = randomString(16);
                $("#article-wrapper").append('<li class="article-title" id="q' + answer + '"><pre></pre></li>');
                for (var j = 0; j < prompt.length; j++) {
                    $("#q" + answer).children('pre').text($("#q" + answer).children('pre').text() + prompt[j]);
                }
                $("#article-wrapper").append('<li class="article-content" id="' + answer + '"></li>');
                streaming();
            }
        });


    }

    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

});