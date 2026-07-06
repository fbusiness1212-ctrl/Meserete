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
    
    // 👪 ክፍል ፭፡ የቤተሰብ አዲስ መረጃዎች
    let fatherName = document.getElementById("mFatherName").value.trim();
    let fatherChrist = document.getElementById("mFatherChrist").value.trim();
    let fatherPhone = document.getElementById("mFatherPhone").value.trim();
    let motherName = document.getElementById("mMotherName").value.trim();
    let motherChrist = document.getElementById("mMotherChrist").value.trim();
    let motherPhone = document.getElementById("mMotherPhone").value.trim();

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
        familyDetails: {
            fatherName: fatherName || "የተመዘገበ የለም",
            fatherChrist: fatherChrist || "የተመዘገበ የለም",
            fatherPhone: fatherPhone || "የተመዘገበ የለም",
            motherName: motherName || "የተመዘገበ የለም",
            motherChrist: motherChrist || "የተመዘገበ የለም",
            motherPhone: motherPhone || "የተመዘገበ የለም"
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

// 📜 የአባል ማኅደር ፋይልን መክፈቻ (ክፍል ፭ የቤተሰብ መረጃን ጨምሮ)
function viewProfile(index) {
    currentViewingIndex = index;
    let m = members[index];
    
    let fam = m.familyDetails || { fatherName: "የለም", fatherChrist: "የለም", fatherPhone: "የለም", motherName: "የለም", motherChrist: "የለም", motherPhone: "የለም" };

    let content = `** የግል መረጃ **\nሙሉ ስም: ${m.name}\nየክርስትና ስም: ${m.christName}\nጾታ: ${m.gender} | ዕድሜ: ${m.age} | የደም ዓይነት: ${m.blood}\nትውልድ ዘመን: ${m.birthDate}\n\n** አድራሻ እና ሥራ **\nስልክ: ${m.phone}\nመኖሪያ: ${m.address}\n\n** ክፍል ፭፡ የቤተሰብ ሁኔታ መረጃ **\nየአባት ስም: ${fam.fatherName} | ክርስትና ስም: ${fam.fatherChrist} | ስልክ: ${fam.fatherPhone}\nየእናት ስም: ${fam.motherName} | ክርስትና ስም: ${fam.motherChrist} | ስልክ: ${fam.motherPhone}\n\n** መንፈሳዊ መረጃ **\nየንሥሐ አባት: ${m.godfather}\nየቁርባን ሁኔታ: ${m.qurbanStatus} (የመጨረሻ: ${m.lastQurbanDate})\n\n** ተጨማሪ ማስታወሻ **\n${m.notes}`;
    
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
    
    let fam = m.familyDetails || {};
    document.getElementById("mFatherName").value = fam.fatherName || "";
    document.getElementById("mFatherChrist").value = fam.fatherChrist || "";
    document.getElementById("mFatherPhone").value = fam.fatherPhone || "";
    document.getElementById("mMotherName").value = fam.motherName || "";
    document.getElementById("mMotherChrist").value = fam.motherChrist || "";
    document.getElementById("mMotherPhone").value = fam.motherPhone || "";
    
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
    document.getElementById("mNotes").value = "";
    document.getElementById("mFatherName").value = "";
    document.getElementById("mFatherChrist").value = "";
    document.getElementById("mFatherPhone").value = "";
    document.getElementById("mMotherName").value = "";
    document.getElementById("mMotherChrist").value = "";
    document.getElementById("mMotherPhone").value = "";
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
