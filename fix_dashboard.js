const fs = require('fs');
const path = 'c:/Users/Foridi/Desktop/grow-halal/public/dashboard.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the first redundant block (Firebase + old app.js)
const firstBlockStart = content.indexOf('<!-- Firebase SDKs -->');
const firstBlockEnd = content.indexOf('<!-- Report Preview Modal -->');

if (firstBlockStart !== -1 && firstBlockEnd !== -1 && firstBlockStart < firstBlockEnd) {
    const html2pdf = '    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\n';
    content = content.substring(0, firstBlockStart) + html2pdf + content.substring(firstBlockEnd);
}

// 2. Fix the corrupted tail
const navEnd = content.indexOf('id="bnav-profile">');
if (navEnd !== -1) {
    const endTag = '    </nav>';
    const lastNavEnd = content.indexOf(endTag, navEnd);
    
    if (lastNavEnd !== -1) {
        // Cut everything after the REAL nav end and put the correct footer
        const footer = `\n    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
    <script src="app.js?v=11" defer></script>
</body>
</html>`;
        content = content.substring(0, lastNavEnd + endTag.length) + footer;
    }
}

// 3. Make sure the Profile button text is fixed too
content = content.replace(/<button class="bottom-nav-item" onclick="openSelfProfile\(\)" id="bnav-profile">[\s\S]*?<\/button>/, 
    `<button class="bottom-nav-item" onclick="openSelfProfile()" id="bnav-profile">
                <i class="fa-solid fa-user"></i>
                <span data-i18n="menu-profile">Profile</span>
            </button>`);

fs.writeFileSync(path, content, 'utf8');
console.log('Dashboard HTML repair complete');
