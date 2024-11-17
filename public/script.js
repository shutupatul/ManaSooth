// Handles the form submission and chatbot activation
document.getElementById('submitAssessment').addEventListener('click', function () {
    // Collecting form data
    let formData = new FormData(document.getElementById('assessmentForm'));
    let results = calculateResults(formData);

    // Display results
    displayResults(results);

    // Activate Chatbot after submitting the assessment
    activateChatbot();
});

function normalizeInput(input) {
    return input.toLowerCase().trim();
}

// Event listener for sending the message
document.getElementById("sendMessage").addEventListener("click", async function() {
    let userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() === "") return; // Do not send empty messages

    const chatWindow = document.getElementById('chatWindow');
    
    // Append user message to chat window
    chatWindow.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
    
    // Clear input field
    document.getElementById('userMessage').value = '';

    // Scroll chat window to bottom after each new message
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Make a POST request to the backend to get the chatbot's response
    try {
        const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
});


        const data = await response.json();
        if (data.reply) {
            chatWindow.innerHTML += `<div><strong>Chatbot:</strong> ${data.reply}</div>`;
        } else {
            chatWindow.innerHTML += "<div><strong>Chatbot:</strong> Sorry, I couldn't understand that. Can you please rephrase?</div>";
        }
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        chatWindow.innerHTML += "<div><strong>Chatbot:</strong> Sorry, something went wrong. Please try again later.</div>";
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

// Function to calculate results based on answers
function calculateResults(formData) {
    let results = {};
    let totalScore = 0;

    // Loop through each question (q1, q2, ..., q19)
    for (let [key, value] of formData.entries()) {
        // Check if the key starts with 'q' and is a number
        if (key.startsWith('q')) {
            totalScore += parseInt(value);
        }
    }

    // Determine the mental health status based on the total score
    if (totalScore <= 10) {
        results.status = "Good mental health";
    } else if (totalScore <= 20) {
        results.status = "Moderate symptoms of depression or anxiety";
    } else {
        results.status = "Possible severe depression or anxiety symptoms";
    }

    results.totalScore = totalScore;
    return results;
}

// Function to display results on the page
function displayResults(results) {
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = `
        <p><strong>Total Score:</strong> ${results.totalScore}</p>
        <p><strong>Status:</strong> ${results.status}</p>
    `;
    document.getElementById('results').style.display = 'block'; // Show results section
}

// Function to activate the chatbot
function activateChatbot() {
    document.getElementById('chatbot').style.display = 'block';
    setTimeout(() => {
        startChatbotConversation();
    }, 500);
}

// Function to start the chatbot conversation
function startChatbotConversation() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML += "<div><strong>Chatbot:</strong> Hello! How are you feeling today?</div>";
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}
