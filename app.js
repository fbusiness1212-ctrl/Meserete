// 🔐 የአድሚን መግቢያ ማረጋገጫ
function checkLogin() {
    var user = document.getElementById("adminUsername").value;
    var pass = document.getElementById("adminPassword").value;
    
    if (user === "Meserete-Hywet" && pass === "2116") {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("mainDashboard").style.display = "block";
        fetchMembersFromFirebase(); // ገጹ ሲከፈት መረጃዎችን ከዳታቤዝ ያመጣል
    } else {
        alert("የተሳሳተ የአድሚን ስም ወይም የይለፍ ቃል አስገብተዋል!");
    }
}

// 🔒 ከመለያ መውጫ
function handleLogout() {
    document.getElementById("lockScreen").style.display = "block";
    document.getElementById("mainDashboard").style.display = "none";
    document.getElementById("adminUsername").value = "";
    document.getElementById("adminPassword").value = "";
}

// 🌐 የ Firebase ዳታቤዝ አድራሻ (የአንተ ትክክለኛ ሊንክ ተገጥሞለታል)
const FIREBASE_URL = "https://meserete-hyewt-default-rtdb.firebaseio.com/";

// 📂 የአባላት እና የፅዋ መረጃዎችን ለመያዝ
let members = [];
let tsiwaList = [];
let currentViewingIndex = -1;

// 📥 መረጃዎችን ከ Firebase ዳታቤዝ ማውረጃ ፈንክሽን
function fetchMembersFromFirebase() {
    fetch(`${FIREBASE_URL}/members.json`)
    .then(response => response.json())
    .then(data => {
        members = [];
        if (data) {
            // ከዳታቤዝ የመጣውን መረጃ ወደ Array መቀየሪያ
            Object.keys(data).forEach(key => {
                let member = data[key];
                member.firebaseKey = key; // ለእያንዳንዱ አባል መለያ ቁልፍ መስጠት
                members.push(member);
            });
        }
        renderMembers();
    })
    .catch(error => console.error("መረጃ ከዳታቤዝ ሲመጣ ስህተት ተፈጥሯል:", error));
}

// 📝 አዲስ አባል መመዝገቢያ እና ማሻሻያ ቅጽ (ወደ Firebase ይልካል)
function addMember() {
    let name = document.getElementById("mName").value.trim();
    let phone = document.getElementById("mPhone").value.trim();
    let christName = document.getElementById("mChrist").value.trim();
    let bDay = document.getElementById("birthDay").value;
    let bMonth = document.getElementById("birthMonth").value;
    let bYear = document.getElementById("birthYear").value;
    let age = document.getElementById("mAge").value;
    let gender = document.getElementById("mGender").value;
    let blood = document.getElementById("mBlood").value;
    let qurbanStatus = document.getElementById("mQurbanStatus").value;
    let qDay = document.getElementById("qDay").value;
    let qMonth = document.getElementById("qMonth").value;
    let qYear = document.getElementById("qYear").value;
    let job = document.getElementById("mJobStatus").value;
    let loc = document.getElementById("mLoc").value;
    let wereda = document.getElementById("mWereda").value;
    let houseNum = document.getElementById("mHouseNum").value;
    let sefer = document.getElementById("mSeferName").value;
    let godName = document.getElementById("mGodName").value;
    let godPhone = document.getElementById("mGodPhone").value;
    let notes = document.getElementById("mNotes").value;

    if(!name || !phone) {
        alert("እባክዎ ቢያንስ ሙሉ ስምና ስልክ ቁጥር ያስገቡ!");
        return;
    }

    let todayDate = new Date();
    let editIdx = parseInt(document.getElementById("editIndex").value);

    let memberData = {
        name, phone, christName, age, gender, blood, qurbanStatus,
        birthDate: `${bDay}/${bMonth}/${bYear}`,
        lastQurbanDate: `${qDay}/${qMonth}/${qYear}`,
        address: `${loc} ክፍለ ከተማ፣ ወረዳ ${wereda}፣ የቤት ቁጥር ${houseNum} (${sefer})`,
        godfather: `${godName} (ስልክ: ${godPhone})`,
        notes: notes || "የለም",
        qurbanTrack: { checked: qurbanStatus === "በቅዱስ ቁርባን ያለ", lastUpdated: "በምዝገባ ወቅት" }
    };

    if (editIdx === -1) {
        // 1️⃣ አዲስ ምዝገባ ከሆነ -> ቀጥታ ወደ Firebase መላክ (POST)
        memberData.registrationDate = todayDate.toISOString();
        
        fetch(`${FIREBASE_URL}/members.json`, {
            method: "POST",
            body: JSON.stringify(memberData)
        })
        .then(() => {
            alert("አባል በተሳካ ሁኔታ በዳታቤዝ ውስጥ ተመዝግቧል!");
            fetchMembersFromFirebase(); // ገጹን በዳታቤዝ ማደሻ
        });
    } else {
        // 2️⃣ ነባር መረጃ ማሻሻያ ከሆነ -> በ Firebase ላይ ማደስ (PUT)
        let firebaseKey = members[editIdx].firebaseKey;
        memberData.registrationDate = members[editIdx].registrationDate || todayDate.toISOString();
        
        fetch(`${FIREBASE_URL}/members/${firebaseKey}.json`, {
            method: "PUT",
            body: JSON.stringify(memberData)
        })
        .then(() => {
            alert("የአባል ማኅደር በዳታቤዝ ላይ በተሳካ ሁኔታ ተሻሽሏል!");
            document.getElementById("editIndex").value = "-1";
            fetchMembersFromFirebase();
        });
    }

    resetForm();
    goBack();
}

