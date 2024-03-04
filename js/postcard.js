const cardData = [
    {
        heading:'QC : 1',
        topic_name:'@msg/sms-0'
    },
    {
        heading:'MQTTBOX_1',
        topic_name:'@msg/sms-1'
    },
    {
        heading:'DUMMY_0',
        topic_name:'DUMMY_0'
    },
    {
        heading:'DUMMY_1',
        topic_name:'DUMMY_1'
    },
    {
        heading:'DUMMY_2',
        topic_name:'DUMMY_2'
    },
]

const postContainer = document.querySelector('.card-list');

const postMethods = ()=>{
    cardData.map((postData)=>{
        const postElement = document.createElement('div');
        postElement.classList.add('card');
        postElement.innerHTML=`
                <h1>${postData.heading}</h1>
                <h3>Status : <button id="status-${postData.topic_name}" class="offline" onclick='normalMessage("${postData.topic_name}","checkStatus")'>Offline</button></h3>
                <div id="show-${postData.topic_name}" class="messages"></div>
                <div class="gButt"><button onclick="normalMessage('${postData.topic_name}','callMessage')">เรียก</button><button onclick="normalMessage('${postData.topic_name}','cancelMessage')">ยกเลิก</button></div>
            `
        postContainer.appendChild(postElement)
    })
}
postMethods()
