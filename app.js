let members = JSON.parse(localStorage.getItem('mahber_members')) || [];
let tsiwas = JSON.parse(localStorage.getItem('mahber_tsiwas')) || [];

// 🔐 የአድሚን መግቢያ መረጃዎች
const ADMIN_USER = "Meserete-Hywet";
const ADMIN_PASS = "2116";
let activeModalIndex = -1;
let editTsiwaIndex = -1;

// 🔄 ገጹ ሲከፈት ከዚህ በፊት Login ማድረጉን ቼክ ማድረጊያ (በራስ-ሰር እንዳይቆለፍ)
window.addEventListener('load', () => {
    if (localStorage.getItem('mahber_isLoggedIn') === 'true') {
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        showMembers();
        showTsiwas();
    }
});

// 💻 አዲሱ የLogin ማረጋገጫ ፈንክሽን
function checkLogin() {
    let userInput = document.getElementById('adminUsername').value.trim();
    let passInput = document.getElementById('adminPassword').value.trim();
    
    if (userInput === ADMIN_USER && passInput === ADMIN_PASS) {
        localStorage.setItem('mahber_isLoggedIn', 'true'); // መግባቱን አስታውስ
        document.getElementById('lockScreen').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        showMembers();
        showTsiwas();
        
        // የገቡበትን ፎርም አጽዳ
        document.getElementById('adminUsername').value = "";
        document.getElementById('adminPassword').value = "";
    } else {
        alert("❌ የተጠቃሚ ስም ወይም የይለፍ ቃል የተሳሳተ ነው!");
    }
}

// 🚪 ሲስተሙን መቆለፊያ (Logout)
function handleLogout() {
    localStorage.removeItem('mahber_isLoggedIn');
    document.getElementById('mainDashboard').style.display = 'none';
    document.querySelectorAll('.file-view').forEach(view => view.style.display = 'none');
    document.getElementById('lockScreen').style.display = 'block';
}

// 📅 በየዓመቱ ዕድሜን በራስ-ሰር ማስያዣ ፈንክሽን
function calculateAge() {
    let birthYear = parseInt(document.getElementById('birthYear').value) || 1995;
    const CURRENT_ETHIOPIAN_YEAR = 2018; 
    let age = CURRENT_ETHIOPIAN_YEAR - birthYear;
    if(age < 0) age = 0;
    document.getElementById('mAge').innerText = age;
    document.getElementById('mAge').value = age;
    return age;
}

function saveToLocalStorage() {
    localStorage.setItem('mahber_members', JSON.stringify(members));
    localStorage.setItem('mahber_tsiwas', JSON.stringify(tsiwas));
}

