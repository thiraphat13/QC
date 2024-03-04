client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "096006cb-3ce7-4163-99dd-2529dbcbd46c");
client.onMessageArrived = onMessageArrived;

order = [];

var options = {
    useSSL: true,
    userName : "RaThqpN9bPALcm67sPvyGgBws9TVVtCW",
    password : "BRLSxgt2jcwPVLZtGoQRy5YznExrTB8f",  
    onSuccess: onConnect,
    onFailure:doFail,
}

client.connect(options);

function onConnect() {
    document.getElementById("status").className = "online";
    document.getElementById("status").innerHTML = "Online";
    client.subscribe("@msg/open");
    cardData.map((postData)=>{
        client.subscribe(postData.topic_name)
        normalMessage(postData.topic_name,"startStatus")
    });
}

while(!client.connected()) {
    document.getElementById("status").className = "connect"; 
    document.getElementById("status").innerHTML = "Connect...";
    client.connect(options);
}

function doFail(e){
    document.getElementById("status").className = "offline";
    document.getElementById("status").innerHTML = e;
  }

function onMessageArrived(message) {
    document.getElementById("show-"+message.destinationName).innerHTML += message.payloadString+"<br>";
    document.getElementById("show-"+message.destinationName).scrollTop = document.getElementById("show-"+message.destinationName).scrollHeight;
    changeStatus(message.payloadString,message.destinationName);
    getQueue(message.destinationName,message.payloadString);
}

function publishMessage() {
    topic_name = document.getElementById("topic_name").value;
    msg_name = document.getElementById("msg_name").value;
    message = new Paho.MQTT.Message(msg_name);
    message.destinationName = topic_name;
    client.send(message);
}

function changeStatus(message_txt,topic_name) {
    var status_id = "status-"+topic_name;
    if (message_txt=="Connected") {
        document.getElementById(status_id).className = "online"; 
        document.getElementById(status_id).innerHTML = "Online";
    } else if (message_txt=="checkStatus") {
        document.getElementById(status_id).className = "connect"; 
        document.getElementById(status_id).innerHTML = "Connect...";
    } else if (message_txt=="startStatus") {
        document.getElementById(status_id).className = "connect"; 
        document.getElementById(status_id).innerHTML = "Connect...";
    }
}

function normalMessage(topic,msg) {
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);

    if (msg=='callMessage') {
        if (topic=='@msg/open') {
            if (order.length>0) {
                order.pop();
                if (order.length>0) {
                    document.getElementById("show-@msg/open").innerHTML += order+"<br>";
                    document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
                } else {
                    document.getElementById("show-@msg/open").innerHTML += "0 Order<br>";
                    document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
                }
            } else {
                document.getElementById("show-@msg/open").innerHTML += "0 Order<br>";
                document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
            }
        } else {
            while (order.includes(topic)) {
                order.splice(order.indexOf(topic), 1);
            }
            if (order.length>0) {
                order.map((postData)=>{
                    client.subscribe(postData)
                    normalMessage(postData,"reQueue")
                });
                document.getElementById("show-@msg/open").innerHTML += order+"<br>";
                document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
            }
        }
    } else if (msg=='cancelMessage') {
        while (order.includes(topic)) {
            order.splice(order.indexOf(topic), 1);
        }
        if (order.length>0) {
            order.map((postData)=>{
                client.subscribe(postData)
                normalMessage(postData,"reQueue")
            });
            document.getElementById("show-@msg/open").innerHTML += order+"<br>";
            document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
        }
    }
}

function getQueue(topic,msg) {
    if (msg=="getQueue") {
        if (!order.includes(topic)) {
            order.push(topic);
        }
        n=0;
        while (topic!=order[n]) {
            normalMessage(topic,"coutQueue");
            n++;
        }
        normalMessage(topic,"coutQueue");
        document.getElementById("show-@msg/open").innerHTML += order+"<br>";
        document.getElementById("show-@msg/open").scrollTop = document.getElementById("show-@msg/open").scrollHeight;
    }
}