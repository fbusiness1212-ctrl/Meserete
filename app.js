// 🔐 የአድሚን መግቢያ ማረጋገጫ
function checkLogin() {
    var user = document.getElementById("adminUsername").value;
    var pass = document.getElementById("adminPassword").value;
    
    if (user === "Meserete-Hywet" && pass === "2116") {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("mainDashboard").style.display = "block";
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

// 📂 የአባላት እና የፅዋ መረጃዎችን ለመያዝ
let members = [];
let tsiwaList = [];
let currentViewingIndex = -1;

// 📝 አዲስ አባል መመዝገቢያ እና ማሻሻያ ቅጽ
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

    // 🕒 አባል የተመዘገበበትን ትክክለኛ የኢትዮጵያ/የዛሬ ቀን መያዣ (ለ3 ወር ማስጠንቀቂያ ክትትል)
    let todayDate = new Date();

    let memberData = {
        name, phone, christName, age, gender, blood, qurbanStatus,
        birthDate: `${bDay}/${bMonth}/${bYear}`,
        lastQurbanDate: `${qDay}/${qMonth}/${qYear}`,
        address: `${loc} ክፍለ ከተማ፣ ወረዳ ${wereda}፣ የቤት ቁጥር ${houseNum} (${sefer})`,
        godfather: `${godName} (ስልክ: ${godPhone})`,
        notes: notes || "የለም",
        registrationDate: todayDate.toISOString(), // የገባበት ቀን በቋሚነት ይመዘገባል
        qurbanTrack: { checked: qurbanStatus === "በቅዱስ ቁርባን ያለ", lastUpdated: "በምዝገባ ወቅት" }
    };

    let editIdx = parseInt(document.getElementById("editIndex").value);
    if (editIdx === -1) {
        members.push(memberData);
        alert("አባል በተሳካ ሁኔታ በፎልደር ውስጥ ተመዝግቧል!");
    } else {
        // መረጃው ሲሻሻል የድሮውን መመዝገቢያ ቀን እንዳያጠፋው ማረጋገጫ
        memberData.registrationDate = members[editIdx].registrationDate || todayDate.toISOString();
        members[editIdx] = memberData;
        alert("የአባል ማኅደር ፋይል በተሳካ ሁኔታ ተሻሽሏል!");
        document.getElementById("editIndex").value = "-1";
    }

    resetForm();
    goBack();
    renderMembers();
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
        let rowClass = "";
        let rowStyle = "";
        let warningBadge = "";

        // 1️⃣ ቅዱስ ቁርባን የተቀበለ ካልሆነ (በቅዱስ ቁርባን የሌለ ከሆነ) ሙሉ መስመሩን ቀይ ማድረጊያ
        if (m.qurbanStatus !== "በቅዱስ ቁርባን ያለ") {
            rowStyle = "background-color: #ffebee; color: #c62828; font-weight: 500; border-bottom: 1px solid #ffcdd2;";
        }

        // 2️⃣ ከተመዘገበ 3 ወር (90 ቀን) ያለፈው መሆኑን ማረጋገጫ እና ማስጠንቀቂያ ማውጫ
        if (m.registrationDate) {
            let regDate = new Date(m.registrationDate);
            let timeDiff = today.getTime() - regDate.getTime();
            let daysDiff = timeDiff / (1000 * 3600 * 24); // ወደ ቀናት መቀየሪያ

            if (daysDiff >= 90) {
                warningBadge = ` <span style="background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 6px; display: inline-block; border: 1px solid white;">⚠️ የ3 ወር ማስጠንቀቂያ!</span>`;
            }
        }

        tbody.innerHTML += `<tr style="${rowStyle}" class="${rowClass}">
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

// 📜 የአባል ማኅደር ፋይልን በፖፕ-አፕ (Modal) መክፈቻ
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

// 🗓️ የወርሃዊ ቁርባን ክትትል ማስተካከያ
function toggleMonthlyQurban() {
    if(currentViewingIndex !== -1) {
        let checked = document.getElementById("modalQurbanCheck").checked;
        members[currentViewingIndex].qurbanTrack.checked = checked;
        members[currentViewingIndex].qurbanTrack.lastUpdated = checked ? "የዚህ ወር ተፈጽሟል" : "ተደናቅፏል / አልቆረበም";
        document.getElementById("modalLastUpdatedText").textContent = `መጨረሻ የተሻሻለው፦ ${members[currentViewingIndex].qurbanTrack.lastUpdated}`;
        renderMembers();
    }
}

// ✏️ የአባል ፋይል ማሻሻያ (Edit) ወደ ፎርም መጫኛ
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

// 🏆 ፅዋ መዝገብ (ሴንተሬዝ) ስራዎች
function addTsiwa() {
    let tName = document.getElementById("tName").value.trim();
    let tMember = document.getElementById("tMember").value.trim();
    let d = document.getElementById("ethDay").value;
    let m = document.getElementById("ethMonth").value;
    let y = document.getElementById("ethYear").value;

    if(!tName || !tMember) {
        alert("እባክዎ የፅዋ ስምና የባለዕጣውን አባል ስም ያስገቡ!");
        return;
    }

    tsiwaList.push({ name: tName, member: tMember, date: `${m} ${d} ቀን ${y} ዓ.ም` });
    alert("የፅዋ ዕጣ በተሳካ ሁኔታ ተመዝግቧል!");
    
    document.getElementById("tName").value = "";
    document.getElementById("tMember").value = "";
    renderTsiwa();
}

function renderTsiwa() {
    let tbody = document.getElementById("tsiwaTableBody");
    tbody.innerHTML = "";
    if(tsiwaList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:gray;">ምንም የፅዋ ዕጣ አልተመዘገበም።</td></tr>`;
        return;
    }
    tsiwaList.forEach((t, index) => {
        tbody.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td><b>${t.name}</b></td>
            <td>${t.member}</td>
            <td>${t.date}</td>
            <td style="text-align:center;"><button onclick="tsiwaList.splice(${index},1); renderTsiwa();" style="background:#c62828; color:white; border:none; padding:3px 7px; border-radius:3px; cursor:pointer; font-size:11px;">🔄 ዕጣ ቀይር</button></td>
        </tr>`;
    });
}

// 🧮 የዕድሜ ስሌት (የአሁኑን አመት 2026 መነሻ በማድረግ)
function calculateAge() {
    let year = document.getElementById("birthYear").value;
    if(year) {
        document.getElementById("mAge").value = 2026 - parseInt(year);
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

// ሲስተሙ መጀመሪያ ሲከፈት ሰንጠረዦቹን ባዶ አድርጎ ያዘጋጃል
window.addEventListener('load', () => {
    renderMembers();
    renderTsiwa();
});
