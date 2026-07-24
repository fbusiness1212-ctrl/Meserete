// 🌐 የ Firebase ዳታቤዝ አድራሻ 
const FIREBASE_URL = "https://meserete-hyewt-default-rtdb.firebaseio.com";

// 📂 ዳታዎችን ለመያዝ
let members = [];
let tsiwaList = [];
let currentViewingIndex = -1;

// 🔐 የአድሚን መግቢያ ማረጋገጫ
function checkLogin() {
    var user = document.getElementById("adminUsername").value;
    var pass = document.getElementById("adminPassword").value;
    
    if (user === "Meserete-Hywet" && pass === "2116") {
        document.getElementById("lockScreen").style.display = "none";
        document.getElementById("mainDashboard").style.display = "block";
        fetchMembersFromFirebase(); 
        fetchTsiwaFromFirebase();   
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

// 📥 መረጃዎችን ከ Firebase ዳታቤዝ ማውረጃ
function fetchMembersFromFirebase() {
    fetch(`${FIREBASE_URL}/members.json`)
    .then(response => response.json())
    .then(data => {
        members = [];
        if (data) {
            Object.keys(data).forEach(key => {
                let member = data[key];
                member.firebaseKey = key; 
                members.push(member);
            });
        }
        renderMembers();
    })
    .catch(error => console.error("መረጃ ከዳታቤዝ ሲመጣ ስህተት ተፈጥሯል:", error));
}

// 📝 አዲስ አባል መመዝገቢያ እና ማሻሻያ ቅጽ (ሙሉ 6 ክፍሎች)
function addMember() {
    let name = document.getElementById("mName").value.trim();
    let phone = document.getElementById("mPhone").value.trim();
    let christName = document.getElementById("mChrist").value.trim();
    let bDay = document.getElementById("birthDay").value;
    let bMonth = document.getElementById("birthMonth").value;
    let bYear = document.getElementById("birthYear").value;
    let age = document.getElementById("mAge").value;
    let gender = document.getElementById("mGender").value;
    let nationality = document.getElementById("mNationality").value;
    let blood = document.getElementById("mBlood").value;
    let qurbanStatus = document.getElementById("mQurbanStatus").value;
    let qDay = document.getElementById("qDay").value;
    let qMonth = document.getElementById("qMonth").value;
    let qYear = document.getElementById("qYear").value;
    
    // ክፍል ፪
    let job = document.getElementById("mJobStatus").value;
    let loc = document.getElementById("mLoc").value;
    let wereda = document.getElementById("mWereda").value;
    let houseNum = document.getElementById("mHouseNum").value;
    let sefer = document.getElementById("mSeferName").value;
    let mapLoc = document.getElementById("mMapLoc").value;

    // ክፍል ፫
    let godName = document.getElementById("mGodName").value;
    let godPhone = document.getElementById("mGodPhone").value;
    let edu = document.getElementById("mEdu").value;
    let churchService = document.getElementById("mChurchService").value;

    // ክፍል ፬
    let famName = document.getElementById("mFamName").value;
    let famChrist = document.getElementById("mFamChrist").value;
    let famPhone = document.getElementById("mFamPhone").value;
    let relation = document.getElementById("mRelation").value;

    let notes = document.getElementById("mNotes").value;
    
    // ክፍል ፭
    let fatherName = document.getElementById("mFatherName").value.trim();
    let fatherChrist = document.getElementById("mFatherChrist").value.trim();
    let fatherPhone = document.getElementById("mFatherPhone").value.trim();
    let fatherJob = document.getElementById("mFatherJobStatus").value;
    
    let motherName = document.getElementById("mMotherName").value.trim();
    let motherChrist = document.getElementById("mMotherChrist").value.trim();
    let motherPhone = document.getElementById("mMotherPhone").value.trim();
    let motherJob = document.getElementById("mMotherJobStatus").value;

    if(!name || !phone) {
        alert("እባክዎ ቢያንስ ሙሉ ስምና ስልክ ቁጥር ያስገቡ!");
        return;
    }

    let todayDate = new Date();
    let editIdx = parseInt(document.getElementById("editIndex").value);

    let memberData = {
        name, phone, christName, age, gender, nationality, blood, qurbanStatus,
        birthDay: bDay, birthMonth: bMonth, birthYear: bYear,
        qDay: qDay, qMonth: qMonth, qYear: qYear,
        job, loc, wereda, houseNum, sefer, mapLoc,
        godName, godPhone, edu, churchService,
        famName, famChrist, famPhone, relation,
        notes: notes || "የለም",
        familyDetails: {
            fatherName: fatherName || "የተመዘገበ የለም",
            fatherChrist: fatherChrist || "የተመዘገበ የለም",
            fatherPhone: fatherPhone || "የተመዘገበ የለም",
            fatherJob: fatherJob || "",
            motherName: motherName || "የተመዘገበ የለም",
            motherChrist: motherChrist || "የተመዘገበ የለም",
            motherPhone: motherPhone || "የተመዘገበ የለም",
            motherJob: motherJob || ""
        },
        qurbanTrack: { 
            checked: qurbanStatus === "በቅዱስ ቁርባን ያለ", 
            lastUpdated: editIdx === -1 ? "በምዝገባ ወቅት" : (members[editIdx].qurbanTrack ? members[editIdx].qurbanTrack.lastUpdated : "በምዝገባ ወቅት")
        }
    };

    if (editIdx === -1) {
        memberData.registrationDate = todayDate.toISOString();
        
        fetch(`${FIREBASE_URL}/members.json`, {
            method: "POST",
            body: JSON.stringify(memberData)
        })
        .then(() => {
            alert("አባል በተሳካ ሁኔታ በዳታቤዝ ውስጥ ተመዝግቧል!");
            fetchMembersFromFirebase();
            resetForm();
            goBack();
        });
    } else {
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
            resetForm();
            goBack();
        });
    }
}