// 📋 የአባላትን ዝርዝር በሰንጠረዥ ማሳያ (ከቀለም እና የ3 ወር ማስጠንቀቂያ ጋር)
function renderMembers() {
    let tbody = document.getElementById("memberTableBody");
    tbody.innerHTML = "";
    
    if(members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:gray;">ምንም የተመዘገበ አባል የለም።</td></tr>`;
        return;
    }

    let today = new Date();

    members.forEach((m, index) => {
        let rowStyle = "";
        let warningBadge = "";

        if (m.qurbanStatus !== "በቅዱስ ቁርባን ያለ") {
            rowStyle = "background-color: #ffebee; color: #c62828; font-weight: 500; border-bottom: 1px solid #ffcdd2;";
        }

        if (m.registrationDate) {
            let regDate = new Date(m.registrationDate);
            let timeDiff = today.getTime() - regDate.getTime();
            let daysDiff = timeDiff / (1000 * 3600 * 24);

            if (daysDiff >= 90) {
                warningBadge = ` <span style="background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 6px; display: inline-block; border: 1px solid white;">⚠️ የ3 ወር ማስጠንቀቂያ!</span>`;
            }
        }

        tbody.innerHTML += `<tr style="${rowStyle}">
            <td>${index + 1}</td>
            <td><b>${m.name}</b> ${warningBadge}</td>
            <td>${m.phone}</td>
            <td>${m.qurbanStatus}</td>
            <td><button onclick="viewProfile(${index})" style="background:#1a2a3a; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">📂 ክፈት</button></td>
        </tr>`;
    });
}

