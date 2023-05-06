let handleMemberJoined = async (MemberId) =>  {
    console.log('A new Member has joined the room:',MemberId)
    addMemberToDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)

    let {name} =await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDOM(`${name} has entered the room`)
}

let addMemberToDom = async (MemberId) => {
    let {name} =await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    let memberWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
    <span class="green__icon"></span>
    <p class="member_name">${name}</p>
</div> `

memberWrapper.insertAdjacentHTML('beforeend', memberItem)
}

let updateMemberTotal =  async (members) => {
    let total = document.getElementById('members__count')
    total.innerText =members.length
}

let handleMemberLeft= async (MemberId) => {

    removeMemberFromDOM(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDOM = async (MemberId) =>{
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name= memberWrapper.getElementsByClassName('member_name')[0].textContent
    memberWrapper.remove()

    addBotMessageToDOM(`${name} has left the room`)
}
let getMembers = async () =>{
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for(let i=0; members.length>i;i++){
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {
    console.log('A new message was received')
    let data  = JSON.parse(messageData.text)
   
    if(data.type === 'chat'){
        addMessageToDOM(data.displayName, data.message)
    }

    if (data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `use-container-${uid}`){
            displayFrame.style.display=null
            
            for(leti=0; videoFrames.length> i; i++){
                videoFrames[i].style.height ='300px'  
                videoFrames[i].style.width ='300px'
              }
        
         }

    }
}

let sendMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
    addMessageToDOM(displayName, message)
    e.target.reset()
}

let addMessageToDOM = (name,message) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = ` <div class="message__wrapper">
    <div class="message__body">
        <strong class="message__author">${name}</strong>
        <p class="message__text">${message}</p>
    </div>
</div>`

messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}
}

let addBotMessageToDOM = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `   <div class="message__wrapper">
    <div class="message__body__bot">
        <strong class="message__author__bot">🤖 Bot</strong>
        <p class="message__text__bot">${botMessage}</p>
    </div>
</div>`

messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}
}

let questionToDOM = (raisehAND) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `   <div class="message__wrapper">
    <div class="message__body__bot">
        <strong class="message__author__bot">🤖 Bot</strong>
        <p class="message__text__bot">${raisehAND} wants to ask a question</p>
    </div>
</div>`

messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}
}

let askShareToDOM = (raisehAND) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `   <div class="message__wrapper">
    <div class="message__body__bot">
        <strong class="message__author__bot">${raisehAND}</strong>
        <p class="message__text__bot">I want to share my screen</p>
    </div>
</div>`

messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
if(lastMessage){
    lastMessage.scrollIntoView()
}
}

let leaveChannel = async() => {
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener('beforeunload', leaveChannel)

let messageForm =document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)