// 📋 የአባላትን ዝርዝር በሰንጠረዥ ማሳያ
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
        let isDelayed = false;

        if (m.qurbanStatus !== "በቅዱስ ቁርባን ያለ") {
            rowStyle = "background-color: #ffebee; color: #c62828; font-weight: 500; border-bottom: 1px solid #ffcdd2;";
            isDelayed = true;
        }

        if (m.registrationDate) {
            let regDate = new Date(m.registrationDate);
            let timeDiff = today.getTime() - regDate.getTime();
            let daysDiff = timeDiff / (1000 * 3600 * 24);

            if (daysDiff >= 90 && isDelayed) {
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

// 📜 የአባል ማኅደር ፋይልን መክፈቻ (ሙሉ መረጃን አንድ ላይ የሚያሳይ)
function viewProfile(index) {
    currentViewingIndex = index;
    let m = members[index];
    
    let fam = m.familyDetails || { fatherName: "የለም", fatherChrist: "የለም", fatherPhone: "የለም", fatherJob: "የለም", motherName: "የለም", motherChrist: "የለም", motherPhone: "የለም", motherJob: "የለም" };

    let content = `** ክፍል ፩፡ የግል ማኅደራዊ መረጃ **
ሙሉ ስም: ${m.name}
የክርስትና ስም: ${m.christName}
ጾታ: ${m.gender} | ዕድሜ: ${m.age} | ዜግነት: ${m.nationality || "ኢትዮጵያዊ"} | የደም ዓይነት: ${m.blood}
ትውልድ ዘመን: ${m.birthDay || ""}/${m.birthMonth || ""}/${m.birthYear || ""}

** ክፍል ፪፡ የሥራና የመኖሪያ አድራሻ መረጃ **
ስልክ ቁጥር: ${m.phone}
የሥራ ሁኔታ: ${m.job || "የለም"}
ክፍለ ከተማ: ${m.loc || "የለም"} | ወረዳ: ${m.wereda || "የለም"} | የቤት ቁጥር: ${m.houseNum || "የለም"}
የሰፈር ልዩ ስም / ዞን: ${m.sefer || "የለም"}
ቋሚ መኖሪያ (Location): ${m.mapLoc || "የለም"}

** ክፍል ፫፡ የሃይማኖት አባት እና ትምህርት **
የክርስትና አባት ስም: ${m.godName || "የለም"}
የአባት ስልክ ቁጥር: ${m.godPhone || "የለም"}
የትምህርት ደረጃ: ${m.edu || "የለም"}
የሚያገለግሉበት ደብር: ${m.churchService || "የለም"}

** ክፍል ፬፡ የድንገተኛ አደጋ ተጠሪ መረጃ **
የተጠሪ ሙሉ ስም: ${m.famName || "የለም"}
የተጠሪ ክርስትና ስም: ${m.famChrist || "የለም"}
የተጠሪ ስልክ ቁጥር: ${m.famPhone || "የለም"}
ከአባሉ ጋር ያለው ዝምድና: ${m.relation || "የለም"}

** ክፍል ፭፡ የቤተሰብ ሁኔታ መረጃ **
[ የባንዲራ አባት መረጃ ]
የአባት ሙሉ ስም: ${fam.fatherName} | ክርስትና ስም: ${fam.fatherChrist}
የአባት ስልክ ቁጥር: ${fam.fatherPhone} | የሥራ ሁኔታ: ${fam.fatherJob || "የለም"}

[ የእናት መረጃ ]
የእናት ሙሉ ስም: ${fam.motherName} | ክርስትና ስም: ${fam.motherChrist}
የእናት ስልክ ቁጥር: ${fam.motherPhone} | የሥራ ሁኔታ: ${fam.motherJob || "የለም"}

** ክፍል ፮፡ ምርመራ (ተጨማሪ ማስታወሻ) **
የቁርባን ሁኔታ: ${m.qurbanStatus} (የመጨረሻ የቆረበበት: ${m.qDay || ""}/${m.qMonth || ""}/${m.qYear || ""})
ማስታወሻ: ${m.notes}`;
    
    document.getElementById("profileContent").textContent = content;
    document.getElementById("modalQurbanCheck").checked = m.qurbanTrack ? m.qurbanTrack.checked : false;
    document.getElementById("modalLastUpdatedText").textContent = `መጨረሻ የተሻሻለው፦ ${m.qurbanTrack ? m.qurbanTrack.lastUpdated : "የለም"}`;
    
    document.getElementById("modalEditBtn").onclick = function() {
        closeProfile();
        editMember(index);
    };

    document.getElementById("modalDeleteBtn").onclick = function() {
        deleteMember(index);
    };

    document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
    document.getElementById("profileModal").style.display = "none";
}

// ✏️ የአባል ፋይል ማሻሻያ (Edit) - ሁሉንም መረጃዎች ወደ ፎርሙ ይመልሳል
function editMember(index) {
    let m = members[index];
    document.getElementById("editIndex").value = index;
    
    // ክፍል ፩
    document.getElementById("mName").value = m.name || "";
    document.getElementById("mPhone").value = m.phone || "";
    document.getElementById("mChrist").value = m.christName || "";
    document.getElementById("mAge").value = m.age || "";
    document.getElementById("mGender").value = m.gender || "";
    document.getElementById("mNationality").value = m.nationality || "ኢትዮጵያዊ";
    document.getElementById("mBlood").value = m.blood || "ያልታወቀ";
    document.getElementById("mQurbanStatus").value = m.qurbanStatus || "በቅዱስ ቁርባን ያለ";
    
    document.getElementById("birthDay").value = m.birthDay || "1";
    document.getElementById("birthMonth").value = m.birthMonth || "መስከረም";
    document.getElementById("birthYear").value = m.birthYear || "2000";
    
    document.getElementById("qDay").value = m.qDay || "ቀን";
    document.getElementById("qMonth").value = m.qMonth || "ወር";
    document.getElementById("qYear").value = m.qYear || "ዓመት";

    // ክፍል ፪
    document.getElementById("mJobStatus").value = m.job || "";
    document.getElementById("mLoc").value = m.loc || "";
    document.getElementById("mWereda").value = m.wereda || "";
    document.getElementById("mHouseNum").value = m.houseNum || "";
    document.getElementById("mSeferName").value = m.sefer || "";
    document.getElementById("mMapLoc").value = m.mapLoc || "";

    // ክፍል ፫
    document.getElementById("mGodName").value = m.godName || "";
    document.getElementById("mGodPhone").value = m.godPhone || "";
    document.getElementById("mEdu").value = m.edu || "";
    document.getElementById("mChurchService").value = m.churchService || "";

    // ክፍል ፬
    document.getElementById("mFamName").value = m.famName || "";
    document.getElementById("mFamChrist").value = m.famChrist || "";
    document.getElementById("mFamPhone").value = m.famPhone || "";
    document.getElementById("mRelation").value = m.relation || "";

    // ክፍል ፭
    let fam = m.familyDetails || {};
    document.getElementById("mFatherName").value = fam.fatherName && fam.fatherName !== "የተመዘገበ የለም" ? fam.fatherName : "";
    document.getElementById("mFatherChrist").value = fam.fatherChrist && fam.fatherChrist !== "የተመዘገበ የለም" ? fam.fatherChrist : "";
    document.getElementById("mFatherPhone").value = fam.fatherPhone && fam.fatherPhone !== "የተመዘገበ የለም" ? fam.fatherPhone : "";
    document.getElementById("mFatherJobStatus").value = fam.fatherJob || "";
    
    document.getElementById("mMotherName").value = fam.motherName && fam.motherName !== "የተመዘገበ የለም" ? fam.motherName : "";
    document.getElementById("mMotherChrist").value = fam.motherChrist && fam.motherChrist !== "የተመዘገበ የለም" ? fam.motherChrist : "";
    document.getElementById("mMotherPhone").value = fam.motherPhone && fam.motherPhone !== "የተመዘገbe የለም" ? fam.motherPhone : "";
    document.getElementById("mMotherJobStatus").value = fam.motherJob || "";

    // ክፍል ፮
    document.getElementById("mNotes").value = m.notes && m.notes !== "የለም" ? m.notes : "";
    
    document.getElementById("formActionTitle").textContent = "✏️ የአባል ማኅደር ፋይል ማሻሻያ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 የተቀየረውን ፋይል አሻሽለህ መዝግብ";
    openFolder('newRegistrationFolder');
}

// 🗑️ የአባል ፋይል መሰረዣ
function deleteMember(index) {
    let m = members[index];
    if (confirm(`የአባሉን "${m.name}" ሙሉ የቪዲዮ/ማኅደር ፋይል ከዳታቤዝ ላይ ሙሉ በሙሉ መሰረዝ ይፈልጋሉ?`)) {
        fetch(`${FIREBASE_URL}/members/${m.firebaseKey}.json`, {
            method: "DELETE"
        })
        .then(() => {
            alert("የአባሉ ፋይል በተሳካ ሁኔታ ተሰርዟል!");
            closeProfile();
            fetchMembersFromFirebase();
        })
        .catch(error => alert("ፋይል ሲሰረዝ ስህተት አጋጥሟል፦ " + error));
    }
}

// 🗓️ የወርሃዊ ቁርባን ክትትል ማሻሻያ
function toggleMonthlyQurban() {
    if (currentViewingIndex === -1) return;
    let m = members[currentViewingIndex];
    let isChecked = document.getElementById("modalQurbanCheck").checked;
    let todayStr = new Date().toLocaleDateString('am-ET') + " እረፍት";

    m.qurbanStatus = isChecked ? "በቅዱስ ቁርባን ያለ" : "ከቆረበ ቆይቷል";
    m.qurbanTrack = { checked: isChecked, lastUpdated: todayStr };

    fetch(`${FIREBASE_URL}/members/${m.firebaseKey}.json`, {
        method: "PUT",
        body: JSON.stringify(m)
    })
    .then(() => {
        document.getElementById("modalLastUpdatedText").textContent = `መጨረሻ የተሻሻለው፦ ${todayStr}`;
        fetchMembersFromFirebase();
    });
}

// 🧮 የዕድሜ ስሌት (በኢትዮጵያ አቆጣጠር 2018 ዓ.ም መነሻ በማድረግ የተስተካከለ)
function calculateAge() {
    let yearInput = document.getElementById("birthYear").value;
    if(yearInput) {
        // የአሁኑ የኢትዮጵያ ዓመተ ምሕረት 2018 ነው
        let currentEthYear = 2018; 
        let age = currentEthYear - parseInt(yearInput); 
        
        if(age >= 0) {
            document.getElementById("mAge").value = age;
        } else {
            document.getElementById("mAge").value = "";
        }
    }
}

// ☕ የፅዋ ዕጣ መረጃዎችን ከዳታቤዝ ማውረጃ
function fetchTsiwaFromFirebase() {
    fetch(`${FIREBASE_URL}/tsiwa.json`)
    .then(response => response.json())
    .then(data => {
        tsiwaList = [];
        if (data) {
            Object.keys(data).forEach(key => {
                let tsiwa = data[key];
                tsiwa.firebaseKey = key;
                tsiwaList.push(tsiwa);
            });
        }
        renderTsiwa();
    });
}

// 📝 አዲስ የፅዋ ዕጣ ለመመዝገብ እና ለማሻሻያ
function addTsiwa() {
    let tName = document.getElementById("tName").value.trim();
    let tMember = document.getElementById("tMember").value.trim();
    let day = document.getElementById("ethDay").value;
    let month = document.getElementById("ethMonth").value;
    let year = document.getElementById("ethYear").value;
    let editKey = document.getElementById("tsiwaEditKey").value; // የማሻሻያ መለያ

    if (!tName || !tMember) {
        alert("እባክዎ የፅዋውን ስም እና የአባሉን ስም ያስገቡ!");
        return;
    }

    let tsiwaData = {
        tsiwaName: tName,
        memberName: tMember,
        date: `${day}/${month}/${year}`
    };

    if (editKey === "") {
        // ➕ አዲስ መመዝገቢያ ከሆነ (የነበረው ኦሪጅናል POST)
        fetch(`${FIREBASE_URL}/tsiwa.json`, {
            method: "POST",
            body: JSON.stringify(tsiwaData)
        })
        .then(() => {
            alert("የፅዋ ዕጣ በተሳካ ሁኔታ ተመዝግቧል!");
            clearTsiwaForm();
            fetchTsiwaFromFirebase();
        })
        .catch(error => alert("የፅዋ መረጃ ሲመዘገብ ስህተት ተፈጥሯል፦ " + error));
    } else {
        // ✏️ የነበረን ለማሻሻል ከሆነ (አዲሱ PUT)
        fetch(`${FIREBASE_URL}/tsiwa/${editKey}.json`, {
            method: "PUT",
            body: JSON.stringify(tsiwaData)
        })
        .then(() => {
            alert("የፅዋ ዕጣ መረጃ በተሳካ ሁኔታ ተሻሽሏል!");
            clearTsiwaForm();
            fetchTsiwaFromFirebase();
        })
        .catch(error => alert("የፅዋ መረጃ ሲታደስ ስህተት ተፈጥሯል፦ " + error));
    }
}

// 📋 የፅዋ ዕጣዎችን ዝርዝር ማሳያ
function renderTsiwa() {
    let tbody = document.getElementById("tsiwaTableBody");
    tbody.innerHTML = "";

    if (tsiwaList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:gray;">ምንም የተመዘገበ የፅዋ ዕጣ የለም።</td></tr>`;
        return;
    }

    tsiwaList.forEach((t, index) => {
        tbody.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td><b>${t.tsiwaName}</b></td>
            <td>${t.memberName}</td>
            <td>${t.date}</td>
            <td style="text-align:center; display: flex; gap: 5px; justify-content: center;">
                <button onclick="editTsiwa(${index})" style="background:#ffa000; color:white; border:none; padding:3px 8px; border-radius:3px; cursor:pointer;">አስተካክል</button>
                <button onclick="deleteTsiwa('${t.firebaseKey}')" style="background:#c62828; color:white; border:none; padding:3px 8px; border-radius:3px; cursor:pointer;">ሰርዝ</button>
            </td>
        </tr>`;
    });
}

// ✏️ የፅዋ መረጃን ወደ ፎርሙ መልሶ ማሻሻያ ላይ ማድረጊያ
function editTsiwa(index) {
    let t = tsiwaList[index];
    document.getElementById("tsiwaEditKey").value = t.firebaseKey;
    document.getElementById("tName").value = t.tsiwaName;
    document.getElementById("tMember").value = t.memberName;

    // ቀኑን ከፋፍሎ ወደ select ፎርም መመለስ
    if (t.date && t.date.includes("/")) {
        let parts = t.date.split("/");
        if (parts.length === 3) {
            document.getElementById("ethDay").value = parts[0];
            document.getElementById("ethMonth").value = parts[1];
            document.getElementById("ethYear").value = parts[2];
        }
    }

    document.getElementById("tsiwaFormTitle").textContent = "✏️ የፅዋ ዕጣ ማሻሻያ ቅጽ";
    document.getElementById("tsiwaSubmitBtn").textContent = "💾 የተቀየረውን ፅዋ አሻሽል";
    document.getElementById("tsiwaSubmitBtn").style.background = "#ffa000";
}
// 🗑️ የፅዋ ዕጣ መረጃን ከ Firebase ላይ መሰረዣ Function
function deleteTsiwa(firebaseKey) {
    if (confirm("ይህንን የፅዋ ዕጣ መረጃ ሙሉ በሙሉ ከዳታቤዝ ላይ መሰረዝ ይፈልጋሉ?")) {
        fetch(`${FIREBASE_URL}/tsiwa/${firebaseKey}.json`, {
            method: "DELETE"
        })
        .then(() => {
            alert("የፅዋ ዕጣ መረጃው በተሳካ ሁኔታ ተሰርዟል!");
            fetchTsiwaFromFirebase();
        })
        .catch(error => {
            alert("መረጃውን ሲሰረዝ ስህተት አጋጥሟል፦ " + error);
        });
    }
}
// 🧹 የፅዋ ቅጽን ማጽጃ 
function clearTsiwaForm() {
    document.getElementById("tsiwaEditKey").value = "";
    document.getElementById("tName").value = "";
    document.getElementById("tMember").value = "";
    document.getElementById("tsiwaFormTitle").textContent = "[+] አዲስ የፅዋ ዕጣ መዝግብ";
    document.getElementById("tsiwaSubmitBtn").textContent = "ፅዋ መዝግብ";
    document.getElementById("tsiwaSubmitBtn").style.background = "#1a2a3a";
    
    // ቀናትን ወደ መጀመሪያው መመለሻ
    document.getElementById("ethDay").value = "1";
    document.getElementById("ethMonth").value = "መስከረም";
    document.getElementById("ethYear").value = "2018";
}

// 🔄 ፎርሙን ባዶ ማድረጊያ
function resetForm() {
    document.getElementById("editIndex").value = "-1";
    document.getElementById("mName").value = "";
    document.getElementById("mPhone").value = "";
    document.getElementById("mChrist").value = "";
    document.getElementById("mAge").value = "";
    if(document.getElementById("mGender")) document.getElementById("mGender").value = "";
    if(document.getElementById("mNationality")) document.getElementById("mNationality").value = "ኢትዮጵያዊ";
    if(document.getElementById("mBlood")) document.getElementById("mBlood").value = "ያልታወቀ";
    if(document.getElementById("mQurbanStatus")) document.getElementById("mQurbanStatus").value = "በቅዱስ ቁርባን ያለ";
    
    if(document.getElementById("mJobStatus")) document.getElementById("mJobStatus").value = "";
    document.getElementById("mLoc").value = "";
    document.getElementById("mWereda").value = "";
    document.getElementById("mHouseNum").value = "";
    document.getElementById("mSeferName").value = "";
    document.getElementById("mMapLoc").value = "";
    
    document.getElementById("mGodName").value = "";
    document.getElementById("mGodPhone").value = "";
    document.getElementById("mEdu").value = "";
    document.getElementById("mChurchService").value = "";
    
    document.getElementById("mFamName").value = "";
    document.getElementById("mFamChrist").value = "";
    document.getElementById("mFamPhone").value = "";
    document.getElementById("mRelation").value = "";

    document.getElementById("mFatherName").value = "";
    document.getElementById("mFatherChrist").value = "";
    document.getElementById("mFatherPhone").value = "";
    if(document.getElementById("mFatherJobStatus")) document.getElementById("mFatherJobStatus").value = "";
    document.getElementById("mMotherName").value = "";
    document.getElementById("mMotherChrist").value = "";
    document.getElementById("mMotherPhone").value = "";
    if(document.getElementById("mMotherJobStatus")) document.getElementById("mMotherJobStatus").value = "";
    
    document.getElementById("mNotes").value = "";
    document.getElementById("formActionTitle").textContent = "📝 የማህበርተኛ መታወቂያ ማውጫ ሙሉ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 ሙሉ ፋይሉን በፎልደር ውስጥ መዝግብ";
}

// 🗓️ DOM ሲጭን ቀናትን፣ ወራትንና አመታትን መሙያ
window.addEventListener('DOMContentLoaded', () => {
    let dSel = document.getElementById('ethDay');
    let mSel = document.getElementById('ethMonth');
    let ySel = document.getElementById('ethYear');

    let bdSel = document.getElementById('birthDay');
    let bmSel = document.getElementById('birthMonth');
    let bySel = document.getElementById('birthYear');

    let qDaySel = document.getElementById('qDay');
    let qMonthSel = document.getElementById('qMonth');
    let qYearSel = document.getElementById('qYear');

    let months = ["መስከረም", "ጥቅምት", "ሕዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"];

    for(let i=1; i<=30; i++) {
        if(dSel) dSel.innerHTML += `<option value="${i}">${i}</option>`;
        if(bdSel) bdSel.innerHTML += `<option value="${i}">${i}</option>`;
        if(qDaySel) qDaySel.innerHTML += `<option value="${i}">${i}</option>`;
    }

    months.forEach(m => {
        if(mSel) mSel.innerHTML += `<option value="${m}">${m}</option>`;
        if(bmSel) bmSel.innerHTML += `<option value="${m}">${m}</option>`;
        if(qMonthSel) qMonthSel.innerHTML += `<option value="${m}">${m}</option>`;
    });

    let currentEthYear = 2018; 

    if(bySel) {
        bySel.innerHTML = "";
        for(let y=1950; y<=currentEthYear; y++) {
            bySel.innerHTML += `<option value="${y}">${y}</option>`;
        }
        bySel.value = "2000"; 
    }

    if(ySel) {
        ySel.innerHTML = "";
        for(let y=2000; y<=(currentEthYear + 10); y++) {
            ySel.innerHTML += `<option value="${y}">${y}</option>`;
        }
        ySel.value = currentEthYear.toString();
    }

    if(qYearSel) {
        qYearSel.innerHTML = "";
        for(let y=2010; y<=currentEthYear; y++) {
            qYearSel.innerHTML += `<option value="${y}">${y}</option>`;
        }
        qYearSel.value = currentEthYear.toString();
    }
    
    calculateAge(); 
});