// 🔍 አባላትን በስም ወይም በስልክ መፈለጊያ
function searchMember() {
    let query = document.getElementById("search").value.toLowerCase();
    let rows = document.getElementById("memberTableBody").getElementsByTagName("tr");
    for (let row of rows) {
        let nameCell = row.getElementsByTagName("td")[1];
        let phoneCell = row.getElementsByTagName("td")[2];
        if (nameCell && phoneCell) {
            let nameText = nameCell.textContent.toLowerCase();
            let phoneText = phoneCell.textContent.toLowerCase();
            if (nameText.includes(query) || phoneText.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }
}

// 📜 የአባል ማኅደር ፋይልን መክፈቻ
function viewProfile(index) {
    currentViewingIndex = index;
    let m = members[index];
    let content = `** የግል መረጃ **\nሙሉ ስም: ${m.name}\nየክርስትና ስም: ${m.christName}\nጾታ: ${m.gender} | ዕድሜ: ${m.age} | የደም ዓይነት: ${m.blood}\nትውልድ ዘመን: ${m.birthDate}\n\n** አድራሻ እና ሥራ **\nስልክ: ${m.phone}\nመኖሪያ: ${m.address}\n\n** መንፈሳዊ መረጃ **\nየንሥሐ አባት: ${m.godfather}\nየቁርባን ሁኔታ: ${m.qurbanStatus} (የመጨረሻ: ${m.lastQurbanDate})\n\n** ተጨማሪ ማስታወሻ **\n${m.notes}`;
    
    document.getElementById("profileContent").textContent = content;
    document.getElementById("modalQurbanCheck").checked = m.qurbanTrack.checked;
    document.getElementById("modalLastUpdatedText").textContent = `መጨረሻ የተሻሻለው፦ ${m.qurbanTrack.lastUpdated}`;
    
    document.getElementById("modalEditBtn").onclick = function() {
        closeProfile();
        editMember(index);
    };
    document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
    document.getElementById("profileModal").style.display = "none";
}

// ✏️ የአባል ፋይል ማሻሻያ (Edit)
function editMember(index) {
    let m = members[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("mName").value = m.name;
    document.getElementById("mPhone").value = m.phone;
    document.getElementById("mChrist").value = m.christName;
    document.getElementById("mAge").value = m.age;
    document.getElementById("mGender").value = m.gender;
    document.getElementById("mBlood").value = m.blood;
    document.getElementById("mQurbanStatus").value = m.qurbanStatus;
    document.getElementById("mNotes").value = m.notes;
    
    document.getElementById("formActionTitle").textContent = "✏️ የአባል ማኅደር ፋይል ማሻሻያ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 የተቀየረውን ፋይል አሻሽለህ መዝግብ";
    openFolder('newRegistrationFolder');
}

// 🧮 የዕድሜ ስሌት (የአሁኑን አመት 2026 መነሻ በማድረግ)
// 🔐 የአድሚን መግቢያ ማረጋገጫ
function checkLogin() {
    var user = document.getElementById("adminUsername").value;
    var pass = document.getElementById("adminPassword").value;
    
    if (user === "Meserete-Hywet" && pass === "2116") {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("mainDashboard").style.display = "block";
        fetchMembersFromFirebase(); // ገጹ ሲከፈት መረጃዎችን ከዳታቤዝ ያመጣል
    } else {
        alert("የተሳሳተ የአድሚን ስም ወይም የይለፍ ቃል አስገብተዋል!");
    }
}

// 🔒 ከመለያ መውጫ
function handleLogout() {
    document.getElementById("lockScreen").style.display = "block";
    document.getElementById("mainDashboard").style.display = "none";
    document.getElementById("adminUsername").value = "";
    document.getElementById("adminPassword").value = "";
}

// 🌐 የ Firebase ዳታቤዝ አድራሻ (የአንተ ትክክለኛ ሊንክ ተገጥሞለታል)
const FIREBASE_URL = "https://meserete-hyewt-default-rtdb.firebaseio.com/";

// 📂 የአባላት እና የፅዋ መረጃዎችን ለመያዝ
let members = [];
let tsiwaList = [];
let currentViewingIndex = -1;

// 📥 መረጃዎችን ከ Firebase ዳታቤዝ ማውረጃ ፈንክሽን
function fetchMembersFromFirebase() {
    fetch(`${FIREBASE_URL}/members.json`)
    .then(response => response.json())
    .then(data => {
        members = [];
        if (data) {
            // ከዳታቤዝ የመጣውን መረጃ ወደ Array መቀየሪያ
            Object.keys(data).forEach(key => {
                let member = data[key];
                member.firebaseKey = key; // ለእያንዳንዱ አባል መለያ ቁልፍ መስጠት
                members.push(member);
            });
        }
        renderMembers();
    })
    .catch(error => console.error("መረጃ ከዳታቤዝ ሲመጣ ስህተት ተፈጥሯል:", error));
}

// 📝 አዲስ አባል መመዝገቢያ እና ማሻሻያ ቅጽ (ወደ Firebase ይልካል)
function addMember() {
    let name = document.getElementById("mName").value.trim();
    let phone = document.getElementById("mPhone").value.trim();
    let christName = document.getElementById("mChrist").value.trim();
    let bDay = document.getElementById("birthDay").value;
    let bMonth = document.getElementById("birthMonth").value;
    let bYear = document.getElementById("birthYear").value;
    let age = document.getElementById("mAge").value;
    let gender = document.getElementById("mGender").value;
    let blood = document.getElementById("mBlood").value;
    let qurbanStatus = document.getElementById("mQurbanStatus").value;
    let qDay = document.getElementById("qDay").value;
    let qMonth = document.getElementById("qMonth").value;
    let qYear = document.getElementById("qYear").value;
    let job = document.getElementById("mJobStatus").value;
    let loc = document.getElementById("mLoc").value;
    let wereda = document.getElementById("mWereda").value;
    let houseNum = document.getElementById("mHouseNum").value;
    let sefer = document.getElementById("mSeferName").value;
    let godName = document.getElementById("mGodName").value;
    let godPhone = document.getElementById("mGodPhone").value;
    let notes = document.getElementById("mNotes").value;

    if(!name || !phone) {
        alert("እባክዎ ቢያንስ ሙሉ ስምና ስልክ ቁጥር ያስገቡ!");
        return;
    }

    let todayDate = new Date();
    let editIdx = parseInt(document.getElementById("editIndex").value);

    let memberData = {
        name, phone, christName, age, gender, blood, qurbanStatus,
        birthDate: `${bDay}/${bMonth}/${bYear}`,
        lastQurbanDate: `${qDay}/${qMonth}/${qYear}`,
        address: `${loc} ክፍለ ከተማ፣ ወረዳ ${wereda}፣ የቤት ቁጥር ${houseNum} (${sefer})`,
        godfather: `${godName} (ስልክ: ${godPhone})`,
        notes: notes || "የለም",
        qurbanTrack: { checked: qurbanStatus === "በቅዱስ ቁርባን ያለ", lastUpdated: "በምዝገባ ወቅት" }
    };

    if (editIdx === -1) {
        // 1️⃣ አዲስ ምዝገባ ከሆነ -> ቀጥታ ወደ Firebase መላክ (POST)
        memberData.registrationDate = todayDate.toISOString();
        
        fetch(`${FIREBASE_URL}/members.json`, {
            method: "POST",
            body: JSON.stringify(memberData)
        })
        .then(() => {
            alert("አባል በተሳካ ሁኔታ በዳታቤዝ ውስጥ ተመዝግቧል!");
            fetchMembersFromFirebase(); // ገጹን በዳታቤዝ ማደሻ
        });
    } else {
        // 2️⃣ ነባር መረጃ ማሻሻያ ከሆነ -> በ Firebase ላይ ማደስ (PUT)
        let firebaseKey = members[editIdx].firebaseKey;
        memberData.registrationDate = members[editIdx].registrationDate || todayDate.toISOString();
        
        fetch(`${FIREBASE_URL}/members/${firebaseKey}.json`, {
            method: "PUT",
            body: JSON.stringify(memberData)
        })
        .then(() => {
            alert("የአባል ማኅደር በዳታቤዝ ላይ በተሳካ ሁኔታ ተሻሽሏል!");
            document.getElementById("editIndex").value = "-1";
            fetchMembersFromFirebase();
        });
    }

    resetForm();
    goBack();
}

// 📋 የአባላትን ዝርዝር በሰንጠረዥ ማሳያ (ከቀለም እና የ3 ወር ማስጠንቀቂያ ጋር)
function renderMembers() {
    let tbody = document.getElementById("memberTableBody");
    tbody.innerHTML = "";
    
    if(members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:gray;">ምንም የተመዘገበ አባል የለም።</td></tr>`;
        return;
    }

    let today = new Date();

    members.forEach((m, index) => {
        let rowStyle = "";
        let warningBadge = "";

        if (m.qurbanStatus !== "በቅዱስ ቁርባን ያለ") {
            rowStyle = "background-color: #ffebee; color: #c62828; font-weight: 500; border-bottom: 1px solid #ffcdd2;";
        }

        if (m.registrationDate) {
            let regDate = new Date(m.registrationDate);
            let timeDiff = today.getTime() - regDate.getTime();
            let daysDiff = timeDiff / (1000 * 3600 * 24);

            if (daysDiff >= 90) {
                warningBadge = ` <span style="background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 6px; display: inline-block; border: 1px solid white;">⚠️ የ3 ወር ማስጠንቀቂያ!</span>`;
            }
        }

        tbody.innerHTML += `<tr style="${rowStyle}">
            <td>${index + 1}</td>
            <td><b>${m.name}</b> ${warningBadge}</td>
            <td>${m.phone}</td>
            <td>${m.qurbanStatus}</td>
            <td><button onclick="viewProfile(${index})" style="background:#1a2a3a; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">📂 ክፈት</button></td>
        </tr>`;
    });
}

// 🔍 አባላትን በስም ወይም በስልክ መፈለጊያ
function searchMember() {
    let query = document.getElementById("search").value.toLowerCase();
    let rows = document.getElementById("memberTableBody").getElementsByTagName("tr");
    for (let row of rows) {
        let nameCell = row.getElementsByTagName("td")[1];
        let phoneCell = row.getElementsByTagName("td")[2];
        if (nameCell && phoneCell) {
            let nameText = nameCell.textContent.toLowerCase();
            let phoneText = phoneCell.textContent.toLowerCase();
            if (nameText.includes(query) || phoneText.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }
}

// 📜 የአባል ማኅደር ፋይልን መክፈቻ
function viewProfile(index) {
    currentViewingIndex = index;
    let m = members[index];
    let content = `** የግል መረጃ **\nሙሉ ስም: ${m.name}\nየክርስትና ስም: ${m.christName}\nጾታ: ${m.gender} | ዕድሜ: ${m.age} | የደም ዓይነት: ${m.blood}\nትውልድ ዘመን: ${m.birthDate}\n\n** አድራሻ እና ሥራ **\nስልክ: ${m.phone}\nመኖሪያ: ${m.address}\n\n** መንፈሳዊ መረጃ **\nየንሥሐ አባት: ${m.godfather}\nየቁርባን ሁኔታ: ${m.qurbanStatus} (የመጨረሻ: ${m.lastQurbanDate})\n\n** ተጨማሪ ማስታወሻ **\n${m.notes}`;
    
    document.getElementById("profileContent").textContent = content;
    document.getElementById("modalQurbanCheck").checked = m.qurbanTrack.checked;
    document.getElementById("modalLastUpdatedText").textContent = `መጨረሻ የተሻሻለው፦ ${m.qurbanTrack.lastUpdated}`;
    
    document.getElementById("modalEditBtn").onclick = function() {
        closeProfile();
        editMember(index);
    };
    document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
    document.getElementById("profileModal").style.display = "none";
}

// ✏️ የአባል ፋይል ማሻሻያ (Edit)
function editMember(index) {
    let m = members[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("mName").value = m.name;
    document.getElementById("mPhone").value = m.phone;
    document.getElementById("mChrist").value = m.christName;
    document.getElementById("mAge").value = m.age;
    document.getElementById("mGender").value = m.gender;
    document.getElementById("mBlood").value = m.blood;
    document.getElementById("mQurbanStatus").value = m.qurbanStatus;
    document.getElementById("mNotes").value = m.notes;
    
    document.getElementById("formActionTitle").textContent = "✏️ የአባል ማኅደር ፋይል ማሻሻያ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 የተቀየረውን ፋይል አሻሽለህ መዝግብ";
    openFolder('newRegistrationFolder');
}

// 🧮 የዕድሜ ስሌት (የአሁኑን አመት 2026 መነሻ በማድረግ)
function calculateAge() {
    let yearInput = document.getElementById("birthYear").value;
    if(yearInput) {
        // 🇪🇹 የፈረንጆቹን ዓመት (Gregorian Year) ወደ ኢትዮጵያ ዓመተ ምህረት በራስ-ሰር መቀየሪያ ስሌት
        let gregorianYear = new Date().getFullYear(); 
        let currentEthiopianYear = gregorianYear - 8; // ለምሳሌ፡ 2026 - 8 = 2018 ዓ.ም ይሆናል
        
        let age = currentEthiopianYear - parseInt(yearInput);
        
        if(age >= 0) {
            document.getElementById("mAge").value = age;
        } else {
            document.getElementById("mAge").value = "";
        }
    }
}

function resetForm() {
    document.getElementById("editIndex").value = "-1";
    document.getElementById("mName").value = "";
    document.getElementById("mPhone").value = "";
    document.getElementById("mChrist").value = "";
    document.getElementById("mNotes").value = "";
    document.getElementById("formActionTitle").textContent = "📝 የማህበርተኛ መታወቂያ ማውጫ ሙሉ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 ሙሉ ፋይሉን በፎልደር ውስጥ መዝግብ";
}


function resetForm() {
    document.getElementById("editIndex").value = "-1";
    document.getElementById("mName").value = "";
    document.getElementById("mPhone").value = "";
    document.getElementById("mChrist").value = "";
    document.getElementById("mNotes").value = "";
    document.getElementById("formActionTitle").textContent = "📝 የማህበርተኛ መታወቂያ ማውጫ ሙሉ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 ሙሉ ፋይሉን በፎልደር ውስጥ መዝግብ";
}
window.addEventListener('DOMContentLoaded', () => {
    let bdSel = document.getElementById('birthDay');
    let bmSel = document.getElementById('birthMonth');
    let bySel = document.getElementById('birthYear');
    let qd = document.getElementById('qDay');
    let qm = document.getElementById('qMonth');
    let qy = document.getElementById('qYear');
    let months = ["መስከረም", "ጥቅምት", "ሕዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"];

    for(let i=1; i<=30; i++) { bdSel.innerHTML += `<option value="${i}">${i}</option>`; qd.innerHTML += `<option value="${i}">${i}</option>`; }
    months.forEach(m => { bmSel.innerHTML += `<option value="${m}">${m}</option>`; qm.innerHTML += `<option value="${m}">${m}</option>`; });
    
    // 🔄 አውቶማቲክ የአሁኑን የኢትዮጵያ ዓመት መነሻ በማድረግ ምርጫዎችን መሙላት
    let currentEthYear = new Date().getFullYear() - 8; 
    
    // የትውልድ ዓመት ምርጫ ከ1950 ጀምሮ እስከ አሁኑ የኢትዮጵያ ዓመት (2018) ድረስ ብቻ ያሳያል
    for(let y=1950; y<=currentEthYear; y++) { bySel.innerHTML += `<option value="${y}">${y}</option>`; }
    // የቁርባን ዓመት ምርጫ ከ2010 ጀምሮ እስከ አሁኑ የኢትዮጵያ ዓመት (2018) ድረስ ያሳያል
    for(let y=2010; y<=currentEthYear; y++) { qy.innerHTML += `<option value="${y}">${y}</option>`; }
    
    bySel.value = "1995";
    calculateAge();
});
