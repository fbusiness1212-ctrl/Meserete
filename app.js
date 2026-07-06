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

// 🌐 የ Firebase ዳታቤዝ አድራሻ 
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
    let nationality = document.getElementById("mNationality").value;
    let blood = document.getElementById("mBlood").value;
    let qurbanStatus = document.getElementById("mQurbanStatus").value;
    let qDay = document.getElementById("qDay").value;
    let qMonth = document.getElementById("qMonth").value;
    let qYear = document.getElementById("qYear").value;
    
    // ክፍል ፪፡ አድራሻ እና ሥራ
    let job = document.getElementById("mJobStatus").value;
    let loc = document.getElementById("mLoc").value;
    let wereda = document.getElementById("mWereda").value;
    let houseNum = document.getElementById("mHouseNum").value;
    let sefer = document.getElementById("mSeferName").value;
    let mapLoc = document.getElementById("mMapLoc").value;

    // ክፍል ፫፡ የሃይማኖት አባት
    let godName = document.getElementById("mGodName").value;
    let godPhone = document.getElementById("mGodPhone").value;
    let edu = document.getElementById("mEdu").value;
    let churchService = document.getElementById("mChurchService").value;

    // ክፍል ፬፡ ድንገተኛ አደጋ
    let famName = document.getElementById("mFamName").value;
    let famChrist = document.getElementById("mFamChrist").value;
    let famPhone = document.getElementById("mFamPhone").value;
    let relation = document.getElementById("mRelation").value;

    let notes = document.getElementById("mNotes").value;
    
    // 👪 ክፍል ፭፡ የቤተሰብ መረጃዎች
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
        });
    }

    resetForm();
    goBack();
}

// 📋 የአባላትን ዝርዝር በሰንጠረዥ ማሳያ (ከቀለም እና የ3 ወር አውቶማቲክ ማስጠንቀቂያ ጋር)
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

        // 1. የቁርባን ሁኔታ "በቅዱስ ቁርባን ያለ" ካልተባለ በቀይ ይደምቃል
        if (m.qurbanStatus !== "በቅዱስ ቁርባን ያለ") {
            rowStyle = "background-color: #ffebee; color: #c62828; font-weight: 500; border-bottom: 1px solid #ffcdd2;";
            isDelayed = true;
        }

        // 2. ከ3 ወር (90 ቀን) በላይ የዘገየ ከሆነ ⚠️ ምልክት በራስ ሰር ያደርጋል
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
    
    if(m.birthDay) document.getElementById("birthDay").value = m.birthDay;
    if(m.birthMonth) document.getElementById("birthMonth").value = m.birthMonth;
    if(m.birthYear) document.getElementById("birthYear").value = m.birthYear;
    
    if(m.qDay) document.getElementById("qDay").value = m.qDay;
    if(m.qMonth) document.getElementById("qMonth").value = m.qMonth;
    if(m.qYear) document.getElementById("qYear").value = m.qYear;

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
    document.getElementById("mMotherPhone").value = fam.motherPhone && fam.motherPhone !== "የተመዘገበ የለም" ? fam.motherPhone : "";
    document.getElementById("mMotherJobStatus").value = fam.motherJob || "";

    // ክፍል ፮
    document.getElementById("mNotes").value = m.notes && m.notes !== "የለም" ? m.notes : "";
    
    document.getElementById("formActionTitle").textContent = "✏️ የአባል ማኅደር ፋይል ማሻሻያ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 የተቀየረውን ፋይል አሻሽለህ መዝግብ";
    openFolder('newRegistrationFolder');
}

// 🗓️ በሞዳል ውስጥ የቁርባን ሁኔታን መለወጫ
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

// 🧮 የዕድሜ ስሌት (የአሁኑን አመት 2026 መነሻ በማድረግ)
function calculateAge() {
    let yearInput = document.getElementById("birthYear").value;
    if(yearInput) {
        let gregorianYear = new Date().getFullYear(); 
        let currentEthiopianYear = gregorianYear - 8; 
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
    document.getElementById("mAge").value = "";
    document.getElementById("mGender").value = "";
    document.getElementById("mNationality").value = "ኢትዮጵያዊ";
    document.getElementById("mBlood").value = "ያልታወቀ";
    document.getElementById("mQurbanStatus").value = "በቅዱስ ቁርባን ያለ";
    
    document.getElementById("mJobStatus").value = "";
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
    document.getElementById("mFatherJobStatus").value = "";
    document.getElementById("mMotherName").value = "";
    document.getElementById("mMotherChrist").value = "";
    document.getElementById("mMotherPhone").value = "";
    document.getElementById("mMotherJobStatus").value = "";
    
    document.getElementById("mNotes").value = "";
    document.getElementById("formActionTitle").textContent = "📝 የማህበርተኛ መታወቂያ ማውጫ ሙሉ ቅጽ";
    document.getElementById("submitBtn").textContent = "💾 ሙሉ ፋይሉን በፎልደር ውስጥ መዝግብ";
}

// DOM Loading
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

    let currentEthYear = new Date().getFullYear() - 8; 

    if(bySel) {
        bySel.innerHTML = "";
        for(let y=1950; y<=currentEthYear; y++) {
            bySel.innerHTML += `<option value="${y}">${y}</option>`;
        }
    }

    if(ySel) {
        ySel.innerHTML = "";
        for(let y=2000; y<=(currentEthYear + 10); y++) {
            ySel.innerHTML += `<option value="${y}">${y}</option>`;
        }
    }
    if(qYearSel) {
        qYearSel.innerHTML = "";
        for(let y=2010; y<=currentEthYear; y++) {
            qYearSel.innerHTML += `<option value="${y}">${y}</option>`;
        }
    }

    if(bySel) bySel.value = "2000"; 
    if(qYearSel) qYearSel.value = currentEthYear.toString();
    if(ySel) ySel.value = currentEthYear.toString();
    
    calculateAge(); 
});
