// ========== TRANSLATION SYSTEM ==========

// Translation dictionaries


function loadChatMessages(chatId) {
    const container = $("#chat-container");
    container.empty();
   
    const messages = chatData[chatId] || [];
    const title = translations[currentLanguage][`subjects.${chatId}`] ||
                 $(`.discussion-item[data-discussion="${chatId}"] h6`).text();
    $("#chat-title").text(title);
   
    if (messages.length === 0) {
        const noMessagesText = translations[currentLanguage]["chat.noMessages"];
        container.append(`
            <div class="text-center py-5 text-muted">
                <i class="bi bi-chat-left" style="font-size: 3rem;"></i>
                <p class="mt-3">${noMessagesText}</p>
            </div>
        `);
        return;
    }
   
    messages.forEach(msg => {
        const messageClass = msg.type === "sent" ? "message-sent" : "message-received";
        const senderName = msg.sender[currentLanguage] || msg.sender.fr;
        const messageText = msg.message[currentLanguage] || msg.message.fr;
       
        container.append(`
            <div class="chat-message ${messageClass}">
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong>${senderName}</strong>
                    <small class="text-muted">${msg.time}</small>
                </div>
                <div>${messageText}</div>
            </div>
        `);
    });
   
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

function sendMessage() {
    const input = $("#chat-input");
    const message = input.val().trim();
   
    if (message === "") return;
   
    // Add message to chat
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
   
    const container = $("#chat-container");
    const senderName = currentLanguage === 'fr' ? 'John Bonté' : 'John Bonté';
   
    container.append(`
        <div class="chat-message message-sent">
            <div class="d-flex justify-content-between align-items-start mb-1">
                <strong>${senderName}</strong>
                <small class="text-muted">${timeString}</small>
            </div>
            <div>${message}</div>
        </div>
    `);
   
    // Reset input
    input.val("");
   
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

// ========== SESSION MANAGEMENT ==========

function createNewSession() {
    const title = $("#session-title").val();
    const date = $("#session-date").val();
    const time = $("#session-time").val();
    const students = $("#session-students").val();
    const description = $("#session-description").val();
   
    // Success message
    const successMessage = translations[currentLanguage]["common.sessionCreated"];
    alert(`${successMessage}\n${currentLanguage === 'fr' ? 'Titre' : 'Title'}: "${title}"\n${currentLanguage === 'fr' ? 'Date' : 'Date'}: ${date} ${time}\n${currentLanguage === 'fr' ? 'Étudiants' : 'Students'}: ${students}`);
   
    // Return to sessions view
    showView("sessions");
    updateNavActive($("#sessions-link"));
   
    // Reset form
    $("#new-session-form")[0].reset();
}

function startTutoringSession(sessionName) {
    activeSession = sessionName;
   
    // Update session title
    let sessionTitle = "";
    let sessionInfo = "";
   
    const dateText = currentLanguage === 'fr' ? 'Date' : 'Date';
    const timeText = currentLanguage === 'fr' ? 'Heure' : 'Time';
    const studentsText = currentLanguage === 'fr' ? 'Étudiants' : 'Students';
   
    switch(sessionName) {
        case "maths":
            sessionTitle = translations[currentLanguage]["subjects.math"];
            sessionInfo = `${dateText}: 10/01/2025 - ${timeText}: 14:00 - ${studentsText}: 5`;
            break;
        case "electronics":
            sessionTitle = translations[currentLanguage]["subjects.electronics"];
            sessionInfo = `${dateText}: 08/01/2025 - ${timeText}: 10:00 - ${studentsText}: 8`;
            break;
        case "analysis":
            sessionTitle = translations[currentLanguage]["subjects.analysis"];
            sessionInfo = `${dateText}: 05/01/2025 - ${timeText}: 16:00 - ${studentsText}: 3`;
            break;
    }
   
    $("#session-chat-title").text(sessionTitle);
    $("#session-chat-info").text(sessionInfo);
   
    // Load session messages
    loadTutoringChat(sessionName);
   
    // Initialize participants list
    const participantsCount = sessionName === "maths" ? 5 :
                             sessionName === "electronics" ? 8 : 3;
   
    const participantsList = $("#participants-list");
    participantsList.empty();
   
    const teacherText = translations[currentLanguage]["tutoring.teacher"];
    participantsList.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>John Bonté</span>
            <span class="badge bg-primary rounded-pill">${teacherText}</span>
        </li>
    `);
   
    const studentText = currentLanguage === 'fr' ? 'Étudiant' : 'Student';
    for (let i = 1; i <= participantsCount; i++) {
        participantsList.append(`
            <li class="list-group-item">
                <span>${studentText} ${i}</span>
            </li>
        `);
    }
   
    // Initialize session resources
    const sessionResources = $("#session-resources");
    sessionResources.empty();
   
    if (sessionName === "maths") {
        const sharedText = currentLanguage === 'fr' ? 'Partagé à' : 'Shared at';
        sessionResources.append(`
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-file-earmark-pdf text-primary fs-4 me-3"></i>
                            <div>
                                <h6 class="mb-0">Exercices_Matrices.pdf</h6>
                                <small class="text-muted">${sharedText} 14:10</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
   
    // Show tutoring view
    showView("tutoring");
    updateNavActive(null);
}

function loadTutoringChat(sessionName) {
    const container = $("#tutoring-chat-container");
    container.empty();
   
    const messages = chatData[sessionName] || [];
   
    if (messages.length === 0) {
        const startConversationText = translations[currentLanguage]["common.startConversation"];
        container.append(`
            <div class="text-center py-5 text-muted">
                <i class="bi bi-chat-left" style="font-size: 3rem;"></i>
                <p class="mt-3">${startConversationText}</p>
            </div>
        `);
        return;
    }
   
    messages.forEach(msg => {
        const messageClass = msg.type === "sent" ? "message-sent" : "message-received";
        const senderName = msg.sender[currentLanguage] || msg.sender.fr;
        const messageText = msg.message[currentLanguage] || msg.message.fr;
       
        container.append(`
            <div class="chat-message ${messageClass}">
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong>${senderName}</strong>
                    <small class="text-muted">${msg.time}</small>
                </div>
                <div>${messageText}</div>
            </div>
        `);
    });
   
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

function sendTutoringMessage() {
    const input = $("#tutoring-chat-input");
    const message = input.val().trim();
   
    if (message === "") return;
   
    // Add message to chat
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
   
    const container = $("#tutoring-chat-container");
    const senderName = currentLanguage === 'fr' ? 'John Bonté' : 'John Bonté';
   
    container.append(`
        <div class="chat-message message-sent">
            <div class="d-flex justify-content-between align-items-start mb-1">
                <strong>${senderName}</strong>
                <small class="text-muted">${timeString}</small>
            </div>
            <div>${message}</div>
        </div>
    `);
   
    // Reset input
    input.val("");
   
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

// ========== FILE MANAGEMENT ==========

function importFile() {
    const fileInput = $("#file-upload")[0];
    const description = $("#file-description").val();
    const subject = $("#file-subject").val();
   
    if (fileInput.files.length === 0) {
        const errorMessage = translations[currentLanguage]["common.fileRequired"];
        alert(errorMessage);
        return;
    }
   
    const fileName = fileInput.files[0].name;
   
    // Success message
    const successMessage = translations[currentLanguage]["common.fileImported"];
    const subjectLabel = currentLanguage === 'fr' ? 'Matière' : 'Subject';
    const descLabel = currentLanguage === 'fr' ? 'Description' : 'Description';
   
    alert(`${successMessage}\n${currentLanguage === 'fr' ? 'Fichier' : 'File'}: "${fileName}"\n${subjectLabel}: ${subject}\n${descLabel}: ${description}`);
   
    // Return to resources view
    showView("resources");
    updateNavActive($("#resources-link"));
   
    // Reset form
    $("#import-form")[0].reset();
}

function shareFileInSession() {
    const fileInput = $("#session-file-upload")[0];
   
    if (fileInput.files.length === 0) {
        const errorMessage = translations[currentLanguage]["common.selectFile"];
        alert(errorMessage);
        return;
    }
   
    const fileName = fileInput.files[0].name;
   
    // Add sharing message
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
   
    const container = $("#tutoring-chat-container");
    const senderName = currentLanguage === 'fr' ? 'John Bonté' : 'John Bonté';
    const sharedText = currentLanguage === 'fr' ? 'Fichier partagé' : 'File shared';
   
    container.append(`
        <div class="chat-message message-sent">
            <div class="d-flex justify-content-between align-items-start mb-1">
                <strong>${senderName}</strong>
                <small class="text-muted">${timeString}</small>
            </div>
            <div><i class="bi bi-file-earmark"></i> ${sharedText}: <strong>${fileName}</strong></div>
        </div>
    `);
   
    // Add resource to list
    const sessionResources = $("#session-resources");
    const sharedAtText = currentLanguage === 'fr' ? 'Partagé à' : 'Shared at';
   
    sessionResources.append(`
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark text-primary fs-4 me-3"></i>
                        <div>
                            <h6 class="mb-0">${fileName}</h6>
                            <small class="text-muted">${sharedAtText} ${timeString}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
   
    // Reset file input
    fileInput.value = "";
   
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
   
    const successMessage = translations[currentLanguage]["common.fileShared"];
    alert(`${successMessage}: "${fileName}"`);
}

// ========== INITIALIZATION ==========

$(document).ready(function() {
    // Language change handler
    $('.lang-btn').click(function() {
        const lang = $(this).data('lang');
        changeLanguage(lang);
    });
   
    // Navigation between views
    $("#dashboard-link").click(function(e) {
        e.preventDefault();
        showView("dashboard");
        updateNavActive($(this));
    });
   
    $("#sessions-link").click(function(e) {
        e.preventDefault();
        showView("sessions");
        updateNavActive($(this));
    });
   
    $("#resources-link").click(function(e) {
        e.preventDefault();
        showView("resources");
        updateNavActive($(this));
        loadFolderContents(currentFolder);
    });
   
    $("#discussions-link").click(function(e) {
        e.preventDefault();
        showView("discussions");
        updateNavActive($(this));
        loadChatMessages(currentChat);
    });
   
    $("#new-session-link").click(function(e) {
        e.preventDefault();
        showView("new-session");
        updateNavActive($(this));
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        $("#session-date").val(tomorrow.toISOString().split('T')[0]);
    });
   
    $("#import-link").click(function(e) {
        e.preventDefault();
        showView("import");
        updateNavActive($(this));
    });
   
    $("#logout-link").click(function(e) {
        e.preventDefault();
        const message = translations[currentLanguage]["common.confirmLogout"];
        const successMessage = translations[currentLanguage]["common.logoutSuccess"];
       
        if(confirm(message)) {
            alert(successMessage);
            // Redirect to login page
        }
    });
   
    // Dashboard buttons
    $("#start-session-btn").click(function() {
        showView("new-session");
        updateNavActive($("#new-session-link"));
    });
   
    $("#add-files-btn").click(function() {
        showView("import");
        updateNavActive($("#import-link"));
    });
   
    $("#view-all-sessions").click(function(e) {
        e.preventDefault();
        showView("sessions");
        updateNavActive($("#sessions-link"));
    });
   
    // Session filtering
    $(".btn-group .btn").click(function() {
        $(".btn-group .btn").removeClass("active");
        $(this).addClass("active");
       
        const filter = $(this).data("filter");
        if (filter === "all") {
            $(".session-card").show();
        } else {
            $(".session-card").hide();
            $(`.session-card[data-status="${filter}"]`).show();
        }
    });
   
    // Folder navigation
    $(document).on("click", ".folder-item", function() {
        const folderId = $(this).data("folder");
        if (folderId) {
            navigateToFolder(folderId);
        }
    });
   
    $(document).on("click", ".breadcrumb-item a", function(e) {
        e.preventDefault();
        const folderId = $(this).data("folder");
        navigateToFolder(folderId);
    });
   
    // Discussion management
    $(document).on("click", ".discussion-item", function() {
        $(".discussion-item").removeClass("discussion-active");
        $(this).addClass("discussion-active");
       
        const discussionId = $(this).data("discussion");
        currentChat = discussionId;
        loadChatMessages(discussionId);
    });
   
    // Sending messages in discussions
    $("#send-message-btn").click(function() {
        sendMessage();
    });
   
    $("#chat-input").keypress(function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });
   
    // Start a tutoring session
    $(document).on("click", ".start-chat-btn", function() {
        const sessionName = $(this).data("session");
        startTutoringSession(sessionName);
    });
   
    // View a session discussion
    $(document).on("click", ".view-chat-btn", function() {
        const sessionName = $(this).data("session");
        showView("discussions");
        updateNavActive($("#discussions-link"));
       
        // Select the correct discussion
        $(`.discussion-item[data-discussion="${sessionName}"]`).click();
    });
   
    // New session
    $("#new-session-btn").click(function() {
        showView("new-session");
        updateNavActive($("#new-session-link"));
    });
   
    $("#cancel-session-btn").click(function() {
        showView("sessions");
        updateNavActive($("#sessions-link"));
    });
   
    $("#new-session-form").submit(function(e) {
        e.preventDefault();
        createNewSession();
    });
   
    // File import
    $("#cancel-import-btn").click(function() {
        showView("resources");
        updateNavActive($("#resources-link"));
    });
   
    $("#import-form").submit(function(e) {
        e.preventDefault();
        importFile();
    });
   
    // Tutoring session
    $("#end-session-btn").click(function() {
        const message = translations[currentLanguage]["common.confirmEndSession"];
        if(confirm(message)) {
            showView("sessions");
            updateNavActive($("#sessions-link"));
        }
    });
   
    $("#tutoring-send-btn").click(function() {
        sendTutoringMessage();
    });
   
    $("#tutoring-chat-input").keypress(function(e) {
        if (e.which === 13) {
            sendTutoringMessage();
        }
    });
   
    $("#share-file-btn").click(function() {
        shareFileInSession();
    });
   
    // Initialize default view
    showView("dashboard");
    updateNavActive($("#dashboard-link"));
   
    // Initialize language
    changeLanguage(currentLanguage);});