// 💾 አባል መመዝገቢያ እና ማሻሻያ (Add / Edit) ፈንክሽን
function addMember() {
    let name = document.getElementById('mName').value.trim();
    let christ = document.getElementById('mChrist').value.trim();
    let bDay = document.getElementById('birthDay').value;
    let bMonth = document.getElementById('birthMonth').value;
    let bYear = document.getElementById('birthYear').value;
    let age = calculateAge();
    let gender = document.getElementById('mGender').value;
    let nationality = document.getElementById('mNationality').value.trim();
    let blood = document.getElementById('mBlood').value;
    
    let qurbanStatus = document.getElementById('mQurbanStatus').value;
    let qDay = document.getElementById('qDay').value;
    let qMonth = document.getElementById('qMonth').value;
    let qYear = document.getElementById('qYear').value;
    let qDateFull = (qDay !== "ቀን" && qMonth !== "ወር" && qYear !== "ዓመት") ? `${qMonth} ${qDay} ቀን ${qYear} ዓ.ም` : "ቀን አልተጠቀሰም";

    let jobStatus = document.getElementById('mJobStatus').value;
    let phone = document.getElementById('mPhone').value.trim();
    let kifleKetema = document.getElementById('mLoc').value;
    let wereda = document.getElementById('mWereda').value.trim();
    let houseNum = document.getElementById('mHouseNum').value.trim();
    let seferName = document.getElementById('mSeferName').value.trim();
    let mapLoc = document.getElementById('mMapLoc').value.trim();
    
    let gName = document.getElementById('mGodName').value.trim();
    let gPhone = document.getElementById('mGodPhone').value.trim();
    let edu = document.getElementById('mEdu').value.trim();
    
    let famName = document.getElementById('mFamName').value.trim();
    let famChrist = document.getElementById('mFamChrist').value.trim();
    let famPhone = document.getElementById('mFamPhone').value.trim();
    let relation = document.getElementById('mRelation').value.trim();

    let fatherName = document.getElementById('mFatherName').value.trim();
    let fatherChrist = document.getElementById('mFatherChrist').value.trim();
    let fatherPhone = document.getElementById('mFatherPhone').value.trim();
    let motherName = document.getElementById('mMotherName').value.trim();
    let motherChrist = document.getElementById('mMotherChrist').value.trim();
    let motherPhone = document.getElementById('mMotherPhone').value.trim();
    
    let notes = document.getElementById('mNotes').value.trim();

    if (!name || !christ || !phone || !gender || !jobStatus) { 
        return alert('እባክዎ ስም፣ የክርስትና ስም፣ ጾታ፣ ስልክ እና የሥራ ሁኔታ ያሟሉ!'); 
    }

    let editIndex = parseInt(document.getElementById('editIndex').value);

    let lastCheckedTime = editIndex !== -1 ? (members[editIndex].lastCheckedTime || Date.now()) : Date.now();
    let qurbanCheckedThisMonth = editIndex !== -1 ? (members[editIndex].qurbanCheckedThisMonth || false) : false;

    let memberData = {
        name, christ, bDay, bMonth, bYear, age, gender, nationality, blood,
        qurbanStatus, qDateFull, qDay, qMonth, qYear,
        jobStatus, phone, kifleKetema, wereda, houseNum, seferName, mapLoc,
        gName, gPhone, edu,
        famName, famChrist, famPhone, relation,
        fatherName, fatherChrist, fatherPhone, motherName, motherChrist, motherPhone,
        notes, lastCheckedTime, qurbanCheckedThisMonth
    };

    if (editIndex === -1) {
        members.push(memberData);
        alert('🎯 አዲሱ አባል በስኬት በፎልደር ውስጥ ተመዝግቧል!');
    } else {
        members[editIndex] = memberData;
        alert('✏️ የአባሉ ማህደር መረጃ በስኬት ታድሷል (የተስተካከለ)!');
    }

    saveToLocalStorage();
    showMembers();
    resetForm();
    goBack();
}

// 🔴 የ3 ወር የቁርባን ማስጠንቀቂያ ቼክ ማድረጊያ ፎርሙላ
function isQurbanOverdue(member) {
    if (member.qurbanCheckedThisMonth) return false;
    let threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; 
    let timePassed = Date.now() - member.lastCheckedTime;
    return timePassed > threeMonthsInMs;
}

function showMembers() {
    let tbody = document.getElementById('memberTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    let searchTerm = document.getElementById('search').value.toLowerCase();
    
    let filtered = members.filter(m => m.name.toLowerCase().includes(searchTerm) || m.phone.includes(searchTerm));

    if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:gray;">ምንም መዝገብ ፋይል አልተገኘም</td></tr>';
        return;
    }

    filtered.forEach((m, idx) => {
        let originalIndex = members.indexOf(m);
        let rowClass = isQurbanOverdue(m) ? 'class="danger-row"' : '';
        
        let currentYear = 2018;
        let realAge = currentYear - (parseInt(m.bYear) || 1995);
        if(realAge < 0) realAge = 0;

        tbody.innerHTML += `
            <tr ${rowClass}>
                <td>${idx + 1}</td>
                <td style="font-weight:bold;">📂 ${m.name}</td>
                <td>${m.phone}</td>
                <td>${realAge} ዓመት</td>
                <td>
                    <button onclick="openProfile(${originalIndex})" style="background:#1a2a3a; color:white; border:none; padding:5px 10px; font-size:11px; font-weight:bold; border-radius:3px; cursor:pointer;">ማህደር ክፈት</button>
                </td>
            </tr>
        `;
    });
}

