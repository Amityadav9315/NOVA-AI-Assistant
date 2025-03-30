const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function callBackend(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/assistant/${endpoint}?${queryString}`;
    const response = await fetch(url);
    return await response.text();
}

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello') || message.includes('nova')) {
        speak("Hello sir, How May I Help You?");
    } else if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes('open youtube')) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes('open facebook')) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('shutdown')) {
        callBackend('shutdown')
            .then(response => speak(response))
            .catch(err => speak("Unable to process your request."));
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        const query = message.replace(" ", "+");
        callBackend('info', { query })
            .then(response => speak(response))
            .catch(err => speak("Unable to fetch the information."));
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else if (message.includes('exit') || message.includes('close') || message.includes('shut down')) {
        speak("Goodbye sir, shutting down the assistant.");
        recognition.stop(); // Stop voice recognition
        btn.disabled = true; // Disable the button to prevent restarting
        content.textContent = "Assistant shut down."; // Display a message
    } else {
        const query = message.replace(" ", "+");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        const finalText = "I found some information for " + message + " on Google.";
        speak(finalText);
    }
}
