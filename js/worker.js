// var es;
// self.onmessage = function (event) {
//     console.log('Received message from main thread:', event.data);
//     // do some work here

//     var type = event.data.type;
//     if (type == 1) {
//         es = new EventSource("http://43.138.141.112:3355/chatgpt/call?sessionId=" + event.data.sessionId);
//         es.onmessage = function (event) {
//             // console.log(event);
//             // console.log(event.data);

//             self.postMessage(event.data);
//         }
//     } else if (type == 2) {
//         es.close;
//     }


// };

self.addEventListener('connect', e => {
    const port = e.ports[0];
    port.addEventListener('message', event => {
        console.log('Received message from main thread:', event.data);

        var type = event.data.type;
        console.log(type)

        if (type == 1) {
            var es = new EventSource("http://43.138.141.112:3355/chatgpt/call?sessionId=" + event.data.sessionId);
            es.onmessage = function (event) {
                console.log('ggg' + event.data)
                port.postMessage(event.data);
            }
        } else if (type == 2) {
            self.close();
        }

    });
    port.start();
});