// 📜 የማህደር ፋይል መመልከቻ
function openProfile(index) {
    activeModalIndex = index;
    let m = members[index];
    
    let currentYear = 2018;
    let calculatedAge = currentYear - (parseInt(m.bYear) || 1995);

    let content = `👤 [ክፍል ፩: የግል ማኅደራዊ መረጃ]\n` +
          `• ሙሉ ስም: ${m.name}\n` +
          `• የክርስትና ስም: ${m.christ}\n` +
          `• የትውልድ ዘመን: ${m.bMonth} ${m.bDay} ቀን ${m.bYear} ዓ.ም\n` +
          `• የአሁኑ ዕድሜ: ${calculatedAge} ዓመት\n` +
          `• ጾታ: ${m.gender} | ዜግነት: ${m.nationality}\n` +
          `• የደም ዓይነት: ${m.blood}\n` +
          `• የቁርባን መነሻ ሁኔታ: ${m.qurbanStatus} (${m.qDateFull})\n\n` +
          `💼 [ክፍል ፪: የሥራና አድራሻ መረጃ]\n` +
          `• የሥራ ሁኔታ: ${m.jobStatus}\n` +
          `• ስልክ ቁጥር: ${m.phone}\n` +
          `• ክፍለ ከተማ: ${m.kifleKetema || 'ያልተገለጸ'} | ወረዳ: ${m.wereda || '-'} | የቤት ቁጥር: ${m.houseNum || '-'}\n` +
          `• ሰፈር / ዞን: ${m.seferName || 'ያልተገለጸ'}\n` +
          `• ቋሚ መኖሪያ (Location): ${m.mapLoc || 'ያልተገለጸ'}\n\n` +
          `⛪ [ክፍል ፫: የሃይማኖት አባት እና ትምህርት]\n` +
          `• የክርስትና አባት ስም: ${m.gName || 'ያልተገለጸ'}\n` +
          `• የአባት ስልክ ቁጥር: ${m.gPhone || 'ያልተገለጸ'}\n` +
          `• የትምህርት ደረጃ: ${m.edu || 'ያልተገለጸ'}\n\n` +
          `🚑 [ክፍል ፬: የድንገተኛ አደጋ ተጠሪ]\n` +
          `• ተጠሪ ስም: ${m.famName} (${m.relation})\n` +
          `• ተጠሪ ስልክ: ${m.famPhone} | ክርስትና ስም: ${m.famChrist || '-'}\n\n` +
          `👨‍👩‍👦 [ክፍል ፭: የቤተሰብ ሁኔታ መረጃ]\n` +
          `• የአባት ስም: ${m.fatherName || '-'} | ክርስትና፡ ${m.fatherChrist || '-'} | ስልክ፡ ${m.fatherPhone || '-'}\n` +
          `• የእናት ስም: ${m.motherName || '-'} | ክርስትና፡ ${m.motherChrist || '-'} | ስልክ፡ ${m.motherPhone || '-'}\n\n` +
          `📝 [ክፍል ፮: ምርመራ]\n${m.notes || 'ምንም ማስታወሻ የለም'}`;

    document.getElementById('profileContent').innerText = content;
    document.getElementById('modalQurbanCheck').checked = m.qurbanCheckedThisMonth || false;
    
    let lastDate = new Date(m.lastCheckedTime).toLocaleDateString('am-ET');
    document.getElementById('modalLastUpdatedText').innerText = `የመጨረሻ ማረጋገጫ የተደረገበት ቀን፡ ${lastDate}`;

    document.getElementById('modalEditBtn').onclick = function() {
        closeProfile();
        editMemberForm(index);
    };

    document.getElementById('profileModal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
    activeModalIndex = -1;
}

function toggleMonthlyQurban() {
    if (activeModalIndex === -1) return;
    let isChecked = document.getElementById('modalQurbanCheck').checked;
    members[activeModalIndex].qurbanCheckedThisMonth = isChecked;
    members[activeModalIndex].lastCheckedTime = Date.now();
    saveToLocalStorage();
    showMembers();
    let lastDate = new Date(Date.now()).toLocaleDateString('am-ET');
    document.getElementById('modalLastUpdatedText').innerText = `የመጨረሻ ማረጋገጫ የተደረገበት ቀን፡ ${lastDate}`;
}

function editMemberForm(index) {
    let m = members[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('formActionTitle').innerText = `✏️ የማህደር ፋይል ማስተካከያ (አደራጅ)፦ ${m.name}`;
    document.getElementById('submitBtn').innerText = `💾 የተስተካከለውን ፋይል አሻሽለህ መዝግብ`;

    document.getElementById('mName').value = m.name;
    document.getElementById('mChrist').value = m.christ;
    document.getElementById('birthDay').value = m.bDay;
    document.getElementById('birthMonth').value = m.bMonth;
    document.getElementById('birthYear').value = m.bYear;
    document.getElementById('mGender').value = m.gender;
    document.getElementById('mNationality').value = m.nationality;
    document.getElementById('mBlood').value = m.blood;
    document.getElementById('mQurbanStatus').value = m.qurbanStatus;
    
    if(m.qDay) document.getElementById('qDay').value = m.qDay;
    if(m.qMonth) document.getElementById('qMonth').value = m.qMonth;
    if(m.qYear) document.getElementById('qYear').value = m.qYear;

    document.getElementById('mJobStatus').value = m.jobStatus;
    document.getElementById('mPhone').value = m.phone;
    document.getElementById('mLoc').value = m.kifleKetema;
    document.getElementById('mWereda').value = m.wereda;
    document.getElementById('mHouseNum').value = m.houseNum;
    document.getElementById('mSeferName').value = m.seferName;
    document.getElementById('mMapLoc').value = m.mapLoc;
    
    document.getElementById('mGodName').value = m.gName;
    document.getElementById('mGodPhone').value = m.gPhone;
    document.getElementById('mEdu').value = m.edu;
    
    document.getElementById('mFamName').value = m.famName;
    document.getElementById('mFamChrist').value = m.famChrist;
    document.getElementById('mFamPhone').value = m.famPhone;
    document.getElementById('mRelation').value = m.relation;

    document.getElementById('mFatherName').value = m.fatherName || '';
    document.getElementById('mFatherChrist').value = m.fatherChrist || '';
    document.getElementById('mFatherPhone').value = m.fatherPhone || '';
    document.getElementById('mMotherName').value = m.motherName || '';
    document.getElementById('mMotherChrist').value = m.motherChrist || '';
    document.getElementById('mMotherPhone').value = m.motherPhone || '';
    
    document.getElementById('mNotes').value = m.notes || '';

    calculateAge();
    openFolder('newRegistrationFolder');
}

function resetForm() {
    document.getElementById('editIndex').value = "-1";
    document.getElementById('formActionTitle').innerText = `📝 የማህበርተኛ መታወቂያ ማውጫ ሙሉ ቅጽ`;
    document.getElementById('submitBtn').innerText = `💾 ሙሉ ፋይሉን በፎልደር ውስጥ መዝግብ`;
    
    let fields = ['mName', 'mChrist', 'mPhone', 'mHouseNum', 'mSeferName', 'mMapLoc', 'mGodName', 'mGodPhone', 'mEdu', 'mFamName', 'mFamChrist', 'mFamPhone', 'mRelation', 'mFatherName', 'mFatherChrist', 'mFatherPhone', 'mMotherName', 'mMotherChrist', 'mMotherPhone', 'mNotes'];
    fields.forEach(f => { document.getElementById(f).value = ''; });
    
    document.getElementById('mGender').value = '';
    document.getElementById('mJobStatus').value = '';
    document.getElementById('mLoc').value = '';
    document.getElementById('birthYear').value = '1995';
    document.getElementById('qDay').value = 'ቀን';
    document.getElementById('qMonth').value = 'ወር';
    document.getElementById('qYear').value = 'ዓመት';
    calculateAge();
}

function searchMember() {
    showMembers();
}

// ==================== 🗓️ የፅዋ መዝገብ ክፍሎች ====================

function addTsiwa() {
    let name = document.getElementById('tName').value.trim();
    let mem = document.getElementById('tMember').value.trim();
    let d = document.getElementById('ethDay').value;
    let m = document.getElementById('ethMonth').value;
    let y = document.getElementById('ethYear').value;
    let fullEthDate = `${m} ${d} ቀን ${y} ዓ.ም`;
    
    if(!name || !mem) return alert('እባክዎ የፅዋውን ስም እና የአባሉን ስም ያስገቡ!');
    
    if (editTsiwaIndex === -1) {
        tsiwas.push({name, mem, date: fullEthDate, d, m, y, isTurnDone: false});
        alert('🎯 አዲሱ ፅዋ በስኬት ተመዝግቧል!');
    } else {
        let currentStatus = tsiwas[editTsiwaIndex].isTurnDone || false;
        tsiwas[editTsiwaIndex] = {name, mem, date: fullEthDate, d, m, y, isTurnDone: currentStatus};
        alert('✏️ የፅዋው መረጃ በስኬት ታድሷል!');
        editTsiwaIndex = -1;
        document.getElementById('tsiwaFormTitle').innerText = "[+] አዲስ የፅዋ ዕጣ መዝግብ";
        document.getElementById('tsiwaSubmitBtn').innerText = "ፅዋ መዝግብ";
    }
    
    saveToLocalStorage();
    showTsiwas();
    document.getElementById('tName').value = '';
    document.getElementById('tMember').value = '';
}

function showTsiwas() {
    let tbody = document.getElementById('tsiwaTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if(tsiwas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:gray;">ምንም የተመዘገበ ፅዋ የለም</td></tr>';
        return;
    }
    tsiwas.forEach((t, index) => {
        let checkStyle = t.isTurnDone ? 'checked' : '';
        let rowBG = t.isTurnDone ? 'style="background-color: #e2f0d9;"' : '';

        tbody.innerHTML += `
            <tr ${rowBG}>
                <td>${index + 1}</td>
                <td style="font-weight:bold; color:#b8860b;">የ${t.name} ፅዋ</td>
                <td>${t.mem}</td>
                <td>🗓️ ${t.date}</td>
                <td style="text-align:center;">
                    <input type="checkbox" ${checkStyle} onclick="toggleTsiwaStatus(${index})" style="cursor:pointer; transform: scale(1.2); margin-right: 10px;" title="ፅዋ አውጥቷል">
                    <button onclick="editTsiwaForm(${index})" style="background:#ffa000; color:white; border:none; padding:4px 8px; font-size:11px; font-weight:bold; border-radius:3px; cursor:pointer; margin-right: 5px;">አስተካክል</button>
                    <button onclick="deleteTsiwa(${index})" style="background:#ef5350; color:white; border:none; padding:4px 8px; font-size:11px; font-weight:bold; border-radius:3px; cursor:pointer;">አጥፋ</button>
                </td>
            </tr>
        `;
    });
}

function toggleTsiwaStatus(index) {
    tsiwas[index].isTurnDone = !tsiwas[index].isTurnDone;
    saveToLocalStorage();
    showTsiwas();
}

function editTsiwaForm(index) {
    editTsiwaIndex = index;
    let t = tsiwas[index];
    document.getElementById('tName').value = t.name;
    document.getElementById('tMember').value = t.mem;
    if(t.d) document.getElementById('ethDay').value = t.d;
    if(t.m) document.getElementById('ethMonth').value = t.m;
    if(t.y) document.getElementById('ethYear').value = t.y;
    
    document.getElementById('tsiwaFormTitle').innerText = `✏️ የፅዋ መረጃ ማስተካከያ፦ የ${t.name} ፅዋ`;
    document.getElementById('tsiwaSubmitBtn').innerText = "💾 የተስተካከለውን ፅዋ አሻሽል";
    document.getElementById('tsiwaFormTitle').scrollIntoView({ behavior: 'smooth' });
}

function deleteTsiwa(index) {
    if(confirm("❌ ይህንን የፅዋ መዝገብ በእርግጠኝነት ማጥፋት ይፈልጋሉ?")) {
        tsiwas.splice(index, 1);
        saveToLocalStorage();
        showTsiwas();
    }
}
